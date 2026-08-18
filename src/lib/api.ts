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
  // 1. Get presigned URL
  const urlRes = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'get_upload_url',
      registrationId,
      draftToken,
      type: 'proof',
      filename: file.name,
      contentType: file.type
    })
  });

  const urlData = await urlRes.json();
  if (!urlRes.ok) throw new Error(urlData.error || 'Failed to get upload URL');

  // 2. Upload file directly to Supabase Storage
  const uploadRes = await fetch(urlData.url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    }
  });

  if (!uploadRes.ok) throw new Error('Failed to upload file to storage');

  // 3. Confirm upload
  const confirmRes = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'confirm_upload',
      registrationId,
      draftToken,
      type: 'proof',
      path: urlData.path,
      size: file.size,
      filename: file.name,
      contentType: file.type
    })
  });

  const confirmData = await confirmRes.json();
  if (!confirmRes.ok) throw new Error(confirmData.error || 'Failed to confirm upload');

  return confirmData; // { success: true, path: '...' }
}

export async function uploadPitchDeck(registrationId: string, draftToken: string, file: File) {
  // 1. Get presigned URL
  const urlRes = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'get_upload_url',
      registrationId,
      draftToken,
      type: 'pitch_deck',
      filename: file.name,
      contentType: file.type
    })
  });

  const urlData = await urlRes.json();
  if (!urlRes.ok) throw new Error(urlData.error || 'Failed to get upload URL');

  // 2. Upload file directly to Supabase Storage
  const uploadRes = await fetch(urlData.url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    }
  });

  if (!uploadRes.ok) throw new Error('Failed to upload file to storage');

  // 3. Confirm upload
  const confirmRes = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'confirm_upload',
      registrationId,
      draftToken,
      type: 'pitch_deck',
      path: urlData.path,
      size: file.size,
      filename: file.name,
      contentType: file.type
    })
  });

  const confirmData = await confirmRes.json();
  if (!confirmRes.ok) throw new Error(confirmData.error || 'Failed to confirm upload');

  return confirmData; // { success: true, path: '...' }
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
