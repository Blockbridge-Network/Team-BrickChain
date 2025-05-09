import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Create a response object that we can modify
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create supabase server client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  try {
    // Check authentication using getUser
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('Auth error:', userError);
      return response;
    }

    // Handle auth routes
    if (request.nextUrl.pathname.startsWith('/auth/')) {
      if (user) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      return response;
    }

    // Protected routes check
    const protectedPaths = ['/dashboard', '/list', '/invest', '/profile'];
    const isProtectedRoute = protectedPaths.some(path => 
      request.nextUrl.pathname.startsWith(path)
    );

    if (isProtectedRoute) {
      // Redirect to login if not authenticated
      if (!user) {
        const redirectUrl = new URL('/auth/login', request.url);
        redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
      }

      // Get user's role and wallet status
      const { data: userData, error } = await supabase
        .from('users')
        .select('role, wallet_address')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        return response;
      }

      // Role-based access control
      if (request.nextUrl.pathname.startsWith('/list/') && userData?.role !== 'PROPERTY_OWNER') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      if (request.nextUrl.pathname.startsWith('/invest/') && userData?.role !== 'INVESTOR') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // Check wallet requirement for investment and property listing
      if ((request.nextUrl.pathname.startsWith('/invest/') || 
           request.nextUrl.pathname.startsWith('/list/')) && 
          !userData?.wallet_address) {
        const redirectUrl = new URL('/profile', request.url);
        redirectUrl.searchParams.set('wallet_required', 'true');
        return NextResponse.redirect(redirectUrl);
      }
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return response;
  }
}

export const config = {
  matcher: [
    '/auth/:path*',
    '/dashboard/:path*',
    '/list/:path*',
    '/invest/:path*',
    '/profile/:path*',
  ],
};
