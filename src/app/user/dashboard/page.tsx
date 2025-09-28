'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Heart, Activity, Calendar, FileText, Phone, Plus, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { userService } from '@/services/userService';
import AIChat from '@/components/AIChat';

export default function UserDashboard() {
  const { userProfile, signOut } = useAuth();
  const { t } = useLanguage();
  const [healthSummary, setHealthSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!userProfile) return;
      
      try {
        setLoading(true);
        const summary = await userService.getUserHealthSummary(userProfile.uid);
        setHealthSummary(summary);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [userProfile]);

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getHealthScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/30 via-background to-secondary-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-soft border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-primary animate-heartbeat" />
              <h1 className="text-2xl font-bold text-gray-900">{t('app.name')}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 font-medium">
                Welcome, {userProfile?.name}
              </span>
              <Button variant="outline" onClick={signOut} className="hover:bg-destructive-50 hover:border-destructive-200 hover:text-destructive-700">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Health Score Card */}
        <div className="mb-8 animate-fade-in">
          <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="p-2 rounded-lg bg-primary-100">
                  <TrendingUp className="h-6 w-6 text-primary-600" />
                </div>
                <span>Health Score</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-5xl font-bold ${getHealthScoreColor(healthSummary?.healthScore || 0)} mb-2`}>
                    {healthSummary?.healthScore || 0}
                  </div>
                  <div className={`text-lg font-medium ${getHealthScoreColor(healthSummary?.healthScore || 0)}`}>
                    {getHealthScoreLabel(healthSummary?.healthScore || 0)}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-3">Based on your latest vitals</p>
                  <Link href="/user/vitals">
                    <Button variant="gradient" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/user/vitals">
            <Card className="group hover:shadow-large transition-all duration-300 cursor-pointer animate-slide-in-up">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-primary-100 group-hover:bg-primary-200 transition-colors">
                    <Activity className="h-8 w-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Record Vitals</h3>
                    <p className="text-sm text-gray-600">Track your health</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/user/appointments">
            <Card className="group hover:shadow-large transition-all duration-300 cursor-pointer animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-secondary-100 group-hover:bg-secondary-200 transition-colors">
                    <Calendar className="h-8 w-8 text-secondary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Book Appointment</h3>
                    <p className="text-sm text-gray-600">ASHA or Doctor</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/user/reports">
            <Card className="group hover:shadow-large transition-all duration-300 cursor-pointer animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-accent-100 group-hover:bg-accent-200 transition-colors">
                    <FileText className="h-8 w-8 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Medical Reports</h3>
                    <p className="text-sm text-gray-600">Upload & view</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/user/emergency">
            <Card className="group hover:shadow-large transition-all duration-300 cursor-pointer animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-destructive-100 group-hover:bg-destructive-200 transition-colors">
                    <Phone className="h-8 w-8 text-destructive-600 animate-heartbeat" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Emergency</h3>
                    <p className="text-sm text-gray-600">Get help now</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Latest Vitals */}
          <Card>
            <CardHeader>
              <CardTitle>Latest Vitals</CardTitle>
              <CardDescription>Your most recent health measurements</CardDescription>
            </CardHeader>
            <CardContent>
              {healthSummary?.latestVitals ? (
                <div className="space-y-4">
                  {healthSummary.latestVitals.vitals.bloodPressure && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Blood Pressure</span>
                      <span className="text-lg font-semibold">
                        {healthSummary.latestVitals.vitals.bloodPressure.systolic}/
                        {healthSummary.latestVitals.vitals.bloodPressure.diastolic} mmHg
                      </span>
                    </div>
                  )}
                  {healthSummary.latestVitals.vitals.bloodSugar && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Blood Sugar</span>
                      <span className="text-lg font-semibold">
                        {healthSummary.latestVitals.vitals.bloodSugar.value} {healthSummary.latestVitals.vitals.bloodSugar.unit}
                      </span>
                    </div>
                  )}
                  {healthSummary.latestVitals.vitals.weight && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Weight</span>
                      <span className="text-lg font-semibold">
                        {healthSummary.latestVitals.vitals.weight} kg
                      </span>
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    Recorded on {new Date(healthSummary.latestVitals.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No vitals recorded yet</p>
                  <Link href="/user/vitals">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Record Vitals
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Health Assistant */}
          <AIChat 
            context={{
              vitals: healthSummary?.latestVitals?.vitals,
              diseases: userProfile?.diseases,
            }}
          />
        </div>

        {/* Upcoming Appointments */}
        {healthSummary?.upcomingAppointments && healthSummary.upcomingAppointments.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled healthcare visits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthSummary.upcomingAppointments.map((appointment: any) => (
                  <div key={appointment.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">
                        {appointment.type === 'consultation' ? 'Doctor Consultation' : 'ASHA Visit'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </p>
                      <p className="text-sm text-gray-500">{appointment.reason}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.urgency === 'high' ? 'bg-red-100 text-red-800' :
                        appointment.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {appointment.urgency}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Health Alerts */}
        {healthSummary?.healthScore && healthSummary.healthScore < 60 && (
          <Card className="mt-8 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span>Health Alert</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 mb-4">
                Your health score indicates some concerns. Consider consulting with a healthcare provider.
              </p>
              <div className="flex space-x-2">
                <Link href="/user/appointments">
                  <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                    Book Consultation
                  </Button>
                </Link>
                <Link href="/user/emergency">
                  <Button className="bg-red-600 hover:bg-red-700">
                    Emergency Help
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
