import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { verifySessionCookie } from '@/lib/adminAuth';

function authenticate(req: NextRequest) {
  const sessionCookie = req.cookies.get('ecell_admin_session')?.value;
  return verifySessionCookie(sessionCookie);
}

export async function POST(req: NextRequest) {
  if (!authenticate(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { path, bucket = 'eureka-proofs' } = await req.json();

    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Generate a signed URL valid for 60 seconds (just enough time for the browser to initiate the download/view)
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .createSignedUrl(path, 60);

    if (error) {
      console.error('Error generating signed URL:', error);
      throw error;
    }

    return NextResponse.json({ success: true, signedUrl: data.signedUrl });
  } catch (error: any) {
    console.error('Admin Signed URL API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
