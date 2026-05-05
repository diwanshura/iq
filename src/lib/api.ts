import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authAPI = {
  signup: (username: string, email: string, password: string, ageRange: string) =>
    api.post('/auth/signup', { username, email, password, ageRange }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  logout: () =>
    api.post('/auth/logout'),
  getCurrentUser: () =>
    api.get('/auth/current-user').catch(error => {
      // 401 is expected for unauthenticated users
      if (error.response?.status === 401) {
        throw error;
      }
      throw error;
    })
};

export const questionsAPI = {
  getQuestions: (iq_section: string, count: number = 30) =>
    api.get('/questions', { params: { iq_section, count } }),
  submitAnswer: (testId: string, questionId: string, answer: string, timeSpent: number) =>
    api.post(`/tests/${testId}/answers`, { questionId, answer, timeSpent })
};

export const testAPI = {
  createTest: (iq_section: string) =>
    api.post('/tests', { iq_section }),
  getTest: (testId: string) =>
    api.get(`/tests/${testId}`),
  submitTest: (testId: string) =>
    api.post(`/tests/${testId}/submit`),
  getUserTests: () =>
    api.get('/tests')
};

export const resultsAPI = {
  getResult: (resultId: string) =>
    api.get(`/results/${resultId}`),
  getUserResults: () =>
    api.get('/results')
};

export default api;
