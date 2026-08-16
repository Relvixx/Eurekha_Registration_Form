import React from 'react';
import { useFormState } from '../../hooks/useFormState';
import TeamMemberCard from './TeamMemberCard';
import { v4 as uuidv4 } from 'uuid';
import { Plus } from 'lucide-react';

interface Props {
  errors?: Record<string, any>;
}

export default function StepTeamDetails({ errors = {} }: Props) {
  const teamName = useFormState((state) => state.teamName);
  const teamMembers = useFormState((state) => state.teamMembers);
  const updateTeamName = useFormState((state) => state.updateTeamName);
  const addTeamMember = useFormState((state) => state.addTeamMember);
  const updateTeamMember = useFormState((state) => state.updateTeamMember);
  const removeTeamMember = useFormState((state) => state.removeTeamMember);

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
    <div className="glass-panel p-8 md:p-10 rounded-2xl w-full animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-3xl font-black text-white mb-3 font-poppins tracking-tight">Team Details</h2>
      <p className="text-text-muted mb-10 font-inter text-lg">Enter your team and leader information.</p>
      
      {errors._general && (
        <div className="mb-8 p-4 bg-error/10 border border-error/30 rounded-xl text-error text-sm font-inter flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
          {errors._general}
        </div>
      )}

      <div className="space-y-10">
        <div>
          <label className="block text-sm font-semibold text-white mb-3 font-inter">Team Name <span className="text-primary">*</span></label>
          <input
            type="text"
            placeholder="Enter your team name"
            value={teamName}
            onChange={(e) => updateTeamName(e.target.value)}
            className={`glass-input w-full ${errors.teamName ? 'border-error shadow-[0_0_10px_rgba(255,37,58,0.1)]' : 'border-white/10'}`}
          />
          {errors.teamName && <p className="text-error text-xs mt-1.5 font-inter font-medium">{errors.teamName}</p>}
        </div>
        
        <div className="space-y-6">
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
          className="w-full py-4 rounded-xl border border-dashed border-white/20 bg-surface-secondary/30 text-gray-400 hover:text-white hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 font-inter font-medium focus-ring group"
        >
          <Plus className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" /> Add Additional Team Member
        </button>
      </div>
    </div>
  );
}
