import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { verifySessionCookie } from '@/lib/adminAuth';

// POST — Public: Submit feedback
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      overall_experience,
      organization_rating,
      best_parts,
      would_participate_again,
      communication_rating,
      venue_rating,
      improvement_suggestion,
      participant_name,
    } = body;

    // Basic validation
    if (
      !overall_experience || !organization_rating ||
      !best_parts || !Array.isArray(best_parts) || best_parts.length === 0 ||
      !would_participate_again
    ) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    if (
      overall_experience < 1 || overall_experience > 5 ||
      organization_rating < 1 || organization_rating > 5
    ) {
      return NextResponse.json(
        { error: 'Ratings must be between 1 and 5.' },
        { status: 400 }
      );
    }

    if (!['definitely', 'maybe', 'probably_not'].includes(would_participate_again)) {
      return NextResponse.json(
        { error: 'Invalid value for would_participate_again.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('event_feedback')
      .insert({
        overall_experience,
        organization_rating,
        best_parts,
        would_participate_again,
        communication_rating: communication_rating || null,
        venue_rating: venue_rating || null,
        improvement_suggestion: improvement_suggestion?.trim() || null,
        participant_name: participant_name?.trim() || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Feedback insert error:', error);
      return NextResponse.json(
        { error: 'Failed to submit feedback.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err: any) {
    console.error('Feedback API error:', err);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

// GET — Admin only: Fetch all feedback
export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get('ecell_admin_session')?.value;
  if (!verifySessionCookie(sessionCookie)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('event_feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Feedback fetch error:', error);
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Feedback GET error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch feedback.' },
      { status: 500 }
    );
  }
}
