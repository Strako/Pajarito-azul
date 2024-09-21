import axios from 'axios';
export const BASE_URL = '/api';

export const NewInstance = axios.create({
  // Configuration
  baseURL: BASE_URL,
  headers: {
    accept: 'application/json',
  },
});

export function setAuthToken(token: string | null) {
  NewInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

NewInstance.interceptors.request.use(
  (config) => {
    const authToken = sessionStorage.getItem('auth_token');
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
