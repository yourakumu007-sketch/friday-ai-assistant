export interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  preferred_language: 'en' | 'hi' | 'bn';
  voice_preference: 'male' | 'female';
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  task_id?: string;
  title: string;
  description?: string;
  reminder_time: string;
  is_recurring: boolean;
  recurrence_pattern?: 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_message: string;
  assistant_response: string;
  language: 'en' | 'hi' | 'bn';
  created_at: string;
}

export interface Memory {
  id: string;
  user_id: string;
  key: string;
  value: any;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    access_token: string;
    refresh_token?: string;
    token_type: string;
  };
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  timestamp?: string;
}
