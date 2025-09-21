'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowLeft, Phone, MapPin, AlertTriangle, Shield, Activity, Clock } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { emergencyService } from '@/services/emergencyService';

export default function EmergencyPage() {
  const { userProfile } = useAuth();
  const { t } = useLanguage();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<any>(null);
  const [nearbyServices, setNearbyServices] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmergencyData = async () => {
      try {
        setLoading(true);
        
        // Get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setUserLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              console.error('Error getting location:', error);
              toast.error('Unable to get your location. Please enable location services.');
            }
          );
        }

        // Get emergency contacts
        const contacts = await emergencyService.getEmergencyContacts();
        setEmergencyContacts(contacts);

        // Get nearby services if location is available
        if (userLocation) {
          const [hospitals, ambulances, bloodBanks, pharmacies] = await Promise.all([
            emergencyService.getNearbyHospitals(userLocation, 15),
            emergencyService.getNearbyAmbulances(userLocation, 20),
            emergencyService.getNearbyBloodBanks(userLocation, 25),
            emergencyService.getNearbyPharmacies(userLocation, 5),
          ]);

          setNearbyServices({
            hospitals,
            ambulances,
            bloodBanks,
            pharmacies,
          });
        }
      } catch (error) {
        console.error('Error loading emergency data:', error);
        toast.error('Failed to load emergency services');
      } finally {
        setLoading(false);
      }
    };

    loadEmergencyData();
  }, [userLocation]);

  const handleEmergencyCall = (number: string, service: string) => {
    if (navigator.userAgent.includes('Mobile')) {
      window.location.href = `tel:${number}`;
    } else {
      toast.success(`Call ${service}: ${number}`);
    }
  };

  const handleServiceCall = (phone: string, serviceName: string) => {
    if (navigator.userAgent.includes('Mobile')) {
      window.location.href = `tel:${phone}`;
    } else {
      toast.success(`Call ${serviceName}: ${phone}`);
    }
  };

  const getDistance = (service: any) => {
    if (!userLocation) return 'Distance unknown';
    
    const distance = emergencyService['calculateDistance'](
      userLocation.latitude,
      userLocation.longitude,
      service.location.latitude,
      service.location.longitude
    );
    
    return `${distance.toFixed(1)} km away`;
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency Services</h1>
          <p className="text-gray-600">Quick access to emergency healthcare services</p>
        </div>

        {/* Emergency Contacts */}
        {emergencyContacts && (
          <div className="mb-8">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Emergency Contacts</span>
                </CardTitle>
                <CardDescription className="text-red-700">
                  Call these numbers immediately in case of emergency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Button
                    onClick={() => handleEmergencyCall(emergencyContacts.medical, 'Medical Emergency')}
                    className="bg-red-600 hover:bg-red-700 text-white h-16 flex flex-col items-center justify-center"
                  >
                    <Phone className="h-6 w-6 mb-1" />
                    <span className="text-sm font-medium">Medical</span>
                    <span className="text-xs">{emergencyContacts.medical}</span>
                  </Button>
                  
                  <Button
                    onClick={() => handleEmergencyCall(emergencyContacts.police, 'Police')}
                    className="bg-blue-600 hover:bg-blue-700 text-white h-16 flex flex-col items-center justify-center"
                  >
                    <Shield className="h-6 w-6 mb-1" />
                    <span className="text-sm font-medium">Police</span>
                    <span className="text-xs">{emergencyContacts.police}</span>
                  </Button>
                  
                  <Button
                    onClick={() => handleEmergencyCall(emergencyContacts.fire, 'Fire')}
                    className="bg-orange-600 hover:bg-orange-700 text-white h-16 flex flex-col items-center justify-center"
                  >
                    <AlertTriangle className="h-6 w-6 mb-1" />
                    <span className="text-sm font-medium">Fire</span>
                    <span className="text-xs">{emergencyContacts.fire}</span>
                  </Button>
                  
                  <Button
                    onClick={() => handleEmergencyCall(emergencyContacts.womenHelpline, 'Women Helpline')}
                    className="bg-pink-600 hover:bg-pink-700 text-white h-16 flex flex-col items-center justify-center"
                  >
                    <Heart className="h-6 w-6 mb-1" />
                    <span className="text-sm font-medium">Women</span>
                    <span className="text-xs">{emergencyContacts.womenHelpline}</span>
                  </Button>
                  
                  <Button
                    onClick={() => handleEmergencyCall(emergencyContacts.childHelpline, 'Child Helpline')}
                    className="bg-green-600 hover:bg-green-700 text-white h-16 flex flex-col items-center justify-center"
                  >
                    <Activity className="h-6 w-6 mb-1" />
                    <span className="text-sm font-medium">Child</span>
                    <span className="text-xs">{emergencyContacts.childHelpline}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Nearby Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ambulances */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-red-600" />
                <span>Ambulances</span>
              </CardTitle>
              <CardDescription>Emergency medical transport services</CardDescription>
            </CardHeader>
            <CardContent>
              {nearbyServices.ambulances && nearbyServices.ambulances.length > 0 ? (
                <div className="space-y-3">
                  {nearbyServices.ambulances.slice(0, 3).map((ambulance: any) => (
                    <div key={ambulance.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{ambulance.name}</h4>
                          <p className="text-sm text-gray-600">{ambulance.location.address}</p>
                          <p className="text-xs text-gray-500">{getDistance(ambulance)}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleServiceCall(ambulance.contact.phone, ambulance.name)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Call
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No ambulances found nearby</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hospitals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>Hospitals</span>
              </CardTitle>
              <CardDescription>Nearest medical facilities</CardDescription>
            </CardHeader>
            <CardContent>
              {nearbyServices.hospitals && nearbyServices.hospitals.length > 0 ? (
                <div className="space-y-3">
                  {nearbyServices.hospitals.slice(0, 3).map((hospital: any) => (
                    <div key={hospital.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{hospital.name}</h4>
                          <p className="text-sm text-gray-600">{hospital.location.address}</p>
                          <p className="text-xs text-gray-500">{getDistance(hospital)}</p>
                          {hospital.emergencyWard && (
                            <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full mt-1">
                              Emergency Ward
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleServiceCall(hospital.contact.phone, hospital.name)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Call
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No hospitals found nearby</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Blood Banks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-600" />
                <span>Blood Banks</span>
              </CardTitle>
              <CardDescription>Blood availability and testing</CardDescription>
            </CardHeader>
            <CardContent>
              {nearbyServices.bloodBanks && nearbyServices.bloodBanks.length > 0 ? (
                <div className="space-y-3">
                  {nearbyServices.bloodBanks.slice(0, 3).map((bloodBank: any) => (
                    <div key={bloodBank.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{bloodBank.name}</h4>
                          <p className="text-sm text-gray-600">{bloodBank.location.address}</p>
                          <p className="text-xs text-gray-500">{getDistance(bloodBank)}</p>
                          {bloodBank.testingFacilities && (
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mt-1">
                              Testing Available
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleServiceCall(bloodBank.contact.phone, bloodBank.name)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Call
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No blood banks found nearby</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pharmacies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-600" />
                <span>Pharmacies</span>
              </CardTitle>
              <CardDescription>24/7 medicine delivery</CardDescription>
            </CardHeader>
            <CardContent>
              {nearbyServices.pharmacies && nearbyServices.pharmacies.length > 0 ? (
                <div className="space-y-3">
                  {nearbyServices.pharmacies.slice(0, 3).map((pharmacy: any) => (
                    <div key={pharmacy.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{pharmacy.name}</h4>
                          <p className="text-sm text-gray-600">{pharmacy.location.address}</p>
                          <p className="text-xs text-gray-500">{getDistance(pharmacy)}</p>
                          {pharmacy.deliveryAvailable && (
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mt-1">
                              Delivery Available
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleServiceCall(pharmacy.contact.phone, pharmacy.name)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Call
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No pharmacies found nearby</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Location Notice */}
        {!userLocation && (
          <Card className="mt-8 border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 text-yellow-800">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold">Location Access Required</span>
              </div>
              <p className="text-yellow-700 mt-2">
                To show nearby emergency services, please enable location access in your browser settings.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
