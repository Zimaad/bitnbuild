'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowLeft, Calendar, Clock, User, MapPin, Plus, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { userService } from '@/services/userService';

export default function AppointmentsPage() {
  const { userProfile } = useAuth();
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [availableASHA, setAvailableASHA] = useState<any[]>([]);
  const [availableDoctors, setAvailableDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    type: 'asha_visit' as 'asha_visit' | 'consultation',
    providerId: '',
    date: '',
    time: '',
    reason: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
  });

  useEffect(() => {
    const loadData = async () => {
      if (!userProfile) return;
      
      try {
        setLoading(true);
        const [userAppointments, ashaWorkers, doctors] = await Promise.all([
          userService.getUserAppointments(userProfile.uid),
          userService.getAvailableASHAWorkers(),
          userService.getAvailableDoctors(),
        ]);
        
        setAppointments(userAppointments);
        setAvailableASHA(ashaWorkers);
        setAvailableDoctors(doctors);
      } catch (error) {
        console.error('Error loading appointments data:', error);
        toast.error('Failed to load appointments data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userProfile]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userProfile) {
      toast.error('User not authenticated');
      return;
    }

    if (!bookingData.providerId || !bookingData.date || !bookingData.time || !bookingData.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const appointmentData = {
        patientId: userProfile.uid,
        [bookingData.type === 'asha_visit' ? 'ashaId' : 'doctorId']: bookingData.providerId,
        type: bookingData.type,
        date: bookingData.date,
        time: bookingData.time,
        reason: bookingData.reason,
        urgency: bookingData.urgency,
      };

      await userService.bookAppointment(appointmentData);
      
      toast.success('Appointment booked successfully');
      setShowBookingForm(false);
      
      // Reset form
      setBookingData({
        type: 'asha_visit',
        providerId: '',
        date: '',
        time: '',
        reason: '',
        urgency: 'medium',
      });
      
      // Reload appointments
      const userAppointments = await userService.getUserAppointments(userProfile.uid);
      setAppointments(userAppointments);
      
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && appointments.length === 0) {
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
              <Link href="/user/dashboard" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900">
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointments</h1>
            <p className="text-gray-600">Manage your healthcare appointments</p>
          </div>
          
          <Button onClick={() => setShowBookingForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Book Appointment
          </Button>
        </div>

        {/* Booking Form Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Book New Appointment</CardTitle>
                <CardDescription>Schedule a visit with ASHA worker or doctor</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Appointment Type</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="type"
                          value="asha_visit"
                          checked={bookingData.type === 'asha_visit'}
                          onChange={(e) => setBookingData({ ...bookingData, type: e.target.value as any, providerId: '' })}
                          className="text-primary"
                        />
                        <span className="text-sm">ASHA Visit</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="type"
                          value="consultation"
                          checked={bookingData.type === 'consultation'}
                          onChange={(e) => setBookingData({ ...bookingData, type: e.target.value as any, providerId: '' })}
                          className="text-primary"
                        />
                        <span className="text-sm">Doctor Consultation</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Select {bookingData.type === 'asha_visit' ? 'ASHA Worker' : 'Doctor'}
                    </label>
                    <select
                      value={bookingData.providerId}
                      onChange={(e) => setBookingData({ ...bookingData, providerId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Select a provider</option>
                      {(bookingData.type === 'asha_visit' ? availableASHA : availableDoctors).map((provider: any) => (
                        <option key={provider.id} value={provider.id}>
                          {provider.name} - {provider.specialization || 'ASHA Worker'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Date</label>
                      <Input
                        type="date"
                        value={bookingData.date}
                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Time</label>
                      <Input
                        type="time"
                        value={bookingData.time}
                        onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Reason for Visit</label>
                    <textarea
                      placeholder="Describe the reason for your appointment..."
                      value={bookingData.reason}
                      onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Urgency Level</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="urgency"
                          value="low"
                          checked={bookingData.urgency === 'low'}
                          onChange={(e) => setBookingData({ ...bookingData, urgency: e.target.value as any })}
                          className="text-primary"
                        />
                        <span className="text-sm">Low</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="urgency"
                          value="medium"
                          checked={bookingData.urgency === 'medium'}
                          onChange={(e) => setBookingData({ ...bookingData, urgency: e.target.value as any })}
                          className="text-primary"
                        />
                        <span className="text-sm">Medium</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="urgency"
                          value="high"
                          checked={bookingData.urgency === 'high'}
                          onChange={(e) => setBookingData({ ...bookingData, urgency: e.target.value as any })}
                          className="text-primary"
                        />
                        <span className="text-sm">High</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowBookingForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Booking...' : 'Book Appointment'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Appointments List */}
        {appointments.length > 0 ? (
          <div className="space-y-6">
            {appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          {appointment.type === 'asha_visit' ? (
                            <User className="h-5 w-5 text-green-600" />
                          ) : (
                            <Calendar className="h-5 w-5 text-blue-600" />
                          )}
                          <h3 className="font-semibold text-lg">
                            {appointment.type === 'asha_visit' ? 'ASHA Visit' : 'Doctor Consultation'}
                          </h3>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(appointment.urgency)}`}>
                          {appointment.urgency} priority
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(appointment.time)}</span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-1">Reason:</h4>
                        <p className="text-gray-600">{appointment.reason}</p>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        Booked on {formatDate(appointment.createdAt)}
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      {appointment.status === 'pending' && (
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                      )}
                      {appointment.status === 'accepted' && (
                        <Button size="sm">
                          Join Consultation
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments Yet</h3>
              <p className="text-gray-600 mb-6">You haven't booked any appointments yet. Book your first appointment to get started.</p>
              <Button onClick={() => setShowBookingForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Book Your First Appointment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
