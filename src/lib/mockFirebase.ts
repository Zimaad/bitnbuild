// Mock Firebase for development when real Firebase is not available
export const mockAuth = {
  currentUser: null,
  signInWithPhoneNumber: async () => ({ verificationId: 'mock-verification-id' }),
  signInWithCredential: async () => ({ user: { uid: 'mock-user-id' } }),
  signOut: async () => {},
  onAuthStateChanged: (callback: (user: any) => void) => {
    // Mock user for development
    setTimeout(() => callback({ uid: 'mock-user-id', phoneNumber: '+1234567890' }), 1000);
    return () => {};
  },
};

// Mock data for ASHA dashboard
const mockASHAProfile = {
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
  role: 'asha',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date()
};

const mockTasks = [
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
  }
];

const mockRecentPatients = [
  {
    id: 'patient-5',
    name: 'Geeta Reddy',
    phone: '+9876543214',
    lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    taskType: 'vitals_check'
  },
  {
    id: 'patient-6',
    name: 'Rajesh Patel',
    phone: '+9876543215',
    lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    taskType: 'medicine_delivery'
  },
  {
    id: 'patient-7',
    name: 'Meera Joshi',
    phone: '+9876543216',
    lastVisit: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    taskType: 'follow_up'
  }
];

export const mockDb = {
  collection: (name: string) => ({
    doc: (id: string) => ({
      get: async () => {
        if (name === 'users' && id === 'mock-asha-id') {
          return { exists: true, data: () => mockASHAProfile };
        }
        return { exists: false, data: () => null };
      },
      set: async (data: any) => {},
      update: async (data: any) => {},
      delete: async () => {},
    }),
    add: async (data: any) => ({ id: 'mock-doc-id' }),
    where: (field: string, op: string, value: any) => ({
      get: async () => {
        if (name === 'ashaTasks' && field === 'ashaId' && value === 'mock-asha-id') {
          return { docs: mockTasks.map(task => ({ id: task.id, data: () => task })) };
        }
        return { docs: [] };
      },
    }),
  }),
};

export const mockStorage = {
  ref: (path: string) => ({
    put: async (file: File) => ({ ref: { getDownloadURL: async () => 'mock-url' } }),
    getDownloadURL: async () => 'mock-url',
  }),
};

export const mockAnalytics = {
  logEvent: (eventName: string, parameters?: any) => {},
};
