import React from 'react';
import { Check } from 'lucide-react';

interface WizardProgressProps {
  currentStep: number;
}

export default function WizardProgress({ currentStep }: WizardProgressProps) {
  const steps = [
    { num: 1, label: 'Participant Type' },
    { num: 2, label: 'Team Details' },
    { num: 3, label: 'Idea/Startup' },
    { num: 4, label: 'Eureka Registration' },
    { num: 5, label: 'Registration Proof' },
    { num: 6, label: 'Review & Submit' }
  ];

  return (
    <div className="w-full mb-8 md:mb-12">
      {/* Desktop Progress (Hidden on small mobile) */}
      <div className="hidden sm:flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-white/10 z-0"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#00E5FF] z-0 transition-all duration-500 ease-in-out shadow-[0_0_8px_rgba(0,229,255,0.5)]"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step) => {
          const isCompleted = step.num < currentStep;
          const isCurrent = step.num === currentStep;
          
          return (
            <div key={step.num} className="relative z-10 flex flex-col items-center gap-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
                  isCompleted 
                    ? 'bg-[#00E5FF] text-black shadow-[0_0_12px_rgba(0,229,255,0.4)]' 
                    : isCurrent 
                      ? 'bg-[#FF1744] text-white shadow-[0_0_12px_rgba(255,23,68,0.4)] border-none' 
                      : 'bg-[#1a1a1a] text-gray-500 border border-white/10'
                }`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? <Check size={18} strokeWidth={3} /> : step.num}
              </div>
              
              <span className={`text-[10px] uppercase tracking-wider font-bold absolute top-12 whitespace-nowrap text-center w-24 left-1/2 -translate-x-1/2 ${
                isCurrent ? 'text-white' : isCompleted ? 'text-[#00E5FF]' : 'text-gray-600'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Compact Progress (Visible only on very small screens) */}
      <div className="sm:hidden flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-400">
          <span>Step {currentStep} of {steps.length}</span>
          <span className="text-white">{steps[currentStep - 1]?.label}</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#FF1744] to-[#00E5FF] transition-all duration-500 ease-in-out"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
