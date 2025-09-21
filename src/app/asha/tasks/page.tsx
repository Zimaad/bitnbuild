'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowLeft, Activity, CheckCircle, Clock, AlertCircle, MapPin, Phone, Calendar } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ashaService } from '@/services/ashaService';

export default function ASHATasksPage() {
  const { userProfile } = useAuth();
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    const loadTasks = async () => {
      if (!userProfile) return;
      
      try {
        setLoading(true);
        const pendingTasks = await ashaService.getPendingTasks(userProfile.uid);
        setTasks(pendingTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [userProfile]);

  const handleAcceptTask = async (taskId: string) => {
    try {
      await ashaService.acceptTask(taskId);
      toast.success('Task accepted successfully');
      
      // Reload tasks
      const pendingTasks = await ashaService.getPendingTasks(userProfile?.uid || '');
      setTasks(pendingTasks);
    } catch (error) {
      console.error('Error accepting task:', error);
      toast.error('Failed to accept task');
    }
  };

  const handleStartTask = async (taskId: string) => {
    try {
      await ashaService.startTask(taskId);
      toast.success('Task started');
      
      // Reload tasks
      const pendingTasks = await ashaService.getPendingTasks(userProfile?.uid || '');
      setTasks(pendingTasks);
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

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
            <p className="text-gray-600">Manage your patient visits and tasks</p>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex space-x-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({tasks.length})
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
            >
              Pending ({tasks.filter(t => t.status === 'pending').length})
            </Button>
            <Button
              variant={filter === 'accepted' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('accepted')}
            >
              Accepted ({tasks.filter(t => t.status === 'accepted').length})
            </Button>
            <Button
              variant={filter === 'in_progress' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('in_progress')}
            >
              In Progress ({tasks.filter(t => t.status === 'in_progress').length})
            </Button>
          </div>
        </div>

        {/* Tasks List */}
        {filteredTasks.length > 0 ? (
          <div className="space-y-6">
            {filteredTasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-gray-100 rounded-lg">
                        {getTaskTypeIcon(task.taskType)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{task.patientName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority} priority
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{task.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(task.scheduledDate)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(task.scheduledTime)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>{task.patientPhone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{task.patientAddress}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      {task.status === 'pending' && (
                        <Button
                          onClick={() => handleAcceptTask(task.id)}
                          className="w-full"
                        >
                          Accept Task
                        </Button>
                      )}
                      {task.status === 'accepted' && (
                        <Button
                          onClick={() => handleStartTask(task.id)}
                          className="w-full"
                        >
                          Start Visit
                        </Button>
                      )}
                      {task.status === 'in_progress' && (
                        <Link href={`/asha/tasks/${task.id}`}>
                          <Button className="w-full">
                            Complete Task
                          </Button>
                        </Link>
                      )}
                      {task.status === 'completed' && (
                        <div className="text-center">
                          <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
                          <span className="text-sm text-green-600 font-medium">Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Task Details */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Task Type:</span>
                        <p className="text-gray-600">{task.taskType.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Assigned By:</span>
                        <p className="text-gray-600">{task.assignedBy ? 'Doctor' : 'System'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Created:</span>
                        <p className="text-gray-600">{formatDate(task.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tasks Found</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'You don\'t have any tasks assigned yet.'
                  : `No tasks with status "${filter}" found.`
                }
              </p>
            </CardContent>
          </Card>
        )}

        {/* Task Statistics */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Task Statistics</CardTitle>
            <CardDescription>Overview of your task performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {tasks.filter(t => t.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {tasks.filter(t => t.status === 'accepted').length}
                </div>
                <div className="text-sm text-gray-600">Accepted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {tasks.filter(t => t.status === 'in_progress').length}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {tasks.filter(t => t.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
