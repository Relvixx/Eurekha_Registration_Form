import React from 'react';
import { useWizardState } from '../../hooks/useWizardState';
import { User, Rocket } from 'lucide-react';

interface Props {
  errors?: Record<string, string>;
}

export default function StepParticipantType({ errors = {} }: Props) {
  const participantType = useWizardState((state) => state.participantType);
  const setParticipantType = useWizardState((state) => state.setParticipantType);

  return (
    <div className="glass-panel p-8 md:p-10 rounded-2xl w-full animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-3xl font-black text-white mb-3 font-poppins tracking-tight">Participant Type</h2>
      <p className="text-[#888888] mb-10 font-inter text-lg">Select how you are registering for Eureka.</p>
      
      {errors.participantType && (
        <div className="mb-8 p-4 bg-[#FF253A]/10 border border-[#FF253A]/30 rounded-xl text-[#FF253A] text-sm font-inter flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF253A]"></span>
          {errors.participantType}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div 
          onClick={() => setParticipantType('student')}
          className={`flex-1 rounded-2xl p-8 transition-all cursor-pointer text-center border relative overflow-hidden group ${
            participantType === 'student' 
              ? 'premium-card scale-[1.02]' 
              : 'bg-[#000000] border-white/5 hover:border-white/15 hover:bg-[#1A1A2E]/50'
          }`}
        >
          {/* Active indicator dot */}
          <div className={`absolute top-4 right-4 w-3 h-3 rounded-full transition-all ${
            participantType === 'student' ? 'bg-[#1A6FF5] shadow-[0_0_10px_#1A6FF5]' : 'bg-white/10'
          }`}></div>

          <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center border transition-all duration-300 ${
            participantType === 'student' ? 'bg-[#1A6FF5]/10 border-[#1A6FF5]/50 text-[#1A6FF5] shadow-[0_0_20px_rgba(26,111,245,0.2)]' : 'bg-[#1A1A2E] border-white/5 text-gray-400 group-hover:text-white'
          }`}>
            <User size={32} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3 font-poppins">Student</h3>
          <p className="text-sm text-[#888888] font-inter leading-relaxed">I am registering as an individual or team of students with an idea.</p>
        </div>
        
        <div 
          onClick={() => setParticipantType('startup')}
          className={`flex-1 rounded-2xl p-8 transition-all cursor-pointer text-center border relative overflow-hidden group ${
            participantType === 'startup' 
              ? 'premium-card scale-[1.02]' 
              : 'bg-[#000000] border-white/5 hover:border-white/15 hover:bg-[#1A1A2E]/50'
          }`}
        >
          {/* Active indicator dot */}
          <div className={`absolute top-4 right-4 w-3 h-3 rounded-full transition-all ${
            participantType === 'startup' ? 'bg-[#1A6FF5] shadow-[0_0_10px_#1A6FF5]' : 'bg-white/10'
          }`}></div>

          <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center border transition-all duration-300 ${
            participantType === 'startup' ? 'bg-[#1A6FF5]/10 border-[#1A6FF5]/50 text-[#1A6FF5] shadow-[0_0_20px_rgba(26,111,245,0.2)]' : 'bg-[#1A1A2E] border-white/5 text-gray-400 group-hover:text-white'
          }`}>
            <Rocket size={32} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3 font-poppins">Startup</h3>
          <p className="text-sm text-[#888888] font-inter leading-relaxed">We are registering as an established startup.</p>
        </div>
      </div>
    </div>
  );
}
