// Mock data for ASHA service - no Firebase dependency
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

// Mock data
const mockASHAProfile: ASHAProfile = {
  uid: 'mock-asha-id',
  phone: '+1234567890',
  name: 'Priya Sharma',
  email: 'priya.sharma@asha.com',
  aadhaar: '123456789012',
  age: 32,
  gender: 'Female',
  licenseNumber: 'ASHA-2024-001',
  experience: 5,
  languages: ['Hindi', 'English', 'Tamil'],
  availability: {
    startTime: '08:00',
    endTime: '18:00',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  isAvailable: true,
  location: {
    latitude: 12.9716,
    longitude: 77.5946,
    address: 'Koramangala, Bangalore'
  },
  rating: 4.8,
  totalVisits: 156,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date()
};

const mockTasks: ASHATask[] = [
  {
    id: 'task-1',
    ashaId: 'mock-asha-id',
    patientId: 'patient-1',
    patientName: 'Ramesh Kumar',
    patientPhone: '+9876543210',
    patientAddress: '123 Main Street, Koramangala',
    taskType: 'vitals_check',
    priority: 'high',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '09:00',
    status: 'pending',
    description: 'Regular blood pressure and sugar check for diabetic patient',
    assignedBy: 'doctor-1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'task-2',
    ashaId: 'mock-asha-id',
    patientId: 'patient-2',
    patientName: 'Sunita Devi',
    patientPhone: '+9876543211',
    patientAddress: '456 Park Road, Indiranagar',
    taskType: 'medicine_delivery',
    priority: 'medium',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '11:30',
    status: 'accepted',
    description: 'Deliver diabetes medication and check compliance',
    assignedBy: 'doctor-2',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'task-3',
    ashaId: 'mock-asha-id',
    patientId: 'patient-3',
    patientName: 'Amit Singh',
    patientPhone: '+9876543212',
    patientAddress: '789 Garden Street, HSR Layout',
    taskType: 'follow_up',
    priority: 'low',
    scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: '14:00',
    status: 'pending',
    description: 'Post-surgery follow-up visit',
    assignedBy: 'doctor-1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'task-4',
    ashaId: 'mock-asha-id',
    patientId: 'patient-4',
    patientName: 'Lakshmi Iyer',
    patientPhone: '+9876543213',
    patientAddress: '321 Temple Street, Malleswaram',
    taskType: 'vitals_check',
    priority: 'urgent',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '16:00',
    status: 'in_progress',
    description: 'Emergency vitals check for elderly patient',
    assignedBy: 'doctor-3',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'task-5',
    ashaId: 'mock-asha-id',
    patientId: 'patient-5',
    patientName: 'Geeta Reddy',
    patientPhone: '+9876543214',
    patientAddress: '555 Market Street, Jayanagar',
    taskType: 'medicine_delivery',
    priority: 'medium',
    scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: '10:00',
    status: 'pending',
    description: 'Deliver hypertension medication',
    assignedBy: 'doctor-2',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockRecentPatients = [
  {
    id: 'patient-6',
    name: 'Rajesh Patel',
    phone: '+9876543215',
    lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    taskType: 'vitals_check'
  },
  {
    id: 'patient-7',
    name: 'Meera Joshi',
    phone: '+9876543216',
    lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    taskType: 'medicine_delivery'
  },
  {
    id: 'patient-8',
    name: 'Suresh Kumar',
    phone: '+9876543217',
    lastVisit: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    taskType: 'follow_up'
  }
];

class ASHAService {
  // Create ASHA profile
  async createASHAProfile(ashaData: Partial<ASHAProfile>): Promise<void> {
    // Mock implementation - just log
    console.log('Creating ASHA profile:', ashaData);
  }

  // Get ASHA profile
  async getASHAProfile(uid: string): Promise<ASHAProfile | null> {
    // Mock implementation - return mock profile
    return mockASHAProfile;
  }

  // Update ASHA profile
  async updateASHAProfile(uid: string, updates: Partial<ASHAProfile>): Promise<void> {
    // Mock implementation - just log
    console.log('Updating ASHA profile:', uid, updates);
  }

  // Update ASHA availability
  async updateAvailability(uid: string, isAvailable: boolean): Promise<void> {
    // Mock implementation - just log
    console.log('Updating availability:', uid, isAvailable);
  }

  // Get pending tasks for ASHA
  async getPendingTasks(ashaId: string): Promise<ASHATask[]> {
    // Mock implementation - return mock tasks
    return mockTasks;
  }

  // Accept task
  async acceptTask(taskId: string): Promise<void> {
    // Mock implementation - update task status
    const task = mockTasks.find(t => t.id === taskId);
    if (task) {
      task.status = 'accepted';
      task.updatedAt = new Date();
    }
    console.log('Task accepted:', taskId);
  }

  // Start task
  async startTask(taskId: string): Promise<void> {
    // Mock implementation - update task status
    const task = mockTasks.find(t => t.id === taskId);
    if (task) {
      task.status = 'in_progress';
      task.updatedAt = new Date();
    }
    console.log('Task started:', taskId);
  }

  // Complete task
  async completeTask(
    taskId: string,
    vitalsRecorded?: ASHATask['vitalsRecorded'],
    notes?: string
  ): Promise<void> {
    // Mock implementation - update task status
    const task = mockTasks.find(t => t.id === taskId);
    if (task) {
      task.status = 'completed';
      task.vitalsRecorded = vitalsRecorded;
      task.notes = notes;
      task.completedAt = new Date();
      task.updatedAt = new Date();
    }
    console.log('Task completed:', taskId, vitalsRecorded, notes);
  }

  // Create new task
  async createTask(taskData: Omit<ASHATask, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    // Mock implementation - add to mock tasks
    const newTask: ASHATask = {
      ...taskData,
      id: `task-${Date.now()}`,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockTasks.push(newTask);
    console.log('Task created:', newTask);
    return newTask.id;
  }

  // Get ASHA's completed tasks
  async getCompletedTasks(ashaId: string, limitCount: number = 20): Promise<ASHATask[]> {
    // Mock implementation - return completed tasks
    return mockTasks.filter(task => task.status === 'completed').slice(0, limitCount);
  }

  // Get ASHA statistics
  async getASHAStatistics(ashaId: string): Promise<{
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    averageRating: number;
    thisMonthTasks: number;
  }> {
    // Mock implementation - calculate from mock data
    const totalTasks = mockTasks.length;
    const completedTasks = mockTasks.filter(task => task.status === 'completed').length;
    const pendingTasks = mockTasks.filter(task => 
      ['pending', 'accepted', 'in_progress'].includes(task.status)
    ).length;
    
    // Calculate this month's tasks
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const thisMonthTasks = mockTasks.filter(task => {
      const taskDate = task.createdAt;
      return taskDate >= thisMonth;
    }).length;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      averageRating: mockASHAProfile.rating || 0,
      thisMonthTasks,
    };
  }

  // Get nearby patients
  async getNearbyPatients(
    ashaLocation: { latitude: number; longitude: number },
    radiusKm: number = 10
  ): Promise<any[]> {
    // Mock implementation - return mock recent patients
    return mockRecentPatients;
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
    // Mock implementation - just log
    console.log('Updating location:', uid, location);
  }

  // Get ASHA dashboard data
  async getDashboardData(ashaId: string): Promise<{
    pendingTasks: ASHATask[];
    todayTasks: ASHATask[];
    statistics: any;
    recentPatients: any[];
  }> {
    // Mock implementation - return dashboard data
    const pendingTasks = mockTasks;
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = mockTasks.filter(task => task.scheduledDate === today);
    const statistics = await this.getASHAStatistics(ashaId);
    const recentPatients = mockRecentPatients;

    return {
      pendingTasks,
      todayTasks,
      statistics,
      recentPatients,
    };
  }
}

export const ashaService = new ASHAService();