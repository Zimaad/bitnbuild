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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('app.name')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Bridging the Rural Health Divide with AI-Powered Healthcare Solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/user/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Patient Portal
                </Button>
              </Link>
              <Link href="/asha/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  ASHA Portal
                </Button>
              </Link>
              <Link href="/doctor/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Doctor Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Healthcare Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect patients, ASHA workers, and doctors for seamless healthcare delivery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Patient Features */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Patient Portal</CardTitle>
                <CardDescription>
                  Manage your health with AI-powered insights, vitals tracking, and easy appointment booking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Record and track vital signs</li>
                  <li>• AI health assistant chatbot</li>
                  <li>• Book ASHA visits and doctor consultations</li>
                  <li>• Upload and manage medical reports</li>
                  <li>• Emergency services access</li>
                </ul>
              </CardContent>
            </Card>

            {/* ASHA Features */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>ASHA Worker Portal</CardTitle>
                <CardDescription>
                  Streamlined task management and patient care coordination for community health workers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Accept and manage patient visits</li>
                  <li>• Record patient vitals and symptoms</li>
                  <li>• Coordinate with doctors</li>
                  <li>• Track visit history and statistics</li>
                  <li>• Emergency response coordination</li>
                </ul>
              </CardContent>
            </Card>

            {/* Doctor Features */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Stethoscope className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Doctor Portal</CardTitle>
                <CardDescription>
                  Professional consultation platform with patient management and prescription tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Conduct video/audio consultations</li>
                  <li>• Access complete patient history</li>
                  <li>• Write and manage prescriptions</li>
                  <li>• Assign ASHA follow-up tasks</li>
                  <li>• Track consultation statistics</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Emergency Services */}
      <section className="py-20 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Emergency Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Quick access to emergency healthcare services when you need them most
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Phone className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Ambulance</h3>
                <p className="text-sm text-gray-600">Emergency medical transport</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Hospital</h3>
                <p className="text-sm text-gray-600">Find nearest hospitals</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Blood Bank</h3>
                <p className="text-sm text-gray-600">Blood availability check</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Stethoscope className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Pharmacy</h3>
                <p className="text-sm text-gray-600">24/7 medicine delivery</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-red-500" />
              <h3 className="text-xl font-bold">{t('app.name')}</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering rural healthcare through technology
            </p>
            <p className="text-sm text-gray-500">
              © 2024 Aarogya Sahayak. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
