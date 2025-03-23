'use client';

import { Inter } from 'next/font/google';
import React from 'react';

// Initialize the Inter font
const inter = Inter({ subsets: ['latin'] });

export default function PresentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} min-h-screen bg-gray-900`}>
      {children}
    </div>
  );
} 