'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowLeft, Stethoscope, Calendar, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { doctorService } from '@/services/doctorService';

export default function DoctorConsultationsPage() {
  const { userProfile } = useAuth();
  const { t } = useLanguage();
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    const loadConsultations = async () => {
      if (!userProfile) return;
      
      try {
        setLoading(true);
        const doctorConsultations = await doctorService.getDoctorConsultations(userProfile.uid, 50);
        setConsultations(doctorConsultations);
      } catch (error) {
        console.error('Error loading consultations:', error);
        toast.error('Failed to load consultations');
      } finally {
        setLoading(false);
      }
    };

    loadConsultations();
  }, [userProfile]);

  const handleStartConsultation = async (consultationId: string) => {
    try {
      await doctorService.startConsultation({
        doctorId: userProfile?.uid || '',
        patientId: '', // Will be filled from consultation data
        patientName: '',
        patientPhone: '',
        appointmentId: consultationId,
        type: 'video',
        status: 'scheduled',
        scheduledAt: new Date(),
      });
      
      toast.success('Consultation started');
      
      // Redirect to consultation room
      window.location.href = `/doctor/consultations/${consultationId}`;
    } catch (error) {
      console.error('Error starting consultation:', error);
      toast.error('Failed to start consultation');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Stethoscope className="h-5 w-5 text-blue-600" />;
      case 'audio': return <Heart className="h-5 w-5 text-green-600" />;
      case 'chat': return <Users className="h-5 w-5 text-purple-600" />;
      default: return <Stethoscope className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredConsultations = consultations.filter(consultation => {
    if (filter === 'all') return true;
    return consultation.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Link href="/doctor/dashboard" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">{t('app.name')}</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Consultations</h1>
            <p className="text-gray-600">Manage your patient consultations</p>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex space-x-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({consultations.length})
            </Button>
            <Button
              variant={filter === 'scheduled' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('scheduled')}
            >
              Scheduled ({consultations.filter(c => c.status === 'scheduled').length})
            </Button>
            <Button
              variant={filter === 'in_progress' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('in_progress')}
            >
              In Progress ({consultations.filter(c => c.status === 'in_progress').length})
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Completed ({consultations.filter(c => c.status === 'completed').length})
            </Button>
          </div>
        </div>

        {/* Consultations List */}
        {filteredConsultations.length > 0 ? (
          <div className="space-y-6">
            {filteredConsultations.map((consultation) => (
              <Card key={consultation.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-gray-100 rounded-lg">
                        {getTypeIcon(consultation.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{consultation.patientName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                            {consultation.status.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(consultation.scheduledAt)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(consultation.scheduledAt)}</span>
                          </div>
                          {consultation.duration && (
                            <div className="flex items-center space-x-2">
                              <Stethoscope className="h-4 w-4" />
                              <span>{consultation.duration} minutes</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <Heart className="h-4 w-4" />
                            <span>{consultation.patientPhone}</span>
                          </div>
                        </div>
                        
                        {consultation.prescription && (
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-sm font-medium text-green-800 mb-1">Prescription Available</p>
                            <p className="text-xs text-green-700">
                              Diagnosis: {consultation.prescription.diagnosis}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      {consultation.status === 'scheduled' && (
                        <Button
                          onClick={() => handleStartConsultation(consultation.id)}
                          className="w-full"
                        >
                          Start Consultation
                        </Button>
                      )}
                      {consultation.status === 'in_progress' && (
                        <Link href={`/doctor/consultations/${consultation.id}`}>
                          <Button className="w-full">
                            Continue Consultation
                          </Button>
                        </Link>
                      )}
                      {consultation.status === 'completed' && (
                        <div className="text-center">
                          <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
                          <span className="text-sm text-green-600 font-medium">Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Consultation Details */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Consultation Type:</span>
                        <p className="text-gray-600">{consultation.type}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Started:</span>
                        <p className="text-gray-600">
                          {consultation.startedAt ? formatTime(consultation.startedAt) : 'Not started'}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Completed:</span>
                        <p className="text-gray-600">
                          {consultation.completedAt ? formatTime(consultation.completedAt) : 'Not completed'}
                        </p>
                      </div>
                    </div>
                    
                    {consultation.notes && (
                      <div className="mt-4">
                        <span className="font-medium text-gray-700">Notes:</span>
                        <p className="text-gray-600 mt-1">{consultation.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Consultations Found</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'You don\'t have any consultations yet.'
                  : `No consultations with status "${filter}" found.`
                }
              </p>
            </CardContent>
          </Card>
        )}

        {/* Consultation Statistics */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Consultation Statistics</CardTitle>
            <CardDescription>Overview of your consultation performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {consultations.filter(c => c.status === 'scheduled').length}
                </div>
                <div className="text-sm text-gray-600">Scheduled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {consultations.filter(c => c.status === 'in_progress').length}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {consultations.filter(c => c.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {consultations.reduce((total, c) => total + (c.duration || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Minutes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
