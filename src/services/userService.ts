import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { STORAGE_PATHS } from '@/utils/constants';
import { Vitals, Appointment, FileUpload } from '@/utils/validators';

export interface UserProfile {
  uid: string;
  phone: string;
  name: string;
  email?: string;
  aadhaar?: string;
  age?: number;
  gender?: string;
  diseases?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface VitalRecord {
  id: string;
  userId: string;
  vitals: Vitals;
  recordedBy: 'user' | 'asha' | 'doctor';
  recordedById?: string;
  timestamp: Date;
  notes?: string;
}

export interface MedicalReport {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  description?: string;
  uploadedAt: Date;
  parsedData?: any;
}

export interface AppointmentRequest {
  id: string;
  patientId: string;
  doctorId?: string;
  ashaId?: string;
  type: 'consultation' | 'asha_visit';
  date: string;
  time: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

class UserService {
  // Create user profile
  async createUserProfile(userData: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, 'users', userData.uid!);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  // Get user profile
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  // Add vital record
  async addVitalRecord(vitalData: Omit<VitalRecord, 'id' | 'timestamp'>): Promise<string> {
    const vitalsRef = collection(db, 'vitals');
    const docRef = await addDoc(vitalsRef, {
      ...vitalData,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  }

  // Get user's vital records
  async getUserVitals(userId: string, limitCount: number = 10): Promise<VitalRecord[]> {
    try {
      const vitalsRef = collection(db, 'vitals');
      const q = query(
        vitalsRef,
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as VitalRecord[];
    } catch (error) {
      console.error('Error getting user vitals:', error);
      throw error;
    }
  }

  // Upload medical report
  async uploadMedicalReport(
    userId: string,
    file: File,
    description?: string
  ): Promise<MedicalReport> {
    try {
      // Upload file to storage
      const fileName = `${userId}_${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `${STORAGE_PATHS.USER_REPORTS}/${fileName}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      // Save metadata to Firestore
      const reportData = {
        userId,
        fileName: file.name,
        fileUrl: downloadURL,
        fileType: file.type,
        fileSize: file.size,
        description,
        uploadedAt: serverTimestamp(),
      };

      const reportsRef = collection(db, 'medicalReports');
      const docRef = await addDoc(reportsRef, reportData);

      return {
        id: docRef.id,
        ...reportData,
        uploadedAt: new Date(),
      } as MedicalReport;
    } catch (error) {
      console.error('Error uploading medical report:', error);
      throw error;
    }
  }

  // Get user's medical reports
  async getUserMedicalReports(userId: string): Promise<MedicalReport[]> {
    try {
      const reportsRef = collection(db, 'medicalReports');
      const q = query(
        reportsRef,
        where('userId', '==', userId),
        orderBy('uploadedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate() || new Date(),
      })) as MedicalReport[];
    } catch (error) {
      console.error('Error getting medical reports:', error);
      throw error;
    }
  }

  // Delete medical report
  async deleteMedicalReport(reportId: string): Promise<void> {
    try {
      // Get report data first
      const reportDoc = await getDoc(doc(db, 'medicalReports', reportId));
      if (!reportDoc.exists()) {
        throw new Error('Report not found');
      }

      const reportData = reportDoc.data() as MedicalReport;
      
      // Delete file from storage
      const storageRef = ref(storage, reportData.fileUrl);
      await deleteObject(storageRef);

      // Delete document from Firestore
      await deleteDoc(doc(db, 'medicalReports', reportId));
    } catch (error) {
      console.error('Error deleting medical report:', error);
      throw error;
    }
  }

  // Book appointment
  async bookAppointment(appointmentData: Omit<AppointmentRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const appointmentsRef = collection(db, 'appointments');
    const docRef = await addDoc(appointmentsRef, {
      ...appointmentData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  // Get user's appointments
  async getUserAppointments(userId: string): Promise<AppointmentRequest[]> {
    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('patientId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as AppointmentRequest[];
    } catch (error) {
      console.error('Error getting user appointments:', error);
      throw error;
    }
  }

  // Update appointment status
  async updateAppointmentStatus(appointmentId: string, status: AppointmentRequest['status']): Promise<void> {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  }

  // Get available ASHA workers
  async getAvailableASHAWorkers(): Promise<any[]> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('role', '==', 'asha'),
        where('isAvailable', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting available ASHA workers:', error);
      throw error;
    }
  }

  // Get available doctors
  async getAvailableDoctors(specialization?: string): Promise<any[]> {
    try {
      const usersRef = collection(db, 'users');
      let q = query(
        usersRef,
        where('role', '==', 'doctor'),
        where('isAvailable', '==', true)
      );

      if (specialization) {
        q = query(q, where('specialization', '==', specialization));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting available doctors:', error);
      throw error;
    }
  }

  // Get user's health summary
  async getUserHealthSummary(userId: string): Promise<{
    latestVitals: VitalRecord | null;
    recentReports: MedicalReport[];
    upcomingAppointments: AppointmentRequest[];
    healthScore: number;
  }> {
    try {
      const [vitals, reports, appointments] = await Promise.all([
        this.getUserVitals(userId, 1),
        this.getUserMedicalReports(userId),
        this.getUserAppointments(userId),
      ]);

      const latestVitals = vitals[0] || null;
      const recentReports = reports.slice(0, 5);
      const upcomingAppointments = appointments.filter(
        apt => apt.status === 'accepted' && new Date(apt.date) > new Date()
      );

      // Calculate basic health score based on vitals
      let healthScore = 100;
      if (latestVitals) {
        const { vitals } = latestVitals;
        
        // Blood pressure check
        if (vitals.bloodPressure) {
          const { systolic, diastolic } = vitals.bloodPressure;
          if (systolic > 140 || diastolic > 90) healthScore -= 20;
          else if (systolic > 120 || diastolic > 80) healthScore -= 10;
        }

        // Blood sugar check
        if (vitals.bloodSugar) {
          const { value, fasting } = vitals.bloodSugar;
          if (fasting) {
            if (value > 126) healthScore -= 25;
            else if (value > 100) healthScore -= 15;
          } else {
            if (value > 200) healthScore -= 25;
            else if (value > 140) healthScore -= 15;
          }
        }

        // Weight check (BMI)
        if (vitals.weight && vitals.height) {
          const bmi = vitals.weight / Math.pow(vitals.height / 100, 2);
          if (bmi > 30 || bmi < 18.5) healthScore -= 15;
          else if (bmi > 25 || bmi < 20) healthScore -= 10;
        }
      }

      return {
        latestVitals,
        recentReports,
        upcomingAppointments,
        healthScore: Math.max(0, healthScore),
      };
    } catch (error) {
      console.error('Error getting user health summary:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
