import axios, { AxiosInstance } from 'axios';
import { User, Task, Reminder, ChatMessage, AuthResponse, APIResponse } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_V1 = `${API_BASE_URL}/api/v1`;

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_V1,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Auth
  async register(username: string, email: string, password: string, preferredLanguage: string = 'en'): Promise<AuthResponse> {
    const response = await this.client.post('/auth/register', {
      username,
      email,
      password,
      preferred_language: preferredLanguage,
    });
    return response.data;
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post('/auth/login', {
      username,
      password,
    });
    return response.data;
  }

  async refreshToken(token: string): Promise<APIResponse<{ access_token: string }>> {
    const response = await this.client.post('/auth/refresh', { token });
    return response.data;
  }

  // Tasks
  async getTasks(status?: string, priority?: string): Promise<APIResponse<any>> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (priority) params.append('priority', priority);
    const response = await this.client.get(`/tasks?${params}`);
    return response.data;
  }

  async createTask(title: string, description?: string, priority: string = 'MEDIUM', dueDate?: string): Promise<APIResponse<Task>> {
    const response = await this.client.post('/tasks', {
      title,
      description,
      priority,
      due_date: dueDate,
    });
    return response.data;
  }

  async updateTask(taskId: string, data: Partial<Task>): Promise<APIResponse<Task>> {
    const response = await this.client.put(`/tasks/${taskId}`, data);
    return response.data;
  }

  async deleteTask(taskId: string): Promise<APIResponse<null>> {
    const response = await this.client.delete(`/tasks/${taskId}`);
    return response.data;
  }

  // Chat
  async sendMessage(message: string, language: string = 'en'): Promise<APIResponse<ChatMessage>> {
    const response = await this.client.post('/chat', {
      message,
      language,
    });
    return response.data;
  }

  async getChatHistory(limit: number = 50): Promise<APIResponse<ChatMessage[]>> {
    const response = await this.client.get(`/chat/history?limit=${limit}`);
    return response.data;
  }

  // Memory
  async saveMemory(key: string, value: any, description?: string): Promise<APIResponse<null>> {
    const response = await this.client.post('/memory', {
      key,
      value,
      description,
    });
    return response.data;
  }

  async getMemory(key: string): Promise<APIResponse<any>> {
    const response = await this.client.get(`/memory/${key}`);
    return response.data;
  }

  // Reminders
  async getReminders(): Promise<APIResponse<Reminder[]>> {
    const response = await this.client.get('/reminders');
    return response.data;
  }

  async createReminder(title: string, reminderTime: string, isRecurring?: boolean): Promise<APIResponse<Reminder>> {
    const response = await this.client.post('/reminders', {
      title,
      reminder_time: reminderTime,
      is_recurring: isRecurring || false,
    });
    return response.data;
  }
}

export const apiClient = new APIClient();
