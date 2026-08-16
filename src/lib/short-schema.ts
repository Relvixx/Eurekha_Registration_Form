import { z } from 'zod';

export const immediateRegistrationSchema = z.object({
  participantType: z.enum(['student', 'startup'], {
    message: 'Please tell us if you are applying as a student or a startup',
  }),
  teamName: z.string().min(2, 'Every great team needs a name! Please enter yours.'),
  leadName: z.string().min(2, 'Please provide the name of the team leader.'),
  leadEmail: z.string().email('Please provide a valid email address so we can reach you.'),
  leadPhone: z.string().regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number.'),
  leadAltPhone: z.string().regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number.').optional().or(z.literal('')),
  leadCollege: z.string().min(2, 'Please let us know your college or institution name.'),
  leadBranch: z.string().min(2, 'Please let us know your branch or course of study.'),
  leadYear: z.string().min(1, 'Please select your current year of study.'),
  membersNames: z.string().optional(),
  ideaCategory: z.string().min(2, 'Please choose the category that best fits your idea.'),
  customIdeaCategory: z.string().optional(),
  ideaStage: z.string().min(2, 'Please let us know what stage your idea is currently at.'),
}).refine(data => {
  if (data.ideaCategory === 'Other' && (!data.customIdeaCategory || data.customIdeaCategory.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: 'Please specify your custom category',
  path: ['customIdeaCategory']
});

export type ImmediateRegistrationFormValues = z.infer<typeof immediateRegistrationSchema>;
