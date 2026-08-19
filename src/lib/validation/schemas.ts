import { z } from 'zod';

export const step1Schema = z.object({
  participantType: z.enum(['student', 'startup'], {
    message: 'Please tell us if you are applying as a student or a startup',
  }),
});

const baseMemberObjectSchema = z.object({
  id: z.string(),
  fullName: z.string().min(2, 'Please tell us your full name'),
  email: z.string().email('Please provide a valid email address so we can reach you'),
  mobileNumber: z.string().min(10, 'Please provide a valid 10-digit mobile number').optional().or(z.literal('')),
  institution: z.string().min(2, 'Please let us know your institution or college name'),
  role: z.string().min(1, 'Please select your role in the team'),
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
  message: 'Please tell us what your custom role is',
  path: ['customRole'],
};

// Additional members must be fully valid if added
export const additionalMemberSchema = baseMemberObjectSchema.refine(
  validateCustomRole, 
  customRoleRefinement
);

// The leader is strictly validated
export const leaderSchema = baseMemberObjectSchema.extend({
  mobileNumber: z.string().min(10, 'The team leader\'s mobile number is required so we can contact you'),
}).refine(validateCustomRole, customRoleRefinement);

// Member 2 is optional. If completely empty, it's valid. If partially filled, it's validated.
export const optionalMemberSchema = baseMemberObjectSchema.partial().refine((data) => {
  const hasAnyField = !!(data.fullName || data.email || data.institution);
  if (!hasAnyField) return true;
  
  // If partially filled, run the full validation
  const result = additionalMemberSchema.safeParse(data);
  return result.success;
}, {
  message: 'It looks like some details are missing for this team member. Please fill them out or remove the member if not needed.',
});

export const step2Schema = z.object({
  teamName: z.string().min(2, 'Every great team needs a name! Please enter yours.'),
  teamMembers: z.array(z.any()).refine((members) => {
    return members.length >= 1 && members[0].isLeader;
  }, 'Your team must have at least one member assigned as the Team Leader.'),
});

const urlSchema = z
  .string()
  .trim()
  .url('Please provide a valid website link, making sure it starts with http:// or https://')
  .optional()
  .or(z.literal(''));

export const studentIdeaSchema = z.object({
  ideaName: z.string().min(2, 'What is the name of your brilliant idea?'),
  problemStatement: z.string().min(10, 'Please tell us a bit more about the problem you are solving'),
  proposedSolution: z.string().min(10, 'We\'d love to hear more about your proposed solution'),
  category: z.string().min(1, 'Please choose the category that best fits your idea'),
  customCategory: z.string().optional(),
  currentStage: z.string().min(1, 'Please let us know what stage your idea is currently at'),
  shortDescription: z.string().min(10, 'Please give us a brief description of your idea'),
  websiteUrl: urlSchema,
  pitchDeckUploaded: z.boolean().optional(),
}).refine(data => {
  if (data.category === 'Other' && (!data.customCategory || data.customCategory.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: 'Please specify your custom category',
  path: ['customCategory']
}).refine(data => {
  const hasWebsite = !!data.websiteUrl && data.websiteUrl.trim() !== '';
  const hasPitchDeck = data.pitchDeckUploaded === true;
  return hasWebsite || hasPitchDeck;
}, {
  message: 'Important for tomorrow\'s pitch: You must either provide a Website/Prototype Link OR upload a Pitch Deck.',
  path: ['websiteUrl'] // Highlight website field as the anchor for the error
});

export const startupDetailsSchema = z.object({
  startupName: z.string().min(2, 'What is the name of your startup?'),
  problemStatement: z.string().min(10, 'Please tell us a bit more about the problem your startup is solving'),
  solution: z.string().min(10, 'We\'d love to hear more about your startup\'s solution'),
  category: z.string().min(1, 'Please choose the category that best fits your startup'),
  customCategory: z.string().optional(),
  currentStage: z.string().min(1, 'Please let us know what stage your startup is currently at'),
  shortDescription: z.string().min(10, 'Please give us a brief description of your startup'),
  websiteUrl: urlSchema,
  linkedinUrl: urlSchema,
  pitchDeckUploaded: z.boolean().optional(),
}).refine(data => {
  if (data.category === 'Other' && (!data.customCategory || data.customCategory.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: 'Please specify your custom category',
  path: ['customCategory']
}).refine(data => {
  const hasWebsite = !!data.websiteUrl && data.websiteUrl.trim() !== '';
  const hasPitchDeck = data.pitchDeckUploaded === true;
  return hasWebsite || hasPitchDeck;
}, {
  message: 'Important for tomorrow\'s pitch: You must either provide a Website/Prototype Link OR upload a Pitch Deck.',
  path: ['websiteUrl'] // Highlight website field as the anchor for the error
});

export const step4Schema = z.object({
  eurekaSelfConfirmed: z.boolean().refine(val => val === true, "Please check the box to confirm you have completed the Eureka registration on the main website.")
});

export const step5Schema = z.object({
  eurekaRegistrationId: z.string().min(3, "We need your Eureka Registration ID to verify your entry."),
  proofUploaded: z.boolean().refine(val => val === true, "Please upload a screenshot or document proving your Eureka registration."),
  proofUrl: z.string().min(1, "Please wait for the proof document to finish uploading.").optional().or(z.literal(''))
});

export const step6Schema = z.object({
  finalDeclaration: z.boolean().refine(val => val === true, "Please agree to the final declaration to complete your registration.")
});

