import { FormState } from '@/types/eureka';

const API_URL = '/api/registration';

export async function createRegistrationDraft(state: Partial<FormState>) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'create_draft',
      data: state,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create registration draft');
  }

  return data; // { registrationId, draftToken }
}

export async function saveRegistrationDraft(registrationId: string, draftToken: string, state: FormState) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'save_draft',
      registrationId,
      draftToken,
      state,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to save registration draft');
  }

  return data;
}

export async function uploadRegistrationProof(registrationId: string, draftToken: string, file: File) {
  const formData = new FormData();
  formData.append('action', 'upload_proof');
  formData.append('registrationId', registrationId);
  formData.append('draftToken', draftToken);
  formData.append('file', file);

  const res = await fetch(API_URL, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to upload proof');
  }

  return data; // { success: true, path: '...' }
}

export async function uploadPitchDeck(registrationId: string, draftToken: string, file: File) {
  const formData = new FormData();
  formData.append('action', 'upload_pitch_deck');
  formData.append('registrationId', registrationId);
  formData.append('draftToken', draftToken);
  formData.append('file', file);

  const res = await fetch(API_URL, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to upload pitch deck');
  }

  return data; // { success: true, path: '...' }
}

export async function submitRegistration(registrationId: string, draftToken: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'submit_registration',
        registrationId,
        draftToken
      })
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Submission failed');
    }
    
    const data = await response.json();
    return { success: data.success };
  } catch (error: any) {
    console.error('Error submitting registration:', error);
    return { success: false, error: error.message };
  }
}
