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
    <div className="p-6 md:p-8 rounded-2xl border border-white/5 bg-text-dark relative group transition-all hover:border-white/10 hover:shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white font-poppins">
          {memberLabel}
          {isLeader && <span className="ml-3 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 font-inter font-medium tracking-wide">Required</span>}
          {!isLeader && index === 1 && <span className="ml-3 text-xs bg-surface-secondary text-text-muted px-3 py-1 rounded-full border border-white/5 font-inter font-medium tracking-wide">Optional</span>}
        </h3>
        
        {!isLeader && onRemove && (
          <button 
            onClick={() => onRemove(member.id)}
            className="text-text-muted hover:text-error transition-colors p-2 rounded-lg hover:bg-error/10 focus-ring"
            aria-label={`Remove ${memberLabel}`}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={member.fullName}
            onChange={handleChange}
            className={`glass-input w-full ${errors.fullName ? 'border-error shadow-[0_0_10px_rgba(255,37,58,0.1)]' : 'border-white/10'}`}
          />
          {errors.fullName && <p className="text-error text-xs mt-1.5 font-inter font-medium">{errors.fullName}</p>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={member.email}
            onChange={handleChange}
            className={`glass-input w-full ${errors.email ? 'border-error shadow-[0_0_10px_rgba(255,37,58,0.1)]' : 'border-white/10'}`}
          />
          {errors.email && <p className="text-error text-xs mt-1.5 font-inter font-medium">{errors.email}</p>}
        </div>

        <div>
          <input
            type="tel"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={member.mobileNumber}
            onChange={handleChange}
            className={`glass-input w-full ${errors.mobileNumber ? 'border-error shadow-[0_0_10px_rgba(255,37,58,0.1)]' : 'border-white/10'}`}
          />
          {errors.mobileNumber && <p className="text-error text-xs mt-1.5 font-inter font-medium">{errors.mobileNumber}</p>}
        </div>

        <div>
          <input
            type="text"
            name="institution"
            placeholder="College / Institution"
            value={member.institution}
            onChange={handleChange}
            className={`glass-input w-full ${errors.institution ? 'border-error shadow-[0_0_10px_rgba(255,37,58,0.1)]' : 'border-white/10'}`}
          />
          {errors.institution && <p className="text-error text-xs mt-1.5 font-inter font-medium">{errors.institution}</p>}
        </div>

        <div>
          <select
            name="role"
            value={member.role}
            onChange={handleChange}
            disabled={isLeader}
            className={`glass-input w-full appearance-none bg-no-repeat ${errors.role ? 'border-error shadow-[0_0_10px_rgba(255,37,58,0.1)]' : 'border-white/10'} ${isLeader ? 'opacity-70 cursor-not-allowed' : ''}`}
            style={{
              backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%23888888%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")',
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px 16px'
            }}
          >
            <option value="" disabled>Select Role</option>
            {availableRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          {errors.role && <p className="text-error text-xs mt-1.5 font-inter font-medium">{errors.role}</p>}
        </div>

        {member.role === 'Other' && (
          <div className="md:col-span-1">
            <input
              type="text"
              name="customRole"
              placeholder="Specify Custom Role"
              value={member.customRole || ''}
              onChange={handleChange}
              className={`glass-input w-full ${errors.customRole ? 'border-error shadow-[0_0_10px_rgba(255,37,58,0.1)]' : 'border-white/10'}`}
            />
            {errors.customRole && <p className="text-error text-xs mt-1.5 font-inter font-medium">{errors.customRole}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
