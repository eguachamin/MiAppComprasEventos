import { API_URL } from '@env';
import axios from 'axios';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export default api;