import React from 'react';
import { useWizardState } from '../../hooks/useWizardState';
import TeamMemberCard from './TeamMemberCard';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  errors?: Record<string, any>;
}

export default function StepTeamDetails({ errors = {} }: Props) {
  const teamName = useWizardState((state) => state.teamName);
  const teamMembers = useWizardState((state) => state.teamMembers);
  const updateTeamName = useWizardState((state) => state.updateTeamName);
  const addTeamMember = useWizardState((state) => state.addTeamMember);
  const updateTeamMember = useWizardState((state) => state.updateTeamMember);
  const removeTeamMember = useWizardState((state) => state.removeTeamMember);

  const handleAddMember = () => {
    addTeamMember({
      id: uuidv4(),
      fullName: '',
      email: '',
      mobileNumber: '',
      institution: '',
      role: '',
      isLeader: false,
    });
  };

  // Ensure there are at least two slots (Leader and optional Member 2)
  // If the user hasn't added a second member yet, we can either automatically
  // add one in the store, or just rely on the store having it.
  // The spec says "Member 2 is rendered by default. Member 2 is NOT mandatory."
  // Let's make sure the store has at least 2 members.
  React.useEffect(() => {
    if (teamMembers.length < 2) {
      addTeamMember({
        id: uuidv4(),
        fullName: '',
        email: '',
        mobileNumber: '',
        institution: '',
        role: '',
        isLeader: false,
      });
    }
  }, [teamMembers.length, addTeamMember]);

  return (
    <div className="glass-panel p-6 md:p-8 rounded-2xl w-full animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-2xl font-bold text-white mb-2">Team Details</h2>
      <p className="text-gray-400 mb-8">Enter your team and leader information.</p>
      
      {errors._general && (
        <div className="mb-6 p-4 bg-[#FF1744]/10 border border-[#FF1744]/30 rounded-xl text-[#FF1744] text-sm">
          {errors._general}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Team Name</label>
          <input
            type="text"
            placeholder="Enter your team name"
            value={teamName}
            onChange={(e) => updateTeamName(e.target.value)}
            className={`glass-input p-4 w-full border ${errors.teamName ? 'border-[#FF1744]' : 'border-white/10'}`}
          />
          {errors.teamName && <p className="text-[#FF1744] text-xs mt-1">{errors.teamName}</p>}
        </div>
        
        <div className="space-y-6 mt-8">
          {teamMembers.map((member, index) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              index={index}
              errors={errors.teamMembers?.[index] || {}}
              onChange={updateTeamMember}
              onRemove={index > 1 ? removeTeamMember : undefined}
            />
          ))}
        </div>
        
        <button 
          onClick={handleAddMember}
          className="w-full py-4 rounded-xl border border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-white/50 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
        >
          <span className="text-xl">+</span> Add Additional Team Member
        </button>
      </div>
    </div>
  );
}
