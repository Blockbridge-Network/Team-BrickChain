'use client';

import { ThirdwebProvider } from "thirdweb/react";
import { ethereum } from "thirdweb/chains";
import { createThirdwebClient } from "thirdweb";
import { ThemeProvider } from "../components/ui/ThemeProvider";
import { createBrowserClient } from '@supabase/ssr';
import { AuthProvider } from '../contexts/AuthContext';
import { OnboardingProvider } from '../contexts/OnboardingContext';

// Initialize Supabase client
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Initialize Thirdweb client
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID
});

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThirdwebProvider client={client} activeChain={ethereum}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >        <AuthProvider supabaseClient={supabase}>
          <OnboardingProvider>
            {children}
          </OnboardingProvider>
        </AuthProvider>
      </ThemeProvider>
    </ThirdwebProvider>
  );
}