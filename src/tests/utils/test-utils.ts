import { NextRequest, NextResponse } from 'next/server';

export function createMockRequestResponse(pathname: string, options: {
  headers?: Record<string, string>,
  cookies?: Record<string, string>
} = {}) {
  const url = new URL(`http://localhost:3000${pathname}`);
  
  const headers = new Headers(options.headers);
  if (options.cookies) {
    const cookieString = Object.entries(options.cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ');
    headers.set('cookie', cookieString);
  }

  const request = new NextRequest(url, { headers });
  
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  return { request, response };
}

export function mockSupabaseClient() {
  return {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  };
}

export function mockAuthenticatedUser(userId: string) {
  return {
    data: { user: { id: userId } },
    error: null
  };
}

export function mockUserData(role: 'PROPERTY_OWNER' | 'INVESTOR', walletAddress?: string) {
  return {
    data: {
      role,
      wallet_address: walletAddress || null,
    }
  };
}
