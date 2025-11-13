import axios from 'axios';
import { Meeting, Note } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Meetings API
export const meetingsApi = {
  getAll: async (): Promise<Meeting[]> => {
    const response = await api.get('/meetings');
    return response.data;
  },

  getById: async (id: string): Promise<Meeting> => {
    const response = await api.get(`/meetings/${id}`);
    return response.data;
  },

  create: async (meeting: Partial<Meeting>): Promise<Meeting> => {
    const response = await api.post('/meetings', meeting);
    return response.data;
  },

  update: async (id: string, meeting: Partial<Meeting>): Promise<Meeting> => {
    const response = await api.put(`/meetings/${id}`, meeting);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/meetings/${id}`);
  },
};

// Notes API
export const notesApi = {
  getAll: async (): Promise<Note[]> => {
    const response = await api.get('/notes');
    return response.data;
  },

  getByMeetingId: async (meetingId: string): Promise<Note[]> => {
    const response = await api.get(`/notes/meeting/${meetingId}`);
    return response.data;
  },

  generate: async (meetingId: string, transcript: string): Promise<Note> => {
    const response = await api.post('/notes/generate', { meetingId, transcript });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },
};

// Schedule API
export const scheduleApi = {
  getUpcoming: async (): Promise<Meeting[]> => {
    const response = await api.get('/schedule/upcoming');
    return response.data;
  },

  getRange: async (start: string, end: string): Promise<Meeting[]> => {
    const response = await api.get(`/schedule/range?start=${start}&end=${end}`);
    return response.data;
  },
};

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  signup: async (name: string, email: string, password: string) => {
    const response = await api.post('/api/auth/register', { name, email, password });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },
};

export default api;
