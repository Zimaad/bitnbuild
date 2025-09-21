import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { EMERGENCY_SERVICES } from '@/utils/constants';

export interface EmergencyRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  type: 'ambulance' | 'hospital' | 'blood_bank' | 'pharmacy';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  description?: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo?: string; // service provider ID
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  notes?: string;
}

export interface EmergencyService {
  id: string;
  name: string;
  type: 'ambulance' | 'hospital' | 'blood_bank' | 'pharmacy';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  contact: {
    phone: string;
    email?: string;
  };
  availability: {
    is24Hours: boolean;
    startTime?: string;
    endTime?: string;
    days?: string[];
  };
  services: string[];
  rating?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Hospital extends EmergencyService {
  type: 'hospital';
  specialties: string[];
  bedCapacity: number;
  availableBeds: number;
  emergencyWard: boolean;
  icuAvailable: boolean;
}

export interface AmbulanceService extends EmergencyService {
  type: 'ambulance';
  vehicleCount: number;
  availableVehicles: number;
  vehicleTypes: string[];
  responseTime: number; // in minutes
}

export interface BloodBank extends EmergencyService {
  type: 'blood_bank';
  bloodGroups: string[];
  availableUnits: Record<string, number>;
  testingFacilities: boolean;
}

export interface Pharmacy extends EmergencyService {
  type: 'pharmacy';
  medicines: string[];
  deliveryAvailable: boolean;
  deliveryRadius: number; // in km
}

class EmergencyService {
  // Create emergency request
  async createEmergencyRequest(requestData: Omit<EmergencyRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const requestsRef = collection(db, 'emergencyRequests');
    const docRef = await addDoc(requestsRef, {
      ...requestData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  // Get nearby emergency services
  async getNearbyServices(
    userLocation: { latitude: number; longitude: number },
    serviceType: EmergencyService['type'],
    radiusKm: number = 10
  ): Promise<EmergencyService[]> {
    try {
      const servicesRef = collection(db, 'emergencyServices');
      const q = query(
        servicesRef,
        where('type', '==', serviceType),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      const services = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as EmergencyService[];

      // Filter by distance
      const nearbyServices = services.filter(service => {
        const distance = this.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          service.location.latitude,
          service.location.longitude
        );
        return distance <= radiusKm;
      });

      // Sort by distance
      return nearbyServices.sort((a, b) => {
        const distanceA = this.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          a.location.latitude,
          a.location.longitude
        );
        const distanceB = this.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          b.location.latitude,
          b.location.longitude
        );
        return distanceA - distanceB;
      });
    } catch (error) {
      console.error('Error getting nearby services:', error);
      throw error;
    }
  }

  // Get nearby hospitals
  async getNearbyHospitals(
    userLocation: { latitude: number; longitude: number },
    radiusKm: number = 15
  ): Promise<Hospital[]> {
    const services = await this.getNearbyServices(userLocation, 'hospital', radiusKm);
    return services as Hospital[];
  }

  // Get nearby ambulances
  async getNearbyAmbulances(
    userLocation: { latitude: number; longitude: number },
    radiusKm: number = 20
  ): Promise<AmbulanceService[]> {
    const services = await this.getNearbyServices(userLocation, 'ambulance', radiusKm);
    return services as AmbulanceService[];
  }

  // Get nearby blood banks
  async getNearbyBloodBanks(
    userLocation: { latitude: number; longitude: number },
    radiusKm: number = 25
  ): Promise<BloodBank[]> {
    const services = await this.getNearbyServices(userLocation, 'blood_bank', radiusKm);
    return services as BloodBank[];
  }

  // Get nearby pharmacies
  async getNearbyPharmacies(
    userLocation: { latitude: number; longitude: number },
    radiusKm: number = 5
  ): Promise<Pharmacy[]> {
    const services = await this.getNearbyServices(userLocation, 'pharmacy', radiusKm);
    return services as Pharmacy[];
  }

  // Get emergency contacts
  async getEmergencyContacts(): Promise<{
    police: string;
    fire: string;
    medical: string;
    womenHelpline: string;
    childHelpline: string;
  }> {
    // These are standard Indian emergency numbers
    return {
      police: '100',
      fire: '101',
      medical: '108',
      womenHelpline: '181',
      childHelpline: '1098',
    };
  }

  // Calculate distance between two points (Haversine formula)
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Get user's emergency requests
  async getUserEmergencyRequests(userId: string): Promise<EmergencyRequest[]> {
    try {
      const requestsRef = collection(db, 'emergencyRequests');
      const q = query(
        requestsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        completedAt: doc.data().completedAt?.toDate(),
      })) as EmergencyRequest[];
    } catch (error) {
      console.error('Error getting user emergency requests:', error);
      throw error;
    }
  }

