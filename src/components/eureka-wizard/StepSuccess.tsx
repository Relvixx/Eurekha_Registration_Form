import React from 'react';
import { useWizardState } from '../../hooks/useWizardState';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { EUREKA_CONFIG } from '../../lib/config/eureka';

export default function StepSuccess() {
  const wizardState = useWizardState();

  const handleCopy = () => {
    if (wizardState.referenceCode) {
      navigator.clipboard.writeText(wizardState.referenceCode);
    }
  };

  return (
    <div className="glass-panel p-8 md:p-12 rounded-2xl w-full text-center animate-in fade-in zoom-in duration-500 max-w-3xl mx-auto mt-8">
      <div className="w-20 h-20 mx-auto bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 size={40} />
      </div>
      
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Registration Successful!</h2>
      
      <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
        Your Eureka registration details and proof have been successfully submitted to E-Cell MET.
      </p>

      <div className="bg-[#1a1a1a] rounded-xl p-8 border border-emerald-500/30 mb-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <p className="text-sm text-gray-400 mb-2 uppercase tracking-wider font-semibold">Your Registration Reference Code</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <p className="text-3xl md:text-4xl font-mono font-bold text-emerald-400 select-all tracking-wider">
            {wizardState.referenceCode || 'EUREKA-XXXXXX'}
          </p>
          <button 
            onClick={handleCopy}
            className="text-sm bg-black/40 hover:bg-white/10 px-4 py-2 rounded-full text-gray-300 transition-colors focus-ring"
            title="Copy Reference Code"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="space-y-4 text-left max-w-xl mx-auto mb-10">
        <h3 className="text-white font-bold text-lg border-b border-white/10 pb-2">Next Steps</h3>
        <ul className="space-y-3 text-gray-400 text-sm">
          <li className="flex gap-3">
            <span className="text-[#FF1744] mt-0.5">•</span>
            Please save your Reference Code. You will need it for any future communication regarding your registration.
          </li>
          <li className="flex gap-3">
            <span className="text-[#FF1744] mt-0.5">•</span>
            Our team will verify your Eureka Registration ID ({wizardState.eurekaRegistrationId}) and the proof you uploaded.
          </li>
          <li className="flex gap-3">
            <span className="text-[#FF1744] mt-0.5">•</span>
            We will contact you via email at {wizardState.teamMembers[0]?.email} if any further action is required.
          </li>
        </ul>
      </div>

      <div className="pt-8 border-t border-white/10">
        <p className="text-gray-500 text-sm mb-6">
          If you have any questions, please contact E-Cell MET support.
        </p>
        <a 
          href="/"
          className="btn btn-glass px-8 py-3 rounded-full text-white inline-flex items-center gap-2 focus-ring hover:bg-white/10"
        >
          Return to Homepage
        </a>
      </div>
    </div>
  );
}
