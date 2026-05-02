export interface User {
  id: string;
  username: string;
  email: string;
  ageRange: '10-18' | '19-45' | '46-60';
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, ageRange: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface Question {
  _id: string;
  question: string;
  type: 'pattern' | 'logic' | 'spatial' | 'numerical' | 'memory' | 'abstract';
  difficulty: number;
  iq_section: '50-100' | '100-150' | '150+';
  source: 'dataset' | 'ai';
  options: string[];
  correct_answer?: string;
  time_limit: number;
  explanation?: string;
}

export interface TestResponse {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

export interface TestResult {
  _id: string;
  accuracy: number;
  estimatedIQ: number;
  totalTime: number;
  averageTimePerQuestion: number;
  iq_section: '50-100' | '100-150' | '150+';
  categoricalScores: {
    pattern: number;
    logic: number;
    spatial: number;
    numerical: number;
    memory: number;
    abstract: number;
  };
  cognitiveStrengths: string[];
  weaknesses: string[];
  recommendations: string[];
  completedAt: string;
}
