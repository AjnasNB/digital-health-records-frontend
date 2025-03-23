'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (isAuthenticated) {
      router.push('/dashboard');
    }
    
    // Animation trigger
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main>
        <div className="relative min-h-screen">
          {/* Hero background with overlay */}
          <div className="absolute inset-0 z-0">
        <Image
              src="/assets/banner.webp" 
              alt="Medical Banner"
              fill
          priority
              style={{ 
                objectFit: 'cover', 
                objectPosition: 'center',
                filter: 'brightness(0.4) saturate(1.2)', 
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/60 to-gray-900/95"></div>
          </div>
          
          {/* Hero content */}
          <div className="container mx-auto px-4 py-32 md:py-40 relative z-10">
            <div className={`max-w-3xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 mb-6">
                Your Health Records,<br />Digitized & Intelligent
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Docufy transforms your paper health documents into smart digital records. 
                Upload any medical document and our AI instantly extracts, organizes, and 
                provides insights on your health data.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/register" 
                  className="group relative inline-flex items-center justify-center px-8 py-3 rounded-lg overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-300"
                >
                  <span className="relative">
                    Get Started
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
                <Link 
                  href="/login" 
                  className="inline-flex items-center justify-center px-8 py-3 rounded-lg text-white font-medium border border-gray-600 hover:bg-gray-800 transition-all duration-300"
                >
                  Login
                </Link>
                <Link 
                  href="/presentation" 
                  className="inline-flex items-center justify-center px-8 py-3 rounded-lg text-white font-medium border border-purple-700 bg-purple-900/30 hover:bg-purple-800/50 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
                  </svg>
                  Presentation
                </Link>
              </div>
              
              {/* Stats */}
              <div className={`mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-lg border border-gray-700">
                  <div className="text-3xl font-bold text-blue-400 mb-2">5,000+</div>
                  <p className="text-gray-300">Documents Processed</p>
                </div>
                <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-lg border border-gray-700">
                  <div className="text-3xl font-bold text-blue-400 mb-2">98%</div>
                  <p className="text-gray-300">Accuracy Rate</p>
                </div>
                <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-lg border border-gray-700">
                  <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
                  <p className="text-gray-300">Secure Access</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features section */}
        <section className="py-20 bg-gray-900 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4">
            <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Powerful Features to Manage Your Health
              </h2>
              <p className="text-xl text-gray-400">
                Our intelligent platform helps you organize, understand, and share your health records securely.
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                <div className="text-blue-400 mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Document Digitization</h3>
                <p className="text-gray-400">
                  Upload handwritten notes, prescriptions, lab results, and other documents. Our AI transforms them into structured digital records.
                </p>
              </div>
              
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                <div className="text-blue-400 mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Intelligent Analysis</h3>
                <p className="text-gray-400">
                  Our advanced AI analyzes your health data to identify trends, flag potential issues, and provide personalized insights.
                </p>
              </div>
              
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                <div className="text-blue-400 mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Call Verification</h3>
                <p className="text-gray-400">
                  Automated verification calls confirm extracted information with patients, ensuring the highest level of accuracy in digitized records.
                </p>
              </div>

              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                <div className="text-blue-400 mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Bank-Level Security</h3>
                <p className="text-gray-400">
                  Your health data is protected with end-to-end encryption, secure access controls, and compliant with healthcare privacy standards.
                </p>
              </div>
              
             
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Digitalize Your Health Records?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Join thousands of users who have transformed how they manage their health information.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/register" 
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                Get Started for Free
              </Link>
              <Link 
                href="/presentation" 
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
                </svg>
                View Presentation
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
          <Image
                src="/assets/logo-removebg-preview.png" 
                alt="Docufy Logo" 
                width={40} 
                height={40}
                className="mr-2"
              />
              <span className="text-xl font-semibold text-white">Docufy</span>
            </div>
            <div className="flex gap-8 mb-6 md:mb-0">
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Docufy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
