import { supabase } from './supabaseClient';
import { WizardState } from '@/types/eureka';

export async function createRegistrationDraft(state: Partial<WizardState>) {
  const { data, error } = await supabase.functions.invoke('registration', {
    body: {
      action: 'create_draft',
      data: state,
    },
  });

  if (error) {
    throw new Error(error.message || 'Failed to create registration draft');
  }

  return data; // { registrationId, draftToken }
}

export async function saveRegistrationDraft(registrationId: string, draftToken: string, state: WizardState) {
  const { data, error } = await supabase.functions.invoke('registration', {
    body: {
      action: 'save_draft',
      registrationId,
      draftToken,
      state,
    },
  });

  if (error) {
    throw new Error(error.message || 'Failed to save registration draft');
  }

  return data;
}

export async function uploadRegistrationProof(registrationId: string, draftToken: string, file: File) {
  const formData = new FormData();
  formData.append('action', 'upload_proof');
  formData.append('registrationId', registrationId);
  formData.append('draftToken', draftToken);
  formData.append('file', file);

  const { data, error } = await supabase.functions.invoke('registration', {
    body: formData,
  });

  if (error) {
    throw new Error(error.message || 'Failed to upload proof');
  }

  return data; // { success: true, path: '...' }
}

export async function submitRegistration(registrationId: string, draftToken: string) {
  const { data, error } = await supabase.functions.invoke('registration', {
    body: {
      action: 'submit_registration',
      registrationId,
      draftToken,
    },
  });

  if (error) {
    throw new Error(error.message || 'Failed to submit registration');
  }

  return data; // { success: true, referenceCode }
}
