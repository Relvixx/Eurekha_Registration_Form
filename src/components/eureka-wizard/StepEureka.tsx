'use client';

import { useWizardState } from '../../hooks/useWizardState';
import NecCodeCard from './NecCodeCard';
import { EUREKA_CONFIG } from '../../lib/config/eureka';

interface StepEurekaProps {
  error?: string;
}

export default function StepEureka({ error }: StepEurekaProps) {
  const wizardState = useWizardState();

  const handleEurekaClick = () => {
    wizardState.setEurekaLinkClicked(true);
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    wizardState.setEurekaSelfConfirmed(e.target.checked);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Complete Eureka Registration
        </h2>
        <p className="text-white/60 text-sm sm:text-base">
          Almost there! To participate, you need to officially register your team on the Eureka platform using our E-Cell MET referral code.
        </p>
      </div>

      {/* Code Card */}
      <div className="max-w-md mx-auto">
        <NecCodeCard />
      </div>

      {/* Registration Steps */}
      <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <svg className="w-5 h-5 mr-3 text-[#FF1744]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Registration Instructions
        </h3>
        
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[13px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-7 h-7 rounded-full border border-white/20 bg-black text-white text-xs font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_rgba(0,0,0,1)] z-10">
              1
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] text-white/80 text-sm py-2">
              <strong className="text-white">Copy the NEC ID</strong> shown above.
            </div>
          </div>
          
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-7 h-7 rounded-full border border-white/20 bg-black text-white text-xs font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_rgba(0,0,0,1)] z-10">
              2
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] text-white/80 text-sm py-2">
              <strong className="text-white">Open the Eureka</strong> registration portal.
            </div>
          </div>
          
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-7 h-7 rounded-full border border-white/20 bg-black text-white text-xs font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_rgba(0,0,0,1)] z-10">
              3
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] text-white/80 text-sm py-2">
              Use the NEC ID as the <strong className="text-white">referral code</strong>.
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-7 h-7 rounded-full border border-white/20 bg-black text-white text-xs font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_rgba(0,0,0,1)] z-10">
              4
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] text-white/80 text-sm py-2">
              <strong className="text-white">Complete</strong> Eureka registration.
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-7 h-7 rounded-full border border-[#FF1744] bg-[#FF1744]/10 text-[#FF1744] text-xs font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_rgba(0,0,0,1)] z-10">
              5
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] text-white/80 text-sm py-2">
              <strong className="text-white">Return to this wizard</strong> to confirm.
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href={EUREKA_CONFIG.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleEurekaClick}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#FF1744] text-white font-semibold hover:bg-[#D50000] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 shadow-lg shadow-[#FF1744]/20"
          >
            Register on Eureka
            <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <p className="mt-3 text-xs text-white/40">Opens in a new tab</p>
        </div>
      </div>

      {/* Confirmation Checkbox */}
      <div className="max-w-2xl mx-auto pt-4">
        <label 
          htmlFor="eureka-confirmation"
          className={`flex items-start p-4 sm:p-5 rounded-xl border cursor-pointer transition-all duration-200 ${
            wizardState.eurekaSelfConfirmed 
              ? 'bg-emerald-500/10 border-emerald-500/30' 
              : error 
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              id="eureka-confirmation"
              checked={wizardState.eurekaSelfConfirmed}
              onChange={handleConfirmChange}
              className="w-5 h-5 rounded border-white/20 bg-black/50 text-[#FF1744] focus:ring-[#FF1744] focus:ring-offset-black cursor-pointer"
              aria-describedby={error ? "eureka-error" : undefined}
            />
          </div>
          <div className="ml-4">
            <span className={`block font-medium ${wizardState.eurekaSelfConfirmed ? 'text-emerald-400' : 'text-white'}`}>
              I have completed my Eureka registration using the NEC ID provided above.
            </span>
            <span className="block text-sm text-white/50 mt-1">
              By checking this box, you confirm that you have successfully submitted your team details on the official Eureka platform.
            </span>
            {error && (
              <span id="eureka-error" className="block text-sm text-red-400 mt-2 font-medium flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </span>
            )}
          </div>
        </label>
      </div>
    </div>
  );
}
