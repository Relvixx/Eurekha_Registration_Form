import React from 'react';
import { useFormState } from '../../hooks/useFormState';
import { CheckCircle2, XCircle, Edit2 } from 'lucide-react';

interface StepReviewProps {
  onEditStep?: (step: number) => void;
}

export default function StepReview({ onEditStep }: StepReviewProps) {
  const formState = useFormState();

  const handleDeclarationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formState.setFinalDeclaration(e.target.checked);
  };

  return (
    <div className="glass-panel p-8 md:p-10 rounded-2xl w-full animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-3xl font-black text-white mb-3 font-poppins tracking-tight">Review & Submit</h2>
      <p className="text-text-muted mb-10 font-inter text-lg">Please review all information before final submission.</p>
      
      <div className="space-y-6">
        {/* Participant Type */}
        <div className="bg-text-dark rounded-xl p-6 border border-white/5 shadow-inner relative group">
          {onEditStep && (
            <button onClick={() => onEditStep(1)} className="absolute top-6 right-6 text-gray-500 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs font-semibold">
              <Edit2 size={14} /> EDIT
            </button>
          )}
          <h3 className="text-white font-bold mb-4 font-inter">Registration Type</h3>
          <p className="text-text-muted text-sm capitalize font-inter">{formState.participantType}</p>
        </div>
        
        {/* Team Details */}
        <div className="bg-text-dark rounded-xl p-6 border border-white/5 shadow-inner relative group">
          {onEditStep && (
            <button onClick={() => onEditStep(2)} className="absolute top-6 right-6 text-gray-500 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs font-semibold">
              <Edit2 size={14} /> EDIT
            </button>
          )}
          <h3 className="text-white font-bold mb-4 font-inter">Team Details</h3>
          <div className="space-y-3 font-inter">
            <p className="text-white text-sm"><span className="text-text-muted mr-2">Team Name:</span> {formState.teamName}</p>
            <div className="border-t border-white/5 pt-4 mt-4">
              <h4 className="text-sm font-semibold text-text-muted mb-3">Members:</h4>
              <ul className="space-y-2">
                {formState.teamMembers.map((member, idx) => (
                  <li key={member.id} className="text-sm text-white">
                    <span>{member.fullName}</span> 
                    <span className="text-primary ml-2 text-xs font-semibold">({member.isLeader ? 'Leader' : member.role})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="bg-text-dark rounded-xl p-6 border border-white/5 shadow-inner relative group">
          {onEditStep && (
            <button onClick={() => onEditStep(3)} className="absolute top-6 right-6 text-gray-500 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs font-semibold">
              <Edit2 size={14} /> EDIT
            </button>
          )}
          <h3 className="text-white font-bold mb-4 font-inter">Project Details</h3>
          <div className="space-y-3 font-inter">
            {formState.participantType === 'student' ? (
              <>
                <p className="text-white text-sm"><span className="text-text-muted mr-2">Idea Name:</span> {formState.studentIdeaDetails.ideaName}</p>
                <p className="text-white text-sm"><span className="text-text-muted mr-2">Category:</span> {formState.studentIdeaDetails.category}</p>
                <p className="text-white text-sm"><span className="text-text-muted mr-2">Stage:</span> {formState.studentIdeaDetails.currentStage}</p>
                {formState.studentIdeaDetails.pitchDeckUploaded && formState.studentIdeaDetails.pitchDeckFileName && (
                  <p className="text-white text-sm"><span className="text-text-muted mr-2">Pitch Deck:</span> {formState.studentIdeaDetails.pitchDeckFileName}</p>
                )}
              </>
            ) : (
              <>
                <p className="text-white text-sm"><span className="text-text-muted mr-2">Startup Name:</span> {formState.startupDetails.startupName}</p>
                <p className="text-white text-sm"><span className="text-text-muted mr-2">Category:</span> {formState.startupDetails.category}</p>
                <p className="text-white text-sm"><span className="text-text-muted mr-2">Stage:</span> {formState.startupDetails.currentStage}</p>
                {formState.startupDetails.pitchDeckUploaded && formState.startupDetails.pitchDeckFileName && (
                  <p className="text-white text-sm"><span className="text-text-muted mr-2">Pitch Deck:</span> {formState.startupDetails.pitchDeckFileName}</p>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Eureka Registration */}
        <div className="bg-text-dark rounded-xl p-6 border border-white/5 shadow-inner relative group">
          {onEditStep && (
            <button onClick={() => onEditStep(5)} className="absolute top-6 right-6 text-gray-500 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs font-semibold">
              <Edit2 size={14} /> EDIT
            </button>
          )}
          <h3 className="text-white font-bold mb-4 font-inter">Eureka Registration Proof</h3>
          <div className="space-y-3 font-inter">
            <p className="text-white text-sm"><span className="text-text-muted mr-2">Eureka ID:</span> {formState.eurekaRegistrationId}</p>
            <p className="text-white text-sm flex items-center gap-2">
              <span className="text-text-muted">Proof Uploaded:</span> 
              {formState.proofUploaded ? (
                <span className="text-[#00E5FF] flex items-center gap-1 font-semibold"><CheckCircle2 size={16} /> Yes</span>
              ) : (
                <span className="text-error flex items-center gap-1 font-semibold"><XCircle size={16} /> No</span>
              )}
            </p>
          </div>
        </div>
        
        {/* Important Guidelines */}
        <div className="bg-primary/5 rounded-xl p-6 border border-primary/20 shadow-inner text-left mb-8 mt-6">
          <h3 className="text-white font-bold mb-4 font-inter flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Important Guidelines
          </h3>
          <ul className="space-y-3 font-inter text-sm text-text-muted">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>If you register for Eureka using this portal, then only you are qualified for <strong className="text-white font-medium">Eureka at IIT Bombay</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>The presentation time will be <strong className="text-white font-medium">5 mins</strong> (3 min pitching, 2 min Q&A).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>Your pitch deck must contain <strong className="text-white font-medium">at least 7 slides</strong>.</span>
            </li>
          </ul>
        </div>
        
        {/* Final Declaration */}
        <div className="flex items-start gap-4 p-5 bg-primary/5 border border-primary/30 rounded-2xl">
          <input 
            type="checkbox" 
            id="final-declaration" 
            checked={formState.finalDeclaration}
            onChange={handleDeclarationChange}
            className="mt-1 w-5 h-5 rounded border-white/20 text-primary focus:ring-primary bg-black/50 cursor-pointer accent-primary" 
          />
          <label htmlFor="final-declaration" className="text-sm text-text-muted cursor-pointer select-none font-inter leading-relaxed">
            I hereby declare that all the information provided is true to the best of my knowledge. I understand that any false information may lead to disqualification. I confirm that the uploaded proof belongs to this registration and that this information will be used for Eureka and NEC registration processing.
          </label>
        </div>
      </div>
    </div>
  );
}
