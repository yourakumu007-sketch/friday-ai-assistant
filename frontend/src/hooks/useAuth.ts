import { useState, useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import { apiClient } from '../services/api';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const { user, setUser, setToken } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(
    async (username: string, email: string, password: string, language: string = 'en') => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.register(username, email, password, language);
        setUser(response.data.user);
        setToken(response.data.access_token);
        toast.success('Registration successful!');
        return response;
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Registration failed';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setToken]
  );

  const login = useCallback(
    async (username: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.login(username, password);
        setUser(response.data.user);
        setToken(response.data.access_token);
        toast.success('Login successful!');
        return response;
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Login failed';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setToken]
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    toast.success('Logged out successfully');
  }, [setUser, setToken]);

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
  };
};
