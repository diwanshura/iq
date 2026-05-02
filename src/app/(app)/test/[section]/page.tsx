'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { testAPI, questionsAPI } from '@/lib/api';
import { Question } from '@/types';
import { motion } from 'framer-motion';

export default function TestPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const section = params.section as string;

  const [testId, setTestId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [testLoading, setTestLoading] = useState(true);
  const [testSubmitting, setTestSubmitting] = useState(false);

  // Load test on mount
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    const initializeTest = async () => {
      try {
        const response = await testAPI.createTest(section);
        setTestId(response.data.testId);
        setQuestions(response.data.questions);
        const currentQuestion = response.data.questions[0];
        setTimeRemaining(currentQuestion.time_limit);
      } catch (error) {
        console.error('Failed to create test:', error);
        router.push('/test');
      } finally {
        setTestLoading(false);
      }
    };

    initializeTest();
  }, [user, loading, router, section]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0 || !testId) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, testId]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeRemaining === 0 && testId && questions.length > 0) {
      handleSubmitAnswer();
    }
  }, [timeRemaining, testId, questions]);

  const handleSubmitAnswer = async () => {
    if (!testId || !selectedAnswer || currentQuestionIndex >= questions.length) return;

    const currentQuestion = questions[currentQuestionIndex];
    const timeSpent = currentQuestion.time_limit - timeRemaining;

    try {
      await questionsAPI.submitAnswer(
        testId,
        currentQuestion._id,
        selectedAnswer,
        timeSpent
      );

      const nextIndex = currentQuestionIndex + 1;

      if (nextIndex >= questions.length) {
        // Complete test
        await testAPI.submitTest(testId);
        router.push(`/results/${testId}`);
      } else {
        // Move to next question
        setCurrentQuestionIndex(nextIndex);
        setSelectedAnswer(null);
        const nextQuestion = questions[nextIndex];
        setTimeRemaining(nextQuestion.time_limit);
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  if (testLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-lg">Loading test...</div>
      </div>
    );
  }

  if (!testId || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-lg">Failed to load test.</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const timerColor =
    timeRemaining > 10 ? 'text-green-400' :
    timeRemaining > 5 ? 'text-yellow-400' :
    'text-red-400';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Question {currentQuestionIndex + 1} of {questions.length}</h1>
            <p className="text-slate-400">IQ Section: {section}</p>
          </div>
          <div className={`text-4xl font-bold ${timerColor}`}>
            {timeRemaining}s
          </div>
        </div>

        <div className="mb-8 bg-slate-700 rounded-full h-2 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <motion.div
          className="bg-slate-800 rounded-lg p-8 mb-8 border border-slate-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={currentQuestion._id}
        >
          <p className="text-slate-400 text-sm mb-4">
            Type: <span className="capitalize font-semibold text-blue-400">{currentQuestion.type}</span> |
            Difficulty: <span className="font-semibold text-yellow-400">{currentQuestion.difficulty}/10</span>
          </p>
          <h2 className="text-2xl font-semibold text-white mb-8">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, idx) => (
              <motion.button
                key={idx}
                onClick={() => setSelectedAnswer(option)}
                className={`w-full p-4 rounded-lg border-2 transition text-left font-medium ${
                  selectedAnswer === option
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : 'bg-slate-700 border-slate-600 text-slate-200 hover:border-blue-400'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {option}
              </motion.button>
            ))}
          </div>

          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer || testSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            {testSubmitting ? 'Submitting...' : currentQuestionIndex === questions.length - 1 ? 'Complete Test' : 'Next Question'}
          </button>
        </motion.div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-slate-400 text-sm mb-3">Jump to question:</p>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`aspect-square rounded text-sm font-medium transition ${
                  idx === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
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
