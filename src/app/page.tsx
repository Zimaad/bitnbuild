'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Stethoscope, Phone, Globe, Shield } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-soft border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-primary animate-heartbeat" />
              <h1 className="text-2xl font-bold text-gray-900">{t('app.name')}</h1>
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-gray-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="ta">தமிழ்</option>
                <option value="te">తెలుగు</option>
                <option value="bn">বাংলা</option>
                <option value="mr">मराठी</option>
                <option value="gu">ગુજરાતી</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="ml">മലയാളം</option>
                <option value="pa">ਪੰਜਾਬੀ</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-100/20 to-secondary-100/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {t('app.name')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Bridging the Rural Health Divide with AI-Powered Healthcare Solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/user/dashboard">
                <Button variant="gradient" size="xl" className="w-full sm:w-auto animate-slide-in-up">
                  Patient Portal
                </Button>
              </Link>
              <Link href="/asha/dashboard">
                <Button variant="gradient-success" size="xl" className="w-full sm:w-auto animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
                  ASHA Portal
                </Button>
              </Link>
              <Link href="/doctor/dashboard">
                <Button variant="gradient-accent" size="xl" className="w-full sm:w-auto animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                  Doctor Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted-50/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Healthcare Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect patients, ASHA workers, and doctors for seamless healthcare delivery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Patient Features */}
            <Card className="group hover:shadow-large transition-all duration-300 animate-slide-in-up">
              <CardHeader>
                <div className="p-3 rounded-xl bg-primary-100 w-fit mb-4 group-hover:bg-primary-200 transition-colors">
                  <Users className="h-12 w-12 text-primary-600" />
                </div>
                <CardTitle className="text-xl">Patient Portal</CardTitle>
                <CardDescription className="text-base">
                  Manage your health with AI-powered insights, vitals tracking, and easy appointment booking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span>Record and track vital signs</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span>AI health assistant chatbot</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span>Book ASHA visits and doctor consultations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span>Upload and manage medical reports</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span>Emergency services access</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* ASHA Features */}
            <Card className="group hover:shadow-large transition-all duration-300 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="p-3 rounded-xl bg-secondary-100 w-fit mb-4 group-hover:bg-secondary-200 transition-colors">
                  <Heart className="h-12 w-12 text-secondary-600" />
                </div>
                <CardTitle className="text-xl">ASHA Worker Portal</CardTitle>
                <CardDescription className="text-base">
                  Streamlined task management and patient care coordination for community health workers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                    <span>Accept and manage patient visits</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                    <span>Record patient vitals and symptoms</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                    <span>Coordinate with doctors</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                    <span>Track visit history and statistics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                    <span>Emergency response coordination</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Doctor Features */}
            <Card className="group hover:shadow-large transition-all duration-300 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="p-3 rounded-xl bg-accent-100 w-fit mb-4 group-hover:bg-accent-200 transition-colors">
                  <Stethoscope className="h-12 w-12 text-accent-600" />
                </div>
                <CardTitle className="text-xl">Doctor Portal</CardTitle>
                <CardDescription className="text-base">
                  Professional consultation platform with patient management and prescription tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                    <span>Conduct video/audio consultations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                    <span>Access complete patient history</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                    <span>Write and manage prescriptions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                    <span>Assign ASHA follow-up tasks</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                    <span>Track consultation statistics</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Emergency Services */}
      <section className="py-20 bg-gradient-to-br from-destructive-50 to-warning-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-destructive-100/20 to-warning-100/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Emergency Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Quick access to emergency healthcare services when you need them most
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center group hover:shadow-large transition-all duration-300 animate-slide-in-up">
              <CardContent className="pt-6">
                <div className="p-4 rounded-xl bg-destructive-100 w-fit mx-auto mb-4 group-hover:bg-destructive-200 transition-colors">
                  <Phone className="h-12 w-12 text-destructive-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Ambulance</h3>
                <p className="text-sm text-gray-600">Emergency medical transport</p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-large transition-all duration-300 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
              <CardContent className="pt-6">
                <div className="p-4 rounded-xl bg-primary-100 w-fit mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                  <Shield className="h-12 w-12 text-primary-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Hospital</h3>
                <p className="text-sm text-gray-600">Find nearest hospitals</p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-large transition-all duration-300 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="pt-6">
                <div className="p-4 rounded-xl bg-destructive-100 w-fit mx-auto mb-4 group-hover:bg-destructive-200 transition-colors">
                  <Heart className="h-12 w-12 text-destructive-600 animate-heartbeat" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Blood Bank</h3>
                <p className="text-sm text-gray-600">Blood availability check</p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-large transition-all duration-300 animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
              <CardContent className="pt-6">
                <div className="p-4 rounded-xl bg-secondary-100 w-fit mx-auto mb-4 group-hover:bg-secondary-200 transition-colors">
                  <Stethoscope className="h-12 w-12 text-secondary-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Pharmacy</h3>
                <p className="text-sm text-gray-600">24/7 medicine delivery</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/10 to-secondary-900/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center animate-fade-in">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Heart className="h-8 w-8 text-primary-400 animate-heartbeat" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                {t('app.name')}
              </h3>
            </div>
            <p className="text-gray-300 mb-6 text-lg max-w-2xl mx-auto">
              Empowering rural healthcare through technology and AI-driven solutions
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 mb-8">
              <span className="text-sm text-gray-400">© 2024 Aarogya Sahayak. All rights reserved.</span>
              <div className="flex space-x-4">
                <span className="text-sm text-gray-500">Privacy Policy</span>
                <span className="text-sm text-gray-500">Terms of Service</span>
                <span className="text-sm text-gray-500">Contact Us</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
