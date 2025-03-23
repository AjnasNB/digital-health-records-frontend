'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="h-10 w-10 flex items-center justify-center bg-blue-600 rounded-md overflow-hidden">
                <Image 
                  src="/assets/logo-removebg-preview.png" 
                  alt="Docufy Logo" 
                  width={32} 
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="ml-2 text-xl font-bold text-white">Docufy   The Future</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/dashboard' 
                      ? 'text-white bg-blue-600' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white transition-colors'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/upload" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/upload' 
                      ? 'text-white bg-blue-600' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white transition-colors'
                  }`}
                >
                  Upload
                </Link>
                <Link 
                  href="/profile" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/profile' 
                      ? 'text-white bg-blue-600' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white transition-colors'
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800">
          {isAuthenticated ? (
            <>
              <Link 
                href="/dashboard" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === '/dashboard' 
                    ? 'text-white bg-blue-600' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white transition-colors'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/upload" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === '/upload' 
                    ? 'text-white bg-blue-600' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white transition-colors'
                }`}
              >
                Upload
              </Link>
              <Link 
                href="/profile" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === '/profile' 
                    ? 'text-white bg-blue-600' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white transition-colors'
                }`}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 