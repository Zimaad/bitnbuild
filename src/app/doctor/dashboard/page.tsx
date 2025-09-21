'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowLeft, Users, Calendar, TrendingUp, CheckCircle, Clock, AlertCircle, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { doctorService } from '@/services/doctorService';
import { ashaService } from '@/services/ashaService';

export default function DoctorDashboard() {
  const { userProfile, signOut } = useAuth();
  const { t } = useLanguage();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!userProfile) return;
      
      try {
        setLoading(true);
        const data = await doctorService.getDashboardData(userProfile.uid);
        setDashboardData(data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [userProfile]);

  const handleAcceptAppointment = async (appointmentId: string) => {
    try {
      await doctorService.acceptAppointment(appointmentId);
      toast.success('Appointment accepted successfully');
      
      // Reload dashboard data
      const data = await doctorService.getDashboardData(userProfile?.uid || '');
      setDashboardData(data);
    } catch (error) {
      console.error('Error accepting appointment:', error);
      toast.error('Failed to accept appointment');
    }
  };

  const handleRejectAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to reject this appointment?')) return;
    
    try {
      await doctorService.rejectAppointment(appointmentId, 'Doctor unavailable');
      toast.success('Appointment rejected');
      
      // Reload dashboard data
      const data = await doctorService.getDashboardData(userProfile?.uid || '');
      setDashboardData(data);
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      toast.error('Failed to reject appointment');
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
              <Heart className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">{t('app.name')}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, Dr. {userProfile?.name}
              </span>
              <Button variant="outline" onClick={signOut}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Consultations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData?.statistics?.totalConsultations || 0}
                  </p>
                </div>
                <Stethoscope className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {dashboardData?.statistics?.completedConsultations || 0}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {dashboardData?.statistics?.pendingAppointments || 0}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Earnings</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ₹{dashboardData?.statistics?.totalEarnings || 0}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Consultations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Today's Consultations</span>
              </CardTitle>
              <CardDescription>Your scheduled consultations for today</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData?.todayConsultations && dashboardData.todayConsultations.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.todayConsultations.map((consultation: any) => (
                    <div key={consultation.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{consultation.patientName}</h4>
                          <p className="text-sm text-gray-600">{consultation.type}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          consultation.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          consultation.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {consultation.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{formatTime(consultation.scheduledAt)}</span>
                          <span>{consultation.duration ? `${consultation.duration} min` : 'Not started'}</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          {consultation.status === 'scheduled' && (
                            <Button
                              size="sm"
                              onClick={() => window.location.href = `/doctor/consultations/${consultation.id}`}
                            >
                              Start Consultation
                            </Button>
                          )}
                          {consultation.status === 'in_progress' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.location.href = `/doctor/consultations/${consultation.id}`}
                            >
                              Continue
                            </Button>
                          )}
                          {consultation.status === 'completed' && (
                            <div className="text-center">
                              <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
                              <span className="text-sm text-green-600 font-medium">Completed</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No consultations scheduled for today</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <span>Pending Appointments</span>
              </CardTitle>
              <CardDescription>Appointments waiting for your approval</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData?.pendingAppointments && dashboardData.pendingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.pendingAppointments.slice(0, 5).map((appointment: any) => (
                    <div key={appointment.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{appointment.patientName}</h4>
                          <p className="text-sm text-gray-600">{appointment.reason}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(appointment.urgency)}`}>
                          {appointment.urgency} priority
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{formatDate(appointment.date)}</span>
                          <span>{formatTime(appointment.time)}</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleAcceptAppointment(appointment.id)}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectAppointment(appointment.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {dashboardData.pendingAppointments.length > 5 && (
                    <div className="text-center pt-4">
                      <Link href="/doctor/appointments">
                        <Button variant="outline">
                          View All Appointments
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No pending appointments</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Patients */}
        {dashboardData?.recentPatients && dashboardData.recentPatients.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Recent Patients</span>
              </CardTitle>
              <CardDescription>Patients you've recently consulted</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardData.recentPatients.map((patient: any) => (
                  <div key={patient.id} className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-1">{patient.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{patient.phone}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{patient.diagnosis || 'No diagnosis'}</span>
                      <span>{new Date(patient.lastConsultation).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and navigation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/doctor/consultations">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <Stethoscope className="h-6 w-6 mb-2" />
                    <span>Consultations</span>
                  </Button>
                </Link>
                
                <Link href="/doctor/appointments">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <Calendar className="h-6 w-6 mb-2" />
                    <span>Appointments</span>
                  </Button>
                </Link>
                
                <Link href="/doctor/patients">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <Users className="h-6 w-6 mb-2" />
                    <span>Patients</span>
                  </Button>
                </Link>
                
                <Link href="/doctor/prescriptions">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <Heart className="h-6 w-6 mb-2" />
                    <span>Prescriptions</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
