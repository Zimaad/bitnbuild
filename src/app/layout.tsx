import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AIProvider } from "@/contexts/AIContext";
import { Toaster } from "react-hot-toast";
import RoleSwitcher from "@/components/RoleSwitcher";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Aarogya Sahayak - Bridging the Rural Health Divide",
  description: "A multilingual, AI-assisted digital health platform connecting patients, ASHA workers, and doctors for chronic disease management and emergency response.",
  keywords: "health, rural healthcare, ASHA, doctor consultation, emergency services, AI health assistant",
  authors: [{ name: "Aarogya Sahayak Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-gray-50 min-h-screen">
        <LanguageProvider>
          <AuthProvider>
            <AIProvider>
              {children}
              <RoleSwitcher />
              <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
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
