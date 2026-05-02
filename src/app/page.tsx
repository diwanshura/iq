'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-white mb-4">
          Adaptive IQ Assessment
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          Experience an intelligent, adaptive cognitive assessment that adjusts to your performance in real-time.
        </p>

        {user ? (
          <div className="space-y-4">
            <p className="text-lg text-slate-400">Welcome, <span className="font-semibold text-blue-400">{user.username}</span></p>
            <Link
              href="/test"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition transform hover:scale-105"
            >
              Start Test
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <Link
              href="/signup"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition"
            >
              Get Started
            </Link>
            <p className="text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="grid grid-cols-3 gap-4 text-left">
            <div>
              <h3 className="font-semibold text-white mb-2">🧠 Adaptive</h3>
              <p className="text-sm text-slate-400">Difficulty adjusts based on your performance</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">📊 Analytics</h3>
              <p className="text-sm text-slate-400">Detailed insights into cognitive strengths</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">🎯 Accurate</h3>
              <p className="text-sm text-slate-400">Based on proven cognitive science</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-xs text-slate-500">
          <p>⚠️ This is not a clinically certified IQ test. Results are for educational purposes only.</p>
        </div>
      </div>
    </div>
  );
}
