import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { APPOINTMENT_STATUS } from '@/utils/constants';

export interface ASHATask {
  id: string;
  ashaId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientAddress: string;
  taskType: 'vitals_check' | 'medicine_delivery' | 'follow_up' | 'emergency_visit';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate: string;
  scheduledTime: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  description: string;
  assignedBy?: string; // doctor ID if assigned by doctor
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  notes?: string;
  vitalsRecorded?: {
    bloodPressure?: { systolic: number; diastolic: number };
    bloodSugar?: { value: number; fasting: boolean; unit: string };
    weight?: number;
    temperature?: number;
    heartRate?: number;
    symptoms?: string;
  };
}

export interface ASHAProfile {
  uid: string;
  phone: string;
  name: string;
  email?: string;
  aadhaar: string;
  age: number;
  gender: string;
  licenseNumber: string;
  experience: number;
  languages: string[];
  availability: {
    startTime: string;
    endTime: string;
    days: string[];
  };
  isAvailable: boolean;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  rating?: number;
  totalVisits?: number;
  createdAt: Date;
  updatedAt: Date;
}

class ASHAService {
  // Create ASHA profile
  async createASHAProfile(ashaData: Partial<ASHAProfile>): Promise<void> {
    const ashaRef = doc(db, 'users', ashaData.uid!);
    await setDoc(ashaRef, {
      ...ashaData,
      role: 'asha',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  // Get ASHA profile
  async getASHAProfile(uid: string): Promise<ASHAPProfile | null> {
    try {
      const ashaDoc = await getDoc(doc(db, 'users', uid));
      if (ashaDoc.exists()) {
        const data = ashaDoc.data();
        if (data.role === 'asha') {
          return data as ASHAProfile;
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting ASHA profile:', error);
      throw error;
    }
  }

  // Update ASHA profile
  async updateASHAProfile(uid: string, updates: Partial<ASHAPProfile>): Promise<void> {
    const ashaRef = doc(db, 'users', uid);
    await updateDoc(ashaRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  // Update ASHA availability
  async updateAvailability(uid: string, isAvailable: boolean): Promise<void> {
    await this.updateASHAProfile(uid, { isAvailable });
  }

  // Get pending tasks for ASHA
  async getPendingTasks(ashaId: string): Promise<ASHATask[]> {
    try {
      const tasksRef = collection(db, 'ashaTasks');
      const q = query(
        tasksRef,
        where('ashaId', '==', ashaId),
        where('status', 'in', ['pending', 'accepted', 'in_progress']),
        orderBy('priority', 'desc'),
        orderBy('scheduledDate', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        completedAt: doc.data().completedAt?.toDate(),
      })) as ASHATask[];
    } catch (error) {
      console.error('Error getting pending tasks:', error);
      throw error;
    }
  }

  // Accept task
  async acceptTask(taskId: string): Promise<void> {
    const taskRef = doc(db, 'ashaTasks', taskId);
    await updateDoc(taskRef, {
      status: 'accepted',
      updatedAt: serverTimestamp(),
    });
  }

  // Start task
  async startTask(taskId: string): Promise<void> {
    const taskRef = doc(db, 'ashaTasks', taskId);
    await updateDoc(taskRef, {
      status: 'in_progress',
      updatedAt: serverTimestamp(),
    });
  }

  // Complete task
  async completeTask(
    taskId: string,
    vitalsRecorded?: ASHATask['vitalsRecorded'],
    notes?: string
  ): Promise<void> {
    const taskRef = doc(db, 'ashaTasks', taskId);
    await updateDoc(taskRef, {
      status: 'completed',
      vitalsRecorded,
      notes,
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Also save vitals to user's vitals collection
    if (vitalsRecorded) {
      const taskDoc = await getDoc(taskRef);
      const taskData = taskDoc.data() as ASHATask;
      
      const vitalsRef = collection(db, 'vitals');
      await addDoc(vitalsRef, {
        userId: taskData.patientId,
        vitals: vitalsRecorded,
        recordedBy: 'asha',
        recordedById: taskData.ashaId,
        timestamp: serverTimestamp(),
        notes: notes || 'Recorded during ASHA visit',
      });
    }
  }

  // Create new task
  async createTask(taskData: Omit<ASHATask, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const tasksRef = collection(db, 'ashaTasks');
    const docRef = await addDoc(tasksRef, {
      ...taskData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  // Get ASHA's completed tasks
  async getCompletedTasks(ashaId: string, limitCount: number = 20): Promise<ASHATask[]> {
    try {
      const tasksRef = collection(db, 'ashaTasks');
      const q = query(
        tasksRef,
        where('ashaId', '==', ashaId),
        where('status', '==', 'completed'),
        orderBy('completedAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        completedAt: doc.data().completedAt?.toDate(),
      })) as ASHATask[];
    } catch (error) {
      console.error('Error getting completed tasks:', error);
      throw error;
    }
  }

  // Get ASHA statistics
  async getASHAStatistics(ashaId: string): Promise<{
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    averageRating: number;
    thisMonthTasks: number;
  }> {
    try {
      const tasksRef = collection(db, 'ashaTasks');
      
      // Get all tasks for this ASHA
      const allTasksQuery = query(tasksRef, where('ashaId', '==', ashaId));
      const allTasksSnapshot = await getDocs(allTasksQuery);
      
      const tasks = allTasksSnapshot.docs.map(doc => doc.data() as ASHATask);
      
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.status === 'completed').length;
      const pendingTasks = tasks.filter(task => 
        ['pending', 'accepted', 'in_progress'].includes(task.status)
      ).length;
      
      // Calculate this month's tasks
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);
      
      const thisMonthTasks = tasks.filter(task => {
        const taskDate = task.createdAt;
        return taskDate >= thisMonth;
      }).length;

      // Get ASHA profile for rating
      const ashaProfile = await this.getASHAProfile(ashaId);
      const averageRating = ashaProfile?.rating || 0;

      return {
        totalTasks,
        completedTasks,
        pendingTasks,
        averageRating,
        thisMonthTasks,
      };
    } catch (error) {
      console.error('Error getting ASHA statistics:', error);
      throw error;
    }
  }

  // Get nearby patients
  async getNearbyPatients(
    ashaLocation: { latitude: number; longitude: number },
    radiusKm: number = 10
  ): Promise<any[]> {
    try {
      // This is a simplified version - in production, you'd use GeoFirestore
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('role', '==', 'user')
      );
      
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter by distance (simplified calculation)
      const nearbyUsers = users.filter(user => {
        if (!user.location) return false;
        
        const distance = this.calculateDistance(
          ashaLocation.latitude,
          ashaLocation.longitude,
          user.location.latitude,
          user.location.longitude
        );
        
        return distance <= radiusKm;
      });

      return nearbyUsers;
    } catch (error) {
      console.error('Error getting nearby patients:', error);
      throw error;
    }
  }

  // Calculate distance between two points (Haversine formula)
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Update ASHA location
  async updateLocation(
    uid: string,
    location: { latitude: number; longitude: number; address: string }
  ): Promise<void> {
    await this.updateASHAProfile(uid, { location });
  }

  // Get ASHA dashboard data
  async getDashboardData(ashaId: string): Promise<{
    pendingTasks: ASHATask[];
    todayTasks: ASHATask[];
    statistics: any;
    recentPatients: any[];
  }> {
    try {
      const [pendingTasks, statistics] = await Promise.all([
        this.getPendingTasks(ashaId),
        this.getASHAStatistics(ashaId),
      ]);

      // Get today's tasks
      const today = new Date().toISOString().split('T')[0];
      const todayTasks = pendingTasks.filter(task => task.scheduledDate === today);

      // Get recent patients (from completed tasks)
      const completedTasks = await this.getCompletedTasks(ashaId, 10);
      const recentPatients = completedTasks.map(task => ({
        id: task.patientId,
        name: task.patientName,
        phone: task.patientPhone,
        lastVisit: task.completedAt,
        taskType: task.taskType,
      }));

      return {
        pendingTasks,
        todayTasks,
        statistics,
        recentPatients,
      };
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      throw error;
    }
  }
}

export const ashaService = new ASHAService();
