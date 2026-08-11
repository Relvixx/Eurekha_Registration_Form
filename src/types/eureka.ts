export type ParticipantType = 'student' | 'startup' | null;

export interface TeamMember {
  id: string; // local unique identifier
  fullName: string;
  email: string;
  mobileNumber: string;
  institution: string;
  role: string;
  customRole?: string;
  isLeader: boolean;
}

export interface StudentIdeaDetails {
  ideaName: string;
  problemStatement: string;
  proposedSolution: string;
  category: string;
  currentStage: string;
  shortDescription: string;
  websiteUrl?: string;
  pitchDeckUploaded?: boolean;
  pitchDeckPath?: string;
  pitchDeckFileName?: string;
}

export interface StartupDetails {
  startupName: string;
  problemStatement: string;
  solution: string;
  category: string;
  currentStage: string;
  shortDescription: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  pitchDeckUploaded?: boolean;
  pitchDeckPath?: string;
  pitchDeckFileName?: string;
}

export interface WizardState {
  // Step 1
  participantType: ParticipantType;
  
  // Step 2
  teamName: string;
  teamMembers: TeamMember[];

  // Step 3
  studentIdeaDetails: StudentIdeaDetails;
  startupDetails: StartupDetails;

  // Step 4
  eurekaLinkClicked: boolean;
  eurekaSelfConfirmed: boolean;

  // Step 5 (Proof)
  eurekaRegistrationId: string;
  proofUploaded: boolean;
  proofUrl?: string;

  // Backend state
  draftToken?: string;
  registrationId?: string;

  // Step 6 (Review & Submit)
  finalDeclaration: boolean;
  submissionStatus: 'idle' | 'submitting' | 'success' | 'error';
  referenceCode?: string;
  submissionError?: string;

  // Actions
  setParticipantType: (type: ParticipantType) => void;
  updateTeamName: (name: string) => void;
  addTeamMember: (member: TeamMember) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  removeTeamMember: (id: string) => void;
  updateStudentIdeaDetails: (updates: Partial<StudentIdeaDetails>) => void;
  updateStartupDetails: (updates: Partial<StartupDetails>) => void;
  setEurekaLinkClicked: (clicked: boolean) => void;
  setEurekaSelfConfirmed: (confirmed: boolean) => void;
  setEurekaRegistrationId: (id: string) => void;
  setProofUploaded: (uploaded: boolean) => void;
  setProofUrl: (url: string) => void;
  setDraftToken: (token: string) => void;
  setRegistrationId: (id: string) => void;
  setFinalDeclaration: (value: boolean) => void;
  setSubmissionStatus: (status: 'idle' | 'submitting' | 'success' | 'error') => void;
  setReferenceCode: (code: string) => void;
  setSubmissionError: (error: string) => void;
  resetWizard: () => void;
}
