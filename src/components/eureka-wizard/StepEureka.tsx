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
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-poppins">
          Complete Eureka Registration
        </h2>
        <p className="text-[#888888] font-inter text-lg">
          Almost there! To participate, you need to officially register your team on the Eureka platform using our E-Cell MET referral code.
        </p>
      </div>

      {/* Eureka IIT Bombay Note */}
      <div className="max-w-2xl mx-auto mb-6 bg-[#1A6FF5]/10 border border-[#1A6FF5]/20 p-4 rounded-xl flex items-start gap-3">
        <svg className="w-5 h-5 text-[#1A6FF5] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <p className="text-[#888888] font-inter text-sm text-left">
          <strong className="text-white font-medium">Important:</strong> If you register for Eureka using this portal, then only you are qualified for <strong className="text-white">Eureka at IIT Bombay</strong>.
        </p>
      </div>

      {/* Code Card */}
      <div className="max-w-md mx-auto">
        <NecCodeCard />
      </div>

      {/* Registration Steps */}
      <div className="max-w-2xl mx-auto glass-panel p-8 md:p-10 rounded-2xl border border-white/5 bg-[#000000]">
        <h3 className="text-xl font-bold text-white mb-8 flex items-center font-poppins">
          <svg className="w-6 h-6 mr-3 text-[#1A6FF5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Registration Instructions
        </h3>
        
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#1A6FF5] before:via-white/10 before:to-transparent">
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-[#1A1A2E] text-[#1A6FF5] text-sm font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_rgba(0,0,0,1)] z-10 font-inter">
              1
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] text-[#888888] font-inter py-2">
              <strong className="text-white">Copy the NEC ID</strong> shown above.
            </div>
          </div>
          
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-[#1A1A2E] text-[#1A6FF5] text-sm font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_rgba(0,0,0,1)] z-10 font-inter">
              2
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] text-[#888888] font-inter py-2">
              <strong className="text-white">Open the Eureka</strong> registration portal.
            </div>
          </div>
          
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-[#1A1A2E] text-[#1A6FF5] text-sm font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_rgba(0,0,0,1)] z-10 font-inter">
              3
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] text-[#888888] font-inter py-2">
              Use the NEC ID as the <strong className="text-white">referral code</strong>.
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-[#1A1A2E] text-[#1A6FF5] text-sm font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_rgba(0,0,0,1)] z-10 font-inter">
              4
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] text-[#888888] font-inter py-2">
              <strong className="text-white">Complete</strong> Eureka registration.
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-[#FF253A]/30 bg-[#FF253A]/10 text-[#FF253A] text-sm font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_rgba(0,0,0,1)] z-10 font-inter">
              5
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] text-[#888888] font-inter py-2">
              <strong className="text-white">Return to this wizard</strong> to confirm.
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <a
            href={EUREKA_CONFIG.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleEurekaClick}
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#1A6FF5] text-white font-semibold font-inter hover:bg-[#1A6FF5]/90 transition-colors duration-200 focus-ring shadow-[0_0_20px_rgba(26,111,245,0.3)]"
          >
            Register on Eureka
            <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <p className="mt-3 text-xs text-[#888888] font-inter">Opens in a new tab</p>
        </div>
      </div>

      {/* Confirmation Checkbox */}
      <div className="max-w-2xl mx-auto pt-4">
        <label 
          htmlFor="eureka-confirmation"
          className={`flex items-start p-5 sm:p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
            wizardState.eurekaSelfConfirmed 
              ? 'bg-[#00E5FF]/5 border-[#00E5FF]/30 shadow-[0_0_15px_rgba(0,229,255,0.05)]' 
              : error 
                ? 'bg-[#FF253A]/5 border-[#FF253A]/30'
                : 'bg-[#000000] border-white/5 hover:border-white/20'
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              id="eureka-confirmation"
              checked={wizardState.eurekaSelfConfirmed}
              onChange={handleConfirmChange}
              className="w-5 h-5 rounded border-white/20 bg-black/50 text-[#00E5FF] focus:ring-[#00E5FF] focus:ring-offset-black cursor-pointer accent-[#00E5FF]"
              aria-describedby={error ? "eureka-error" : undefined}
            />
          </div>
          <div className="ml-4">
            <span className={`block font-semibold font-inter text-lg ${wizardState.eurekaSelfConfirmed ? 'text-[#00E5FF]' : 'text-white'}`}>
              I have completed my Eureka registration using the NEC ID provided above.
            </span>
            <span className="block text-sm text-[#888888] font-inter mt-2">
              By checking this box, you confirm that you have successfully submitted your team details on the official Eureka platform.
            </span>
            {error && (
              <span id="eureka-error" className="block text-sm text-[#FF253A] mt-3 font-medium flex items-center font-inter">
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
