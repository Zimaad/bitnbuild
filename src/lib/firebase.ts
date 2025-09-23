// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:demo",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-DEMO123",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services with fallback to mock services
let auth, db, storage, analytics;

try {
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
} catch (error) {
  console.warn('Firebase initialization failed, using mock services for development:', error);
  // Import mock services synchronously
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { mockAuth, mockDb, mockStorage, mockAnalytics } = require('./mockFirebase');
  auth = mockAuth;
  db = mockDb;
  storage = mockStorage;
  analytics = mockAnalytics;
}

export { auth, db, storage, analytics };
export default app;
