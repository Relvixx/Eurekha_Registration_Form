import React from 'react';
import { useWizardState } from '../../hooks/useWizardState';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function StepReview() {
  const wizardState = useWizardState();

  const handleDeclarationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    wizardState.setFinalDeclaration(e.target.checked);
  };

  return (
    <div className="glass-panel p-6 md:p-8 rounded-2xl w-full animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-2xl font-bold text-white mb-2">Review & Submit</h2>
      <p className="text-gray-400 mb-8">Please review all information before final submission.</p>
      
      <div className="space-y-6">
        {/* Participant Type */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5 relative">
          <h3 className="text-white font-bold mb-4">Registration Type</h3>
          <p className="text-gray-400 text-sm capitalize">{wizardState.participantType}</p>
        </div>
        
        {/* Team Details */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5 relative">
          <h3 className="text-white font-bold mb-4">Team Details</h3>
          <div className="space-y-3">
            <p className="text-gray-300 text-sm"><span className="text-gray-500 mr-2">Team Name:</span> {wizardState.teamName}</p>
            <div className="border-t border-white/5 pt-3 mt-3">
              <h4 className="text-sm font-semibold text-gray-400 mb-2">Members:</h4>
              <ul className="space-y-2">
                {wizardState.teamMembers.map((member, idx) => (
                  <li key={member.id} className="text-sm text-gray-300">
                    <span className="text-white">{member.fullName}</span> 
                    <span className="text-gray-500 ml-2">({member.isLeader ? 'Leader' : member.role})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5 relative">
          <h3 className="text-white font-bold mb-4">Project Details</h3>
          <div className="space-y-3">
            {wizardState.participantType === 'student' ? (
              <>
                <p className="text-gray-300 text-sm"><span className="text-gray-500 mr-2">Idea Name:</span> {wizardState.studentIdeaDetails.ideaName}</p>
                <p className="text-gray-300 text-sm"><span className="text-gray-500 mr-2">Category:</span> {wizardState.studentIdeaDetails.category}</p>
                <p className="text-gray-300 text-sm"><span className="text-gray-500 mr-2">Stage:</span> {wizardState.studentIdeaDetails.currentStage}</p>
              </>
            ) : (
              <>
                <p className="text-gray-300 text-sm"><span className="text-gray-500 mr-2">Startup Name:</span> {wizardState.startupDetails.startupName}</p>
                <p className="text-gray-300 text-sm"><span className="text-gray-500 mr-2">Category:</span> {wizardState.startupDetails.category}</p>
                <p className="text-gray-300 text-sm"><span className="text-gray-500 mr-2">Stage:</span> {wizardState.startupDetails.currentStage}</p>
              </>
            )}
          </div>
        </div>
        
        {/* Eureka Registration */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5 relative">
          <h3 className="text-white font-bold mb-4">Eureka Registration Proof</h3>
          <div className="space-y-3">
            <p className="text-gray-300 text-sm"><span className="text-gray-500 mr-2">Eureka ID:</span> {wizardState.eurekaRegistrationId}</p>
            <p className="text-gray-300 text-sm flex items-center gap-2">
              <span className="text-gray-500">Proof Uploaded:</span> 
              {wizardState.proofUploaded ? (
                <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={16} /> Yes</span>
              ) : (
                <span className="text-red-400 flex items-center gap-1"><XCircle size={16} /> No</span>
              )}
            </p>
          </div>
        </div>
        
        {/* Final Declaration */}
        <div className="flex items-start gap-3 mt-8 p-4 bg-[#FF1744]/10 border border-[#FF1744]/20 rounded-xl">
          <input 
            type="checkbox" 
            id="final-declaration" 
            checked={wizardState.finalDeclaration}
            onChange={handleDeclarationChange}
            className="mt-1 w-5 h-5 rounded border-gray-600 text-[#FF1744] focus:ring-[#FF1744] bg-white/5 cursor-pointer" 
          />
          <label htmlFor="final-declaration" className="text-sm text-gray-300 cursor-pointer select-none">
            I hereby declare that all the information provided is true to the best of my knowledge. I understand that any false information may lead to disqualification. I confirm that the uploaded proof belongs to this registration and that this information will be used for Eureka and NEC registration processing.
          </label>
        </div>
      </div>
    </div>
  );
}
