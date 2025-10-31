import axios from 'axios';
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
export const api = axios.create({ baseURL: BASE, timeout: 10000 });
