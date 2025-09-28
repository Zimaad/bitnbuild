import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AIProvider } from "@/contexts/AIContext";
import { Toaster } from "react-hot-toast";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Aarogya Sahayak - Bridging the Rural Health Divide",
  description: "A multilingual, AI-assisted digital health platform connecting patients, ASHA workers, and doctors for chronic disease management and emergency response.",
  keywords: "health, rural healthcare, ASHA, doctor consultation, emergency services, AI health assistant",
  authors: [{ name: "Aarogya Sahayak Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-gradient-to-br from-primary-50/30 via-background to-secondary-50/30 min-h-screen">
        <LanguageProvider>
          <AuthProvider>
            <AIProvider>
              {children}
              
              <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--card)',
                  color: 'var(--card-foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.75rem',
                  boxShadow: 'var(--shadow-medium)',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: 'var(--success)',
                    secondary: 'var(--success-foreground)',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: 'var(--destructive)',
                    secondary: 'var(--destructive-foreground)',
                  },
                },
              }}
              />
            </AIProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
