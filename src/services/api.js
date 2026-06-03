import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Axios instance - automatically attaches JWT token to every request
const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────────
export const register = (data) => api.post('/auth/register', data);
export const login    = (data) => api.post('/auth/login', data);

// ── Scam check ───────────────────────────────────────────────────
export const checkCompany = (data) => api.post('/scam/check', data);

// ── Community reports ────────────────────────────────────────────
export const getReports    = (page = 0, sort = 'recent') =>
  api.get(`/scam/reports?page=${page}&size=10&sort=${sort}`);
export const getReport     = (id) => api.get(`/scam/reports/${id}`);
export const createReport  = (data) => api.post('/scam/reports', data);
export const upvoteReport  = (id) => api.post(`/scam/reports/${id}/upvote`);
export const deleteReport  = (id) => api.delete(`/scam/reports/${id}`);

export default api;