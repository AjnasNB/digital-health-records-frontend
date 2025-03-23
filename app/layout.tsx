'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>MediLab Records - Your Digital Health Records</title>
        <meta name="description" content="Digitalize and manage your health records with AI-powered insights" />
        <link rel="icon" href="/assets/logo-removebg-preview.png" />
      </head>
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen`}>
        <AuthProvider>
          <Navbar />
          <div className="pt-16">
            {children}
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                padding: '12px 20px',
              },
              success: {
                style: {
                  background: '#056f3b',
                },
                iconTheme: {
                  primary: 'white',
                  secondary: '#056f3b',
                },
              },
              error: {
                style: {
                  background: '#be123c',
                },
                iconTheme: {
                  primary: 'white',
                  secondary: '#be123c',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
