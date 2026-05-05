'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { testAPI, questionsAPI } from '@/lib/api';
import { Question } from '@/types';
import { motion } from 'framer-motion';
import { slugToIqSection, getLevelBySlug, iqSectionDisplayName } from '@/lib/test-levels';
import Link from 'next/link';

export default function TestPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const levelParam = typeof params.level === 'string' ? params.level : '';

  const iq_section = slugToIqSection(levelParam);
  const levelMeta = getLevelBySlug(levelParam.toLowerCase());

  const [testId, setTestId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [testLoading, setTestLoading] = useState(true);
  const [testSubmitting, setTestSubmitting] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!iq_section || !user || loading) {
      if (!loading && user && !iq_section) {
        router.replace('/test');
      }
      return;
    }

    let cancelled = false;

    const initializeTest = async () => {
      setTestLoading(true);
      setInitError(null);
      try {
        const response = await testAPI.createTest(iq_section);
        if (cancelled) return;
        setTestId(response.data.testId);
        setQuestions(response.data.questions);
        const currentQuestion = response.data.questions[0];
        setTimeRemaining(currentQuestion.time_limit);
      } catch (err: unknown) {
        if (cancelled) return;
        const ax = err as { response?: { data?: { detail?: string; error?: string } } };
        const detail = ax.response?.data?.detail ?? ax.response?.data?.error;
        setInitError(typeof detail === 'string' ? detail : 'Could not start this assessment. Please try again.');
        setTestId(null);
        setQuestions([]);
      } finally {
        if (!cancelled) setTestLoading(false);
      }
    };

    initializeTest();
    return () => {
      cancelled = true;
    };
  }, [user, loading, router, iq_section]);

  useEffect(() => {
    if (timeRemaining <= 0 || !testId) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, testId]);

  const handleSubmitAnswer = useCallback(async () => {
    if (!testId || !selectedAnswer || currentQuestionIndex >= questions.length) return;

    const currentQuestion = questions[currentQuestionIndex];
    const timeSpent = currentQuestion.time_limit - timeRemaining;

    setTestSubmitting(true);
    try {
      await questionsAPI.submitAnswer(testId, currentQuestion._id, selectedAnswer, timeSpent);

      const nextIndex = currentQuestionIndex + 1;

      if (nextIndex >= questions.length) {
        const submitRes = await testAPI.submitTest(testId);
        const resultId = submitRes?.data?.resultId as string | undefined;
        router.push(resultId ? `/results/${resultId}` : '/test');
      } else {
        setCurrentQuestionIndex(nextIndex);
        setSelectedAnswer(null);
        const nextQuestion = questions[nextIndex];
        setTimeRemaining(nextQuestion.time_limit);
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setTestSubmitting(false);
    }
  }, [testId, selectedAnswer, currentQuestionIndex, questions, timeRemaining, router]);

  useEffect(() => {
    if (timeRemaining !== 0 || !testId || questions.length === 0 || !selectedAnswer) return;
    const id = window.setTimeout(() => {
      void handleSubmitAnswer();
    }, 0);
    return () => window.clearTimeout(id);
  }, [timeRemaining, testId, questions.length, selectedAnswer, handleSubmitAnswer]);

  if (!iq_section) {
    return null;
  }

  if (testLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-indigo-500" />
          <p className="text-sm text-zinc-400">Preparing your session…</p>
          {levelMeta && <p className="mt-2 text-xs text-zinc-600">{levelMeta.title} · {iqSectionDisplayName(iq_section)}</p>}
        </div>
      </div>
    );
  }

  if (initError || !testId || questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-950 px-4">
        <div className="max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 text-center backdrop-blur-sm">
          <h1 className="text-lg font-semibold text-white">Something went wrong</h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">{initError ?? 'No questions were returned for this track.'}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => router.refresh()}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              Retry
            </button>
            <Link
              href="/test"
              className="rounded-xl border border-zinc-700 px-4 py-2.5 text-center text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800"
            >
              Pick another level
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const timerColor =
    timeRemaining > 10 ? 'text-emerald-400' : timeRemaining > 5 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              {levelMeta?.title ?? 'Assessment'} · {iqSectionDisplayName(iq_section)}
            </p>
            <h1 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h1>
          </div>
          <div className={`font-mono text-4xl font-bold tabular-nums ${timerColor}`}>{timeRemaining}s</div>
        </div>

        <div className="mb-8 h-2 overflow-hidden rounded-full bg-zinc-800">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <motion.div
          className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl backdrop-blur-sm sm:p-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={currentQuestion._id}
        >
          <p className="mb-4 text-xs text-zinc-500">
            Type <span className="font-semibold capitalize text-indigo-400">{currentQuestion.type}</span>
            <span className="mx-2 text-zinc-700">·</span>
            Difficulty <span className="font-semibold text-amber-400">{currentQuestion.difficulty}/10</span>
          </p>
          <h2 className="mb-8 text-lg font-medium leading-relaxed text-white sm:text-xl">{currentQuestion.question}</h2>

          <div className="mb-8 space-y-2.5">
            {currentQuestion.options.map((option, idx) => (
              <motion.button
                key={idx}
                type="button"
                onClick={() => setSelectedAnswer(option)}
                className={`w-full rounded-xl border-2 px-4 py-3.5 text-left text-sm font-medium transition sm:text-base ${
                  selectedAnswer === option
                    ? 'border-indigo-500 bg-indigo-500/15 text-white shadow-lg shadow-indigo-950/40'
                    : 'border-zinc-700 bg-zinc-800/40 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800/70'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {option}
              </motion.button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => void handleSubmitAnswer()}
            disabled={!selectedAnswer || testSubmitting}
            className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400 disabled:shadow-none"
          >
            {testSubmitting ? 'Submitting…' : currentQuestionIndex === questions.length - 1 ? 'Complete test' : 'Next question'}
          </button>
        </motion.div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 backdrop-blur-sm">
          <p className="mb-3 text-xs font-medium text-zinc-500">Jump to question</p>
          <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCurrentQuestionIndex(idx);
                  setSelectedAnswer(null);
                  setTimeRemaining(questions[idx].time_limit);
                }}
                className={`aspect-square rounded-lg text-xs font-medium transition sm:text-sm ${
                  idx === currentQuestionIndex ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
