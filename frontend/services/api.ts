import axios from 'axios';

const API_BASE = 'http://localhost:3000'; // Ajuste conforme seu backend

const api = axios.create({
  baseURL: API_BASE,
});

// Adiciona o token JWT no header Authorization automaticamente
api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
