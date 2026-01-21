import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Dashboard"',
      },
    });
  }

  const base64Credentials = authHeader.substring(6);
  const credentials = atob(base64Credentials);
  const [username, password] = credentials.split(':');

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (username !== 'admin' || password !== adminPassword) {
    return new NextResponse('Invalid credentials', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Dashboard"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
