'use client';

import React, { useState, useEffect } from 'react';
import WizardProgress from './WizardProgress';
import WizardNavigation from './WizardNavigation';
import StepParticipantType from './StepParticipantType';
import StepTeamDetails from './StepTeamDetails';
import StepIdeaStartup from './StepIdeaStartup';
import StepEureka from './StepEureka';
import StepProof from './StepProof';
import StepReview from './StepReview';
import { useWizardState } from '../../hooks/useWizardState';
import { step1Schema, step2Schema, leaderSchema, optionalMemberSchema, additionalMemberSchema, studentIdeaSchema, startupDetailsSchema, step4Schema } from '../../lib/validation/schemas';
import { z } from 'zod';

const TOTAL_STEPS = 6;

export default function WizardShell() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [errors, setErrors] = useState<Record<string, any>>({});
  
  const wizardState = useWizardState();

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const validateCurrentStep = () => {
    setErrors({});
    
    if (currentStep === 1) {
      const result = step1Schema.safeParse({ participantType: wizardState.participantType });
      if (!result.success) {
        const formattedErrors: Record<string, string> = {};
        result.error.issues.forEach((err: any) => {
          const path = err.path[0] as string;
          formattedErrors[path] = err.message;
        });
        setErrors(formattedErrors);
        return false;
      }
    } else if (currentStep === 2) {
      const teamErrors: Record<string, any> = {};
      const teamMembersErrors: Record<string, any>[] = [];
      let hasErrors = false;

      // Validate Team Name
      if (!wizardState.teamName || wizardState.teamName.trim().length < 2) {
        teamErrors.teamName = 'Team name is required (min 2 chars)';
        hasErrors = true;
      }

      // Validate Members
      wizardState.teamMembers.forEach((member, index) => {
        let memberError: Record<string, string> = {};
        
        let schema;
        if (index === 0) {
          schema = leaderSchema;
        } else if (index === 1) {
          schema = optionalMemberSchema;
        } else {
          schema = additionalMemberSchema;
        }

        const result = schema.safeParse(member);
        if (!result.success) {
          hasErrors = true;
          result.error.issues.forEach((err: any) => {
            const path = err.path[0] as string;
            memberError[path] = err.message;
          });
        }
        teamMembersErrors[index] = memberError;
      });

      if (hasErrors) {
        setErrors({
          teamName: teamErrors.teamName,
          teamMembers: teamMembersErrors,
          _general: 'Please fix the errors below to continue.'
        });
        return false;
      }
    } else if (currentStep === 3) {
      if (wizardState.participantType === 'student') {
        const result = studentIdeaSchema.safeParse(wizardState.studentIdeaDetails);
        if (!result.success) {
          const formattedErrors: Record<string, string> = {};
          result.error.issues.forEach((err: any) => {
            const path = err.path[0] as string;
            formattedErrors[path] = err.message;
          });
          setErrors(formattedErrors);
          return false;
        }
      } else if (wizardState.participantType === 'startup') {
        const result = startupDetailsSchema.safeParse(wizardState.startupDetails);
        if (!result.success) {
          const formattedErrors: Record<string, string> = {};
          result.error.issues.forEach((err: any) => {
            const path = err.path[0] as string;
            formattedErrors[path] = err.message;
          });
          setErrors(formattedErrors);
          return false;
        }
      }
    } else if (currentStep === 4) {
      const result = step4Schema.safeParse({ eurekaSelfConfirmed: wizardState.eurekaSelfConfirmed });
      if (!result.success) {
        setErrors({ _general: result.error.issues[0].message });
        return false;
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setErrors({});
      } else {
        console.log('Final Submission Clicked');
        alert('Phase 1/2: Final Submission functionality is not implemented yet.');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setErrors({}); // Clear errors when going back
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepParticipantType errors={errors} />;
      case 2:
        return <StepTeamDetails errors={errors} />;
      case 3:
        return <StepIdeaStartup errors={errors} />;
      case 4:
        return <StepEureka error={errors._general} />;
      case 5:
        return <StepProof />;
      case 6:
        return <StepReview />;
      default:
        return <StepParticipantType errors={errors} />;
    }
  };

  if (!isMounted) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Eureka <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF1744] to-[#00E5FF]">Registration</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
          Complete the six steps below to register your startup or idea for the flagship entrepreneurship event.
        </p>
      </div>

      <WizardProgress currentStep={currentStep} />
      
      <div className="min-h-[400px] flex flex-col justify-between">
        <div className="w-full">
          {renderStep()}
        </div>
        
        <WizardNavigation 
          currentStep={currentStep} 
          totalSteps={TOTAL_STEPS} 
          onNext={handleNext} 
          onBack={handleBack}
          canProceed={true} 
        />
      </div>
    </div>
  );
}
