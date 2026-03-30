import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Next.js 16.2.0 Authentication API
 * Implements Async Cookies API for session management.
 */
export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // User's specific requirement: admin / 123
    if (username === 'admin' && password === '123') {
      const response = NextResponse.json({ message: 'Login successful' });
      
      // Next.js 15/16: cookies() must be awaited
      const cookieStore = await cookies();
      
      cookieStore.set('admin-session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { message: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
