import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { immediateRegistrationSchema } from '@/lib/short-schema';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const result = immediateRegistrationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid data', details: result.error.format() }, { status: 400 });
    }

    const data = result.data;

    // Insert into Supabase
    const { data: insertedData, error } = await supabase
      .from('immediate_registrations')
      .insert([
        {
          participant_type: data.participantType,
          team_name: data.teamName,
          lead_name: data.leadName,
          lead_email: data.leadEmail,
          lead_phone: data.leadPhone,
          lead_alt_phone: data.leadAltPhone || null,
          lead_college: data.leadCollege,
          lead_branch: data.leadBranch,
          lead_year: data.leadYear,
          members_names: data.membersNames || null,
          idea_category: data.ideaCategory === 'Other' && data.customIdeaCategory ? data.customIdeaCategory : data.ideaCategory,
          idea_stage: data.ideaStage,
        }
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save registration' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: insertedData.id });
    
  } catch (error: any) {
    console.error('API Short Register Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
