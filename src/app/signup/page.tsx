'use client';

import SignupForm from '@/components/auth/SignupForm';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Join BrickEarn</h1>
        <p className="text-gray-400">Start your real estate investment journey today</p>
      </div>
      
      <SignupForm />
      
      <p className="mt-4 text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="text-purple-500 hover:text-purple-400">
          Sign in
        </Link>
      </p>
    </main>
  );
}
