import axios from 'axios';
export const BASE_URL = '/api';

export const NewInstance = axios.create({
  // Configuration
  baseURL: BASE_URL,
  headers: {
    accept: 'application/json',
  },
});
