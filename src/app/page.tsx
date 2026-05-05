'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Client-only mount gate so auth redirect does not run during SSR markup.
  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  useEffect(() => {
    if (!loading && !user && mounted) {
      router.push('/login');
    }
  }, [user, loading, router, mounted]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">IQ</span>
            </div>
            <span className="font-semibold text-gray-900">Adaptive IQ</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Welcome, <span className="font-semibold text-gray-900">{user.username}</span></span>
                <button
                  onClick={() => router.push('/test')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
                >
                  Dashboard
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Sign in
                </Link>
                <Link href="/signup" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
            <span className="text-sm font-medium text-indigo-700">🚀 Next-Gen Cognitive Assessment</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Unlock Your <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Cognitive Potential</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience an intelligent, adaptive assessment that adjusts in real-time to your performance. Get precise insights into your cognitive strengths and areas for growth.
          </p>

          {user ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/test"
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Continue to Dashboard
              </Link>
              <Link
                href="/test"
                className="px-8 py-4 border-2 border-gray-200 text-gray-900 rounded-lg font-semibold hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200"
              >
                View Results
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Assessment
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 border-2 border-gray-200 text-gray-900 rounded-lg font-semibold hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Adaptive IQ?</h2>
            <p className="text-lg text-gray-600">Experience the future of cognitive assessment</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🧠',
                title: 'Intelligent Adaptation',
                description: 'Difficulty adjusts in real-time based on your performance for the most accurate assessment'
              },
              {
                icon: '📊',
                title: 'Deep Analytics',
                description: 'Detailed insights into your cognitive strengths, weaknesses, and areas for improvement'
              },
              {
                icon: '🎯',
                title: 'Science-Backed',
                description: 'Built on proven cognitive science principles and research-validated methodology'
              },
              {
                icon: '⚡',
                title: 'Fast & Efficient',
                description: 'Get comprehensive results in minutes, not hours. Optimized for your time'
              },
              {
                icon: '🔒',
                title: 'Private & Secure',
                description: 'Your data is encrypted and never shared. Complete privacy guaranteed'
              },
              {
                icon: '📈',
                title: 'Track Progress',
                description: 'Monitor your cognitive development over time with detailed historical data'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 bg-white hover:bg-indigo-50/30"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10K+', label: 'Active Users' },
              { number: '98%', label: 'Accuracy Rate' },
              { number: '4.9★', label: 'User Rating' },
              { number: '2m', label: 'Avg. Duration' }
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Discover Your Potential?</h2>
          <p className="text-lg opacity-90 mb-8">Join thousands of users discovering their cognitive strengths today</p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
          >
            Get Started Free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 py-12 px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IQ</span>
                </div>
                <span className="font-semibold text-gray-900">Adaptive IQ</span>
              </div>
              <p className="text-sm text-gray-600">Next-gen cognitive assessment platform</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Disclaimer</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-600 mb-4 md:mb-0">
              ⚠️ This is not a clinically certified IQ test. Results are for educational purposes only.
            </p>
            <p className="text-sm text-gray-500">&copy; 2024 Adaptive IQ. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
