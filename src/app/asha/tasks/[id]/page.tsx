'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowLeft, Activity, CheckCircle, Clock, AlertCircle, MapPin, Phone, Calendar, Thermometer, Droplets, Weight, Heart as HeartIcon } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ashaService } from '@/services/ashaService';

export default function TaskCompletionPage({ params }: { params: { id: string } }) {
  const { userProfile } = useAuth();
  const { t } = useLanguage();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [vitals, setVitals] = useState({
    bloodPressure: { systolic: '', diastolic: '' },
    bloodSugar: { value: '', fasting: false, unit: 'mg/dL' },
    weight: '',
    temperature: '',
    heartRate: '',
    symptoms: ''
  });

  useEffect(() => {
    const loadTask = async () => {
      try {
        setLoading(true);
        // Get task from mock data
        const tasks = await ashaService.getPendingTasks(userProfile?.uid || '');
        const foundTask = tasks.find(t => t.id === params.id);
        setTask(foundTask);
      } catch (error) {
        console.error('Error loading task:', error);
        toast.error('Failed to load task');
      } finally {
        setLoading(false);
      }
    };

    if (userProfile) {
      loadTask();
    }
  }, [userProfile, params.id]);

  const handleVitalChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setVitals(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      setVitals(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleCompleteTask = async () => {
    try {
      setSubmitting(true);
      
      // Prepare vitals data
      const vitalsRecorded = {
        bloodPressure: vitals.bloodPressure.systolic && vitals.bloodPressure.diastolic ? {
          systolic: parseInt(vitals.bloodPressure.systolic),
          diastolic: parseInt(vitals.bloodPressure.diastolic)
        } : undefined,
        bloodSugar: vitals.bloodSugar.value ? {
          value: parseInt(vitals.bloodSugar.value),
          fasting: vitals.bloodSugar.fasting,
          unit: vitals.bloodSugar.unit
        } : undefined,
        weight: vitals.weight ? parseFloat(vitals.weight) : undefined,
        temperature: vitals.temperature ? parseFloat(vitals.temperature) : undefined,
        heartRate: vitals.heartRate ? parseInt(vitals.heartRate) : undefined,
        symptoms: vitals.symptoms || undefined
      };

      await ashaService.completeTask(params.id, vitalsRecorded, vitals.symptoms);
      toast.success('Task completed successfully');
      
      // Redirect to dashboard
      window.location.href = '/asha/dashboard';
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
    } finally {
      setSubmitting(false);
    }
  };

  const getTaskTypeIcon = (taskType: string) => {
    switch (taskType) {
      case 'vitals_check': return <Activity className="h-5 w-5 text-blue-600" />;
      case 'medicine_delivery': return <Heart className="h-5 w-5 text-green-600" />;
      case 'follow_up': return <CheckCircle className="h-5 w-5 text-purple-600" />;
      case 'emergency_visit': return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Activity className="h-5 w-5 text-gray-600" />;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Task Not Found</h2>
          <p className="text-gray-600 mb-4">The requested task could not be found.</p>
          <Link href="/asha/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
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
              <Link href="/asha/dashboard" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Task Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                {getTaskTypeIcon(task.taskType)}
              </div>
              <div>
                <CardTitle className="text-2xl">{task.patientName}</CardTitle>
                <CardDescription className="text-lg">{task.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{formatDate(task.scheduledDate)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{formatTime(task.scheduledTime)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{task.patientPhone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{task.patientAddress}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vitals Recording Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span>Record Vitals</span>
            </CardTitle>
            <CardDescription>Record the patient's vital signs and observations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Blood Pressure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Pressure (mmHg)
                </label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Systolic"
                    value={vitals.bloodPressure.systolic}
                    onChange={(e) => handleVitalChange('bloodPressure.systolic', e.target.value)}
                    type="number"
                  />
                  <span className="flex items-center text-gray-500">/</span>
                  <Input
                    placeholder="Diastolic"
                    value={vitals.bloodPressure.diastolic}
                    onChange={(e) => handleVitalChange('bloodPressure.diastolic', e.target.value)}
                    type="number"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Sugar (mg/dL)
                </label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Value"
                    value={vitals.bloodSugar.value}
                    onChange={(e) => handleVitalChange('bloodSugar.value', e.target.value)}
                    type="number"
                  />
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={vitals.bloodSugar.fasting}
                      onChange={(e) => handleVitalChange('bloodSugar.fasting', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-600">Fasting</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Other Vitals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <Input
                  placeholder="Weight"
                  value={vitals.weight}
                  onChange={(e) => handleVitalChange('weight', e.target.value)}
                  type="number"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature (°F)
                </label>
                <Input
                  placeholder="Temperature"
                  value={vitals.temperature}
                  onChange={(e) => handleVitalChange('temperature', e.target.value)}
                  type="number"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heart Rate (bpm)
                </label>
                <Input
                  placeholder="Heart Rate"
                  value={vitals.heartRate}
                  onChange={(e) => handleVitalChange('heartRate', e.target.value)}
                  type="number"
                />
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Symptoms & Observations
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={4}
                placeholder="Describe any symptoms, concerns, or observations..."
                value={vitals.symptoms}
                onChange={(e) => handleVitalChange('symptoms', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Link href="/asha/dashboard">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button 
            onClick={handleCompleteTask}
            disabled={submitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {submitting ? 'Completing...' : 'Complete Task'}
          </Button>
        </div>
      </div>
    </div>
  );
}
