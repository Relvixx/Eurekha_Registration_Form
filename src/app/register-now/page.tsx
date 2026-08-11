import React from 'react';
import type { Metadata } from 'next';
import ImmediateRegistrationForm from '@/components/short-form/ImmediateRegistrationForm';

export const metadata: Metadata = {
  title: "Register Now | Eureka - Asia's Largest Startup Launchpad",
  description: 'Immediate Registration for Eureka - IIT Bombay',
};

export default function RegisterNowPage() {
  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden pt-28 pb-20">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#1A6FF5] rounded-full blur-[120px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#FF253A] rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 font-poppins tracking-tight">
            Register for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A6FF5] to-[#4D90FE]">Eureka</span>
          </h1>
          <p className="text-xl text-gray-400 font-inter max-w-2xl mx-auto">
            Take the first step towards Asia&apos;s largest business model competition. Fill out this quick form to secure your spot.
          </p>
        </div>

        <ImmediateRegistrationForm />
      </div>
    </div>
  );
}
