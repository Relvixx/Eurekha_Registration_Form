import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { verifySessionCookie } from '../admin-auth/route';

// Auth middleware for the admin data API
function authenticate(req: NextRequest) {
  const sessionCookie = req.cookies.get('ecell_admin_session')?.value;
  return verifySessionCookie(sessionCookie);
}

export async function GET(req: NextRequest) {
  if (!authenticate(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();

    // Fetch Quick Leads
    const { data: leads, error: leadsError } = await supabase
      .from('immediate_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (leadsError) {
      console.error('Error fetching leads:', leadsError);
      throw leadsError;
    }

    // Fetch Full Applications with related data
    const { data: applications, error: appsError } = await supabase
      .from('registrations')
      .select(`
        *,
        team_members(*),
        registration_proofs(*)
      `)
      .order('created_at', { ascending: false });

    if (appsError) {
      console.error('Error fetching applications:', appsError);
      throw appsError;
    }

    return NextResponse.json({
      success: true,
      data: {
        leads,
        applications,
      }
    });
  } catch (error: any) {
    console.error('Admin API GET Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!authenticate(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, type, updates } = await req.json();

    if (!id || !type || !updates) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    if (type !== 'lead' && type !== 'application') {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }

    // Only allow updating admin_status and internal_notes through this API
    const allowedUpdates: Record<string, any> = {};
    if (updates.admin_status !== undefined) allowedUpdates.admin_status = updates.admin_status;
    if (updates.internal_notes !== undefined) allowedUpdates.internal_notes = updates.internal_notes;

    if (Object.keys(allowedUpdates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const table = type === 'lead' ? 'immediate_registrations' : 'registrations';

    const { data, error } = await supabase
      .from(table)
      .update(allowedUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating ${table}:`, error);
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Admin API PATCH Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
