import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";
import { encodeHex } from "https://deno.land/std@0.168.0/encoding/hex.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper to hash token
async function hashToken(token: string) {
  const messageBuffer = new TextEncoder().encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", messageBuffer);
  return encodeHex(hashBuffer);
}

// Helper to generate reference code
function generateReferenceCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ECELL-EUR-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Determine action from URL path or body
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    let action = path;
    let bodyData: any = {};

    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      action = formData.get('action')?.toString() || action;
      bodyData = formData;
    } else if (contentType.includes('application/json')) {
      bodyData = await req.json();
      action = bodyData.action || action;
    }

    if (!action) {
      return new Response(JSON.stringify({ error: 'No action specified' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    if (action === 'create_draft') {
      const { participantType, teamName, problemStatement, solutionDescription, shortDescription, category, currentStage } = bodyData.data || {};
      
      const draftTokenRaw = crypto.randomUUID() + crypto.randomUUID();
      const draftTokenHash = await hashToken(draftTokenRaw);
      const necReferralCode = 'NEC2659807'; // Could come from config/env

      const { data, error } = await supabase
        .from('registrations')
        .insert({
          participant_type: participantType || 'student',
          team_name: teamName || 'Draft Team',
          problem_statement: problemStatement || '',
          solution_description: solutionDescription || '',
          short_description: shortDescription || '',
          category: category || 'Other',
          current_stage: currentStage || 'Idea',
          nec_referral_code: necReferralCode,
          status: 'DRAFT',
          draft_token_hash: draftTokenHash,
          eureka_link_clicked: false,
          eureka_self_confirmed: false,
          final_confirmation: false,
        })
        .select('id')
        .single();

      if (error) throw error;

      await supabase.from('registration_events').insert({
        registration_id: data.id,
        event_type: 'REGISTRATION_CREATED',
      });

      return new Response(JSON.stringify({ registrationId: data.id, draftToken: draftTokenRaw }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'save_draft') {
      const { registrationId, draftToken, state } = bodyData;
      if (!registrationId || !draftToken) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
      }

      const hash = await hashToken(draftToken);
      const { data: reg, error: regError } = await supabase
        .from('registrations')
        .select('id, status')
        .eq('id', registrationId)
        .eq('draft_token_hash', hash)
        .single();

      if (regError || !reg) {
        return new Response(JSON.stringify({ error: 'Invalid draft token' }), { status: 401, headers: corsHeaders });
      }

      if (reg.status === 'SUBMITTED') {
        return new Response(JSON.stringify({ error: 'Cannot modify submitted registration' }), { status: 400, headers: corsHeaders });
      }

      // Update registration details based on state
      const updatePayload: any = {
        last_saved_at: new Date().toISOString(),
        participant_type: state.participantType,
        team_name: state.teamName,
        problem_statement: state.participantType === 'student' ? state.studentIdeaDetails?.problemStatement : state.startupDetails?.problemStatement,
        solution_description: state.participantType === 'student' ? state.studentIdeaDetails?.proposedSolution : state.startupDetails?.solution,
        short_description: state.participantType === 'student' ? state.studentIdeaDetails?.shortDescription : state.startupDetails?.shortDescription,
        category: state.participantType === 'student' ? state.studentIdeaDetails?.category : state.startupDetails?.category,
        current_stage: state.participantType === 'student' ? state.studentIdeaDetails?.currentStage : state.startupDetails?.currentStage,
        eureka_self_confirmed: state.eurekaSelfConfirmed || false,
        eureka_link_clicked: state.eurekaLinkClicked || false,
        eureka_registration_id: state.eurekaRegistrationId || null,
        idea_name: state.participantType === 'student' ? state.studentIdeaDetails?.ideaName : null,
        startup_name: state.participantType === 'startup' ? state.startupDetails?.startupName : null,
        website_url: state.participantType === 'student' ? state.studentIdeaDetails?.websiteUrl : state.startupDetails?.websiteUrl,
        linkedin_url: state.participantType === 'startup' ? state.startupDetails?.linkedinUrl : null,
      };

      await supabase.from('registrations').update(updatePayload).eq('id', registrationId);

      // Upsert team members
      if (state.teamMembers && state.teamMembers.length > 0) {
        await supabase.from('team_members').delete().eq('registration_id', registrationId);
        const members = state.teamMembers.map((m: any, idx: number) => ({
          registration_id: registrationId,
          full_name: m.fullName,
          email: m.email,
          mobile_number: m.mobileNumber,
          institution: m.institution,
          role: m.role,
          custom_role: m.customRole,
          is_leader: idx === 0, // Enforce leader rule
          member_order: idx + 1,
        }));
        await supabase.from('team_members').insert(members);
      }

      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'upload_proof') {
      const draftToken = bodyData.get('draftToken')?.toString();
      const registrationId = bodyData.get('registrationId')?.toString();
      const file = bodyData.get('file') as File | null;
      
      if (!draftToken || !registrationId || !file) {
        return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400, headers: corsHeaders });
      }

      const hash = await hashToken(draftToken);
      const { data: reg, error: regError } = await supabase
        .from('registrations')
        .select('id, status')
        .eq('id', registrationId)
        .eq('draft_token_hash', hash)
        .single();

      if (regError || !reg) {
        return new Response(JSON.stringify({ error: 'Invalid draft token' }), { status: 401, headers: corsHeaders });
      }

      if (reg.status === 'SUBMITTED') {
        return new Response(JSON.stringify({ error: 'Cannot modify submitted registration' }), { status: 400, headers: corsHeaders });
      }

      if (file.size > 5 * 1024 * 1024) {
        return new Response(JSON.stringify({ error: 'File size exceeds 5MB' }), { status: 400, headers: corsHeaders });
      }

      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        return new Response(JSON.stringify({ error: 'Invalid file type. Only JPG and PNG are allowed.' }), { status: 400, headers: corsHeaders });
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${registrationId}/${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('eureka-proofs')
        .upload(filePath, file, { contentType: file.type, upsert: true });

      if (uploadError) throw uploadError;

      // Delete existing proof if any
      await supabase.from('registration_proofs').delete().eq('registration_id', registrationId);

      // Insert new proof metadata
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
        metadata: { mime_type: file.type, file_size_bytes: file.size }
      });

      return new Response(JSON.stringify({ success: true, path: filePath }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'submit_registration') {
      const { registrationId, draftToken } = bodyData;
      if (!registrationId || !draftToken) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
      }

      const hash = await hashToken(draftToken);
      const { data: reg, error: regError } = await supabase
        .from('registrations')
        .select('id, status')
        .eq('id', registrationId)
        .eq('draft_token_hash', hash)
        .single();

      if (regError || !reg) {
        return new Response(JSON.stringify({ error: 'Invalid draft token' }), { status: 401, headers: corsHeaders });
      }

      if (reg.status === 'SUBMITTED') {
        return new Response(JSON.stringify({ success: true, message: 'Already submitted' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Ensure proof exists
      const { data: proof, error: proofError } = await supabase.from('registration_proofs').select('id').eq('registration_id', registrationId).single();
      if (proofError || !proof) {
        return new Response(JSON.stringify({ error: 'Registration proof is required before submission' }), { status: 400, headers: corsHeaders });
      }

      const referenceCode = generateReferenceCode();

      const { error: submitError } = await supabase
        .from('registrations')
        .update({
          status: 'SUBMITTED',
          submitted_at: new Date().toISOString(),
          reference_code: referenceCode,
          final_confirmation: true,
        })
        .eq('id', registrationId);

      if (submitError) throw submitError;

      await supabase.from('registration_events').insert({
        registration_id: registrationId,
        event_type: 'REGISTRATION_SUBMITTED',
        metadata: { reference_code: referenceCode }
      });

      return new Response(JSON.stringify({ success: true, referenceCode }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error: any) {
    console.error('Edge Function Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
