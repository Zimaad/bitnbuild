'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowLeft, Phone, User, Mail, Calendar, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { USER_ROLES } from '@/utils/constants';

export default function RegisterPage() {
  const { user } = useAuth();
  const [step, setStep] = useState<'role' | 'phone' | 'otp' | 'profile'>('role');
  const [selectedRole, setSelectedRole] = useState<'user' | 'asha' | 'doctor'>('user');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Profile form data
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    aadhaar: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
  });

  // ASHA specific data
  const [ashaData, setAshaData] = useState({
    licenseNumber: '',
    experience: '',
    languages: [] as string[],
    availabilityStart: '09:00',
    availabilityEnd: '17:00',
    availabilityDays: [] as string[],
  });

  // Doctor specific data
  const [doctorData, setDoctorData] = useState({
    licenseNumber: '',
    specialization: '',
    experience: '',
    languages: [] as string[],
    consultationFee: '',
    availabilityStart: '09:00',
    availabilityEnd: '17:00',
    availabilityDays: [] as string[],
  });

  const { signIn, verifyOTP, createUserProfile, createAshaProfile, createDoctorProfile } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      setLoading(true);
      const result = await signIn(phoneNumber);
      setConfirmationResult(result);
      setStep('otp');
      toast.success('OTP sent successfully');
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      await verifyOTP(confirmationResult, otp);
      setStep('profile');
      toast.success('Phone verified successfully');
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast.error(error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileData.name || !profileData.age || !profileData.gender) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const baseProfileData = {
        uid: user.uid,
        phone: phoneNumber,
        name: profileData.name,
        email: profileData.email || undefined,
        age: parseInt(profileData.age),
        gender: profileData.gender,
        aadhaar: profileData.aadhaar || undefined,
        emergencyContact: profileData.emergencyContactName ? {
          name: profileData.emergencyContactName,
          phone: profileData.emergencyContactPhone,
          relation: profileData.emergencyContactRelation,
        } : undefined,
      };

      if (selectedRole === 'user') {
        await createUserProfile(user, baseProfileData, USER_ROLES.USER);
      } else if (selectedRole === 'asha') {
        await createAshaProfile(user, {
          ...baseProfileData,
          licenseNumber: ashaData.licenseNumber,
          experience: parseInt(ashaData.experience),
          languages: ashaData.languages,
          availability: {
            startTime: ashaData.availabilityStart,
            endTime: ashaData.availabilityEnd,
            days: ashaData.availabilityDays,
          },
        });
      } else if (selectedRole === 'doctor') {
        await createDoctorProfile(user, {
          ...baseProfileData,
          licenseNumber: doctorData.licenseNumber,
          specialization: doctorData.specialization,
          experience: parseInt(doctorData.experience),
          languages: doctorData.languages,
          consultationFee: parseInt(doctorData.consultationFee),
          availability: {
            startTime: doctorData.availabilityStart,
            endTime: doctorData.availabilityEnd,
            days: doctorData.availabilityDays,
          },
        });
      }

      toast.success('Registration completed successfully');
      // Redirect will happen automatically via AuthContext
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast.error(error.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSelection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Choose Your Role</CardTitle>
        <CardDescription className="text-center">
          Select how you'll be using Aarogya Sahayak
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <button
            type="button"
            onClick={() => setSelectedRole('user')}
            className={`p-4 border rounded-lg text-left transition-colors ${
              selectedRole === 'user' 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold">Patient/User</h3>
                <p className="text-sm text-gray-600">Track health, book appointments, get AI assistance</p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('asha')}
            className={`p-4 border rounded-lg text-left transition-colors ${
              selectedRole === 'asha' 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Heart className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold">ASHA Worker</h3>
                <p className="text-sm text-gray-600">Manage patient visits, record vitals, coordinate care</p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('doctor')}
            className={`p-4 border rounded-lg text-left transition-colors ${
              selectedRole === 'doctor' 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <User className="h-6 w-6 text-purple-600" />
              <div>
                <h3 className="font-semibold">Doctor</h3>
                <p className="text-sm text-gray-600">Conduct consultations, write prescriptions, manage patients</p>
              </div>
            </div>
          </button>
        </div>

        <Button 
          onClick={() => setStep('phone')} 
          className="w-full"
          disabled={!selectedRole}
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  );

  const renderPhoneForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Enter Phone Number</CardTitle>
        <CardDescription className="text-center">
          We'll send you a verification code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="9876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="pl-10"
                maxLength={10}
                required
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setStep('role')}
              className="flex-1"
            >
              Back
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={loading || phoneNumber.length !== 10}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderOTPForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Verify OTP</CardTitle>
        <CardDescription className="text-center">
          Enter the 6-digit code sent to +91 {phoneNumber}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="otp" className="text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <Input
              id="otp"
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-lg tracking-widest"
              maxLength={6}
              required
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setStep('phone')}
              className="flex-1"
            >
              Back
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={loading || otp.length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderProfileForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Complete Your Profile</CardTitle>
        <CardDescription className="text-center">
          Tell us more about yourself
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="age" className="text-sm font-medium text-gray-700">
                Age *
              </label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                value={profileData.age}
                onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="gender" className="text-sm font-medium text-gray-700">
                Gender *
              </label>
              <select
                id="gender"
                value={profileData.gender}
                onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email (Optional)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="aadhaar" className="text-sm font-medium text-gray-700">
              Aadhaar Number (Optional)
            </label>
            <Input
              id="aadhaar"
              type="text"
              placeholder="123456789012"
              value={profileData.aadhaar}
              onChange={(e) => setProfileData({ ...profileData, aadhaar: e.target.value.replace(/\D/g, '').slice(0, 12) })}
              maxLength={12}
            />
          </div>

          {/* Role-specific fields */}
          {selectedRole === 'asha' && (
            <>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">ASHA Worker Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="ashaLicense" className="text-sm font-medium text-gray-700">
                      License Number *
                    </label>
                    <Input
                      id="ashaLicense"
                      type="text"
                      placeholder="ASHA123456"
                      value={ashaData.licenseNumber}
                      onChange={(e) => setAshaData({ ...ashaData, licenseNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="ashaExperience" className="text-sm font-medium text-gray-700">
                      Experience (Years) *
                    </label>
                    <Input
                      id="ashaExperience"
                      type="number"
                      placeholder="5"
                      value={ashaData.experience}
                      onChange={(e) => setAshaData({ ...ashaData, experience: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {selectedRole === 'doctor' && (
            <>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Doctor Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="doctorLicense" className="text-sm font-medium text-gray-700">
                      License Number *
                    </label>
                    <Input
                      id="doctorLicense"
                      type="text"
                      placeholder="DOC123456"
                      value={doctorData.licenseNumber}
                      onChange={(e) => setDoctorData({ ...doctorData, licenseNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="specialization" className="text-sm font-medium text-gray-700">
                      Specialization *
                    </label>
                    <Input
                      id="specialization"
                      type="text"
                      placeholder="General Medicine"
                      value={doctorData.specialization}
                      onChange={(e) => setDoctorData({ ...doctorData, specialization: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <label htmlFor="doctorExperience" className="text-sm font-medium text-gray-700">
                      Experience (Years) *
                    </label>
                    <Input
                      id="doctorExperience"
                      type="number"
                      placeholder="10"
                      value={doctorData.experience}
                      onChange={(e) => setDoctorData({ ...doctorData, experience: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="consultationFee" className="text-sm font-medium text-gray-700">
                      Consultation Fee (₹) *
                    </label>
                    <Input
                      id="consultationFee"
                      type="number"
                      placeholder="500"
                      value={doctorData.consultationFee}
                      onChange={(e) => setDoctorData({ ...doctorData, consultationFee: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setStep('otp')}
              className="flex-1"
            >
              Back
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={loading}
            >
              {loading ? 'Creating Profile...' : 'Complete Registration'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">{t('app.name')}</h1>
          </div>
          
          <p className="text-gray-600">Create your account</p>
        </div>

        {/* Form Steps */}
        {step === 'role' && renderRoleSelection()}
        {step === 'phone' && renderPhoneForm()}
        {step === 'otp' && renderOTPForm()}
        {step === 'profile' && renderProfileForm()}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium">
              Sign in here
            </Link>
          </p>
        </div>

        {/* reCAPTCHA container */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}
