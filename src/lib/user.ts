// src/lib/user.ts
import { createClient } from '@/lib/supabase/client';

export interface User {
  id: string;
  email: string;
  role: 'PROPERTY_OWNER' | 'INVESTOR';
  walletAddress?: string;
  createdAt: string;
}

export async function updateUserWallet(walletAddress: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('users')
    .update({ wallet_address: walletAddress })
    .eq('id', (await supabase.auth.getUser()).data.user?.id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    email: data.email,
    role: data.role,
    walletAddress: data.wallet_address,
    createdAt: data.created_at,
  };
}

export async function updateUserRole(role: 'PROPERTY_OWNER' | 'INVESTOR'): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', (await supabase.auth.getUser()).data.user?.id);

  if (error) {
    throw new Error(error.message);
  }
}
