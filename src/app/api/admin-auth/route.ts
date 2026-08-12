import { NextRequest, NextResponse } from 'next/server';
import { createHmac, randomBytes } from 'crypto';

import { signToken, verifySessionCookie } from '@/lib/adminAuth';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!ADMIN_PASSWORD) {
      console.error('ADMIN_PASSWORD not set in environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (password === ADMIN_PASSWORD) {
      // Create a random token and sign it
      const token = randomBytes(32).toString('hex');
      const signature = signToken(token);
      const cookieValue = `${token}:${signature}`;

      const response = NextResponse.json({ success: true });
      
      // Set secure session cookie (12 hours)
      response.cookies.set({
        name: 'ecell_admin_session',
        value: cookieValue,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 12, // 12 hours in seconds
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get('ecell_admin_session')?.value;
  
  if (verifySessionCookie(sessionCookie)) {
    return NextResponse.json({ authenticated: true });
  }
  
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  
  // Clear the session cookie
  response.cookies.set({
    name: 'ecell_admin_session',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  return response;
}
