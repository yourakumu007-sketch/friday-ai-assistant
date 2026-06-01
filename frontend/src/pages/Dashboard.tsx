import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { apiClient } from '../services/api';
import { Task, ChatMessage } from '../types/index';
import ChatWindow from '../components/ChatWindow';
import TaskManager from '../components/TaskManager';
import VoiceInterface from '../components/VoiceInterface';
import { MessageCircle, CheckSquare, Settings, Mic } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, tasks, setTasks, language } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'tasks' | 'voice'>('overview');
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // Fetch tasks
    const fetchTasks = async () => {
      try {
        const response = await apiClient.getTasks();
        if (response.success && response.data?.items) {
          setTasks(response.data.items);
        }
      } catch (err) {
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [setTasks]);

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'COMPLETED').length,
    pending: tasks.filter((t) => t.status === 'PENDING').length,
  };

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="container-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Welcome back, {user?.first_name || user?.username || 'User'}!
          </h1>
          <p className="text-dark-400">Your AI assistant is ready to help</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: 'Total Tasks', value: stats.total, color: 'primary' },
            { label: 'Completed', value: stats.completed, color: 'accent' },
            { label: 'Pending', value: stats.pending, color: 'primary' },
          ].map((stat, idx) => (
            <div key={idx} className="glass p-6 rounded-xl">
              <p className="text-dark-400 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold gradient-text">{stat.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex gap-2 border-b border-dark-700 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: null },
              { id: 'voice', label: 'Voice', icon: Mic },
              { id: 'chat', label: 'Chat', icon: MessageCircle },
              { id: 'tasks', label: 'Tasks', icon: CheckSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-dark-400 hover:text-dark-300'
                  }`}
                >
                  {Icon && <Icon className="inline mr-2" size={18} />}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ChatWindow />
              <TaskManager />
            </div>
          )}

          {activeTab === 'voice' && <VoiceInterface />}

          {activeTab === 'chat' && <ChatWindow />}

          {activeTab === 'tasks' && <TaskManager />}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
