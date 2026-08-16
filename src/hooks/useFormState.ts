import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { FormState, ParticipantType, TeamMember, StudentIdeaDetails, StartupDetails } from '@/types/eureka';

const initialLeader: TeamMember = {
  id: uuidv4(),
  fullName: '',
  email: '',
  mobileNumber: '',
  institution: '',
  role: 'Team Leader',
  isLeader: true,
};

const initialStudentDetails: StudentIdeaDetails = {
  ideaName: '',
  problemStatement: '',
  proposedSolution: '',
  category: '',
  customCategory: '',
  currentStage: '',
  shortDescription: '',
  websiteUrl: '',
  pitchDeckUploaded: false,
  pitchDeckPath: '',
  pitchDeckFileName: '',
};

const initialStartupDetails: StartupDetails = {
  startupName: '',
  problemStatement: '',
  solution: '',
  category: '',
  customCategory: '',
  currentStage: '',
  shortDescription: '',
  websiteUrl: '',
  linkedinUrl: '',
  pitchDeckUploaded: false,
  pitchDeckPath: '',
  pitchDeckFileName: '',
};

export const useFormState = create<FormState>()(
  persist(
    (set) => ({
      participantType: null,
      teamName: '',
      teamMembers: [initialLeader],
      studentIdeaDetails: initialStudentDetails,
      startupDetails: initialStartupDetails,
      eurekaLinkClicked: false,
      eurekaSelfConfirmed: false,
      eurekaRegistrationId: '',
      proofUploaded: false,
      proofUrl: undefined,
      draftToken: undefined,
      registrationId: undefined,
      
      finalDeclaration: false,
      submissionStatus: 'idle',
      submissionError: undefined,

      setParticipantType: (type: ParticipantType) => 
        set((state) => {
          // If the type changes, we clear out the old specific data.
          // This prevents stale data leaking into the final submission.
          if (state.participantType !== type) {
            if (type === 'student') {
              return { participantType: type, startupDetails: initialStartupDetails };
            }
            if (type === 'startup') {
              return { participantType: type, studentIdeaDetails: initialStudentDetails };
            }
          }
          return { participantType: type };
        }),
      
      updateTeamName: (name: string) => set({ teamName: name }),
      
      addTeamMember: (member: TeamMember) => 
        set((state) => ({ teamMembers: [...state.teamMembers, member] })),
        
      updateTeamMember: (id: string, updates: Partial<TeamMember>) =>
        set((state) => ({
          teamMembers: state.teamMembers.map((member) =>
            member.id === id ? { ...member, ...updates } : member
          ),
        })),
        
      removeTeamMember: (id: string) =>
        set((state) => ({
          teamMembers: state.teamMembers.filter(
            (member) => member.id !== id || member.isLeader
          ),
        })),
        
      updateStudentIdeaDetails: (updates: Partial<StudentIdeaDetails>) =>
        set((state) => ({
          studentIdeaDetails: { ...state.studentIdeaDetails, ...updates },
        })),

      updateStartupDetails: (updates: Partial<StartupDetails>) =>
        set((state) => ({
          startupDetails: { ...state.startupDetails, ...updates },
        })),

      setEurekaLinkClicked: (clicked: boolean) => set({ eurekaLinkClicked: clicked }),
      setEurekaSelfConfirmed: (confirmed: boolean) => set({ eurekaSelfConfirmed: confirmed }),
      setEurekaRegistrationId: (id: string) => set({ eurekaRegistrationId: id }),
      setProofUploaded: (uploaded: boolean) => set({ proofUploaded: uploaded }),
      setProofUrl: (url: string) => set({ proofUrl: url }),
      setDraftToken: (token: string) => set({ draftToken: token }),
      setRegistrationId: (id: string) => set({ registrationId: id }),
      setFinalDeclaration: (value: boolean) => set({ finalDeclaration: value }),
      setSubmissionStatus: (status: 'idle' | 'submitting' | 'success' | 'error') => set({ submissionStatus: status }),
      setSubmissionError: (error: string) => set({ submissionError: error }),
      resetForm: () => 
        set({
          participantType: null,
          teamName: '',
          teamMembers: [{ ...initialLeader, id: uuidv4() }], // Generate a new ID for the new session
          studentIdeaDetails: initialStudentDetails,
          startupDetails: initialStartupDetails,
          eurekaLinkClicked: false,
          eurekaSelfConfirmed: false,
          eurekaRegistrationId: '',
          proofUploaded: false,
          proofUrl: undefined,
          draftToken: undefined,
          registrationId: undefined,
          finalDeclaration: false,
          submissionStatus: 'idle',
          submissionError: undefined,
        }),
    }),
    {
      name: 'eureka-form-draft', // unique name for localStorage
      storage: createJSONStorage(() => localStorage), 
      skipHydration: true, // We will manually hydrate to prevent UI mismatch errors
    }
  )
);
