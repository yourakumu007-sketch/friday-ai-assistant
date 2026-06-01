import { useState, useCallback } from 'react';
import { apiClient } from '../services/api';
import { Task, ChatMessage } from '../types/index';
import toast from 'react-hot-toast';

export const useAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tasks
  const createTask = useCallback(async (title: string, description?: string, priority?: string, dueDate?: string) => {
    setLoading(true);
    try {
      const response = await apiClient.createTask(title, description, priority, dueDate);
      toast.success('Task created!');
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to create task';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (taskId: string, data: Partial<Task>) => {
    setLoading(true);
    try {
      const response = await apiClient.updateTask(taskId, data);
      toast.success('Task updated!');
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to update task';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    setLoading(true);
    try {
      await apiClient.deleteTask(taskId);
      toast.success('Task deleted!');
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to delete task';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Chat
  const sendMessage = useCallback(async (message: string, language: string = 'en') => {
    setLoading(true);
    try {
      const response = await apiClient.sendMessage(message, language);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to send message';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    sendMessage,
  };
};
