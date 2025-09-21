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

class DoctorService {
  // Create doctor profile
  async createDoctorProfile(doctorData: Partial<DoctorProfile>): Promise<void> {
    const doctorRef = doc(db, 'users', doctorData.uid!);
    await setDoc(doctorRef, {
      ...doctorData,
      role: 'doctor',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  // Get doctor profile
  async getDoctorProfile(uid: string): Promise<DoctorProfile | null> {
    try {
      const doctorDoc = await getDoc(doc(db, 'users', uid));
      if (doctorDoc.exists()) {
        const data = doctorDoc.data();
        if (data.role === 'doctor') {
          return data as DoctorProfile;
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting doctor profile:', error);
      throw error;
    }
  }

  // Update doctor profile
  async updateDoctorProfile(uid: string, updates: Partial<DoctorProfile>): Promise<void> {
    const doctorRef = doc(db, 'users', uid);
    await updateDoc(doctorRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  // Update doctor availability
  async updateAvailability(uid: string, isAvailable: boolean): Promise<void> {
    await this.updateDoctorProfile(uid, { isAvailable });
  }

  // Get pending appointments
  async getPendingAppointments(doctorId: string): Promise<any[]> {
    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('doctorId', '==', doctorId),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      }));
    } catch (error) {
      console.error('Error getting pending appointments:', error);
      throw error;
    }
  }

  // Accept appointment
  async acceptAppointment(appointmentId: string): Promise<void> {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentRef, {
      status: 'accepted',
      updatedAt: serverTimestamp(),
    });
  }

  // Reject appointment
  async rejectAppointment(appointmentId: string, reason?: string): Promise<void> {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentRef, {
      status: 'rejected',
      rejectionReason: reason,
      updatedAt: serverTimestamp(),
    });
  }

  // Start consultation
  async startConsultation(consultationData: Omit<Consultation, 'id'>): Promise<string> {
    const consultationsRef = collection(db, 'consultations');
    const docRef = await addDoc(consultationsRef, {
      ...consultationData,
      status: 'in_progress',
      startedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  // Complete consultation
  async completeConsultation(
    consultationId: string,
    prescription?: Prescription['medications'],
    diagnosis?: string,
    notes?: string
  ): Promise<void> {
    const consultationRef = doc(db, 'consultations', consultationId);
    
    // Get consultation data to calculate duration
    const consultationDoc = await getDoc(consultationRef);
    const consultationData = consultationDoc.data() as Consultation;
    
    const startedAt = consultationData.startedAt?.toDate() || new Date();
    const completedAt = new Date();
    const duration = Math.round((completedAt.getTime() - startedAt.getTime()) / (1000 * 60));

    await updateDoc(consultationRef, {
      status: 'completed',
      completedAt: serverTimestamp(),
      duration,
      notes,
      prescription: prescription ? {
        medications: prescription,
        diagnosis: diagnosis || '',
        notes,
      } : undefined,
    });

    // Create prescription document if provided
    if (prescription && diagnosis) {
      await this.createPrescription({
        doctorId: consultationData.doctorId,
        patientId: consultationData.patientId,
        consultationId,
        medications: prescription,
        diagnosis,
        notes,
      });
    }

    // Update appointment status
    const appointmentRef = doc(db, 'appointments', consultationData.appointmentId);
    await updateDoc(appointmentRef, {
      status: 'completed',
      updatedAt: serverTimestamp(),
    });
  }

  // Create prescription
  async createPrescription(prescriptionData: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const prescriptionsRef = collection(db, 'prescriptions');
    const docRef = await addDoc(prescriptionsRef, {
      ...prescriptionData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  // Get doctor's consultations
  async getDoctorConsultations(doctorId: string, limitCount: number = 20): Promise<Consultation[]> {
    try {
      const consultationsRef = collection(db, 'consultations');
      const q = query(
        consultationsRef,
        where('doctorId', '==', doctorId),
        orderBy('scheduledAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        scheduledAt: doc.data().scheduledAt?.toDate() || new Date(),
        startedAt: doc.data().startedAt?.toDate(),
        completedAt: doc.data().completedAt?.toDate(),
      })) as Consultation[];
    } catch (error) {
      console.error('Error getting doctor consultations:', error);
      throw error;
    }
  }

  // Get patient's medical history
  async getPatientMedicalHistory(patientId: string): Promise<{
    vitals: any[];
    reports: any[];
    prescriptions: Prescription[];
    consultations: Consultation[];
  }> {
    try {
      const [vitalsSnapshot, reportsSnapshot, prescriptionsSnapshot, consultationsSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'vitals'), where('userId', '==', patientId), orderBy('timestamp', 'desc'))),
        getDocs(query(collection(db, 'medicalReports'), where('userId', '==', patientId), orderBy('uploadedAt', 'desc'))),
        getDocs(query(collection(db, 'prescriptions'), where('patientId', '==', patientId), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'consultations'), where('patientId', '==', patientId), orderBy('scheduledAt', 'desc'))),
      ]);

      const vitals = vitalsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      }));

