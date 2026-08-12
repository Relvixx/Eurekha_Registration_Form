import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only apply to /admin and /api/admin-* routes (excluding /api/admin-auth to avoid redirect loops)
  if (
    pathname.startsWith('/admin') || 
    (pathname.startsWith('/api/admin-') && !pathname.startsWith('/api/admin-auth'))
  ) {
    const sessionCookie = request.cookies.get('ecell_admin_session');
    
    // In a real proxy, we'd verify the HMAC signature of the cookie value here if possible,
    // but typically full crypto verification is done in the route handlers.
    // For proxy, checking if it simply exists is often enough to filter out unauthorized visitors.
    if (!sessionCookie || !sessionCookie.value) {
      if (pathname.startsWith('/api/')) {
        // API routes return 401
        return NextResponse.json(
          { error: 'Unauthorized access to admin API' },
          { status: 401 }
        );
      } else {
        // Only redirect if they are not already on the login page (which is /admin)
        // Actually, /admin IS the login page if not authenticated, and the dashboard if authenticated.
        // Wait, if /admin handles its own login state (as per the prompt), we shouldn't redirect from /admin to somewhere else unless we have a specific /admin/login.
        // The prompt says: "/admin page handles its own login UI... For /admin page: redirect to /admin with auth challenge if no valid session (the page handles its own login UI)"
        // Since /admin is the login page, we should let /admin render. The client component will check the session and show login.
        // Or we can just let it through if it's strictly '/admin' but block things like '/admin/settings' if they existed.
        // Since there is only '/admin' for now, we'll let '/admin' pass through so the login UI can render.
        // We only strictly block '/api/admin-data' etc.
        // Let's refine this: only intercept /api/admin-data and /api/admin-signed-url if no session.
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
