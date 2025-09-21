# Deployment Guide - Aarogya Sahayak

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase Hosting**
   ```bash
   firebase init hosting
   ```

4. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

### Option 3: Netlify

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Connect your GitHub repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `out` (for static export) or `.next` (for serverless)

3. **Environment Variables**
   - Add all environment variables in Netlify dashboard

4. **Deploy**
   - Click "Deploy site"

## 🔧 Pre-deployment Checklist

### Firebase Setup
- [ ] Enable Authentication with Phone provider
- [ ] Create Firestore database
- [ ] Enable Storage
- [ ] Set up Firestore security rules
- [ ] Configure Firebase project settings

### Environment Variables
- [ ] Firebase configuration
- [ ] Gemini API key
- [ ] Google Maps API key (optional)
- [ ] App name and version

### Testing
- [ ] Test authentication flow
- [ ] Test AI chat functionality
- [ ] Test file uploads
- [ ] Test emergency services
- [ ] Test multilingual support

## 📱 Mobile App Deployment

### PWA Features
The app is built as a Progressive Web App (PWA) and can be installed on mobile devices:

1. **Add to Home Screen**
   - Open the web app in mobile browser
   - Tap "Add to Home Screen"
   - App will appear as native app

2. **Offline Support**
   - Service worker enables offline functionality
   - Cached data available without internet

## 🔒 Security Considerations

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // ASHA workers can access assigned patients
    match /asha/{ashaId} {
      allow read, write: if request.auth != null && request.auth.uid == ashaId;
    }
    
    // Doctors can access their patients
    match /doctors/{doctorId} {
      allow read, write: if request.auth != null && request.auth.uid == doctorId;
    }
  }
}
```

### Environment Security
- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- Enable Firebase App Check for additional security

## 📊 Monitoring & Analytics

### Firebase Analytics
- User engagement tracking
- Feature usage analytics
- Performance monitoring

### Error Tracking
- Firebase Crashlytics for error reporting
- Console logging for debugging

## 🚀 Performance Optimization

### Build Optimization
- Enable Next.js Image Optimization
- Use dynamic imports for code splitting
- Optimize bundle size

### Runtime Optimization
- Implement caching strategies
- Use React.memo for component optimization
- Lazy load heavy components

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test
```

## 📞 Post-deployment

### Domain Setup
- Configure custom domain in Vercel/Netlify
- Set up SSL certificates
- Configure DNS settings

### Monitoring
- Set up uptime monitoring
- Configure error alerts
- Monitor performance metrics

---

**Ready to deploy?** Follow the steps above and your Aarogya Sahayak app will be live! 🚀
