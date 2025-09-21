'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, User, Stethoscope, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RoleSwitcher() {
  const { setRole, setUserProfile } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      id: 'user',
      name: 'Patient',
      description: 'Book appointments, track health records',
      icon: <User className="h-8 w-8 text-blue-600" />,
      path: '/user/dashboard',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      id: 'asha',
      name: 'ASHA Worker',
      description: 'Manage patient visits and health monitoring',
      icon: <Heart className="h-8 w-8 text-green-600" />,
      path: '/asha/dashboard',
      color: 'bg-green-50 border-green-200 hover:bg-green-100'
    },
    {
      id: 'doctor',
      name: 'Doctor',
      description: 'Consult patients and manage appointments',
      icon: <Stethoscope className="h-8 w-8 text-purple-600" />,
      path: '/doctor/dashboard',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    }
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    
    // Create mock profile based on selected role
    const mockProfiles = {
      user: {
        uid: 'mock-user-id',
        phone: '+1234567890',
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      asha: {
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
        updatedAt: new Date(),
      },
      doctor: {
        uid: 'mock-doctor-id',
        phone: '+1234567890',
        name: 'Dr. Rajesh Kumar',
        email: 'dr.rajesh@hospital.com',
        licenseNumber: 'DOC-2024-001',
        specialization: 'General Medicine',
        experience: 10,
        hospital: 'City General Hospital',
        role: 'doctor',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      }
    };

    setRole(roleId as any);
    setUserProfile(mockProfiles[roleId as keyof typeof mockProfiles] as any);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold text-gray-900">Aarogya Sahayak</h1>
          </div>
          <p className="text-xl text-gray-600">Choose your role to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Card 
              key={role.id}
              className={`cursor-pointer transition-all duration-200 ${role.color} ${
                selectedRole === role.id ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
              onClick={() => handleRoleSelect(role.id)}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {role.icon}
                </div>
                <CardTitle className="text-2xl">{role.name}</CardTitle>
                <CardDescription className="text-base">
                  {role.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                {selectedRole === role.id ? (
                  <Link href={role.path}>
                    <Button className="w-full">
                      Continue as {role.name}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" className="w-full">
                    Select {role.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedRole && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              You have selected <strong>{roles.find(r => r.id === selectedRole)?.name}</strong>
            </p>
            <Link href={roles.find(r => r.id === selectedRole)?.path || '/'}>
              <Button size="lg">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
