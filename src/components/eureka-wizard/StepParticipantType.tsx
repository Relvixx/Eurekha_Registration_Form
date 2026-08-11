import React from 'react';
import { useWizardState } from '../../hooks/useWizardState';

interface Props {
  errors?: Record<string, string>;
}

export default function StepParticipantType({ errors = {} }: Props) {
  const participantType = useWizardState((state) => state.participantType);
  const setParticipantType = useWizardState((state) => state.setParticipantType);

  return (
    <div className="glass-panel p-6 md:p-8 rounded-2xl w-full animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-2xl font-bold text-white mb-2">Participant Type</h2>
      <p className="text-gray-400 mb-8">Select how you are registering for Eureka.</p>
      
      {errors.participantType && (
        <div className="mb-6 p-4 bg-[#FF1744]/10 border border-[#FF1744]/30 rounded-xl text-[#FF1744] text-sm">
          {errors.participantType}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div 
          onClick={() => setParticipantType('student')}
          className={`flex-1 border rounded-xl p-6 transition-all cursor-pointer text-center ${
            participantType === 'student' 
              ? 'border-[#FF1744] bg-[#FF1744]/10 shadow-[0_0_20px_rgba(255,23,68,0.2)]' 
              : 'border-white/10 bg-white/5 hover:bg-white/10'
          }`}
        >
          <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center border transition-colors ${
            participantType === 'student' ? 'bg-[#FF1744]/20 border-[#FF1744]/50 text-[#FF1744]' : 'bg-[#1a1a1a] border-white/10 text-white'
          }`}>
            <span className="text-2xl">🎓</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Student</h3>
          <p className="text-sm text-gray-400">I am registering as an individual or team of students with an idea.</p>
        </div>
        
        <div 
          onClick={() => setParticipantType('startup')}
          className={`flex-1 border rounded-xl p-6 transition-all cursor-pointer text-center ${
            participantType === 'startup' 
              ? 'border-[#FF1744] bg-[#FF1744]/10 shadow-[0_0_20px_rgba(255,23,68,0.2)]' 
              : 'border-white/10 bg-white/5 hover:bg-white/10'
          }`}
        >
          <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center border transition-colors ${
            participantType === 'startup' ? 'bg-[#FF1744]/20 border-[#FF1744]/50 text-[#FF1744]' : 'bg-[#1a1a1a] border-white/10 text-white'
          }`}>
            <span className="text-2xl">🚀</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Startup</h3>
          <p className="text-sm text-gray-400">We are registering as an established startup.</p>
        </div>
      </div>
    </div>
  );
}
