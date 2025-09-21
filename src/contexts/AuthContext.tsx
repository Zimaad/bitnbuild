'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { authService, User, AshaUser, DoctorUser } from '@/services/authService';
import { USER_ROLES, type UserRole } from '@/utils/constants';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: User | AshaUser | DoctorUser | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (phoneNumber: string) => Promise<any>;
  verifyOTP: (confirmationResult: any, otp: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  setRole: (role: UserRole) => void;
  setUserProfile: (profile: User | AshaUser | DoctorUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | AshaUser | DoctorUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock authentication for development - bypass real Firebase auth
  useEffect(() => {
    // Set mock user data for development
    const mockUser = {
      uid: 'mock-user-id',
      phoneNumber: '+1234567890',
      displayName: 'Demo User',
    } as any;

    const mockProfile = {
      id: 'mock-user-id',
      phoneNumber: '+1234567890',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'user' as UserRole,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setUser(mockUser);
    setUserProfile(mockProfile);
    setRole('user');
    setLoading(false);
  }, []);

  const signIn = async (phoneNumber: string) => {
    try {
      setLoading(true);
      const confirmationResult = await authService.sendOTP(phoneNumber);
      return confirmationResult;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (confirmationResult: any, otp: string) => {
    try {
      setLoading(true);
      await authService.verifyOTP(confirmationResult, otp);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      // Mock sign out - just clear the state
      setUser(null);
      setUserProfile(null);
      setRole(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      setLoading(true);
      await authService.updateUserProfile(user.uid, updates);
      
      // Update local state
      if (userProfile) {
        setUserProfile({ ...userProfile, ...updates });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    role,
    loading,
    signIn,
    verifyOTP,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
    setRole,
    setUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Role-based hooks
export function useUserRole() {
  const { role, userProfile } = useAuth();
  return { role, userProfile };
}

export function useIsUser() {
  const { role } = useAuth();
  return role === USER_ROLES.USER;
}

export function useIsASHA() {
  const { role } = useAuth();
  return role === USER_ROLES.ASHA;
}

export function useIsDoctor() {
  const { role } = useAuth();
  return role === USER_ROLES.DOCTOR;
}
