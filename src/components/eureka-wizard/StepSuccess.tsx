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
    <div className="glass-panel p-10 md:p-14 rounded-2xl w-full text-center animate-in fade-in zoom-in duration-500 max-w-3xl mx-auto mt-8 border border-white/5">
      <div className="w-24 h-24 mx-auto bg-[#00E5FF]/10 text-[#00E5FF] rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,229,255,0.2)]">
        <CheckCircle2 size={48} strokeWidth={2.5} />
      </div>
      
      <h2 className="text-4xl md:text-5xl font-black text-white mb-4 font-poppins tracking-tight">Registration Successful!</h2>
      
      <p className="text-[#888888] text-lg mb-10 max-w-xl mx-auto font-inter">
        Your Eureka registration details and proof have been successfully submitted to E-Cell MET.
      </p>

      <div className="bg-[#000000] rounded-2xl p-8 border border-[#00E5FF]/20 mb-10 relative overflow-hidden group shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <p className="text-sm text-[#888888] mb-3 uppercase tracking-widest font-bold font-inter">Your Registration Reference Code</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <p className="text-3xl md:text-4xl font-mono font-bold text-[#00E5FF] select-all tracking-wider">
            {wizardState.referenceCode || 'EUREKA-XXXXXX'}
          </p>
          <button 
            onClick={handleCopy}
            className="text-sm bg-white/5 border border-white/10 hover:bg-[#1A6FF5]/20 hover:border-[#1A6FF5]/50 px-6 py-2.5 rounded-full text-white transition-all focus-ring font-medium"
            title="Copy Reference Code"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="space-y-5 text-left max-w-xl mx-auto mb-12">
        <h3 className="text-white font-bold text-xl border-b border-white/10 pb-3 font-poppins">Next Steps</h3>
        <ul className="space-y-4 text-[#888888] text-sm font-inter">
          <li className="flex gap-3">
            <span className="text-[#1A6FF5] mt-0.5 text-lg leading-none">•</span>
            <span className="leading-relaxed">Please save your Reference Code. You will need it for any future communication regarding your registration.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#1A6FF5] mt-0.5 text-lg leading-none">•</span>
            <span className="leading-relaxed">Our team will verify your Eureka Registration ID ({wizardState.eurekaRegistrationId}) and the proof you uploaded.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#1A6FF5] mt-0.5 text-lg leading-none">•</span>
            <span className="leading-relaxed">We will contact you via email at {wizardState.teamMembers[0]?.email} if any further action is required.</span>
          </li>
        </ul>
      </div>

      <div className="pt-10 border-t border-white/10">
        <p className="text-[#888888] text-sm mb-6 font-inter">
          If you have any questions, please contact E-Cell MET support.
        </p>
        <a 
          href="/"
          onClick={() => wizardState.resetWizard()}
          className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border border-white/10 bg-[#000000] text-white hover:bg-[#1A6FF5]/10 hover:border-[#1A6FF5]/30 hover:text-[#1A6FF5] transition-all duration-300 font-semibold font-inter focus-ring"
        >
          Return to Homepage
        </a>
      </div>
    </div>
  );
}
