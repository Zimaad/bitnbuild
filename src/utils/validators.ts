import { z } from 'zod';

// Phone number validation schema
export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(10, 'Phone number must be exactly 10 digits')
  .regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number');

// Aadhaar validation schema
export const aadhaarSchema = z
  .string()
  .length(12, 'Aadhaar number must be exactly 12 digits')
  .regex(/^\d{12}$/, 'Aadhaar number must contain only digits');

// Email validation schema
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .optional();

// Name validation schema
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

// Age validation schema
export const ageSchema = z
  .number()
  .min(1, 'Age must be at least 1')
  .max(120, 'Age must be less than 120');

// Gender validation schema
export const genderSchema = z.enum(['male', 'female', 'other']);

// Blood pressure validation schema
export const bloodPressureSchema = z.object({
  systolic: z.number().min(50).max(300),
  diastolic: z.number().min(30).max(200),
});

// Blood sugar validation schema
export const bloodSugarSchema = z.object({
  value: z.number().min(20).max(500),
  fasting: z.boolean(),
  unit: z.enum(['mg/dL', 'mmol/L']),
});

// Weight validation schema
export const weightSchema = z
  .number()
  .min(10, 'Weight must be at least 10 kg')
  .max(300, 'Weight must be less than 300 kg');

// Height validation schema
export const heightSchema = z
  .number()
  .min(50, 'Height must be at least 50 cm')
  .max(250, 'Height must be less than 250 cm');

// User registration schema
export const userRegistrationSchema = z.object({
  phone: phoneSchema,
  name: nameSchema,
  age: ageSchema,
  gender: genderSchema,
  aadhaar: aadhaarSchema.optional(),
  email: emailSchema,
  diseases: z.array(z.string()).optional(),
  emergencyContact: z.object({
    name: nameSchema,
    phone: phoneSchema,
    relation: z.string(),
  }).optional(),
});

// ASHA registration schema
export const ashaRegistrationSchema = z.object({
  phone: phoneSchema,
  name: nameSchema,
  age: ageSchema,
  gender: genderSchema,
  aadhaar: aadhaarSchema,
  email: emailSchema,
  licenseNumber: z.string().min(5),
  experience: z.number().min(0),
  languages: z.array(z.string()).min(1),
  availability: z.object({
    startTime: z.string(),
    endTime: z.string(),
    days: z.array(z.string()),
  }),
});

// Doctor registration schema
export const doctorRegistrationSchema = z.object({
  phone: phoneSchema,
  name: nameSchema,
  age: ageSchema,
  gender: genderSchema,
  aadhaar: aadhaarSchema,
  email: emailSchema,
  licenseNumber: z.string().min(5),
  specialization: z.string().min(2),
  experience: z.number().min(0),
  languages: z.array(z.string()).min(1),
  consultationFee: z.number().min(0),
  availability: z.object({
    startTime: z.string(),
    endTime: z.string(),
    days: z.array(z.string()),
  }),
});

// Vitals entry schema
export const vitalsSchema = z.object({
  bloodPressure: bloodPressureSchema.optional(),
  bloodSugar: bloodSugarSchema.optional(),
  weight: weightSchema.optional(),
  height: heightSchema.optional(),
  heartRate: z.number().min(30).max(200).optional(),
  temperature: z.number().min(95).max(110).optional(),
  symptoms: z.string().optional(),
  notes: z.string().optional(),
});

// Appointment booking schema
export const appointmentSchema = z.object({
  patientId: z.string(),
  doctorId: z.string().optional(),
  ashaId: z.string().optional(),
  type: z.enum(['consultation', 'asha_visit']),
  date: z.string(),
  time: z.string(),
  reason: z.string().min(10),
  urgency: z.enum(['low', 'medium', 'high']),
});

// Prescription schema
export const prescriptionSchema = z.object({
  patientId: z.string(),
  doctorId: z.string(),
  appointmentId: z.string(),
  medications: z.array(z.object({
    name: z.string(),
    dosage: z.string(),
    frequency: z.string(),
    duration: z.string(),
    instructions: z.string().optional(),
  })),
  diagnosis: z.string(),
  followUpDate: z.string().optional(),
  notes: z.string().optional(),
});

// Emergency request schema
export const emergencySchema = z.object({
  type: z.enum(['ambulance', 'hospital', 'blood_bank', 'pharmacy']),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string(),
  }),
  urgency: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string().optional(),
});

// File upload schema
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  type: z.enum(['report', 'prescription', 'image']),
  description: z.string().optional(),
});

// AI chat schema
export const aiChatSchema = z.object({
  message: z.string().min(1),
  context: z.object({
    userId: z.string(),
    vitals: vitalsSchema.optional(),
    diseases: z.array(z.string()).optional(),
    recentReports: z.array(z.string()).optional(),
  }).optional(),
});

export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type AshaRegistration = z.infer<typeof ashaRegistrationSchema>;
export type DoctorRegistration = z.infer<typeof doctorRegistrationSchema>;
export type Vitals = z.infer<typeof vitalsSchema>;
export type Appointment = z.infer<typeof appointmentSchema>;
export type Prescription = z.infer<typeof prescriptionSchema>;
export type EmergencyRequest = z.infer<typeof emergencySchema>;
export type FileUpload = z.infer<typeof fileUploadSchema>;
export type AIChat = z.infer<typeof aiChatSchema>;
