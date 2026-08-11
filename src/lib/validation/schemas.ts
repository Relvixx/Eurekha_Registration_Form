import { z } from 'zod';

export const step1Schema = z.object({
  participantType: z.enum(['student', 'startup'], {
    message: 'Please select a participant type',
  }),
});

const baseMemberObjectSchema = z.object({
  id: z.string(),
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  mobileNumber: z.string().min(10, 'Please enter a valid mobile number').optional().or(z.literal('')),
  institution: z.string().min(2, 'Institution name is required'),
  role: z.string().min(1, 'Role is required'),
  customRole: z.string().optional(),
  isLeader: z.boolean(),
});

const validateCustomRole = (data: any) => {
  if (data.role === 'Other' && (!data.customRole || data.customRole.trim() === '')) {
    return false;
  }
  return true;
};

const customRoleRefinement = {
  message: 'Please specify your custom role',
  path: ['customRole'],
};

// Additional members must be fully valid if added
export const additionalMemberSchema = baseMemberObjectSchema.refine(
  validateCustomRole, 
  customRoleRefinement
);

// The leader is strictly validated
export const leaderSchema = baseMemberObjectSchema.extend({
  mobileNumber: z.string().min(10, 'Leader mobile number is required'),
}).refine(validateCustomRole, customRoleRefinement);

// Member 2 is optional. If completely empty, it's valid. If partially filled, it's validated.
export const optionalMemberSchema = baseMemberObjectSchema.partial().refine((data) => {
  const hasAnyField = !!(data.fullName || data.email || data.institution);
  if (!hasAnyField) return true;
  
  // If partially filled, run the full validation
  const result = additionalMemberSchema.safeParse(data);
  return result.success;
}, {
  message: 'Please complete all required fields for this member, or remove them',
});

export const step2Schema = z.object({
  teamName: z.string().min(2, 'Team name must be at least 2 characters'),
  teamMembers: z.array(z.any()).refine((members) => {
    return members.length >= 1 && members[0].isLeader;
  }, 'Invalid team structure'),
});

const urlSchema = z
  .string()
  .trim()
  .url('Please enter a valid URL (e.g. https://example.com)')
  .optional()
  .or(z.literal(''));

export const studentIdeaSchema = z.object({
  ideaName: z.string().min(2, 'Please enter your idea name'),
  problemStatement: z.string().min(10, 'Please describe the problem you are solving (min 10 chars)'),
  proposedSolution: z.string().min(10, 'Please describe your proposed solution (min 10 chars)'),
  category: z.string().min(1, 'Please select a category'),
  currentStage: z.string().min(1, 'Please select the current stage'),
  shortDescription: z.string().min(10, 'Please provide a short description (min 10 chars)'),
  websiteUrl: urlSchema,
});

export const startupDetailsSchema = z.object({
  startupName: z.string().min(2, 'Please enter your startup name'),
  problemStatement: z.string().min(10, 'Please describe the problem you are solving (min 10 chars)'),
  solution: z.string().min(10, 'Please describe your solution (min 10 chars)'),
  category: z.string().min(1, 'Please select a category'),
  currentStage: z.string().min(1, 'Please select the current stage'),
  shortDescription: z.string().min(10, 'Please provide a short description (min 10 chars)'),
  websiteUrl: urlSchema,
  linkedinUrl: urlSchema,
});

export const step4Schema = z.object({
  eurekaSelfConfirmed: z.boolean().refine(val => val === true, "Please confirm that you have completed your Eureka registration before continuing.")
});
