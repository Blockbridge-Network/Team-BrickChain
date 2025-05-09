import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { middleware } from '../middleware';

// Mock NextRequest and NextResponse
jest.mock('next/server', () => {
  const actual = jest.requireActual('next/server');
  return {
    ...actual,
    NextResponse: {
      next: jest.fn(() => ({
        cookies: {
          set: jest.fn(),
        },
      })),
      redirect: jest.fn((url) => ({
        cookies: {
          set: jest.fn(),
        },
        headers: new Map([['Location', url.toString()]]),
      })),
    },
  };
});

// Mock Supabase client
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(),
}));

describe('Middleware', () => {
  let mockSupabase: jest.Mocked<any>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock for supabase client
    mockSupabase = {
      auth: {
        getUser: jest.fn(),
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    };
    (createServerClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  const createMockRequest = (pathname: string) => {
    return new NextRequest(new URL(`http://localhost:3000${pathname}`), {
      headers: new Headers({
        'cookie': 'some-cookie=value',
      }),
    });
  };

  describe('Authentication Flow', () => {
    it('should allow unauthenticated access to auth routes', async () => {
      const request = createMockRequest('/auth/login');
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });

      const response = await middleware(request);
      expect(NextResponse.redirect).not.toHaveBeenCalled();
    });

    it('should redirect authenticated users to dashboard from auth routes', async () => {
      const request = createMockRequest('/auth/login');
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: '123' } },
        error: null
      });

      await middleware(request);
      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({ pathname: '/dashboard' })
      );
    });

    it('should redirect unauthenticated users to login from protected routes', async () => {
      const request = createMockRequest('/dashboard');
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });

      await middleware(request);
      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({ pathname: '/auth/login' })
      );
    });
  });

  describe('Role-Based Access Control', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: '123' } },
        error: null
      });
    });

    it('should allow PROPERTY_OWNER to access listing routes', async () => {
      const request = createMockRequest('/list/create');
      mockSupabase.single.mockResolvedValue({
        data: { role: 'PROPERTY_OWNER', wallet_address: '0x123' },
      });

      const response = await middleware(request);
      expect(NextResponse.redirect).not.toHaveBeenCalled();
    });

    it('should redirect INVESTOR from listing routes', async () => {
      const request = createMockRequest('/list/create');
      mockSupabase.single.mockResolvedValue({
        data: { role: 'INVESTOR', wallet_address: '0x123' },
      });

      await middleware(request);
      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({ pathname: '/dashboard' })
      );
    });

    it('should allow INVESTOR to access investment routes', async () => {
      const request = createMockRequest('/invest/property/123');
      mockSupabase.single.mockResolvedValue({
        data: { role: 'INVESTOR', wallet_address: '0x123' },
      });

      const response = await middleware(request);
      expect(NextResponse.redirect).not.toHaveBeenCalled();
    });

    it('should redirect PROPERTY_OWNER from investment routes', async () => {
      const request = createMockRequest('/invest/property/123');
      mockSupabase.single.mockResolvedValue({
        data: { role: 'PROPERTY_OWNER', wallet_address: '0x123' },
      });

      await middleware(request);
      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({ pathname: '/dashboard' })
      );
    });
  });

  describe('Wallet Requirements', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: '123' } },
        error: null
      });
    });

    it('should redirect users without wallet to profile page', async () => {
      const request = createMockRequest('/invest/property/123');
      mockSupabase.single.mockResolvedValue({
        data: { role: 'INVESTOR', wallet_address: null },
      });

      await middleware(request);
      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: '/profile',
          search: expect.stringContaining('wallet_required'),
        })
      );
    });

    it('should allow users with wallet to access protected routes', async () => {
      const request = createMockRequest('/invest/property/123');
      mockSupabase.single.mockResolvedValue({
        data: { role: 'INVESTOR', wallet_address: '0x123' },
      });

      const response = await middleware(request);
      expect(NextResponse.redirect).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      const request = createMockRequest('/dashboard');
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: '123' } },
        error: null
      });
      mockSupabase.single.mockRejectedValue(new Error('Database error'));

      const response = await middleware(request);
      expect(response).toBeTruthy(); // Should return a response and not throw
    });

    it('should handle authentication errors gracefully', async () => {
      const request = createMockRequest('/dashboard');
      mockSupabase.auth.getUser.mockRejectedValue(new Error('Auth error'));

      const response = await middleware(request);
      expect(response).toBeTruthy(); // Should return a response and not throw
    });
  });
});
