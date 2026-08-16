import React from 'react';
import { Check } from 'lucide-react';

interface FormProgressProps {
  currentStep: number;
}

export default function FormProgress({ currentStep }: FormProgressProps) {
  const steps = [
    { num: 1, label: 'Participant Type' },
    { num: 2, label: 'Team Details' },
    { num: 3, label: 'Idea/Startup' },
    { num: 4, label: 'Eureka Registration' },
    { num: 5, label: 'Registration Proof' },
    { num: 6, label: 'Review & Submit' }
  ];

  return (
    <div className="w-full mb-12 md:mb-16">
      {/* Desktop Progress (Hidden on small mobile) */}
      <div className="hidden sm:flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/5 z-0"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary z-0 transition-all duration-700 ease-in-out shadow-[0_0_12px_rgba(26,111,245,0.6)]"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step) => {
          const isCompleted = step.num < currentStep;
          const isCurrent = step.num === currentStep;
          
          return (
            <div key={step.num} className="relative z-10 flex flex-col items-center gap-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 font-poppins ${
                  isCompleted 
                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(26,111,245,0.4)]' 
                    : isCurrent 
                      ? 'bg-text-dark text-primary border-2 border-primary shadow-[0_0_20px_rgba(26,111,245,0.3)]' 
                      : 'bg-surface-secondary text-[#555555] border border-white/5'
                }`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? <Check size={18} strokeWidth={3} /> : step.num}
              </div>
              
              <span className={`text-[10px] uppercase tracking-wider font-bold absolute top-12 whitespace-nowrap text-center w-24 left-1/2 -translate-x-1/2 font-inter transition-colors duration-300 ${
                isCurrent ? 'text-[#FFFFFF] drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : isCompleted ? 'text-[#2D87FF]' : 'text-[#555555]'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Compact Progress (Visible only on very small screens) */}
      <div className="sm:hidden flex flex-col gap-3 bg-white/5 p-4 rounded-xl border border-white/10 shadow-lg">
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-400 font-poppins">
          <span>Step {currentStep} of {steps.length}</span>
          <span className="text-white text-right ml-4 line-clamp-1">{steps[currentStep - 1]?.label}</span>
        </div>
        <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-700 ease-in-out rounded-full shadow-[0_0_10px_rgba(26,111,245,0.6)]"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
