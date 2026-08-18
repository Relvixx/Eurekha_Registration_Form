'use client';

import { useFormState } from '../../hooks/useFormState';
import NecCodeCard from './NecCodeCard';
import { EUREKA_CONFIG } from '../../lib/config/eureka';

interface StepEurekaProps {
  error?: string;
}

export default function StepEureka({ error }: StepEurekaProps) {
  const formState = useFormState();

  const handleEurekaClick = () => {
    formState.setEurekaLinkClicked(true);
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formState.setEurekaSelfConfirmed(e.target.checked);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-poppins">
          Complete Eureka Registration
        </h2>
        <p className="text-text-muted font-inter text-lg">
          Almost there! To participate, you need to officially register your team on the Eureka platform using our E-Cell MET referral code.
        </p>
      </div>

      {/* Eureka IIT Bombay Note */}
      <div className="max-w-2xl mx-auto mb-6 bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-start gap-3">
        <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <div className="flex flex-col gap-2">
          <p className="text-text-muted font-inter text-sm text-left">
            <strong className="text-white font-medium">Important:</strong> If you register for Eureka using this portal, then only you are qualified for <strong className="text-white">Eureka at IIT Bombay</strong>.
          </p>
          <p className="text-text-muted font-inter text-sm text-left">
            <strong className="text-green-400 font-medium">Don't worry!</strong> Your progress is automatically saved in this browser. You can safely open the Eureka portal in a new tab, complete your registration, and return here later to upload your proof.
          </p>
        </div>
      </div>

      {/* Code Card */}
      <div className="max-w-md mx-auto">
        <NecCodeCard />
      </div>

      {/* Registration Steps */}
      <div className="max-w-2xl mx-auto glass-panel p-8 md:p-10 rounded-2xl border border-white/5 bg-text-dark">
        <h3 className="text-xl font-bold text-white mb-8 flex items-center font-poppins">
          <svg className="w-6 h-6 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Registration Instructions
        </h3>
        
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-3.75 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-primary before:via-white/10 before:to-transparent">
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-surface-secondary text-primary text-sm font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_rgba(0,0,0,1)] z-10 font-inter">
              1
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] text-text-muted font-inter py-2">
              <strong className="text-white">Copy the NEC ID</strong> shown above.
            </div>
          </div>
          
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-surface-secondary text-primary text-sm font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_rgba(0,0,0,1)] z-10 font-inter">
              2
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] text-text-muted font-inter py-2">
              <strong className="text-white">Open the Eureka</strong> registration portal.
            </div>
          </div>
          
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-surface-secondary text-primary text-sm font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_rgba(0,0,0,1)] z-10 font-inter">
              3
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] text-text-muted font-inter py-2 text-sm leading-relaxed">
              Under <strong className="text-white">"From where did you hear about Eureka! 2026"</strong>, select <strong className="text-primary">"NEC"</strong> to reveal the Referral ID field.
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-surface-secondary text-primary text-sm font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_rgba(0,0,0,1)] z-10 font-inter">
              4
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] text-text-muted font-inter py-2 text-sm">
              Paste the NEC ID into the <strong className="text-white">Referral ID</strong> field and <strong className="text-white">Complete</strong> Eureka registration.
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-error/30 bg-error/10 text-error text-sm font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_rgba(0,0,0,1)] z-10 font-inter">
              5
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] text-text-muted font-inter py-2">
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
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-white font-semibold font-inter hover:bg-primary/90 transition-colors duration-200 focus-ring shadow-[0_0_20px_rgba(26,111,245,0.3)]"
          >
            Register on Eureka
            <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <p className="mt-3 text-xs text-text-muted font-inter">Opens in a new tab</p>
        </div>
      </div>

      {/* Confirmation Checkbox */}
      <div className="max-w-2xl mx-auto pt-4">
        <label 
          htmlFor="eureka-confirmation"
          className={`flex items-start p-5 sm:p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
            formState.eurekaSelfConfirmed 
              ? 'bg-[#00E5FF]/5 border-[#00E5FF]/30 shadow-[0_0_15px_rgba(0,229,255,0.05)]' 
              : error 
                ? 'bg-error/5 border-error/30'
                : 'bg-text-dark border-white/5 hover:border-white/20'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            <input
              type="checkbox"
              id="eureka-confirmation"
              checked={formState.eurekaSelfConfirmed}
              onChange={handleConfirmChange}
              className="w-5 h-5 rounded border-white/20 bg-black/50 text-[#00E5FF] focus:ring-[#00E5FF] focus:ring-offset-black cursor-pointer accent-[#00E5FF]"
              aria-describedby={error ? "eureka-error" : undefined}
            />
          </div>
          <div className="ml-4">
            <span className={`block font-semibold font-inter text-lg ${formState.eurekaSelfConfirmed ? 'text-[#00E5FF]' : 'text-white'}`}>
              I have completed my Eureka registration using the NEC ID provided above.
            </span>
            <span className="block text-sm text-text-muted font-inter mt-2">
              By checking this box, you confirm that you have successfully submitted your team details on the official Eureka platform.
            </span>
            {error && (
              <span id="eureka-error" className="flex text-sm text-error mt-3 font-medium items-center font-inter">
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