  // Update emergency request status
  async updateEmergencyRequestStatus(
    requestId: string,
    status: EmergencyRequest['status'],
    assignedTo?: string,
    notes?: string
  ): Promise<void> {
    const requestRef = doc(db, 'emergencyRequests', requestId);
    const updateData: any = {
      status,
      updatedAt: serverTimestamp(),
    };

    if (assignedTo) {
      updateData.assignedTo = assignedTo;
    }

    if (notes) {
      updateData.notes = notes;
    }

    if (status === 'completed') {
      updateData.completedAt = serverTimestamp();
    }

    await updateDoc(requestRef, updateData);
  }

  // Get emergency statistics
  async getEmergencyStatistics(): Promise<{
    totalRequests: number;
    pendingRequests: number;
    completedRequests: number;
    averageResponseTime: number;
    criticalRequests: number;
  }> {
    try {
      const requestsRef = collection(db, 'emergencyRequests');
      const querySnapshot = await getDocs(requestsRef);
      
      const requests = querySnapshot.docs.map(doc => doc.data() as EmergencyRequest);
      
      const totalRequests = requests.length;
      const pendingRequests = requests.filter(r => r.status === 'pending').length;
      const completedRequests = requests.filter(r => r.status === 'completed').length;
      const criticalRequests = requests.filter(r => r.urgency === 'critical').length;

      // Calculate average response time for completed requests
      const completedWithTime = requests.filter(r => 
        r.status === 'completed' && r.completedAt && r.createdAt
      );
      
      let averageResponseTime = 0;
      if (completedWithTime.length > 0) {
        const totalTime = completedWithTime.reduce((sum, request) => {
          const responseTime = request.completedAt!.getTime() - request.createdAt.getTime();
          return sum + responseTime;
        }, 0);
        averageResponseTime = totalTime / completedWithTime.length / (1000 * 60); // in minutes
      }

      return {
        totalRequests,
        pendingRequests,
        completedRequests,
        averageResponseTime,
        criticalRequests,
      };
    } catch (error) {
      console.error('Error getting emergency statistics:', error);
      throw error;
    }
  }

  // Add emergency service provider
  async addEmergencyService(serviceData: Omit<EmergencyService, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const servicesRef = collection(db, 'emergencyServices');
    const docRef = await addDoc(servicesRef, {
      ...serviceData,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  // Update emergency service
  async updateEmergencyService(serviceId: string, updates: Partial<EmergencyService>): Promise<void> {
    const serviceRef = doc(db, 'emergencyServices', serviceId);
    await updateDoc(serviceRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  // Get all emergency services
  async getAllEmergencyServices(): Promise<EmergencyService[]> {
    try {
      const servicesRef = collection(db, 'emergencyServices');
      const q = query(servicesRef, where('isActive', '==', true));
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as EmergencyService[];
    } catch (error) {
      console.error('Error getting all emergency services:', error);
      throw error;
    }
  }

  // Search emergency services by name
  async searchEmergencyServices(searchTerm: string): Promise<EmergencyService[]> {
    try {
      const servicesRef = collection(db, 'emergencyServices');
      const q = query(
        servicesRef,
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      const allServices = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as EmergencyService[];

      // Filter by search term
      return allServices.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching emergency services:', error);
      throw error;
    }
  }
}

export const emergencyService = new EmergencyService();
