'use client';

import React, { useState, useEffect } from 'react';
import FormProgress from './FormProgress';
import FormNavigation from './FormNavigation';
import StepParticipantType from './StepParticipantType';
import StepTeamDetails from './StepTeamDetails';
import StepIdeaStartup from './StepIdeaStartup';
import StepEureka from './StepEureka';
import StepProof from './StepProof';
import StepReview from './StepReview';
import StepSuccess from './StepSuccess';
import { useFormState } from '../../hooks/useFormState';
import { step1Schema, step2Schema, leaderSchema, optionalMemberSchema, additionalMemberSchema, studentIdeaSchema, startupDetailsSchema, step4Schema, step5Schema, step6Schema } from '../../lib/validation/schemas';
import { createRegistrationDraft, saveRegistrationDraft, submitRegistration } from '../../lib/api';
import { z } from 'zod';

const TOTAL_STEPS = 6;

export default function FormShell() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, any>>({});
  
  const formState = useFormState();

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    useFormState.persist.rehydrate();
    setIsMounted(true);
  }, []);

  const validateCurrentStep = () => {
    setErrors({});
    
    if (currentStep === 1) {
      const result = step1Schema.safeParse({ participantType: formState.participantType });
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
      if (!formState.teamName || formState.teamName.trim().length < 2) {
        teamErrors.teamName = 'Team name is required (min 2 chars)';
        hasErrors = true;
      }

      // Validate Members
      formState.teamMembers.forEach((member, index) => {
        let memberError: Record<string, string> = {};
        
        if (index === 0) {
          // Leader is always strictly validated
          const result = leaderSchema.safeParse(member);
          if (!result.success) {
            hasErrors = true;
            result.error.issues.forEach((err: any) => {
              const path = err.path[0] as string;
              memberError[path] = err.message;
            });
          }
        } else if (index === 1) {
          // Member 2 is optional — only validate if they have any meaningful data
          const hasMeaningfulData = !!(member.fullName?.trim() || member.email?.trim() || member.institution?.trim());
          if (hasMeaningfulData) {
            const result = additionalMemberSchema.safeParse(member);
            if (!result.success) {
              hasErrors = true;
              result.error.issues.forEach((err: any) => {
                const path = err.path[0] as string;
                memberError[path] = err.message;
              });
            }
          }
          // If no meaningful data, skip — it's optional
        } else {
          // Members 3+ are required if added
          const result = additionalMemberSchema.safeParse(member);
          if (!result.success) {
            hasErrors = true;
            result.error.issues.forEach((err: any) => {
              const path = err.path[0] as string;
              memberError[path] = err.message;
            });
          }
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
      if (formState.participantType === 'student') {
        const result = studentIdeaSchema.safeParse(formState.studentIdeaDetails);
        if (!result.success) {
          const formattedErrors: Record<string, string> = {};
          result.error.issues.forEach((err: any) => {
            const path = err.path[0] as string;
            formattedErrors[path] = err.message;
          });
          setErrors(formattedErrors);
          return false;
        }
      } else if (formState.participantType === 'startup') {
        const result = startupDetailsSchema.safeParse(formState.startupDetails);
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
      const result = step4Schema.safeParse({ eurekaSelfConfirmed: formState.eurekaSelfConfirmed });
      if (!result.success) {
        setErrors({ _general: result.error.issues[0].message });
        return false;
      }
    } else if (currentStep === 5) {
      const result = step5Schema.safeParse({ 
        eurekaRegistrationId: formState.eurekaRegistrationId,
        proofUploaded: formState.proofUploaded,
        proofUrl: formState.proofUrl
      });
      if (!result.success) {
        const formattedErrors: Record<string, string> = {};
        result.error.issues.forEach((err: any) => {
          const path = err.path[0] as string;
          formattedErrors[path] = err.message;
        });
        setErrors(formattedErrors);
        return false;
      }
    } else if (currentStep === 6) {
      const result = step6Schema.safeParse({ finalDeclaration: formState.finalDeclaration });
      if (!result.success) {
        setErrors({ _general: result.error.issues[0].message });
        return false;
      }
    }
    
    return true;
  };

  const handleNext = async () => {
    if (validateCurrentStep()) {
      if (currentStep < TOTAL_STEPS) {
        // Only call the backend to create/save a draft when transitioning
        // from Step 4 → Step 5 (all form data is complete at that point).
        // Steps 1–4 remain purely client-side via Zustand/localStorage.
        if (currentStep === 4) {
          setIsSaving(true);
          try {
            if (!formState.draftToken || !formState.registrationId) {
              const result = await createRegistrationDraft(formState);
              if (result) {
                formState.setDraftToken(result.draftToken);
                formState.setRegistrationId(result.registrationId);
              }
            } else {
              await saveRegistrationDraft(formState.registrationId, formState.draftToken, formState);
            }
          } catch (error: any) {
            console.warn('Draft save failed, continuing locally:', error.message);
            // Don't block navigation — Zustand/localStorage still has the data
          } finally {
            setIsSaving(false);
          }
        }

        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setErrors({});
      } else {
        // Final Submission (Step 6)
        if (!formState.registrationId || !formState.draftToken) {
          setErrors({ _general: 'Session expired. Please try refreshing.' });
          return;
        }

        setIsSaving(true);
        formState.setSubmissionStatus('submitting');
        
        try {
          // IMPORTANT: Save the very final state (including Eureka ID from Step 5) before submitting
          await saveRegistrationDraft(formState.registrationId, formState.draftToken, formState);
          
          const result = await submitRegistration(formState.registrationId, formState.draftToken);
          if (result && result.success) {
            formState.setSubmissionStatus('success');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } catch (error: any) {
          console.error('Submission failed:', error);
          setErrors({ _general: error.message || 'Your registration could not be submitted right now. Your saved information has not been lost. Please try again.' });
          formState.setSubmissionStatus('error');
        } finally {
          setIsSaving(false);
        }
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
        return <StepProof errors={errors} />;
      case 6:
        return <StepReview onEditStep={(step) => {
          setCurrentStep(step);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} />;
      default:
        return <StepParticipantType errors={errors} />;
    }
  };

  if (!isMounted) return null;

  if (formState.submissionStatus === 'success') {
    return <StepSuccess />;
  }

  const canProceed = 
    currentStep === 4 ? formState.eurekaSelfConfirmed : 
    currentStep === 5 ? formState.proofUploaded : 
    currentStep === 6 ? formState.finalDeclaration : true;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-8 md:pb-12 pt-2 md:pt-4">
      <div className="text-center mb-12 flex flex-col items-center">
        {/* Compact Branding Header */}
        <div className="inline-flex items-center justify-center gap-4 mb-6 py-2 px-6 rounded-full bg-surface-secondary/80 border border-white/10 backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white font-poppins">ECell <span className="text-[#FF1744]">MET</span></span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-600"></div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-inter">Presents</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight font-poppins drop-shadow-xl">
          EUREKA <span className="text-gradient">REGISTRATION</span>
        </h1>
        <p className="text-text-muted max-w-2xl mx-auto text-base md:text-lg font-inter">
          Complete the registration below to pitch your startup or idea at the flagship entrepreneurship event.
        </p>
      </div>

      <FormProgress currentStep={currentStep} />
      
      <div className="min-h-100 flex flex-col justify-between">
        <div className="w-full relative">
          {isSaving && (
            <div className="absolute inset-0 bg-[#121212]/50 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF1744]"></div>
            </div>
          )}
          {renderStep()}
        </div>
        
        {errors._general && (
          <div className="max-w-2xl mx-auto w-full mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
            {errors._general}
          </div>
        )}

        <FormNavigation 
          currentStep={currentStep} 
          totalSteps={TOTAL_STEPS} 
          onNext={handleNext} 
          onBack={handleBack}
          canProceed={canProceed} 
        />
      </div>
    </div>
  );
}
