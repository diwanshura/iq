'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TestSelectorPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Select Your Test Level</h1>
          <p className="text-slate-300">Choose a difficulty level that matches your cognitive abilities</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* IQ 50-100 Section */}
          <Link href="/test/50-100">
            <div className="h-full bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-8 cursor-pointer hover:shadow-lg hover:scale-105 transition transform text-white">
              <div className="text-4xl font-bold mb-2">🟢</div>
              <h2 className="text-2xl font-bold mb-2">Basic Level</h2>
              <p className="text-sm mb-4">IQ 50-100</p>
              <p className="text-sm opacity-90 mb-4">
                Ideal for beginners and younger users. Simple patterns and basic logical reasoning.
              </p>
              <div className="text-xs bg-white bg-opacity-20 rounded px-3 py-1 inline-block">
                ⏱️ ~20-30 minutes
              </div>
            </div>
          </Link>

          {/* IQ 100-150 Section */}
          <Link href="/test/100-150">
            <div className="h-full bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-8 cursor-pointer hover:shadow-lg hover:scale-105 transition transform text-white">
              <div className="text-4xl font-bold mb-2">🟡</div>
              <h2 className="text-2xl font-bold mb-2">Advanced Level</h2>
              <p className="text-sm mb-4">IQ 100-150</p>
              <p className="text-sm opacity-90 mb-4">
                For average to highly intelligent users. Multi-step logic and abstract reasoning.
              </p>
              <div className="text-xs bg-white bg-opacity-20 rounded px-3 py-1 inline-block">
                ⏱️ ~25-40 minutes
              </div>
            </div>
          </Link>

          {/* IQ 150+ Section */}
          <Link href="/test/150+">
            <div className="h-full bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-8 cursor-pointer hover:shadow-lg hover:scale-105 transition transform text-white">
              <div className="text-4xl font-bold mb-2">🔴</div>
              <h2 className="text-2xl font-bold mb-2">Elite Level</h2>
              <p className="text-sm mb-4">IQ 150+</p>
              <p className="text-sm opacity-90 mb-4">
                For high performers. Cross-domain reasoning and deep abstract thinking.
              </p>
              <div className="text-xs bg-white bg-opacity-20 rounded px-3 py-1 inline-block">
                ⏱️ ~20-30 minutes (fast-paced)
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-12 bg-slate-800 rounded-lg p-6 text-slate-300">
          <h3 className="text-lg font-semibold text-white mb-3">How to Choose:</h3>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Basic Level:</strong> Start here if you're unsure about your ability level</li>
            <li>• <strong>Advanced Level:</strong> Choose this if you consider yourself above average in problem-solving</li>
            <li>• <strong>Elite Level:</strong> Select this if you're confident in your cognitive abilities</li>
          </ul>
          <p className="mt-4 text-xs italic">The test will automatically adjust in difficulty based on your performance</p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-slate-400 hover:text-white transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
