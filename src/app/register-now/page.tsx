import React from 'react';
import type { Metadata } from 'next';
import ImmediateRegistrationForm from '@/components/short-form/ImmediateRegistrationForm';
import CountdownTimer from '@/components/layout/CountdownTimer';

export const metadata: Metadata = {
  title: "Register Now | Eureka - Asia's Largest Startup Launchpad",
  description: 'Immediate Registration for Eureka - IIT Bombay',
};

export default function RegisterNowPage() {
  // Check if current time is past August 19, 2026, 5:00 PM IST
  const isClosed = new Date() > new Date('2026-08-19T17:00:00+05:30');

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden pt-28 pb-20">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-primary rounded-full blur-[120px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-150 h-150 bg-primary rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 font-poppins tracking-tight">
            Register for <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-[#4D90FE]">Eureka</span>
          </h1>
          <p className="text-xl text-gray-400 font-inter max-w-2xl mx-auto">
            Take the first step towards Asia&apos;s largest business model competition.
          </p>
        </div>

        {isClosed ? (
          <div className="max-w-md mx-auto bg-[#121212] border border-white/10 rounded-2xl p-8 text-center shadow-2xl mt-8">
            <div className="w-16 h-16 bg-[#FF1744]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#FF1744]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 font-poppins">Registrations Closed</h2>
            <p className="text-gray-400">
              Thank you for your overwhelming response! The registrations for Eureka are now officially closed.
            </p>
            
            <div className="bg-[#FF1744]/10 border border-[#FF1744]/20 rounded-xl p-4 mt-6 text-left">
              <p className="text-sm text-gray-300 mb-2">
                If you faced any technical issues while filling the form or missed the deadline, please reach out to:
              </p>
              <p className="text-sm font-semibold text-white">Rahul Choudhary</p>
              <p className="text-xs text-[#FF1744] mb-1">Technical Leader</p>
              <p className="text-sm text-gray-300">📞 +91 8983707673</p>
            </div>

            <div className="mt-8">
              <a href="/" className="inline-block bg-white/5 hover:bg-white/10 text-white font-medium py-3 px-6 rounded-lg transition-colors border border-white/10">
                Return to Home
              </a>
            </div>
          </div>
        ) : (
          <>
            <CountdownTimer deadline="2026-08-19T17:00:00+05:30" />
            <ImmediateRegistrationForm />
          </>
        )}
      </div>
    </div>
  );
}
