import { z } from 'zod';

export const immediateRegistrationSchema = z.object({
  participantType: z.enum(['student', 'startup'], {
    message: 'Please select a participant type',
  }),
  teamName: z.string().min(2, 'Team name must be at least 2 characters'),
  leadName: z.string().min(2, 'Leader name must be at least 2 characters'),
  leadEmail: z.string().email('Please enter a valid email address'),
  leadPhone: z.string().regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number'),
  leadAltPhone: z.string().regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number').optional().or(z.literal('')),
  leadCollege: z.string().min(2, 'College name is required'),
  leadBranch: z.string().min(2, 'Branch/Course is required'),
  leadYear: z.string().min(1, 'Year of study is required'),
  membersNames: z.string().optional(),
  ideaCategory: z.string().min(2, 'Please select a category'),
  ideaStage: z.string().min(2, 'Please select a stage'),
});

export type ImmediateRegistrationFormValues = z.infer<typeof immediateRegistrationSchema>;
