import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  canProceed?: boolean;
}

export default function WizardNavigation({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onBack,
  canProceed = true
}: WizardNavigationProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-white/10 w-full">
      <button
        onClick={onBack}
        disabled={isFirstStep}
        className={`btn btn-glass px-6 py-3 w-full sm:w-auto rounded-full text-sm inline-flex items-center justify-center gap-2 focus-ring ${
          isFirstStep ? 'opacity-0 pointer-events-none' : ''
        }`}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <button
        onClick={onNext}
        disabled={!canProceed}
        className={`btn w-full sm:w-auto px-8 py-3 rounded-full text-sm font-bold inline-flex items-center justify-center gap-2 focus-ring transition-transform ${
          !canProceed ? 'opacity-50 cursor-not-allowed bg-gray-600 text-gray-300' 
          : 'btn-primary'
        }`}
      >
        {isLastStep ? (
          <>
            Complete Registration
            <CheckCircle size={18} />
          </>
        ) : (
          <>
            Continue
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </div>
  );
}
