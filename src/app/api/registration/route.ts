import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { randomUUID } from 'crypto';
import { createHash } from 'crypto';

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}



export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    let action: string = '';
    let bodyData: any = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      action = formData.get('action')?.toString() || '';
      bodyData = formData;
    } else {
      bodyData = await req.json();
      action = bodyData.action || '';
    }

    if (!action) {
      return NextResponse.json({ error: 'No action specified' }, { status: 400 });
    }

    let isSupabaseConfigured = true;
    try {
      getSupabaseAdmin();
    } catch (e: any) {
      if (e.message === 'Missing Supabase server configuration') {
        isSupabaseConfigured = false;
      }
    }

    // Mock Mode if Supabase is not configured
    if (!isSupabaseConfigured) {
      console.warn("MOCK MODE: Supabase not configured. Returning mock data.");
      if (action === 'create_draft') {
         return NextResponse.json({ registrationId: 'mock-reg-' + Date.now(), draftToken: 'mock-token' });
      }
      if (action === 'save_draft') {
         return NextResponse.json({ success: true });
      }
      if (action === 'upload_proof' || action === 'upload_pitch_deck') {
         return NextResponse.json({ success: true, path: 'mock/path/' + Date.now() + '.pdf' });
      }
      if (action === 'submit_registration') {
         return NextResponse.json({ success: true });
      }
    }

    const supabase = getSupabaseAdmin();

    // ─── CREATE DRAFT ───
    if (action === 'create_draft') {
      const state = bodyData.data || {};

      const draftTokenRaw = randomUUID() + randomUUID();
      const draftTokenHash = hashToken(draftTokenRaw);

      const { data, error } = await supabase
        .from('registrations')
        .insert({
          participant_type: state.participantType || 'student',
          team_name: state.teamName || 'Draft Team',
          idea_name: state.participantType === 'student' ? state.studentIdeaDetails?.ideaName : null,
          startup_name: state.participantType === 'startup' ? state.startupDetails?.startupName : null,
          problem_statement: state.participantType === 'student'
            ? state.studentIdeaDetails?.problemStatement || ''
            : state.startupDetails?.problemStatement || '',
          solution_description: state.participantType === 'student'
            ? state.studentIdeaDetails?.proposedSolution || ''
            : state.startupDetails?.solution || '',
          short_description: state.participantType === 'student'
            ? state.studentIdeaDetails?.shortDescription || ''
            : state.startupDetails?.shortDescription || '',
          pitch_deck_url: state.participantType === 'student'
            ? state.studentIdeaDetails?.pitchDeckUrl || ''
            : state.startupDetails?.pitchDeckUrl || '',
          category: state.participantType === 'student'
            ? (state.studentIdeaDetails?.category === 'Other' && state.studentIdeaDetails?.customCategory ? state.studentIdeaDetails.customCategory : state.studentIdeaDetails?.category) || 'Other'
            : (state.startupDetails?.category === 'Other' && state.startupDetails?.customCategory ? state.startupDetails.customCategory : state.startupDetails?.category) || 'Other',
          current_stage: state.participantType === 'student'
            ? state.studentIdeaDetails?.currentStage || 'Idea'
            : state.startupDetails?.currentStage || 'Idea',
          nec_referral_code: 'NEC2659807',
          status: 'DRAFT',
          draft_token_hash: draftTokenHash,
          eureka_link_clicked: state.eurekaLinkClicked || false,
          eureka_self_confirmed: state.eurekaSelfConfirmed || false,
          final_confirmation: false,
        })
        .select('id')
        .single();

      if (error) throw error;

      await supabase.from('registration_events').insert({
        registration_id: data.id,
        event_type: 'REGISTRATION_CREATED',
      });

      return NextResponse.json({ registrationId: data.id, draftToken: draftTokenRaw });
    }

    // ─── SAVE DRAFT ───
    if (action === 'save_draft') {
      const { registrationId, draftToken, state } = bodyData;
      if (!registrationId || !draftToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const hash = hashToken(draftToken);
      const { data: reg, error: regError } = await supabase
        .from('registrations')
        .select('id, status')
        .eq('id', registrationId)
        .eq('draft_token_hash', hash)
        .single();

      if (regError || !reg) {
        return NextResponse.json({ error: 'Invalid draft token' }, { status: 401 });
      }

      if (reg.status === 'SUBMITTED') {
        return NextResponse.json({ error: 'Cannot modify submitted registration' }, { status: 400 });
      }

      const updatePayload: Record<string, any> = {
        last_saved_at: new Date().toISOString(),
        participant_type: state.participantType,
        team_name: state.teamName,
        idea_name: state.participantType === 'student' ? state.studentIdeaDetails?.ideaName : null,
        startup_name: state.participantType === 'startup' ? state.startupDetails?.startupName : null,
        problem_statement: state.participantType === 'student' ? state.studentIdeaDetails?.problemStatement : state.startupDetails?.problemStatement,
        solution_description: state.participantType === 'student' ? state.studentIdeaDetails?.proposedSolution : state.startupDetails?.solution,
        short_description: state.participantType === 'student' ? state.studentIdeaDetails?.shortDescription : state.startupDetails?.shortDescription,
        pitch_deck_url: state.participantType === 'student' ? state.studentIdeaDetails?.pitchDeckUrl : state.startupDetails?.pitchDeckUrl,
        category: state.participantType === 'student' ? (state.studentIdeaDetails?.category === 'Other' && state.studentIdeaDetails?.customCategory ? state.studentIdeaDetails.customCategory : state.studentIdeaDetails?.category) : (state.startupDetails?.category === 'Other' && state.startupDetails?.customCategory ? state.startupDetails.customCategory : state.startupDetails?.category),
        current_stage: state.participantType === 'student' ? state.studentIdeaDetails?.currentStage : state.startupDetails?.currentStage,
        eureka_self_confirmed: state.eurekaSelfConfirmed || false,
        eureka_link_clicked: state.eurekaLinkClicked || false,
        eureka_registration_id: state.eurekaRegistrationId || null,
      };

      await supabase.from('registrations').update(updatePayload).eq('id', registrationId);

      // Upsert team members
      if (state.teamMembers?.length > 0) {
        await supabase.from('team_members').delete().eq('registration_id', registrationId);
        const members = state.teamMembers.map((m: any, idx: number) => ({
          registration_id: registrationId,
          full_name: m.fullName,
          email: m.email,
          mobile_number: m.mobileNumber || '',
          institution: m.institution,
          role: m.role,
          custom_role: m.customRole || null,
          is_leader: idx === 0,
          member_order: idx + 1,
        }));
        await supabase.from('team_members').insert(members);
      }

      return NextResponse.json({ success: true });
    }

    // ─── GET UPLOAD URL (PRESIGNED) ───
    if (action === 'get_upload_url') {
      const { registrationId, draftToken, type, filename, contentType } = bodyData;
      if (!registrationId || !draftToken || !type || !filename || !contentType) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
      }

      const hash = hashToken(draftToken);
      const { data: reg, error: regError } = await supabase
        .from('registrations')
        .select('id, status, team_name')
        .eq('id', registrationId)
        .eq('draft_token_hash', hash)
        .single();

      if (regError || !reg) {
        return NextResponse.json({ error: 'Invalid draft token' }, { status: 401 });
      }

      if (reg.status === 'SUBMITTED') {
        return NextResponse.json({ error: 'Cannot modify submitted registration' }, { status: 400 });
      }

      const teamSlug = (reg.team_name || 'Team').replace(/[^a-zA-Z0-9]/g, '_');
      const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
      let folder = type === 'pitch_deck' ? 'pitch-decks' : 'proofs';
      const filePath = `${teamSlug}_${registrationId.substring(0, 6)}/${folder}/${randomUUID().substring(0, 6)}_${sanitizedName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('eureka-proofs')
        .createSignedUploadUrl(filePath);

      if (uploadError) throw uploadError;

      return NextResponse.json({ success: true, url: uploadData.signedUrl, path: filePath });
    }

    // ─── CONFIRM UPLOAD ───
    if (action === 'confirm_upload') {
      const { registrationId, draftToken, type, path, size, filename, contentType } = bodyData;
      
      const hash = hashToken(draftToken);
      const { data: reg, error: regError } = await supabase
        .from('registrations')
        .select('id, status')
        .eq('id', registrationId)
        .eq('draft_token_hash', hash)
        .single();

      if (regError || !reg) {
        return NextResponse.json({ error: 'Invalid draft token' }, { status: 401 });
      }

      if (type === 'proof') {
        await supabase.from('registration_proofs').delete().eq('registration_id', registrationId);
        await supabase.from('registration_proofs').insert({
          registration_id: registrationId,
          storage_bucket: 'eureka-proofs',
          storage_path: path,
          original_filename: filename,
          mime_type: contentType,
          file_size_bytes: size,
        });

        await supabase.from('registration_events').insert({
          registration_id: registrationId,
          event_type: 'PROOF_UPLOADED',
          metadata: { mime_type: contentType, file_size_bytes: size },
        });
      } else if (type === 'pitch_deck') {
        await supabase.from('registrations').update({ pitch_deck_url: path }).eq('id', registrationId);
        await supabase.from('registration_events').insert({
          registration_id: registrationId,
          event_type: 'PITCH_DECK_UPLOADED',
          metadata: { mime_type: contentType, file_size_bytes: size, original_filename: filename },
        });
      }

      return NextResponse.json({ success: true, path });
    }

    // ─── UPLOAD PROOF ───
    if (action === 'upload_proof') {
      const draftToken = bodyData.get('draftToken')?.toString();
      const registrationId = bodyData.get('registrationId')?.toString();
      const file = bodyData.get('file') as File | null;

      if (!draftToken || !registrationId || !file) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
      }

      if (registrationId === 'undefined' || registrationId === 'null' || registrationId === '') {
        return NextResponse.json({ error: 'Invalid registration ID' }, { status: 400 });
      }

      const hash = hashToken(draftToken);
      const { data: reg, error: regError } = await supabase
        .from('registrations')
        .select('id, status')
        .eq('id', registrationId)
        .eq('draft_token_hash', hash)
        .single();

      if (regError || !reg) {
        return NextResponse.json({ error: 'Invalid draft token' }, { status: 401 });
      }

      if (reg.status === 'SUBMITTED') {
        return NextResponse.json({ error: 'Cannot modify submitted registration' }, { status: 400 });
      }

      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size exceeds 5MB' }, { status: 400 });
      }

      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        return NextResponse.json({ error: 'Invalid file type. Only JPG and PNG allowed.' }, { status: 400 });
      }

      // Create a readable folder name: TeamName_ShortId
      const { data: teamReg } = await supabase.from('registrations').select('team_name').eq('id', registrationId).single();
      const teamSlug = (teamReg?.team_name || 'Team').replace(/[^a-zA-Z0-9]/g, '_');
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      
      // Store in TeamName_ShortId/proofs/FileName
      const filePath = `${teamSlug}_${registrationId.substring(0, 6)}/proofs/${randomUUID().substring(0, 6)}_${sanitizedName}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from('eureka-proofs')
        .upload(filePath, buffer, { contentType: file.type, upsert: true });

      if (uploadError) throw uploadError;

      // Remove old proof if any, then insert new
      await supabase.from('registration_proofs').delete().eq('registration_id', registrationId);

      await supabase.from('registration_proofs').insert({
        registration_id: registrationId,
        storage_bucket: 'eureka-proofs',
        storage_path: filePath,
        original_filename: file.name,
        mime_type: file.type,
        file_size_bytes: file.size,
      });

      await supabase.from('registration_events').insert({
        registration_id: registrationId,
        event_type: 'PROOF_UPLOADED',
        metadata: { mime_type: file.type, file_size_bytes: file.size },
      });

      return NextResponse.json({ success: true, path: filePath });
    }

    // ─── UPLOAD PITCH DECK ───
    if (action === 'upload_pitch_deck') {
      const draftToken = bodyData.get('draftToken')?.toString();
      const registrationId = bodyData.get('registrationId')?.toString();
      const file = bodyData.get('file') as File | null;

      if (!draftToken || !registrationId || !file) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
      }

      if (registrationId === 'undefined' || registrationId === 'null' || registrationId === '') {
        return NextResponse.json({ error: 'Invalid registration ID' }, { status: 400 });
      }

      const hash = hashToken(draftToken);
      const { data: reg, error: regError } = await supabase
        .from('registrations')
        .select('id, status')
        .eq('id', registrationId)
        .eq('draft_token_hash', hash)
        .single();

      if (regError || !reg) {
        return NextResponse.json({ error: 'Invalid draft token' }, { status: 401 });
      }

      if (reg.status === 'SUBMITTED') {
        return NextResponse.json({ error: 'Cannot modify submitted registration' }, { status: 400 });
      }

      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
      }

      const allowedTypes = [
        'application/pdf',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: 'Invalid file type. Only PDF, PPT, and PPTX are allowed.' }, { status: 400 });
      }

      // Create a readable folder name: TeamName_ShortId
      const { data: teamReg } = await supabase.from('registrations').select('team_name').eq('id', registrationId).single();
      const teamSlug = (teamReg?.team_name || 'Team').replace(/[^a-zA-Z0-9]/g, '_');
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      
      // Store in TeamName_ShortId/pitch-decks/FileName
      const filePath = `${teamSlug}_${registrationId.substring(0, 6)}/pitch-decks/${randomUUID().substring(0, 6)}_${sanitizedName}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from('eureka-proofs')
        .upload(filePath, buffer, { contentType: file.type, upsert: true });

      if (uploadError) throw uploadError;

      // Save the pitch deck path on the registration record
      await supabase.from('registrations').update({
        pitch_deck_url: filePath,
      }).eq('id', registrationId);

      await supabase.from('registration_events').insert({
        registration_id: registrationId,
        event_type: 'PITCH_DECK_UPLOADED',
        metadata: { mime_type: file.type, file_size_bytes: file.size, original_filename: file.name },
      });

      return NextResponse.json({ success: true, path: filePath });
    }

    // ─── SUBMIT REGISTRATION ───
    if (action === 'submit_registration') {
      const { registrationId, draftToken } = bodyData;
      if (!registrationId || !draftToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const hash = hashToken(draftToken);
      const { data: reg, error: regError } = await supabase
        .from('registrations')
        .select('id, status, eureka_registration_id, reference_code')
        .eq('id', registrationId)
        .eq('draft_token_hash', hash)
        .single();

      if (regError || !reg) {
        return NextResponse.json({ error: 'Invalid draft token' }, { status: 401 });
      }

      if (reg.status === 'SUBMITTED') {
        return NextResponse.json({ success: true, message: 'Already submitted' });
      }

      if (!reg.eureka_registration_id) {
        return NextResponse.json({ error: 'Eureka Registration ID is required before submission' }, { status: 400 });
      }

      const { data: proof } = await supabase
        .from('registration_proofs')
        .select('id')
        .eq('registration_id', registrationId)
        .single();

      if (!proof) {
        return NextResponse.json({ error: 'Registration proof is required before submission' }, { status: 400 });
      }

      const { error: submitError } = await supabase
        .from('registrations')
        .update({
          status: 'SUBMITTED',
          submitted_at: new Date().toISOString(),
          final_confirmation: true,
        })
        .eq('id', registrationId);

      if (submitError) throw submitError;

      await supabase.from('registration_events').insert({
        registration_id: registrationId,
        event_type: 'REGISTRATION_SUBMITTED',
      });

      // ─── AUTO-SYNC TO SHORT FORM (immediate_registrations) ───
      try {
        const { data: fullReg } = await supabase
          .from('registrations')
          .select('participant_type, team_name, category, current_stage')
          .eq('id', registrationId)
          .single();
          
        const { data: members } = await supabase
          .from('team_members')
          .select('full_name, email, mobile_number, institution, is_leader')
          .eq('registration_id', registrationId);

        if (fullReg && members && members.length > 0) {
          const leader = members.find((m: any) => m.is_leader) || members[0];
          const otherMembers = members.filter((m: any) => !m.is_leader).map((m: any) => m.full_name).join(', ');

          await supabase.from('immediate_registrations').insert({
            participant_type: fullReg.participant_type,
            team_name: fullReg.team_name,
            lead_name: leader.full_name,
            lead_email: leader.email,
            lead_phone: leader.mobile_number,
            lead_college: leader.institution,
            lead_branch: 'N/A',
            lead_year: 'N/A',
            members_names: otherMembers || null,
            idea_category: fullReg.category,
            idea_stage: fullReg.current_stage,
          });
        }
      } catch (syncError) {
        // Log but don't fail the registration if auto-sync fails
        console.error('Auto-sync to immediate_registrations failed:', syncError);
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error: any) {
    console.error('API Registration Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
