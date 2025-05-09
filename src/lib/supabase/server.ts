import { cookies } from 'next/headers';
import { createServerClient as createClient } from '@supabase/ssr';
import type { Database } from '../database.types';

export function createServerClient() {
  const cookieStore = cookies();

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) => {
          try {
            cookieStore.set(name, value, options);
          } catch (error) {
            // This can happen if we try to set a cookie during a middleware execution
            // We can safely ignore this case
          }
        },
        remove: (name, options) => {
          try {
            cookieStore.delete(name);
          } catch (error) {
            // This can happen if we try to delete a cookie during a middleware execution
            // We can safely ignore this case
          }
        },
      },
    }
  );
}
