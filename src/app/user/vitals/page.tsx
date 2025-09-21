'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowLeft, Activity, Save, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { userService } from '@/services/userService';
import { vitalsSchema } from '@/utils/validators';

export default function VitalsPage() {
  const { userProfile } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [vitals, setVitals] = useState({
    bloodPressure: {
      systolic: '',
      diastolic: '',
    },
    bloodSugar: {
      value: '',
      fasting: true,
      unit: 'mg/dL',
    },
    weight: '',
    height: '',
    heartRate: '',
    temperature: '',
    symptoms: '',
    notes: '',
  });

  const handleInputChange = (field: string, value: string, subField?: string) => {
    if (subField) {
      setVitals(prev => ({
        ...prev,
        [field]: {
          ...(prev[field as keyof typeof prev] as any),
          [subField]: value,
        },
      }));
    } else {
      setVitals(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userProfile) {
      toast.error('User not authenticated');
      return;
    }

    try {
      setLoading(true);
      
      // Validate and format vitals data
      const vitalsData: any = {};
      
      if (vitals.bloodPressure.systolic && vitals.bloodPressure.diastolic) {
        vitalsData.bloodPressure = {
          systolic: parseInt(vitals.bloodPressure.systolic),
          diastolic: parseInt(vitals.bloodPressure.diastolic),
        };
      }
      
      if (vitals.bloodSugar.value) {
        vitalsData.bloodSugar = {
          value: parseInt(vitals.bloodSugar.value),
          fasting: vitals.bloodSugar.fasting,
          unit: vitals.bloodSugar.unit,
        };
      }
      
      if (vitals.weight) {
        vitalsData.weight = parseFloat(vitals.weight);
      }
      
      if (vitals.height) {
        vitalsData.height = parseFloat(vitals.height);
      }
      
      if (vitals.heartRate) {
        vitalsData.heartRate = parseInt(vitals.heartRate);
      }
      
      if (vitals.temperature) {
        vitalsData.temperature = parseFloat(vitals.temperature);
      }
      
      if (vitals.symptoms) {
        vitalsData.symptoms = vitals.symptoms;
      }
      
      if (vitals.notes) {
        vitalsData.notes = vitals.notes;
      }

      await userService.addVitalRecord({
        userId: userProfile.uid,
        vitals: vitalsData,
        recordedBy: 'user',
      });

      toast.success('Vitals recorded successfully');
      
      // Reset form
      setVitals({
        bloodPressure: { systolic: '', diastolic: '' },
        bloodSugar: { value: '', fasting: true, unit: 'mg/dL' },
        weight: '',
        height: '',
        heartRate: '',
        temperature: '',
        symptoms: '',
        notes: '',
      });
      
    } catch (error) {
      console.error('Error recording vitals:', error);
      toast.error('Failed to record vitals');
    } finally {
      setLoading(false);
    }
  };

  const getBMICategory = () => {
    if (!vitals.weight || !vitals.height) return null;
    
    const weight = parseFloat(vitals.weight);
    const height = parseFloat(vitals.height);
    
    if (isNaN(weight) || isNaN(height) || height === 0) return null;
    
    const bmi = weight / Math.pow(height / 100, 2);
    
    if (bmi < 18.5) return { value: bmi.toFixed(1), category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { value: bmi.toFixed(1), category: 'Normal weight', color: 'text-green-600' };
    if (bmi < 30) return { value: bmi.toFixed(1), category: 'Overweight', color: 'text-yellow-600' };
    return { value: bmi.toFixed(1), category: 'Obese', color: 'text-red-600' };
  };

  const bmiInfo = getBMICategory();

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Record Vitals</h1>
          <p className="text-gray-600">Track your health measurements and symptoms</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Blood Pressure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-red-600" />
                <span>Blood Pressure</span>
              </CardTitle>
              <CardDescription>Measure your systolic and diastolic pressure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Systolic (Top)</label>
                  <Input
                    type="number"
                    placeholder="120"
                    value={vitals.bloodPressure.systolic}
                    onChange={(e) => handleInputChange('bloodPressure', e.target.value, 'systolic')}
                    min="50"
                    max="300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Diastolic (Bottom)</label>
                  <Input
                    type="number"
                    placeholder="80"
                    value={vitals.bloodPressure.diastolic}
                    onChange={(e) => handleInputChange('bloodPressure', e.target.value, 'diastolic')}
                    min="30"
                    max="200"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Normal: Less than 120/80 mmHg
              </p>
            </CardContent>
          </Card>

          {/* Blood Sugar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Blood Sugar</span>
              </CardTitle>
              <CardDescription>Measure your blood glucose level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Blood Sugar Level</label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="100"
                      value={vitals.bloodSugar.value}
                      onChange={(e) => handleInputChange('bloodSugar', e.target.value, 'value')}
                      min="20"
                      max="500"
                      className="flex-1"
                    />
                    <select
                      value={vitals.bloodSugar.unit}
                      onChange={(e) => handleInputChange('bloodSugar', e.target.value, 'unit')}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="mg/dL">mg/dL</option>
                      <option value="mmol/L">mmol/L</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Measurement Type</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="fasting"
                        checked={vitals.bloodSugar.fasting}
                        onChange={() => handleInputChange('bloodSugar', 'true', 'fasting')}
                        className="text-primary"
                      />
                      <span className="text-sm">Fasting</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="fasting"
                        checked={!vitals.bloodSugar.fasting}
                        onChange={() => handleInputChange('bloodSugar', 'false', 'fasting')}
                        className="text-primary"
                      />
                      <span className="text-sm">Non-fasting</span>
                    </label>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500">
                  Normal fasting: 70-100 mg/dL (3.9-5.6 mmol/L)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Weight and Height */}
          <Card>
            <CardHeader>
              <CardTitle>Weight & Height</CardTitle>
              <CardDescription>Track your body measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Weight (kg)</label>
                  <Input
                    type="number"
                    placeholder="70"
                    value={vitals.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    min="10"
                    max="300"
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Height (cm)</label>
                  <Input
                    type="number"
                    placeholder="170"
                    value={vitals.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    min="50"
                    max="250"
                    step="0.1"
                  />
                </div>
              </div>
              
              {bmiInfo && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">BMI</span>
                    <span className={`text-lg font-semibold ${bmiInfo.color}`}>
                      {bmiInfo.value}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{bmiInfo.category}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Vitals */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Measurements</CardTitle>
              <CardDescription>Other health indicators (optional)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Heart Rate (bpm)</label>
                  <Input
                    type="number"
                    placeholder="72"
                    value={vitals.heartRate}
                    onChange={(e) => handleInputChange('heartRate', e.target.value)}
                    min="30"
                    max="200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Temperature (°F)</label>
                  <Input
                    type="number"
                    placeholder="98.6"
                    value={vitals.temperature}
                    onChange={(e) => handleInputChange('temperature', e.target.value)}
                    min="95"
                    max="110"
                    step="0.1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Symptoms and Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Symptoms & Notes</CardTitle>
              <CardDescription>Describe any symptoms or additional notes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Symptoms</label>
                  <textarea
                    placeholder="Describe any symptoms you're experiencing..."
                    value={vitals.symptoms}
                    onChange={(e) => handleInputChange('symptoms', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Additional Notes</label>
                  <textarea
                    placeholder="Any additional notes or observations..."
                    value={vitals.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/user/dashboard">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Vitals
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
