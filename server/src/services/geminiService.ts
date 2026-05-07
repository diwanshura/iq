import { GoogleGenerativeAI } from '@google/generative-ai';
import type { IQuestion } from '../models/Question.js';

interface GeneratedQuestion {
  question: string;
  type: string;
  difficulty: number;
  iq_section: string;
  source: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface AnalysisResult {
  cognitiveStrengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const fallbackQuestions: Record<string, GeneratedQuestion[]> = {
  pattern: [
    {
      question: "What comes next in the sequence: 2, 4, 6, 8, ?",
      type: "pattern",
      difficulty: 3,
      iq_section: "50-100",
      source: "ai",
      options: ["10", "12", "11", "9"],
      correct_answer: "10",
      explanation: "The pattern increases by 2 each time"
    }
  ],
  logic: [
    {
      question: "All cats are animals. Fluffy is a cat. Therefore, Fluffy is an ?",
      type: "logic",
      difficulty: 3,
      iq_section: "50-100",
      source: "ai",
      options: ["animal", "mammal", "cat", "pet"],
      correct_answer: "animal",
      explanation: "Deductive reasoning - valid logical conclusion"
    }
  ],
  spatial: [
    {
      question: "A cube has 6 faces. How many edges does it have?",
      type: "spatial",
      difficulty: 4,
      iq_section: "100-150",
      source: "ai",
      options: ["12", "8", "10", "14"],
      correct_answer: "12",
      explanation: "A cube has 12 edges connecting its vertices"
    }
  ],
  numerical: [
    {
      question: "What is 15% of 200?",
      type: "numerical",
      difficulty: 3,
      iq_section: "50-100",
      source: "ai",
      options: ["30", "25", "35", "40"],
      correct_answer: "30",
      explanation: "15/100 × 200 = 30"
    }
  ],
  abstract: [
    {
      question: "Complete the analogy: Dog is to Bark as Cat is to ?",
      type: "abstract",
      difficulty: 4,
      iq_section: "100-150",
      source: "ai",
      options: ["Meow", "Run", "Eat", "Sleep"],
      correct_answer: "Meow",
      explanation: "Both describe the characteristic sound an animal makes"
    }
  ],
  memory: [
    {
      question: "If you were shown the sequence 7, 3, 9, 2, 5 for 3 seconds, which would you remember first?",
      type: "memory",
      difficulty: 5,
      iq_section: "100-150",
      source: "ai",
      options: ["7", "3", "9", "2"],
      correct_answer: "7",
      explanation: "The first item in a sequence is typically easier to recall (primacy effect)"
    }
  ]
};

const fallbackAnalysis = {
  lowAccuracy: {
    cognitiveStrengths: ["Problem-solving persistence"],
    weaknesses: ["Pattern recognition", "Logical reasoning"],
    recommendations: [
      "Practice fundamental logic patterns and deductive reasoning",
      "Work on visual pattern recognition exercises",
      "Build foundational math skills through incremental practice"
    ]
  },
  mediumAccuracy: {
    cognitiveStrengths: ["Logical thinking", "Pattern recognition"],
    weaknesses: ["Spatial reasoning"],
    recommendations: [
      "Strengthen spatial visualization through mental rotation exercises",
      "Practice complex problem-solving with multiple variables",
      "Develop faster mental math for time-sensitive questions"
    ]
  },
  highAccuracy: {
    cognitiveStrengths: ["Abstract reasoning", "Logical deduction"],
    weaknesses: ["Attention to detail"],
    recommendations: [
      "Challenge yourself with advanced problem-solving scenarios",
      "Explore complex spatial and abstract reasoning",
      "Develop speed without sacrificing accuracy"
    ]
  }
};

export const generateQuestionWithGemini = async (
  category: string,
  difficulty: number,
  iq_section: string
): Promise<GeneratedQuestion> => {
  if (!process.env.GEMINI_API_KEY) {
    return getFallbackQuestion(category, difficulty, iq_section);
  }

  try {
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });

    const prompt = `Generate a unique IQ test question for the following:

Category: ${category}
Difficulty Level: ${difficulty} (1-10 scale)
Target IQ Section: ${iq_section}

Requirements:
- The question must be original and not repeat common formats
- Include exactly 4 multiple choice options
- One option must be the correct answer
- Provide a clear explanation for why the correct answer is right
- The question should test ${category} cognitive abilities

Return ONLY valid JSON with no markdown formatting:
{
  "question": "the question text here",
  "options": ["option A", "option B", "option C", "option D"],
  "correct_answer": "the correct option text",
  "explanation": "explanation of the correct answer"
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return getFallbackQuestion(category, difficulty, iq_section);
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      question: parsed.question,
      type: category,
      difficulty,
      iq_section,
      source: 'ai',
      options: parsed.options,
      correct_answer: parsed.correct_answer,
      explanation: parsed.explanation
    };
  } catch (error) {
    console.error('Gemini question generation failed:', error);
    return getFallbackQuestion(category, difficulty, iq_section);
  }
};

export const generateAnalysisWithGemini = async (
  categoryScores: Record<string, number>,
  accuracy: number,
  estimatedIQ: number,
  iq_section: string,
  averageTimePerQuestion: number
): Promise<AnalysisResult> => {
  if (!process.env.GEMINI_API_KEY) {
    return getFallbackAnalysis(accuracy);
  }

  try {
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });

    const categoryBreakdown = Object.entries(categoryScores)
      .map(([cat, score]) => `${cat}: ${score.toFixed(1)}%`)
      .join('\n  ');

    const prompt = `Analyze this IQ test performance and generate highly personalized recommendations:

Performance Metrics:
- Estimated IQ: ${estimatedIQ}
- Overall Accuracy: ${accuracy.toFixed(1)}%
- Test Level: ${iq_section}
- Average Time per Question: ${averageTimePerQuestion.toFixed(1)}s

Category Performance Breakdown:
  ${categoryBreakdown}

Based on ONLY these actual scores, provide:
1. TWO specific cognitive strengths (categories where score > 65%)
2. TWO specific cognitive weaknesses (categories where score < 55%)
3. THREE actionable, personalized recommendations

Make recommendations specific to the weak areas and build on the strong areas.
Be encouraging but honest about areas needing improvement.

Return ONLY valid JSON with no markdown formatting:
{
  "cognitiveStrengths": ["strength1 based on high score category", "strength2 based on high score category"],
  "weaknesses": ["weakness1 based on low score category", "weakness2 based on low score category"],
  "recommendations": ["specific recommendation 1", "specific recommendation 2", "specific recommendation 3"]
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return getFallbackAnalysis(accuracy);
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      cognitiveStrengths: Array.isArray(parsed.cognitiveStrengths) ? parsed.cognitiveStrengths.slice(0, 2) : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses.slice(0, 2) : [],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.slice(0, 3) : []
    };
  } catch (error) {
    console.error('Gemini analysis generation failed:', error);
    return getFallbackAnalysis(accuracy);
  }
};

function getFallbackQuestion(category: string, difficulty: number, iq_section: string): GeneratedQuestion {
  const questions = fallbackQuestions[category] || fallbackQuestions.pattern;
  const baseQuestion = questions[Math.floor(Math.random() * questions.length)];

  return {
    ...baseQuestion,
    difficulty,
    iq_section
  };
}

function getFallbackAnalysis(accuracy: number): AnalysisResult {
  if (accuracy < 50) {
    return fallbackAnalysis.lowAccuracy;
  } else if (accuracy < 75) {
    return fallbackAnalysis.mediumAccuracy;
  } else {
    return fallbackAnalysis.highAccuracy;
  }
}

export default {
  generateQuestionWithGemini,
  generateAnalysisWithGemini
};
