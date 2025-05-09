'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Database } from '@/lib/database.types';

type UserRole = Database['public']['Tables']['users']['Row']['role'];

interface User {
  id: string;
  email: string;
  role: UserRole;
  walletAddress: string | null;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  updateRole: (role: UserRole) => Promise<void>;
  updateWallet: (address: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateRole: async () => {},
  updateWallet: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        if (authUser && !authError) {
          const { data: userData, error: userDataError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();

          if (!userDataError && userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              role: userData.role,
              walletAddress: userData.wallet_address,
              createdAt: userData.created_at,
            });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          router.push('/login');
        } else if (session?.user) {
          const { data: userData, error: userDataError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!userDataError && userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              role: userData.role,
              walletAddress: userData.wallet_address,
              createdAt: userData.created_at,
            });
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, role: UserRole) => {
    const { data: { user: authUser }, error: signUpError } = 
      await supabase.auth.signUp({ email, password });
    
    if (signUpError) throw signUpError;
    if (!authUser?.id) throw new Error('Failed to create user');

    // Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert([{ id: authUser.id, email, role }]);

    if (profileError) {
      // Cleanup auth user if profile creation fails
      await supabase.auth.signOut();
      throw profileError;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateRole = async (role: UserRole) => {
    if (!user) throw new Error('No authenticated user');

    const { error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', user.id);

    if (error) throw error;
    setUser(prev => prev ? { ...prev, role } : null);
  };
  const updateWallet = async (address: string) => {
    if (!user) throw new Error('No authenticated user');

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    if (!session) {
      throw new Error('No active session');
    }

    const { error } = await supabase
      .from('users')
      .update({ 
        wallet_address: address,
        role: 'INVESTOR', // Default role for new wallet connections
      })
      .eq('id', user.id);

    if (error) throw error;
    setUser(prev => prev ? { ...prev, walletAddress: address, role: 'INVESTOR' } : null);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateRole,
    updateWallet,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
