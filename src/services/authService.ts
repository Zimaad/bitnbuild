import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { USER_ROLES, type UserRole } from '@/utils/constants';

export interface User {
  uid: string;
  phone: string;
  name: string;
  role: UserRole;
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

export interface AshaUser extends User {
  licenseNumber: string;
  experience: number;
  languages: string[];
  availability: {
    startTime: string;
    endTime: string;
    days: string[];
  };
  isAvailable: boolean;
}

export interface DoctorUser extends User {
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
}

class AuthService {
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  // Initialize reCAPTCHA
  initializeRecaptcha(containerId: string = 'recaptcha-container'): void {
    if (typeof window !== 'undefined') {
      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
        },
      });
    }
  }

  // Send OTP
  async sendOTP(phoneNumber: string): Promise<ConfirmationResult> {
    if (!this.recaptchaVerifier) {
      this.initializeRecaptcha();
    }

    const appVerifier = this.recaptchaVerifier!;
    const formattedPhone = `+91${phoneNumber}`;
    
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      return confirmationResult;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  }

  // Verify OTP
  async verifyOTP(confirmationResult: ConfirmationResult, otp: string): Promise<FirebaseUser> {
    try {
      const result = await confirmationResult.confirm(otp);
      return result.user;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  }

  // Create user profile
  async createUserProfile(
    user: FirebaseUser,
    userData: Partial<User>,
    role: UserRole
  ): Promise<void> {
    const userDoc = {
      uid: user.uid,
      phone: userData.phone || '',
      name: userData.name || '',
      role,
      email: userData.email,
      aadhaar: userData.aadhaar,
      age: userData.age,
      gender: userData.gender,
      diseases: userData.diseases || [],
      emergencyContact: userData.emergencyContact,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), userDoc);
  }

  // Create ASHA profile
  async createAshaProfile(
    user: FirebaseUser,
    userData: Partial<AshaUser>
  ): Promise<void> {
    const ashaDoc = {
      uid: user.uid,
      phone: userData.phone || '',
      name: userData.name || '',
      role: USER_ROLES.ASHA,
      email: userData.email,
      aadhaar: userData.aadhaar,
      age: userData.age,
      gender: userData.gender,
      diseases: userData.diseases || [],
      emergencyContact: userData.emergencyContact,
      licenseNumber: userData.licenseNumber || '',
      experience: userData.experience || 0,
      languages: userData.languages || [],
      availability: userData.availability || {
        startTime: '09:00',
        endTime: '17:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      },
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), ashaDoc);
  }

  // Create Doctor profile
  async createDoctorProfile(
    user: FirebaseUser,
    userData: Partial<DoctorUser>
  ): Promise<void> {
    const doctorDoc = {
      uid: user.uid,
      phone: userData.phone || '',
      name: userData.name || '',
      role: USER_ROLES.DOCTOR,
      email: userData.email,
      aadhaar: userData.aadhaar,
      age: userData.age,
      gender: userData.gender,
      diseases: userData.diseases || [],
      emergencyContact: userData.emergencyContact,
      licenseNumber: userData.licenseNumber || '',
      specialization: userData.specialization || '',
      experience: userData.experience || 0,
      languages: userData.languages || [],
      consultationFee: userData.consultationFee || 0,
      availability: userData.availability || {
        startTime: '09:00',
        endTime: '17:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      },
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), doctorDoc);
  }

  // Get user profile
  async getUserProfile(uid: string): Promise<User | AshaUser | DoctorUser | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as User | AshaUser | DoctorUser;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(uid: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  // Get user role
  async getUserRole(uid: string): Promise<UserRole | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.role as UserRole;
      }
      return null;
    } catch (error) {
      console.error('Error getting user role:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
