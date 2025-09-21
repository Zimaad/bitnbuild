// Mock data for Doctor service - no Firebase dependency
import { APPOINTMENT_STATUS } from '@/utils/constants';

export interface DoctorProfile {
  uid: string;
  phone: string;
  name: string;
  email?: string;
  aadhaar: string;
  age: number;
  gender: string;
  licenseNumber: string;
  specialization: string;
  experience: number;
  languages: string[];
  consultationFee: number;
  availability: {
    startTime: string;
    endTime: string;
    days: string[];
  };
  isAvailable: boolean;
  rating?: number;
  totalConsultations?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Consultation {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  appointmentId: string;
  type: 'audio' | 'video' | 'chat';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number; // in minutes
  notes?: string;
  prescription?: {
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions?: string;
    }>;
    diagnosis: string;
    followUpDate?: string;
    notes?: string;
  };
}

export interface Prescription {
  id: string;
  doctorId: string;
  patientId: string;
  consultationId: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  diagnosis: string;
  followUpDate?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data
const mockDoctorProfile: DoctorProfile = {
  uid: 'mock-doctor-id',
  phone: '+1234567890',
  name: 'Dr. Rajesh Kumar',
  email: 'rajesh.kumar@doctor.com',
  aadhaar: '123456789012',
  age: 45,
  gender: 'Male',
  licenseNumber: 'DOC-2024-001',
  specialization: 'General Medicine',
  experience: 15,
  languages: ['Hindi', 'English', 'Telugu'],
  consultationFee: 500,
  availability: {
    startTime: '09:00',
    endTime: '17:00',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  isAvailable: true,
  rating: 4.9,
  totalConsultations: 1247,
  createdAt: new Date('2020-01-01'),
  updatedAt: new Date()
};

const mockAppointments = [
  {
    id: 'appointment-1',
    doctorId: 'mock-doctor-id',
    patientId: 'patient-1',
    patientName: 'Sunita Devi',
    patientPhone: '+9876543210',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    reason: 'Regular checkup for diabetes',
    urgency: 'medium',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'appointment-2',
    doctorId: 'mock-doctor-id',
    patientId: 'patient-2',
    patientName: 'Amit Singh',
    patientPhone: '+9876543211',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    reason: 'Chest pain evaluation',
    urgency: 'high',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'appointment-3',
    doctorId: 'mock-doctor-id',
    patientId: 'patient-3',
    patientName: 'Lakshmi Iyer',
    patientPhone: '+9876543212',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '11:00',
    reason: 'Follow-up for hypertension',
    urgency: 'low',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockConsultations = [
  {
    id: 'consultation-1',
    doctorId: 'mock-doctor-id',
    patientId: 'patient-4',
    patientName: 'Ramesh Kumar',
    patientPhone: '+9876543213',
    appointmentId: 'appointment-4',
    type: 'video' as const,
    status: 'scheduled' as const,
    scheduledAt: new Date(),
    duration: 30,
    notes: 'Patient complained of persistent cough'
  },
  {
    id: 'consultation-2',
    doctorId: 'mock-doctor-id',
    patientId: 'patient-5',
    patientName: 'Geeta Reddy',
    patientPhone: '+9876543214',
    appointmentId: 'appointment-5',
    type: 'audio' as const,
    status: 'completed' as const,
    scheduledAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    duration: 30,
    notes: 'Diabetes management consultation',
    prescription: {
      medications: [
        {
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          duration: '30 days',
          instructions: 'Take with food'
        }
      ],
      diagnosis: 'Type 2 Diabetes',
      followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Continue current medication, monitor blood sugar levels'
    }
  }
];

const mockRecentPatients = [
  {
    id: 'patient-6',
    name: 'Rajesh Patel',
    phone: '+9876543215',
    lastConsultation: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    diagnosis: 'Hypertension'
  },
  {
    id: 'patient-7',
    name: 'Meera Joshi',
    phone: '+9876543216',
    lastConsultation: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    diagnosis: 'Diabetes Type 2'
  },
  {
    id: 'patient-8',
    name: 'Suresh Kumar',
    phone: '+9876543217',
    lastConsultation: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    diagnosis: 'Respiratory Infection'
  }
];

class DoctorService {
  // Create doctor profile
  async createDoctorProfile(doctorData: Partial<DoctorProfile>): Promise<void> {
    // Mock implementation - just log
    console.log('Creating doctor profile:', doctorData);
  }

  // Get doctor profile
  async getDoctorProfile(uid: string): Promise<DoctorProfile | null> {
    // Mock implementation - return mock profile
    return mockDoctorProfile;
  }

  // Update doctor profile
  async updateDoctorProfile(uid: string, updates: Partial<DoctorProfile>): Promise<void> {
    // Mock implementation - just log
    console.log('Updating doctor profile:', uid, updates);
  }

  // Update doctor availability
  async updateAvailability(uid: string, isAvailable: boolean): Promise<void> {
    // Mock implementation - just log
    console.log('Updating availability:', uid, isAvailable);
  }

  // Get pending appointments
  async getPendingAppointments(doctorId: string): Promise<any[]> {
    // Mock implementation - return mock appointments
    return mockAppointments;
  }

  // Accept appointment
  async acceptAppointment(appointmentId: string): Promise<void> {
    // Mock implementation - update appointment status
    const appointment = mockAppointments.find(a => a.id === appointmentId);
    if (appointment) {
      appointment.status = 'accepted';
      appointment.updatedAt = new Date();
    }
    console.log('Appointment accepted:', appointmentId);
  }

  // Reject appointment
  async rejectAppointment(appointmentId: string, reason?: string): Promise<void> {
    // Mock implementation - update appointment status
    const appointment = mockAppointments.find(a => a.id === appointmentId);
    if (appointment) {
      appointment.status = 'rejected';
      appointment.updatedAt = new Date();
    }
    console.log('Appointment rejected:', appointmentId, reason);
  }

  // Start consultation
  async startConsultation(consultationData: Omit<Consultation, 'id'>): Promise<string> {
    // Mock implementation - add to mock consultations
    const newConsultation: Consultation = {
      ...consultationData,
      id: `consultation-${Date.now()}`,
      status: 'in_progress',
      startedAt: new Date(),
    };
    mockConsultations.push(newConsultation as any);
    console.log('Consultation started:', newConsultation);
    return newConsultation.id;
  }

  // Complete consultation
  async completeConsultation(
    consultationId: string,
    prescription?: Prescription['medications'],
    diagnosis?: string,
    notes?: string
  ): Promise<void> {
    // Mock implementation - update consultation status
    const consultation = mockConsultations.find(c => c.id === consultationId);
    if (consultation) {
      consultation.status = 'completed';
      consultation.completedAt = new Date();
      consultation.notes = notes || '';
      if (prescription) {
        consultation.prescription = {
          medications: prescription.map(med => ({
            ...med,
            instructions: med.instructions || ''
          })),
          diagnosis: diagnosis || '',
          followUpDate: '',
          notes: notes || '',
        };
      }
    }
    console.log('Consultation completed:', consultationId, prescription, diagnosis, notes);
  }

  // Create prescription
  async createPrescription(prescriptionData: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    // Mock implementation - just return ID
    const prescriptionId = `prescription-${Date.now()}`;
    console.log('Prescription created:', prescriptionId, prescriptionData);
    return prescriptionId;
  }

  // Get doctor's consultations
  async getDoctorConsultations(doctorId: string, limitCount: number = 20): Promise<Consultation[]> {
    // Mock implementation - return mock consultations
    return mockConsultations.slice(0, limitCount);
  }

  // Get patient's medical history
  async getPatientMedicalHistory(patientId: string): Promise<{
    vitals: any[];
    reports: any[];
    prescriptions: Prescription[];
    consultations: Consultation[];
  }> {
    // Mock implementation - return empty arrays
    return {
      vitals: [],
      reports: [],
      prescriptions: [],
      consultations: [],
    };
  }

  // Assign ASHA task
  async assignASHATask(
    ashaId: string,
    patientId: string,
    taskType: 'vitals_check' | 'medicine_delivery' | 'follow_up' | 'emergency_visit',
    priority: 'low' | 'medium' | 'high' | 'urgent',
    scheduledDate: string,
    scheduledTime: string,
    description: string,
    assignedBy: string
  ): Promise<string> {
    // Mock implementation - just return task ID
    const taskId = `task-${Date.now()}`;
    console.log('ASHA task assigned:', taskId, {
      ashaId,
      patientId,
      taskType,
      priority,
      scheduledDate,
      scheduledTime,
      description,
      assignedBy,
    });
    return taskId;
  }

  // Get doctor statistics
  async getDoctorStatistics(doctorId: string): Promise<{
    totalConsultations: number;
    completedConsultations: number;
    pendingAppointments: number;
    averageRating: number;
    thisMonthConsultations: number;
    totalEarnings: number;
  }> {
    // Mock implementation - calculate from mock data
    const totalConsultations = mockConsultations.length;
    const completedConsultations = mockConsultations.filter(c => c.status === 'completed').length;
    const pendingAppointments = mockAppointments.filter(a => a.status === 'pending').length;
    
    // Calculate this month's consultations
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const thisMonthConsultations = mockConsultations.filter(consultation => {
      const consultationDate = consultation.scheduledAt;
      return consultationDate >= thisMonth;
    }).length;

    const averageRating = mockDoctorProfile.rating || 0;
    const consultationFee = mockDoctorProfile.consultationFee || 0;
    const totalEarnings = completedConsultations * consultationFee;

    return {
      totalConsultations,
      completedConsultations,
      pendingAppointments,
      averageRating,
      thisMonthConsultations,
      totalEarnings,
    };
  }

  // Get doctor dashboard data
  async getDashboardData(doctorId: string): Promise<{
    pendingAppointments: any[];
    todayConsultations: Consultation[];
    statistics: any;
    recentPatients: any[];
  }> {
    // Mock implementation - return dashboard data
    const pendingAppointments = mockAppointments;
    const today = new Date().toISOString().split('T')[0];
    const todayConsultations = mockConsultations.filter(consultation => 
      consultation.scheduledAt.toISOString().split('T')[0] === today
    );
    const statistics = await this.getDoctorStatistics(doctorId);
    const recentPatients = mockRecentPatients;

    return {
      pendingAppointments,
      todayConsultations,
      statistics,
      recentPatients,
    };
  }
}

export const doctorService = new DoctorService();
