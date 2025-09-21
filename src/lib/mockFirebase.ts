// Mock Firebase for development when real Firebase is not available
export const mockAuth = {
  currentUser: null,
  signInWithPhoneNumber: async () => ({ verificationId: 'mock-verification-id' }),
  signInWithCredential: async () => ({ user: { uid: 'mock-user-id' } }),
  signOut: async () => {},
  onAuthStateChanged: (callback: (user: any) => void) => {
    // Mock user for development
    setTimeout(() => callback({ uid: 'mock-user-id', phoneNumber: '+1234567890' }), 1000);
    return () => {};
  },
};

export const mockDb = {
  collection: (name: string) => ({
    doc: (id: string) => ({
      get: async () => ({ exists: false, data: () => null }),
      set: async (data: any) => {},
      update: async (data: any) => {},
      delete: async () => {},
    }),
    add: async (data: any) => ({ id: 'mock-doc-id' }),
    where: (field: string, op: string, value: any) => ({
      get: async () => ({ docs: [] }),
    }),
  }),
};

export const mockStorage = {
  ref: (path: string) => ({
    put: async (file: File) => ({ ref: { getDownloadURL: async () => 'mock-url' } }),
    getDownloadURL: async () => 'mock-url',
  }),
};

export const mockAnalytics = {
  logEvent: (eventName: string, parameters?: any) => {},
};
