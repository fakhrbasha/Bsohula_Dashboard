import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Change to named export 'middleware' instead of default export
export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const path = request.nextUrl.pathname;  
  
  // Define public paths that don't require authentication
  const isPublicPath = path.startsWith('/auth/login');
  
  // Check if user is authenticated by looking for the token cookie
  const token = request.cookies.get('zed.token');
  const isAuthenticated = !!token;

  // If the path is public and user is authenticated, redirect to dashboard
  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If the path is not public and user is not authenticated, redirect to login
  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Otherwise, continue with the request
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Match all paths except for:
    // - API routes
    // - Static files (images, js, css, etc)
    // - Favicon
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};