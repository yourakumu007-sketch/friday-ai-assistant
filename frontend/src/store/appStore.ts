import { create } from 'zustand';
import { User, Task, Reminder } from '../types/index';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;

  // UI
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;

  // Data
  tasks: Task[];
  reminders: Reminder[];
  setTasks: (tasks: Task[]) => void;
  setReminders: (reminders: Reminder[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;

  // Settings
  language: 'en' | 'hi' | 'bn';
  setLanguage: (language: 'en' | 'hi' | 'bn') => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  token: localStorage.getItem('token') || null,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: user !== null,
    }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  },
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      token: null,
    }),

  // UI
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  theme: 'dark',
  setTheme: (theme) => set({ theme }),

  // Data
  tasks: [],
  reminders: [],
  setTasks: (tasks) => set({ tasks }),
  setReminders: (reminders) => set({ reminders }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (task) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

  // Settings
  language: 'en',
  setLanguage: (language) => set({ language }),
  voiceEnabled: true,
  setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),
}));
