import axios from 'axios';

// Base URL for the HueFi backend
const BASE_URL = 'https://huefi.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const register = (userData: any) => api.post('/auth/register', userData).then(res => res.data);
export const login = (credentials: any) => api.post('/auth/login', credentials).then(res => res.data);

export const getBalance = () => api.get('/wallet/balance').then(res => res.data);
export const sendToken = (data: any) => api.post('/wallet/send', data).then(res => res.data);
export const getTransactions = () => api.get('/wallet/transactions').then(res => res.data);

export const getMnemonic = () => api.get('/setting/mnemonic').then(res => res.data);
export const getLeaderboard = () => api.get('/leaderboard').then(res => res.data);

export default api;