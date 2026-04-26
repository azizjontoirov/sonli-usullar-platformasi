import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Token qo'shish
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xatolik ushlash
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

// Hisoblash API
export const calcAPI = {
  // CRUD
  save: (data) => api.post('/calculations', data),
  getHistory: (params) => api.get('/calculations', { params }),
  delete: (id) => api.delete(`/calculations/${id}`),

  // Matematik usullar
  gorner: (data) => api.post('/calculations/gorner', data),
  taylor: (data) => api.post('/calculations/taylor', data),
  newton: (data) => api.post('/calculations/newton', data),
  iteration: (data) => api.post('/calculations/iteration', data),
  transport: (data) => api.post('/calculations/transport', data),
  investment: (data) => api.post('/calculations/investment', data),
};

export default api;
