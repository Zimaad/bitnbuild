'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Heart, Stethoscope } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { USER_ROLES, type UserRole } from '@/utils/constants';

export default function RoleSwitcher() {
  const { role, setRole, setUserProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const switchRole = (newRole: UserRole) => {
    const mockProfiles = {
      user: {
        id: 'mock-user-id',
        phoneNumber: '+1234567890',
        name: 'Demo Patient',
        email: 'patient@example.com',
        role: 'user' as UserRole,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      asha: {
        id: 'mock-asha-id',
        phoneNumber: '+1234567890',
        name: 'Demo ASHA Worker',
        email: 'asha@example.com',
        role: 'asha' as UserRole,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      doctor: {
        id: 'mock-doctor-id',
        phoneNumber: '+1234567890',
        name: 'Demo Doctor',
        email: 'doctor@example.com',
        role: 'doctor' as UserRole,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    setRole(newRole);
    setUserProfile(mockProfiles[newRole]);
    setIsOpen(false);
  };

  const roleInfo = {
    user: { label: 'Patient', icon: Users, color: 'text-blue-600' },
    asha: { label: 'ASHA Worker', icon: Heart, color: 'text-green-600' },
    doctor: { label: 'Doctor', icon: Stethoscope, color: 'text-purple-600' },
  };

  const currentRoleInfo = roleInfo[role || 'user'];

  return (
    <div className="fixed top-4 right-4 z-50">
      <Card className="w-64">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Role Switcher (Demo)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center space-x-2">
            <currentRoleInfo.icon className={`h-4 w-4 ${currentRoleInfo.color}`} />
            <span className="text-sm font-medium">Current: {currentRoleInfo.label}</span>
          </div>
          
          <div className="space-y-1">
            {Object.entries(roleInfo).map(([roleKey, info]) => (
              <Button
                key={roleKey}
                variant={role === roleKey ? "default" : "outline"}
                size="sm"
                className="w-full justify-start"
                onClick={() => switchRole(roleKey as UserRole)}
              >
                <info.icon className={`h-4 w-4 mr-2 ${info.color}`} />
                {info.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
