import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nasara_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshingPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshingPromise) {
        refreshingPromise = api.post('/auth/refresh').finally(() => {
          refreshingPromise = null;
        });
      }

      try {
        const response = await refreshingPromise;
        if (response.data?.accessToken) {
          localStorage.setItem('nasara_access_token', response.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return api(originalRequest);
        }
      } catch {
        localStorage.removeItem('nasara_access_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export async function apiGet(path, params) {
  const { data } = await api.get(path, { params });
  return data;
}

export async function apiPost(path, payload) {
  const { data } = await api.post(path, payload);
  return data;
}

export async function apiPut(path, payload) {
  const { data } = await api.put(path, payload);
  return data;
}

export async function apiDelete(path) {
  const { data } = await api.delete(path);
  return data;
}
