// App Constants
export const APP_NAME = 'Aarogya Sahayak';
export const APP_VERSION = '1.0.0';

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ASHA: 'asha',
  DOCTOR: 'doctor',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Languages
export const LANGUAGES = {
  ENGLISH: 'en',
  HINDI: 'hi',
  TAMIL: 'ta',
  TELUGU: 'te',
  BENGALI: 'bn',
  MARATHI: 'mr',
  GUJARATI: 'gu',
  KANNADA: 'kn',
  MALAYALAM: 'ml',
  PUNJABI: 'pa',
} as const;

export type Language = typeof LANGUAGES[keyof typeof LANGUAGES];

// Vital Types
export const VITAL_TYPES = {
  BLOOD_PRESSURE: 'blood_pressure',
  BLOOD_SUGAR: 'blood_sugar',
  WEIGHT: 'weight',
  HEIGHT: 'height',
  HEART_RATE: 'heart_rate',
  TEMPERATURE: 'temperature',
} as const;

export type VitalType = typeof VITAL_TYPES[keyof typeof VITAL_TYPES];

// Appointment Status
export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type AppointmentStatus = typeof APPOINTMENT_STATUS[keyof typeof APPOINTMENT_STATUS];

// Emergency Services
export const EMERGENCY_SERVICES = {
  AMBULANCE: 'ambulance',
  HOSPITAL: 'hospital',
  BLOOD_BANK: 'blood_bank',
  PHARMACY: 'pharmacy',
} as const;

export type EmergencyService = typeof EMERGENCY_SERVICES[keyof typeof EMERGENCY_SERVICES];

// Disease Categories
export const DISEASE_CATEGORIES = {
  DIABETES: 'diabetes',
  HYPERTENSION: 'hypertension',
  HEART_DISEASE: 'heart_disease',
  ASTHMA: 'asthma',
  ARTHRITIS: 'arthritis',
  OTHER: 'other',
} as const;

export type DiseaseCategory = typeof DISEASE_CATEGORIES[keyof typeof DISEASE_CATEGORIES];

// File Types
export const FILE_TYPES = {
  PDF: 'application/pdf',
  IMAGE: 'image/*',
} as const;

export type FileType = typeof FILE_TYPES[keyof typeof FILE_TYPES];

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  USERS: '/api/users',
  ASHA: '/api/asha',
  DOCTORS: '/api/doctors',
  APPOINTMENTS: '/api/appointments',
  VITALS: '/api/vitals',
  EMERGENCY: '/api/emergency',
  AI: '/api/ai',
} as const;

// Storage Paths
export const STORAGE_PATHS = {
  USER_REPORTS: 'user-reports',
  PRESCRIPTIONS: 'prescriptions',
  PROFILE_IMAGES: 'profile-images',
} as const;
