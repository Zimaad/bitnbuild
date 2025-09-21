'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LANGUAGES, type Language } from '@/utils/constants';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// Translation keys
const translations: Record<Language, Record<string, string>> = {
  [LANGUAGES.ENGLISH]: {
    // Common
    'app.name': 'Aarogya Sahayak',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.submit': 'Submit',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.refresh': 'Refresh',
    
    // Authentication
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.register': 'Register',
    'auth.phone': 'Phone Number',
    'auth.otp': 'OTP',
    'auth.verify': 'Verify',
    'auth.resend': 'Resend OTP',
    'auth.enter_phone': 'Enter your phone number',
    'auth.enter_otp': 'Enter OTP sent to your phone',
    'auth.invalid_phone': 'Invalid phone number',
    'auth.invalid_otp': 'Invalid OTP',
    'auth.otp_sent': 'OTP sent successfully',
    'auth.login_success': 'Login successful',
    'auth.login_failed': 'Login failed',
    
    // User Portal
    'user.dashboard': 'Dashboard',
    'user.vitals': 'Vitals',
    'user.appointments': 'Appointments',
    'user.reports': 'Reports',
    'user.emergency': 'Emergency',
    'user.profile': 'Profile',
    'user.settings': 'Settings',
    'user.ai_chat': 'AI Health Assistant',
    'user.book_asha': 'Book ASHA Visit',
    'user.book_doctor': 'Book Doctor Consultation',
    
    // Vitals
    'vitals.blood_pressure': 'Blood Pressure',
    'vitals.blood_sugar': 'Blood Sugar',
    'vitals.weight': 'Weight',
    'vitals.height': 'Height',
    'vitals.heart_rate': 'Heart Rate',
    'vitals.temperature': 'Temperature',
    'vitals.systolic': 'Systolic',
    'vitals.diastolic': 'Diastolic',
    'vitals.fasting': 'Fasting',
    'vitals.non_fasting': 'Non-fasting',
    'vitals.record_vitals': 'Record Vitals',
    'vitals.latest_vitals': 'Latest Vitals',
    'vitals.vitals_history': 'Vitals History',
    
    // Appointments
    'appointment.book': 'Book Appointment',
    'appointment.upcoming': 'Upcoming Appointments',
    'appointment.history': 'Appointment History',
    'appointment.type': 'Appointment Type',
    'appointment.date': 'Date',
    'appointment.time': 'Time',
    'appointment.reason': 'Reason',
    'appointment.urgency': 'Urgency',
    'appointment.status': 'Status',
    'appointment.pending': 'Pending',
    'appointment.accepted': 'Accepted',
    'appointment.completed': 'Completed',
    'appointment.cancelled': 'Cancelled',
    
    // ASHA Portal
    'asha.dashboard': 'ASHA Dashboard',
    'asha.tasks': 'Tasks',
    'asha.patients': 'Patients',
    'asha.availability': 'Availability',
    'asha.statistics': 'Statistics',
    'asha.accept_task': 'Accept Task',
    'asha.complete_task': 'Complete Task',
    'asha.task_details': 'Task Details',
    'asha.patient_details': 'Patient Details',
    'asha.record_vitals': 'Record Patient Vitals',
    
    // Doctor Portal
    'doctor.dashboard': 'Doctor Dashboard',
    'doctor.consultations': 'Consultations',
    'doctor.patients': 'Patients',
    'doctor.prescriptions': 'Prescriptions',
    'doctor.schedule': 'Schedule',
    'doctor.statistics': 'Statistics',
    'doctor.accept_appointment': 'Accept Appointment',
    'doctor.start_consultation': 'Start Consultation',
    'doctor.end_consultation': 'End Consultation',
    'doctor.write_prescription': 'Write Prescription',
    'doctor.assign_asha': 'Assign ASHA Task',
    
    // Emergency
    'emergency.title': 'Emergency Services',
    'emergency.ambulance': 'Ambulance',
    'emergency.hospital': 'Hospital',
    'emergency.blood_bank': 'Blood Bank',
    'emergency.pharmacy': 'Pharmacy',
    'emergency.contacts': 'Emergency Contacts',
    'emergency.police': 'Police',
    'emergency.fire': 'Fire',
    'emergency.medical': 'Medical',
    'emergency.women_helpline': 'Women Helpline',
    'emergency.child_helpline': 'Child Helpline',
    
    // AI Chat
    'ai.chat': 'AI Health Assistant',
    'ai.ask_question': 'Ask a health question',
    'ai.health_insights': 'Health Insights',
    'ai.lifestyle_tips': 'Lifestyle Tips',
    'ai.medication_reminders': 'Medication Reminders',
    'ai.emergency_advice': 'Emergency Advice',
    
    // Forms
    'form.name': 'Name',
    'form.email': 'Email',
    'form.age': 'Age',
    'form.gender': 'Gender',
    'form.address': 'Address',
    'form.phone': 'Phone',
    'form.aadhaar': 'Aadhaar Number',
    'form.required': 'This field is required',
    'form.invalid_email': 'Invalid email address',
    'form.invalid_phone': 'Invalid phone number',
    'form.invalid_aadhaar': 'Invalid Aadhaar number',
    
    // Messages
    'message.success': 'Operation completed successfully',
    'message.error': 'An error occurred',
    'message.network_error': 'Network error. Please check your connection',
    'message.unauthorized': 'You are not authorized to perform this action',
    'message.not_found': 'Resource not found',
    'message.validation_error': 'Please check your input',
  },
  
  [LANGUAGES.HINDI]: {
    // Common
    'app.name': 'आरोग्य सहायक',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.cancel': 'रद्द करें',
    'common.save': 'सहेजें',
    'common.edit': 'संपादित करें',
    'common.delete': 'हटाएं',
    'common.yes': 'हाँ',
    'common.no': 'नहीं',
    'common.ok': 'ठीक है',
    'common.back': 'वापस',
    'common.next': 'अगला',
    'common.previous': 'पिछला',
    'common.submit': 'जमा करें',
    'common.search': 'खोजें',
    'common.filter': 'फिल्टर',
    'common.sort': 'क्रमबद्ध करें',
    'common.refresh': 'रिफ्रेश करें',
    
    // Authentication
    'auth.login': 'लॉगिन',
    'auth.logout': 'लॉगआउट',
    'auth.register': 'रजिस्टर',
    'auth.phone': 'फोन नंबर',
    'auth.otp': 'OTP',
    'auth.verify': 'सत्यापित करें',
    'auth.resend': 'OTP पुनः भेजें',
    'auth.enter_phone': 'अपना फोन नंबर दर्ज करें',
    'auth.enter_otp': 'आपके फोन पर भेजा गया OTP दर्ज करें',
    'auth.invalid_phone': 'अमान्य फोन नंबर',
    'auth.invalid_otp': 'अमान्य OTP',
    'auth.otp_sent': 'OTP सफलतापूर्वक भेजा गया',
    'auth.login_success': 'लॉगिन सफल',
    'auth.login_failed': 'लॉगिन असफल',
    
    // User Portal
    'user.dashboard': 'डैशबोर्ड',
    'user.vitals': 'वाइटल्स',
    'user.appointments': 'अपॉइंटमेंट',
    'user.reports': 'रिपोर्ट्स',
    'user.emergency': 'आपातकाल',
    'user.profile': 'प्रोफाइल',
    'user.settings': 'सेटिंग्स',
    'user.ai_chat': 'AI स्वास्थ्य सहायक',
    'user.book_asha': 'ASHA विजिट बुक करें',
    'user.book_doctor': 'डॉक्टर कंसल्टेशन बुक करें',
    
    // Vitals
    'vitals.blood_pressure': 'रक्तचाप',
    'vitals.blood_sugar': 'रक्त शर्करा',
    'vitals.weight': 'वजन',
    'vitals.height': 'ऊंचाई',
    'vitals.heart_rate': 'हृदय गति',
    'vitals.temperature': 'तापमान',
    'vitals.systolic': 'सिस्टोलिक',
    'vitals.diastolic': 'डायस्टोलिक',
    'vitals.fasting': 'उपवास',
    'vitals.non_fasting': 'गैर-उपवास',
    'vitals.record_vitals': 'वाइटल्स रिकॉर्ड करें',
    'vitals.latest_vitals': 'नवीनतम वाइटल्स',
    'vitals.vitals_history': 'वाइटल्स इतिहास',
    
    // Appointments
    'appointment.book': 'अपॉइंटमेंट बुक करें',
    'appointment.upcoming': 'आगामी अपॉइंटमेंट',
    'appointment.history': 'अपॉइंटमेंट इतिहास',
    'appointment.type': 'अपॉइंटमेंट प्रकार',
    'appointment.date': 'तारीख',
    'appointment.time': 'समय',
    'appointment.reason': 'कारण',
    'appointment.urgency': 'तात्कालिकता',
    'appointment.status': 'स्थिति',
    'appointment.pending': 'लंबित',
    'appointment.accepted': 'स्वीकृत',
    'appointment.completed': 'पूर्ण',
    'appointment.cancelled': 'रद्द',
    
    // ASHA Portal
    'asha.dashboard': 'ASHA डैशबोर्ड',
    'asha.tasks': 'कार्य',
    'asha.patients': 'रोगी',
    'asha.availability': 'उपलब्धता',
    'asha.statistics': 'आंकड़े',
    'asha.accept_task': 'कार्य स्वीकार करें',
    'asha.complete_task': 'कार्य पूर्ण करें',
    'asha.task_details': 'कार्य विवरण',
    'asha.patient_details': 'रोगी विवरण',
    'asha.record_vitals': 'रोगी वाइटल्स रिकॉर्ड करें',
    
    // Doctor Portal
    'doctor.dashboard': 'डॉक्टर डैशबोर्ड',
    'doctor.consultations': 'परामर्श',
    'doctor.patients': 'रोगी',
    'doctor.prescriptions': 'प्रिस्क्रिप्शन',
    'doctor.schedule': 'समय सारिणी',
    'doctor.statistics': 'आंकड़े',
    'doctor.accept_appointment': 'अपॉइंटमेंट स्वीकार करें',
    'doctor.start_consultation': 'परामर्श शुरू करें',
    'doctor.end_consultation': 'परामर्श समाप्त करें',
    'doctor.write_prescription': 'प्रिस्क्रिप्शन लिखें',
    'doctor.assign_asha': 'ASHA कार्य असाइन करें',
    
    // Emergency
    'emergency.title': 'आपातकालीन सेवाएं',
    'emergency.ambulance': 'एम्बुलेंस',
    'emergency.hospital': 'अस्पताल',
    'emergency.blood_bank': 'रक्त बैंक',
    'emergency.pharmacy': 'फार्मेसी',
    'emergency.contacts': 'आपातकालीन संपर्क',
    'emergency.police': 'पुलिस',
    'emergency.fire': 'अग्निशामक',
    'emergency.medical': 'चिकित्सा',
    'emergency.women_helpline': 'महिला हेल्पलाइन',
    'emergency.child_helpline': 'बाल हेल्पलाइन',
    
    // AI Chat
    'ai.chat': 'AI स्वास्थ्य सहायक',
    'ai.ask_question': 'स्वास्थ्य प्रश्न पूछें',
    'ai.health_insights': 'स्वास्थ्य अंतर्दृष्टि',
    'ai.lifestyle_tips': 'जीवनशैली सुझाव',
    'ai.medication_reminders': 'दवा अनुस्मारक',
    'ai.emergency_advice': 'आपातकालीन सलाह',
    
    // Forms
    'form.name': 'नाम',
    'form.email': 'ईमेल',
    'form.age': 'आयु',
    'form.gender': 'लिंग',
    'form.address': 'पता',
    'form.phone': 'फोन',
    'form.aadhaar': 'आधार नंबर',
    'form.required': 'यह फील्ड आवश्यक है',
    'form.invalid_email': 'अमान्य ईमेल पता',
    'form.invalid_phone': 'अमान्य फोन नंबर',
    'form.invalid_aadhaar': 'अमान्य आधार नंबर',
    
    // Messages
    'message.success': 'ऑपरेशन सफलतापूर्वक पूर्ण',
    'message.error': 'एक त्रुटि हुई',
    'message.network_error': 'नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें',
    'message.unauthorized': 'आपको इस क्रिया को करने की अनुमति नहीं है',
    'message.not_found': 'संसाधन नहीं मिला',
    'message.validation_error': 'कृपया अपना इनपुट जांचें',
  },
  
  // Add other languages with similar structure
  [LANGUAGES.TAMIL]: {
    'app.name': 'ஆரோக்கிய சகாயர்',
    'common.loading': 'ஏற்றுகிறது...',
    'common.error': 'பிழை',
    'common.success': 'வெற்றி',
    'common.cancel': 'ரத்து செய்',
    'common.save': 'சேமி',
    'common.edit': 'திருத்து',
    'common.delete': 'நீக்கு',
    'common.yes': 'ஆம்',
    'common.no': 'இல்லை',
    'common.ok': 'சரி',
    'common.back': 'பின்',
    'common.next': 'அடுத்து',
    'common.previous': 'முந்தைய',
    'common.submit': 'சமர்ப்பி',
    'common.search': 'தேடு',
    'common.filter': 'வடிகட்டு',
    'common.sort': 'வரிசைப்படுத்து',
    'common.refresh': 'புதுப்பி',
  },
  
  [LANGUAGES.TELUGU]: {
    'app.name': 'ఆరోగ్య సహాయకుడు',
    'common.loading': 'లోడ్ అవుతోంది...',
    'common.error': 'లోపం',
    'common.success': 'విజయం',
    'common.cancel': 'రద్దు చేయి',
    'common.save': 'సేవ్ చేయి',
    'common.edit': 'సవరించు',
    'common.delete': 'తొలగించు',
    'common.yes': 'అవును',
    'common.no': 'కాదు',
    'common.ok': 'సరే',
    'common.back': 'వెనుక',
    'common.next': 'తదుపరి',
    'common.previous': 'మునుపటి',
    'common.submit': 'సమర్పించు',
    'common.search': 'వెతుకు',
    'common.filter': 'వడపోత',
    'common.sort': 'క్రమబద్ధీకరించు',
    'common.refresh': 'రిఫ్రెష్ చేయి',
  },
  
  [LANGUAGES.BENGALI]: {
    'app.name': 'আরোগ্য সহায়ক',
    'common.loading': 'লোড হচ্ছে...',
    'common.error': 'ত্রুটি',
    'common.success': 'সফলতা',
    'common.cancel': 'বাতিল',
    'common.save': 'সংরক্ষণ',
    'common.edit': 'সম্পাদনা',
    'common.delete': 'মুছে ফেলুন',
    'common.yes': 'হ্যাঁ',
    'common.no': 'না',
    'common.ok': 'ঠিক আছে',
    'common.back': 'পিছনে',
    'common.next': 'পরবর্তী',
    'common.previous': 'পূর্ববর্তী',
    'common.submit': 'জমা দিন',
    'common.search': 'অনুসন্ধান',
    'common.filter': 'ফিল্টার',
    'common.sort': 'সাজান',
    'common.refresh': 'রিফ্রেশ',
  },
  
  [LANGUAGES.MARATHI]: {
    'app.name': 'आरोग्य सहायक',
    'common.loading': 'लोड होत आहे...',
    'common.error': 'त्रुटी',
    'common.success': 'यश',
    'common.cancel': 'रद्द करा',
    'common.save': 'जतन करा',
    'common.edit': 'संपादित करा',
    'common.delete': 'हटवा',
    'common.yes': 'होय',
    'common.no': 'नाही',
    'common.ok': 'ठीक आहे',
    'common.back': 'मागे',
    'common.next': 'पुढे',
    'common.previous': 'मागील',
    'common.submit': 'सबमिट करा',
    'common.search': 'शोधा',
    'common.filter': 'फिल्टर',
    'common.sort': 'क्रमवारी',
    'common.refresh': 'रिफ्रेश करा',
  },
  
  [LANGUAGES.GUJARATI]: {
    'app.name': 'આરોગ્ય સહાયક',
    'common.loading': 'લોડ થઈ રહ્યું છે...',
    'common.error': 'ભૂલ',
    'common.success': 'સફળતા',
    'common.cancel': 'રદ કરો',
    'common.save': 'સેવ કરો',
    'common.edit': 'સંપાદન કરો',
    'common.delete': 'ડિલીટ કરો',
    'common.yes': 'હા',
    'common.no': 'ના',
    'common.ok': 'ઠીક છે',
    'common.back': 'પાછળ',
    'common.next': 'આગળ',
    'common.previous': 'પાછલું',
    'common.submit': 'સબમિટ કરો',
    'common.search': 'શોધો',
    'common.filter': 'ફિલ્ટર',
    'common.sort': 'ક્રમ',
    'common.refresh': 'રિફ્રેશ કરો',
  },
  
  [LANGUAGES.KANNADA]: {
    'app.name': 'ಆರೋಗ್ಯ ಸಹಾಯಕ',
    'common.loading': 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    'common.error': 'ದೋಷ',
    'common.success': 'ಯಶಸ್ಸು',
    'common.cancel': 'ರದ್ದುಗೊಳಿಸಿ',
    'common.save': 'ಉಳಿಸಿ',
    'common.edit': 'ಸಂಪಾದಿಸಿ',
    'common.delete': 'ಅಳಿಸಿ',
    'common.yes': 'ಹೌದು',
    'common.no': 'ಇಲ್ಲ',
    'common.ok': 'ಸರಿ',
    'common.back': 'ಹಿಂದೆ',
    'common.next': 'ಮುಂದೆ',
    'common.previous': 'ಹಿಂದಿನ',
    'common.submit': 'ಸಲ್ಲಿಸಿ',
    'common.search': 'ಹುಡುಕಿ',
    'common.filter': 'ಫಿಲ್ಟರ್',
    'common.sort': 'ವಿಂಗಡಿಸಿ',
    'common.refresh': 'ರಿಫ್ರೆಶ್ ಮಾಡಿ',
  },
  
  [LANGUAGES.MALAYALAM]: {
    'app.name': 'ആരോഗ്യ സഹായകൻ',
    'common.loading': 'ലോഡ് ചെയ്യുന്നു...',
    'common.error': 'പിശക്',
    'common.success': 'വിജയം',
    'common.cancel': 'റദ്ദാക്കുക',
    'common.save': 'സേവ് ചെയ്യുക',
    'common.edit': 'എഡിറ്റ് ചെയ്യുക',
    'common.delete': 'ഡിലീറ്റ് ചെയ്യുക',
    'common.yes': 'അതെ',
    'common.no': 'അല്ല',
    'common.ok': 'ശരി',
    'common.back': 'പിന്നോട്ട്',
    'common.next': 'അടുത്തത്',
    'common.previous': 'മുമ്പത്തെ',
    'common.submit': 'സബ്മിറ്റ് ചെയ്യുക',
    'common.search': 'തിരയുക',
    'common.filter': 'ഫിൽട്ടർ',
    'common.sort': 'വർഗ്ഗീകരിക്കുക',
    'common.refresh': 'റിഫ്രഷ് ചെയ്യുക',
  },
  
  [LANGUAGES.PUNJABI]: {
    'app.name': 'ਆਰੋਗਿਆ ਸਹਾਇਕ',
    'common.loading': 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    'common.error': 'ਗਲਤੀ',
    'common.success': 'ਸਫਲਤਾ',
    'common.cancel': 'ਰੱਦ ਕਰੋ',
    'common.save': 'ਸੇਵ ਕਰੋ',
    'common.edit': 'ਸੰਪਾਦਨ ਕਰੋ',
    'common.delete': 'ਮਿਟਾਓ',
    'common.yes': 'ਹਾਂ',
    'common.no': 'ਨਹੀਂ',
    'common.ok': 'ਠੀਕ ਹੈ',
    'common.back': 'ਪਿੱਛੇ',
    'common.next': 'ਅਗਲਾ',
    'common.previous': 'ਪਿਛਲਾ',
    'common.submit': 'ਜਮ੍ਹਾ ਕਰੋ',
    'common.search': 'ਖੋਜੋ',
    'common.filter': 'ਫਿਲਟਰ',
    'common.sort': 'ਕ੍ਰਮ',
    'common.refresh': 'ਰਿਫਰੈਸ਼ ਕਰੋ',
  },
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(LANGUAGES.ENGLISH);

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && Object.values(LANGUAGES).includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Save language to localStorage
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = translations[language][key] || translations[LANGUAGES.ENGLISH][key] || key;
    
    // Replace parameters in translation
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{{${paramKey}}}`, String(value));
      });
    }
    
    return translation;
  };

  const isRTL = language === LANGUAGES.HINDI || language === LANGUAGES.URDU; // Add RTL languages as needed

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
