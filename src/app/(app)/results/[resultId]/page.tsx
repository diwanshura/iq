'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { resultsAPI } from '@/lib/api';
import { TestResult } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ResultsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const resultId = params.resultId as string;

  const [result, setResult] = useState<TestResult | null>(null);
  const [resultLoading, setResultLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    const fetchResult = async () => {
      try {
        const response = await resultsAPI.getResult(resultId);
        setResult(response.data);
      } catch (error) {
        console.error('Failed:', error);
        router.push('/');
      } finally {
        setResultLoading(false);
      }
    };

    if (resultId) fetchResult();
  }, [user, loading, router, resultId]);

  if (resultLoading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>;
  if (!result) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="text-white">No results found</div></div>;

  const categoryData = Object.entries(result.categoricalScores).map(([name, score]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    score
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-12 text-center">Test Results</h1>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-600 rounded-lg p-6 text-white">
            <p className="text-sm opacity-80 mb-2">Estimated IQ</p>
            <p className="text-4xl font-bold">{result.estimatedIQ}</p>
          </div>
          <div className="bg-green-600 rounded-lg p-6 text-white">
            <p className="text-sm opacity-80 mb-2">Accuracy</p>
            <p className="text-4xl font-bold">{result.accuracy.toFixed(1)}%</p>
          </div>
          <div className="bg-purple-600 rounded-lg p-6 text-white">
            <p className="text-sm opacity-80 mb-2">Avg Time/Q</p>
            <p className="text-4xl font-bold">{result.averageTimePerQuestion.toFixed(1)}s</p>
          </div>
          <div className="bg-yellow-600 rounded-lg p-6 text-white">
            <p className="text-sm opacity-80 mb-2">Level</p>
            <p className="text-4xl font-bold">{result.iq_section}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Category Scores</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="score" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-green-900 bg-opacity-30 rounded-lg p-6 border border-green-700">
            <h3 className="text-lg font-semibold text-green-400 mb-4">Analysis</h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-green-300 mb-2">Strengths:</p>
                {result.cognitiveStrengths.map((s, i) => <p key={i} className="text-green-300">✓ {s}</p>)}
              </div>
              <div>
                <p className="font-semibold text-yellow-300 mb-2">Recommendations:</p>
                {result.recommendations.slice(0, 2).map((r, i) => <p key={i} className="text-yellow-300 text-sm">→ {r}</p>)}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/test" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg mr-4">
            Take Another Test
          </Link>
          <Link href="/" className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-lg">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}