import React from 'react';
import { TeamMember } from '@/types/eureka';
import { Trash2 } from 'lucide-react';

interface Props {
  member: TeamMember;
  index: number;
  errors: Record<string, string>;
  onChange: (id: string, updates: Partial<TeamMember>) => void;
  onRemove?: (id: string) => void;
}

const ROLES = [
  'Team Leader', // Only for leader
  'Founder',
  'Co-Founder',
  'Developer / Technical',
  'Design',
  'Marketing',
  'Business',
  'Research',
  'Operations',
  'Other',
];

export default function TeamMemberCard({ member, index, errors, onChange, onRemove }: Props) {
  const isLeader = member.isLeader;
  const memberLabel = isLeader ? 'Team Leader' : `Team Member ${index + 1}`;
  
  // Filter roles based on whether it's the leader or not
  const availableRoles = ROLES.filter(r => isLeader ? r === 'Team Leader' : r !== 'Team Leader');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange(member.id, { [name]: value });
  };

  return (
    <div className="glass-panel p-6 rounded-xl border border-white/10 bg-black/20 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">
          {memberLabel}
          {isLeader && <span className="ml-2 text-xs bg-[#FF1744]/20 text-[#FF1744] px-2 py-1 rounded-full border border-[#FF1744]/30">Required</span>}
          {!isLeader && index === 1 && <span className="ml-2 text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full border border-gray-500/30">Optional</span>}
        </h3>
        
        {!isLeader && onRemove && (
          <button 
            onClick={() => onRemove(member.id)}
            className="text-gray-400 hover:text-[#FF1744] transition-colors p-2 rounded-lg hover:bg-[#FF1744]/10"
            aria-label={`Remove ${memberLabel}`}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={member.fullName}
            onChange={handleChange}
            className={`glass-input p-3 w-full border ${errors.fullName ? 'border-[#FF1744]' : 'border-white/10'}`}
          />
          {errors.fullName && <p className="text-[#FF1744] text-xs mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={member.email}
            onChange={handleChange}
            className={`glass-input p-3 w-full border ${errors.email ? 'border-[#FF1744]' : 'border-white/10'}`}
          />
          {errors.email && <p className="text-[#FF1744] text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <input
            type="tel"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={member.mobileNumber}
            onChange={handleChange}
            className={`glass-input p-3 w-full border ${errors.mobileNumber ? 'border-[#FF1744]' : 'border-white/10'}`}
          />
          {errors.mobileNumber && <p className="text-[#FF1744] text-xs mt-1">{errors.mobileNumber}</p>}
        </div>

        <div>
          <input
            type="text"
            name="institution"
            placeholder="College / Institution"
            value={member.institution}
            onChange={handleChange}
            className={`glass-input p-3 w-full border ${errors.institution ? 'border-[#FF1744]' : 'border-white/10'}`}
          />
          {errors.institution && <p className="text-[#FF1744] text-xs mt-1">{errors.institution}</p>}
        </div>

        <div>
          <select
            name="role"
            value={member.role}
            onChange={handleChange}
            disabled={isLeader}
            className={`glass-input p-3 w-full border text-white bg-black/40 ${errors.role ? 'border-[#FF1744]' : 'border-white/10'} ${isLeader ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <option value="" disabled>Select Role</option>
            {availableRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          {errors.role && <p className="text-[#FF1744] text-xs mt-1">{errors.role}</p>}
        </div>

        {member.role === 'Other' && (
          <div className="md:col-span-1">
            <input
              type="text"
              name="customRole"
              placeholder="Specify Custom Role"
              value={member.customRole || ''}
              onChange={handleChange}
              className={`glass-input p-3 w-full border ${errors.customRole ? 'border-[#FF1744]' : 'border-white/10'}`}
            />
            {errors.customRole && <p className="text-[#FF1744] text-xs mt-1">{errors.customRole}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
