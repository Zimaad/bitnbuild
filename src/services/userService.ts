// Mock data for User service - no Firebase dependency
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

// Mock data
const mockUserProfile: UserProfile = {
  uid: 'mock-user-id',
  phone: '+9876543210',
  name: 'Sunita Devi',
  email: 'sunita.devi@user.com',
  aadhaar: '987654321098',
  age: 35,
  gender: 'Female',
  diseases: ['Diabetes Type 2', 'Hypertension'],
  emergencyContact: {
    name: 'Rajesh Kumar',
    phone: '+9876543211',
    relation: 'Husband'
  },
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date()
};

const mockVitalRecords: VitalRecord[] = [
  {
    id: 'vital-1',
    userId: 'mock-user-id',
    vitals: {
      bloodPressure: { systolic: 140, diastolic: 90 },
      bloodSugar: { value: 120, fasting: true, unit: 'mg/dL' },
      weight: 65,
      height: 160,
      temperature: 98.6,
      heartRate: 75,
      symptoms: 'Mild headache'
    },
    recordedBy: 'user',
    timestamp: new Date(),
    notes: 'Feeling slightly tired today'
  },
  {
    id: 'vital-2',
    userId: 'mock-user-id',
    vitals: {
      bloodPressure: { systolic: 135, diastolic: 85 },
      bloodSugar: { value: 110, fasting: true, unit: 'mg/dL' },
      weight: 64.5,
      height: 160,
      temperature: 98.4,
      heartRate: 72,
      symptoms: 'Feeling good'
    },
    recordedBy: 'asha',
    recordedById: 'mock-asha-id',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    notes: 'Regular checkup by ASHA worker'
  }
];

const mockMedicalReports: MedicalReport[] = [
  {
    id: 'report-1',
    userId: 'mock-user-id',
    fileName: 'blood_test_results.pdf',
    fileUrl: '/mock-reports/blood_test_results.pdf',
    fileType: 'application/pdf',
    fileSize: 1024000,
    description: 'Complete blood count and glucose test',
    uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'report-2',
    userId: 'mock-user-id',
    fileName: 'ecg_report.pdf',
    fileUrl: '/mock-reports/ecg_report.pdf',
    fileType: 'application/pdf',
    fileSize: 512000,
    description: 'ECG report from last month',
    uploadedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  }
];

const mockAppointments: AppointmentRequest[] = [
  {
    id: 'appointment-1',
    patientId: 'mock-user-id',
    doctorId: 'mock-doctor-id',
    type: 'consultation',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:00',
    reason: 'Diabetes management consultation',
    urgency: 'medium',
    status: 'accepted',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'appointment-2',
    patientId: 'mock-user-id',
    ashaId: 'mock-asha-id',
    type: 'asha_visit',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '14:00',
    reason: 'Regular vitals check and medicine delivery',
    urgency: 'low',
    status: 'accepted',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

class UserService {
  // Create user profile
  async createUserProfile(userData: Partial<UserProfile>): Promise<void> {
    // Mock implementation - just log
    console.log('Creating user profile:', userData);
  }

  // Get user profile
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    // Mock implementation - return mock profile
    return mockUserProfile;
  }

  // Update user profile
  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    // Mock implementation - just log
    console.log('Updating user profile:', uid, updates);
  }

  // Add vital record
  async addVitalRecord(vitalData: Omit<VitalRecord, 'id' | 'timestamp'>): Promise<string> {
    // Mock implementation - add to mock vitals
    const newVital: VitalRecord = {
      ...vitalData,
      id: `vital-${Date.now()}`,
      timestamp: new Date(),
    };
    mockVitalRecords.push(newVital);
    console.log('Vital record added:', newVital);
    return newVital.id;
  }

  // Get user's vital records
  async getUserVitals(userId: string, limitCount: number = 10): Promise<VitalRecord[]> {
    // Mock implementation - return mock vitals
    return mockVitalRecords.slice(0, limitCount);
  }

  // Upload medical report
  async uploadMedicalReport(
    userId: string,
    file: File,
    description?: string
  ): Promise<MedicalReport> {
    // Mock implementation - create mock report
    const newReport: MedicalReport = {
      id: `report-${Date.now()}`,
      userId,
      fileName: file.name,
      fileUrl: `/mock-reports/${file.name}`,
      fileType: file.type,
      fileSize: file.size,
      description,
      uploadedAt: new Date(),
    };
    mockMedicalReports.push(newReport);
    console.log('Medical report uploaded:', newReport);
    return newReport;
  }

  // Get user's medical reports
  async getUserMedicalReports(userId: string): Promise<MedicalReport[]> {
    // Mock implementation - return mock reports
    return mockMedicalReports;
  }

  // Delete medical report
  async deleteMedicalReport(reportId: string): Promise<void> {
    // Mock implementation - remove from mock reports
    const index = mockMedicalReports.findIndex(r => r.id === reportId);
    if (index > -1) {
      mockMedicalReports.splice(index, 1);
    }
    console.log('Medical report deleted:', reportId);
  }

  // Book appointment
  async bookAppointment(appointmentData: Omit<AppointmentRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    // Mock implementation - add to mock appointments
    const newAppointment: AppointmentRequest = {
      ...appointmentData,
      id: `appointment-${Date.now()}`,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockAppointments.push(newAppointment);
    console.log('Appointment booked:', newAppointment);
    return newAppointment.id;
  }

  // Get user's appointments
  async getUserAppointments(userId: string): Promise<AppointmentRequest[]> {
    // Mock implementation - return mock appointments
    return mockAppointments;
  }

  // Update appointment status
  async updateAppointmentStatus(appointmentId: string, status: AppointmentRequest['status']): Promise<void> {
    // Mock implementation - update appointment status
    const appointment = mockAppointments.find(a => a.id === appointmentId);
    if (appointment) {
      appointment.status = status;
      appointment.updatedAt = new Date();
    }
    console.log('Appointment status updated:', appointmentId, status);
  }

  // Get available ASHA workers
  async getAvailableASHAWorkers(): Promise<any[]> {
    // Mock implementation - return mock ASHA workers
    return [
      {
        id: 'mock-asha-id',
        name: 'Priya Sharma',
        phone: '+1234567890',
        specialization: 'General Health',
        rating: 4.8,
        isAvailable: true
      }
    ];
  }

  // Get available doctors
  async getAvailableDoctors(specialization?: string): Promise<any[]> {
    // Mock implementation - return mock doctors
    return [
      {
        id: 'mock-doctor-id',
        name: 'Dr. Rajesh Kumar',
        phone: '+1234567890',
        specialization: 'General Medicine',
        rating: 4.9,
        consultationFee: 500,
        isAvailable: true
      }
    ];
  }

  // Get user's health summary
  async getUserHealthSummary(userId: string): Promise<{
    latestVitals: VitalRecord | null;
    recentReports: MedicalReport[];
    upcomingAppointments: AppointmentRequest[];
    healthScore: number;
  }> {
    // Mock implementation - return dashboard data
    const latestVitals = mockVitalRecords[0] || null;
    const recentReports = mockMedicalReports.slice(0, 5);
    const upcomingAppointments = mockAppointments.filter(
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
  }
}

export const userService = new UserService();