      const reports = reportsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate() || new Date(),
      }));

      const prescriptions = prescriptionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Prescription[];

      const consultations = consultationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        scheduledAt: doc.data().scheduledAt?.toDate() || new Date(),
        startedAt: doc.data().startedAt?.toDate(),
        completedAt: doc.data().completedAt?.toDate(),
      })) as Consultation[];

      return {
        vitals,
        reports,
        prescriptions,
        consultations,
      };
    } catch (error) {
      console.error('Error getting patient medical history:', error);
      throw error;
    }
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
    // Get patient details
    const patientDoc = await getDoc(doc(db, 'users', patientId));
    const patientData = patientDoc.data();

    const taskData = {
      ashaId,
      patientId,
      patientName: patientData?.name || 'Unknown',
      patientPhone: patientData?.phone || '',
      patientAddress: patientData?.address || '',
      taskType,
      priority,
      scheduledDate,
      scheduledTime,
      status: 'pending',
      description,
      assignedBy,
    };

    const tasksRef = collection(db, 'ashaTasks');
    const docRef = await addDoc(tasksRef, {
      ...taskData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
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
    try {
      const [consultationsSnapshot, appointmentsSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'consultations'), where('doctorId', '==', doctorId))),
        getDocs(query(collection(db, 'appointments'), where('doctorId', '==', doctorId))),
      ]);

      const consultations = consultationsSnapshot.docs.map(doc => doc.data());
      const appointments = appointmentsSnapshot.docs.map(doc => doc.data());

      const totalConsultations = consultations.length;
      const completedConsultations = consultations.filter(c => c.status === 'completed').length;
      const pendingAppointments = appointments.filter(a => a.status === 'pending').length;

      // Calculate this month's consultations
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      const thisMonthConsultations = consultations.filter(consultation => {
        const consultationDate = consultation.scheduledAt?.toDate() || new Date();
        return consultationDate >= thisMonth;
      }).length;

      // Get doctor profile for rating and fee
      const doctorProfile = await this.getDoctorProfile(doctorId);
      const averageRating = doctorProfile?.rating || 0;
      const consultationFee = doctorProfile?.consultationFee || 0;
      const totalEarnings = completedConsultations * consultationFee;

      return {
        totalConsultations,
        completedConsultations,
        pendingAppointments,
        averageRating,
        thisMonthConsultations,
        totalEarnings,
      };
    } catch (error) {
      console.error('Error getting doctor statistics:', error);
      throw error;
    }
  }

  // Get doctor dashboard data
  async getDashboardData(doctorId: string): Promise<{
    pendingAppointments: any[];
    todayConsultations: Consultation[];
    statistics: any;
    recentPatients: any[];
  }> {
    try {
      const [pendingAppointments, consultations, statistics] = await Promise.all([
        this.getPendingAppointments(doctorId),
        this.getDoctorConsultations(doctorId, 50),
        this.getDoctorStatistics(doctorId),
      ]);

      // Get today's consultations
      const today = new Date().toISOString().split('T')[0];
      const todayConsultations = consultations.filter(consultation => 
        consultation.scheduledAt.toISOString().split('T')[0] === today
      );

      // Get recent patients (from completed consultations)
      const completedConsultations = consultations.filter(c => c.status === 'completed');
      const recentPatients = completedConsultations.slice(0, 10).map(consultation => ({
        id: consultation.patientId,
        name: consultation.patientName,
        phone: consultation.patientPhone,
        lastConsultation: consultation.completedAt,
        diagnosis: consultation.prescription?.diagnosis,
      }));

      return {
        pendingAppointments,
        todayConsultations,
        statistics,
        recentPatients,
      };
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      throw error;
    }
  }
}

export const doctorService = new DoctorService();
