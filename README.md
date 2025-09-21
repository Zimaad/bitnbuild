# Aarogya Sahayak - Bridging the Rural Health Divide

A multilingual, AI-assisted digital health platform that connects patients, ASHA workers, and doctors for chronic disease management, consultations, and emergency response.

## 🏥 Overview

Aarogya Sahayak is a comprehensive healthcare platform designed to bridge the gap between rural healthcare needs and available services. The platform leverages AI technology to provide contextual health advice, streamlines communication between healthcare providers, and ensures timely access to emergency services.

## ✨ Key Features

### 👥 User Portal
- **Vitals Tracking**: Record and monitor blood pressure, blood sugar, weight, and other vital signs
- **AI Health Assistant**: Get personalized health advice using Gemini AI
- **Appointment Booking**: Book consultations with ASHA workers or doctors
- **Medical Reports**: Upload and manage medical documents with AI analysis
- **Emergency Services**: Quick access to ambulances, hospitals, blood banks, and pharmacies

### 🏥 ASHA Worker Portal
- **Task Management**: Accept and manage patient visits (Uber-style task pool)
- **Vitals Recording**: Record patient vitals during visits
- **Patient Coordination**: Coordinate with doctors and manage follow-ups
- **Statistics Dashboard**: Track performance and visit history

### 👨‍⚕️ Doctor Portal
- **Consultation Management**: Conduct video/audio consultations
- **Patient History**: Access complete patient medical records
- **Prescription Writing**: Create and manage digital prescriptions
- **ASHA Coordination**: Assign follow-up tasks to ASHA workers

### 🤖 AI Integration
- **Contextual Chatbot**: AI assistant with access to patient vitals and history
- **Health Insights**: AI-powered health recommendations
- **Document Parsing**: Extract data from medical reports using Gemini AI
- **Multilingual Support**: AI responses in regional languages

### 🚨 Emergency Services
- **Location-based Services**: Find nearby hospitals, ambulances, blood banks
- **Emergency Contacts**: Quick access to emergency helplines
- **Real-time Updates**: Live tracking of emergency services

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Lucide React** for icons

### Backend & Services
- **Firebase Authentication** (OTP-based)
- **Firestore** for database
- **Firebase Storage** for file uploads
- **Google Gemini AI** for health assistance
- **Google Maps API** for location services

### Key Libraries
- `@google/generative-ai` - Gemini AI integration
- `react-hook-form` - Form management
- `zod` - Schema validation
- `react-hot-toast` - Notifications
- `date-fns` - Date utilities

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project
- Google Gemini API key
- Google Maps API key (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aarogya-sahayak
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env.local` file with:
   ```env
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

4. **Firebase Setup**
   - Enable Authentication with Phone provider
   - Create Firestore database
   - Enable Storage
   - Set up Firestore security rules

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 User Roles & Authentication

### Authentication Flow
1. **Phone Number Entry**: User enters 10-digit mobile number
2. **OTP Verification**: Firebase sends OTP for verification
3. **Role Selection**: Choose between User, ASHA Worker, or Doctor
4. **Profile Creation**: Complete profile with role-specific information

### Role-based Access
- **Users**: Access patient portal, vitals tracking, AI chat, appointments
- **ASHA Workers**: Task management, patient visits, vitals recording
- **Doctors**: Consultations, prescriptions, patient management

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── user/              # User portal pages
│   ├── asha/              # ASHA worker portal
│   ├── doctor/            # Doctor portal
│   └── shared/            # Shared layouts
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   └── charts/           # Chart components
├── contexts/             # React contexts
│   ├── AuthContext.tsx   # Authentication state
│   ├── LanguageContext.tsx # Multilingual support
│   └── AIContext.tsx     # AI interactions
├── services/             # API services
│   ├── authService.ts    # Authentication logic
│   ├── userService.ts    # User data management
│   ├── ashaService.ts     # ASHA operations
│   ├── doctorService.ts   # Doctor operations
│   ├── aiService.ts       # AI integration
│   └── emergencyService.ts # Emergency services
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
│   ├── constants.ts      # App constants
│   ├── validators.ts     # Form validation schemas
│   └── formatters.ts     # Data formatting utilities
└── lib/                  # External library configurations
    └── firebase.ts       # Firebase setup
```

## 🌐 Multilingual Support

The platform supports 10+ Indian languages:
- English, Hindi, Tamil, Telugu, Bengali
- Marathi, Gujarati, Kannada, Malayalam, Punjabi

AI responses are automatically translated to the user's selected language.

## 🔒 Security & Privacy

- **Data Encryption**: All sensitive data encrypted in transit and at rest
- **Role-based Access**: Users can only access their own data
- **HIPAA Compliance**: Healthcare data handling follows privacy standards
- **Secure Authentication**: OTP-based phone authentication
- **File Security**: Medical reports stored securely with access controls

## 📊 Key Features Implementation

### AI Health Assistant
- Contextual responses based on patient vitals and history
- Health insights generation from vital signs
- Medication reminders and lifestyle advice
- Emergency situation guidance

### Task Management (ASHA)
- Uber-style task pool for patient visits
- Real-time task assignment and acceptance
- GPS-based location tracking
- Visit completion with vitals recording

### Consultation System (Doctor)
- Video/audio consultation capabilities
- Patient history access during consultations
- Digital prescription creation
- ASHA task assignment for follow-ups

### Emergency Services
- Location-based service discovery
- Real-time availability checking
- Direct calling integration
- Emergency contact management

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Firebase Hosting
1. Build the project: `npm run build`
2. Install Firebase CLI: `npm install -g firebase-tools`
3. Deploy: `firebase deploy`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini AI for health assistance capabilities
- Firebase for backend infrastructure
- Radix UI for accessible components
- The healthcare community for insights and feedback

## 📞 Support

For support and questions:
- Email: support@aarogyasahayak.com
- Documentation: [docs.aarogyasahayak.com](https://docs.aarogyasahayak.com)
- Issues: [GitHub Issues](https://github.com/your-repo/issues)

---

**Aarogya Sahayak** - Empowering rural healthcare through technology 🤖🏥