'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowLeft, Stethoscope, Save, Send, Video, Mic, MicOff, VideoOff, Phone, Users, FileText } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { doctorService } from '@/services/doctorService';

export default function ConsultationRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { userProfile } = useAuth();
  const { t } = useLanguage();
  const [consultation, setConsultation] = useState<any>(null);
  const [patientHistory, setPatientHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [consultationNotes, setConsultationNotes] = useState('');
  const [prescription, setPrescription] = useState({
    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    diagnosis: '',
    followUpDate: '',
    notes: '',
  });

  useEffect(() => {
    const loadConsultationData = async () => {
      if (!userProfile) return;
      
      try {
        setLoading(true);
        
        // Resolve params Promise
        const resolvedParams = await params;
        
        // Load consultation details
        const consultations = await doctorService.getDoctorConsultations(userProfile.uid, 100);
        const currentConsultation = consultations.find(c => c.id === resolvedParams.id);
        
        if (!currentConsultation) {
          toast.error('Consultation not found');
          return;
        }
        
        setConsultation(currentConsultation);
        
        // Load patient history
        const history = await doctorService.getPatientMedicalHistory(currentConsultation.patientId);
        setPatientHistory(history);
        
      } catch (error) {
        console.error('Error loading consultation data:', error);
        toast.error('Failed to load consultation data');
      } finally {
        setLoading(false);
      }
    };

    loadConsultationData();
  }, [userProfile, params]);

  const handleAddMedication = () => {
    setPrescription(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    }));
  };

  const handleRemoveMedication = (index: number) => {
    setPrescription(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const handleMedicationChange = (index: number, field: string, value: string) => {
    setPrescription(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const handleEndConsultation = async () => {
    if (!consultation || !userProfile) return;
    
    if (!prescription.diagnosis.trim()) {
      toast.error('Please enter a diagnosis');
      return;
    }

    try {
      setSaving(true);
      
      const medications = prescription.medications.filter(med => 
        med.name.trim() && med.dosage.trim() && med.frequency.trim() && med.duration.trim()
      );

      await doctorService.completeConsultation(
        consultation.id,
        medications,
        prescription.diagnosis,
        consultationNotes
      );
      
      toast.success('Consultation completed successfully');
      
      // Redirect to consultations page
      window.location.href = '/doctor/consultations';
      
    } catch (error) {
      console.error('Error completing consultation:', error);
      toast.error('Failed to complete consultation');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Consultation Not Found</h1>
          <Link href="/doctor/consultations">
            <Button>Back to Consultations</Button>
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
              <Link href="/doctor/consultations" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Consultations</span>
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
        {/* Consultation Header */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-5 w-5 text-blue-600" />
                <span>Consultation with {consultation.patientName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVideoEnabled(!videoEnabled)}
                >
                  {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAudioEnabled(!audioEnabled)}
                >
                  {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = `tel:${consultation.patientPhone}`}
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              {formatDate(consultation.scheduledAt)} at {formatTime(consultation.scheduledAt)}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Call Area */}
          <div className="lg:col-span-2">
            <Card className="h-96">
              <CardContent className="p-6 h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-16 w-16 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Video Call</h3>
                  <p className="text-gray-600 mb-4">
                    {videoEnabled ? 'Video is enabled' : 'Video is disabled'}
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant={videoEnabled ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setVideoEnabled(!videoEnabled)}
                    >
                      {videoEnabled ? <VideoOff className="h-4 w-4 mr-1" /> : <Video className="h-4 w-4 mr-1" />}
                      {videoEnabled ? 'Disable Video' : 'Enable Video'}
                    </Button>
                    <Button
                      variant={audioEnabled ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAudioEnabled(!audioEnabled)}
                    >
                      {audioEnabled ? <MicOff className="h-4 w-4 mr-1" /> : <Mic className="h-4 w-4 mr-1" />}
                      {audioEnabled ? 'Mute' : 'Unmute'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Consultation Notes */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Consultation Notes</CardTitle>
                <CardDescription>Record your observations during the consultation</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  placeholder="Enter your consultation notes here..."
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={6}
                />
              </CardContent>
            </Card>
          </div>

          {/* Patient Information Sidebar */}
          <div className="space-y-6">
            {/* Patient Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Patient Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Name:</span>
                    <p className="text-gray-900">{consultation.patientName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Phone:</span>
                    <p className="text-gray-900">{consultation.patientPhone}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Consultation Type:</span>
                    <p className="text-gray-900">{consultation.type}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Patient History */}
            {patientHistory && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span>Patient History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Latest Vitals:</span>
                      {patientHistory.vitals && patientHistory.vitals.length > 0 ? (
                        <div className="mt-2 space-y-1">
                          {patientHistory.vitals[0].vitals.bloodPressure && (
                            <p className="text-sm text-gray-600">
                              BP: {patientHistory.vitals[0].vitals.bloodPressure.systolic}/{patientHistory.vitals[0].vitals.bloodPressure.diastolic}
                            </p>
                          )}
                          {patientHistory.vitals[0].vitals.bloodSugar && (
                            <p className="text-sm text-gray-600">
                              Sugar: {patientHistory.vitals[0].vitals.bloodSugar.value} {patientHistory.vitals[0].vitals.bloodSugar.unit}
                            </p>
                          )}
                          {patientHistory.vitals[0].vitals.weight && (
                            <p className="text-sm text-gray-600">
                              Weight: {patientHistory.vitals[0].vitals.weight} kg
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No vitals recorded</p>
                      )}
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">Recent Reports:</span>
                      <p className="text-sm text-gray-600">
                        {patientHistory.reports ? patientHistory.reports.length : 0} reports uploaded
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">Previous Consultations:</span>
                      <p className="text-sm text-gray-600">
                        {patientHistory.consultations ? patientHistory.consultations.length : 0} consultations
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Prescription Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  <span>Prescription</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Diagnosis *</label>
                  <Input
                    placeholder="Enter diagnosis"
                    value={prescription.diagnosis}
                    onChange={(e) => setPrescription(prev => ({ ...prev, diagnosis: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Medications</label>
                  <div className="space-y-3">
                    {prescription.medications.map((med, index) => (
                      <div key={index} className="p-3 border rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Medication {index + 1}</span>
                          {prescription.medications.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveMedication(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <Input
                          placeholder="Medication name"
                          value={med.name}
                          onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Dosage"
                            value={med.dosage}
                            onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                          />
                          <Input
                            placeholder="Frequency"
                            value={med.frequency}
                            onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Duration"
                            value={med.duration}
                            onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                          />
                          <Input
                            placeholder="Instructions"
                            value={med.instructions}
                            onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddMedication}
                    >
                      Add Medication
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Follow-up Date</label>
                  <Input
                    type="date"
                    value={prescription.followUpDate}
                    onChange={(e) => setPrescription(prev => ({ ...prev, followUpDate: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Additional Notes</label>
                  <textarea
                    placeholder="Additional prescription notes"
                    value={prescription.notes}
                    onChange={(e) => setPrescription(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* End Consultation Button */}
            <Button
              onClick={handleEndConsultation}
              disabled={saving || !prescription.diagnosis.trim()}
              className="w-full"
              size="lg"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Completing...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  End Consultation
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
