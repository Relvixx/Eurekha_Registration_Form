import { Metadata } from 'next';
import SiteFooter from '@/components/layout/SiteFooter';

export const metadata: Metadata = {
  title: 'Eureka Registration Form | E-Cell MET',
  description: 'Step-by-step registration form for Eureka startup and student tracks.',
};

export default function EurekaRegistrationPage() {
  return (
    <div className="flex-1 w-full bg-text-dark flex flex-col relative overflow-hidden">
      {/* Background ambient light effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-0 w-125 h-75 bg-accent-deep/15 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="max-w-md w-full bg-[#121212] border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-[#FF1744]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#FF1744]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 font-poppins">Registrations Closed</h2>
            <p className="text-gray-400">
              Thank you for your overwhelming response! The registrations for Eureka are now officially closed.
            </p>
            
            <div className="bg-[#1A6FF5]/10 border border-[#1A6FF5]/20 rounded-xl p-4 mt-6 text-left">
              <p className="text-sm text-gray-300 mb-2">
                If you faced any technical issues while filling the form or missed the deadline, please reach out to:
              </p>
              <p className="text-sm font-semibold text-white">Rahul Choudhary</p>
              <p className="text-xs text-[#1A6FF5] mb-1">Technical Leader</p>
              <p className="text-sm text-gray-300">📞 +91 8983707673</p>
            </div>

            <div className="mt-8">
              <a href="/" className="inline-block bg-white/5 hover:bg-white/10 text-white font-medium py-3 px-6 rounded-lg transition-colors border border-white/10">
                Return to Home
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <SiteFooter />
    </div>
  );
}
