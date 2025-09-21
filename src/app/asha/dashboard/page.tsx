'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowLeft, Users, Activity, Calendar, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ashaService } from '@/services/ashaService';


export default function ASHADashboard() {
  const { userProfile, signOut } = useAuth();
  const { t } = useLanguage();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!userProfile) return;
      
      try {
        setLoading(true);
        const data = await ashaService.getDashboardData(userProfile.uid);
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

  const handleAcceptTask = async (taskId: string) => {
    try {
      await ashaService.acceptTask(taskId);
      toast.success('Task accepted successfully');
      
      // Reload dashboard data
      const data = await ashaService.getDashboardData(userProfile?.uid || '');
      setDashboardData(data);
    } catch (error) {
      console.error('Error accepting task:', error);
      toast.error('Failed to accept task');
    }
  };

  const handleStartTask = async (taskId: string) => {
    try {
      await ashaService.startTask(taskId);
      toast.success('Task started');
      
      // Reload dashboard data
      const data = await ashaService.getDashboardData(userProfile?.uid || '');
      setDashboardData(data);
    } catch (error) {
      console.error('Error starting task:', error);
      toast.error('Failed to start task');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
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
                Welcome, {userProfile?.name}
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
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData?.statistics?.totalTasks || 0}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {dashboardData?.statistics?.completedTasks || 0}
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
                    {dashboardData?.statistics?.pendingTasks || 0}
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
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {dashboardData?.statistics?.averageRating?.toFixed(1) || 'N/A'}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <span>Today's Tasks</span>
              </CardTitle>
              <CardDescription>Your scheduled tasks for today</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData?.todayTasks && dashboardData.todayTasks.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.todayTasks.map((task: any) => (
                    <div key={task.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{task.patientName}</h4>
                          <p className="text-sm text-gray-600">{task.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{formatTime(task.scheduledTime)}</span>
                          <span>{task.taskType.replace('_', ' ')}</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          {task.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleAcceptTask(task.id)}
                            >
                              Accept
                            </Button>
                          )}
                          {task.status === 'accepted' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStartTask(task.id)}
                            >
                              Start
                            </Button>
                          )}
                          {task.status === 'in_progress' && (
                            <Link href={`/asha/tasks/${task.id}`}>
                              <Button size="sm">
                                Complete
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No tasks scheduled for today</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <span>Pending Tasks</span>
              </CardTitle>
              <CardDescription>Tasks waiting for your attention</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData?.pendingTasks && dashboardData.pendingTasks.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.pendingTasks.slice(0, 5).map((task: any) => (
                    <div key={task.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{task.patientName}</h4>
                          <p className="text-sm text-gray-600">{task.description}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{formatDate(task.scheduledDate)}</span>
                          <span>{formatTime(task.scheduledTime)}</span>
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => handleAcceptTask(task.id)}
                        >
                          Accept
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {dashboardData.pendingTasks.length > 5 && (
                    <div className="text-center pt-4">
                      <Link href="/asha/tasks">
                        <Button variant="outline">
                          View All Tasks
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No pending tasks</p>
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
              <CardDescription>Patients you've recently visited</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardData.recentPatients.map((patient: any) => (
                  <div key={patient.id} className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-1">{patient.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{patient.phone}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{patient.taskType.replace('_', ' ')}</span>
                      <span>{new Date(patient.lastVisit).toLocaleDateString()}</span>
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
                <Link href="/asha/tasks">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <Activity className="h-6 w-6 mb-2" />
                    <span>All Tasks</span>
                  </Button>
                </Link>
                
                <Link href="/asha/patients">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <Users className="h-6 w-6 mb-2" />
                    <span>Patients</span>
                  </Button>
                </Link>
                
                <Link href="/asha/profile">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <Heart className="h-6 w-6 mb-2" />
                    <span>Profile</span>
                  </Button>
                </Link>
                
                <Link href="/asha/statistics">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    <span>Statistics</span>
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
