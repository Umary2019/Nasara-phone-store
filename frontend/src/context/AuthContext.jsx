import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiGet, apiPost } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem('nasara_access_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiGet('/auth/me');
        setUser(response.user);
      } catch {
        localStorage.removeItem('nasara_access_token');
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (payload) => {
    const response = await apiPost('/auth/login', payload);
    localStorage.setItem('nasara_access_token', response.accessToken);
    setUser(response.user);
    return response;
  };

  const register = async (payload) => {
    const response = await apiPost('/auth/register', payload);
    localStorage.setItem('nasara_access_token', response.accessToken);
    setUser(response.user);
    return response;
  };

  const logout = async () => {
    try {
      await apiPost('/auth/logout');
    } finally {
      localStorage.removeItem('nasara_access_token');
      setUser(null);
    }
  };

  const value = useMemo(() => ({ user, loading, login, register, logout, setUser }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
