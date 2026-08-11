import React from 'react';
import { useWizardState } from '../../hooks/useWizardState';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function StepReview() {
  const wizardState = useWizardState();

  const handleDeclarationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    wizardState.setFinalDeclaration(e.target.checked);
  };

  return (
    <div className="glass-panel p-8 md:p-10 rounded-2xl w-full animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-3xl font-black text-white mb-3 font-poppins tracking-tight">Review & Submit</h2>
      <p className="text-[#888888] mb-10 font-inter text-lg">Please review all information before final submission.</p>
      
      <div className="space-y-6">
        {/* Participant Type */}
        <div className="bg-[#000000] rounded-xl p-6 border border-white/5 shadow-inner">
          <h3 className="text-white font-bold mb-4 font-inter">Registration Type</h3>
          <p className="text-[#888888] text-sm capitalize font-inter">{wizardState.participantType}</p>
        </div>
        
        {/* Team Details */}
        <div className="bg-[#000000] rounded-xl p-6 border border-white/5 shadow-inner">
          <h3 className="text-white font-bold mb-4 font-inter">Team Details</h3>
          <div className="space-y-3 font-inter">
            <p className="text-white text-sm"><span className="text-[#888888] mr-2">Team Name:</span> {wizardState.teamName}</p>
            <div className="border-t border-white/5 pt-4 mt-4">
              <h4 className="text-sm font-semibold text-[#888888] mb-3">Members:</h4>
              <ul className="space-y-2">
                {wizardState.teamMembers.map((member, idx) => (
                  <li key={member.id} className="text-sm text-white">
                    <span>{member.fullName}</span> 
                    <span className="text-[#1A6FF5] ml-2 text-xs font-semibold">({member.isLeader ? 'Leader' : member.role})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="bg-[#000000] rounded-xl p-6 border border-white/5 shadow-inner">
          <h3 className="text-white font-bold mb-4 font-inter">Project Details</h3>
          <div className="space-y-3 font-inter">
            {wizardState.participantType === 'student' ? (
              <>
                <p className="text-white text-sm"><span className="text-[#888888] mr-2">Idea Name:</span> {wizardState.studentIdeaDetails.ideaName}</p>
                <p className="text-white text-sm"><span className="text-[#888888] mr-2">Category:</span> {wizardState.studentIdeaDetails.category}</p>
                <p className="text-white text-sm"><span className="text-[#888888] mr-2">Stage:</span> {wizardState.studentIdeaDetails.currentStage}</p>
                {wizardState.studentIdeaDetails.pitchDeckUploaded && wizardState.studentIdeaDetails.pitchDeckFileName && (
                  <p className="text-white text-sm"><span className="text-[#888888] mr-2">Pitch Deck:</span> {wizardState.studentIdeaDetails.pitchDeckFileName}</p>
                )}
              </>
            ) : (
              <>
                <p className="text-white text-sm"><span className="text-[#888888] mr-2">Startup Name:</span> {wizardState.startupDetails.startupName}</p>
                <p className="text-white text-sm"><span className="text-[#888888] mr-2">Category:</span> {wizardState.startupDetails.category}</p>
                <p className="text-white text-sm"><span className="text-[#888888] mr-2">Stage:</span> {wizardState.startupDetails.currentStage}</p>
                {wizardState.startupDetails.pitchDeckUploaded && wizardState.startupDetails.pitchDeckFileName && (
                  <p className="text-white text-sm"><span className="text-[#888888] mr-2">Pitch Deck:</span> {wizardState.startupDetails.pitchDeckFileName}</p>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Eureka Registration */}
        <div className="bg-[#000000] rounded-xl p-6 border border-white/5 shadow-inner">
          <h3 className="text-white font-bold mb-4 font-inter">Eureka Registration Proof</h3>
          <div className="space-y-3 font-inter">
            <p className="text-white text-sm"><span className="text-[#888888] mr-2">Eureka ID:</span> {wizardState.eurekaRegistrationId}</p>
            <p className="text-white text-sm flex items-center gap-2">
              <span className="text-[#888888]">Proof Uploaded:</span> 
              {wizardState.proofUploaded ? (
                <span className="text-[#00E5FF] flex items-center gap-1 font-semibold"><CheckCircle2 size={16} /> Yes</span>
              ) : (
                <span className="text-[#FF253A] flex items-center gap-1 font-semibold"><XCircle size={16} /> No</span>
              )}
            </p>
          </div>
        </div>
        
        {/* Final Declaration */}
        <div className="flex items-start gap-4 mt-10 p-5 bg-[#1A6FF5]/5 border border-[#1A6FF5]/30 rounded-2xl">
          <input 
            type="checkbox" 
            id="final-declaration" 
            checked={wizardState.finalDeclaration}
            onChange={handleDeclarationChange}
            className="mt-1 w-5 h-5 rounded border-white/20 text-[#1A6FF5] focus:ring-[#1A6FF5] bg-black/50 cursor-pointer accent-[#1A6FF5]" 
          />
          <label htmlFor="final-declaration" className="text-sm text-[#888888] cursor-pointer select-none font-inter leading-relaxed">
            I hereby declare that all the information provided is true to the best of my knowledge. I understand that any false information may lead to disqualification. I confirm that the uploaded proof belongs to this registration and that this information will be used for Eureka and NEC registration processing.
          </label>
        </div>
      </div>
    </div>
  );
}
