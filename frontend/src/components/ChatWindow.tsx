import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { apiClient } from '../services/api';
import { ChatMessage as ChatMessageType } from '../types/index';

const ChatWindow: React.FC = () => {
  const { language } = useAppStore();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      const response = await apiClient.sendMessage(input, language);
      if (response.success && response.data) {
        setMessages((prev) => [...prev, response.data]);
        setInput('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass rounded-2xl overflow-hidden flex flex-col h-96"
    >
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-dark-500">
            <p>No messages yet. Start chatting with FRIDAY!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="space-y-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-end"
              >
                <div className="bg-primary-500 text-white rounded-lg p-3 max-w-xs">
                  {msg.user_message}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-start"
              >
                <div className="bg-dark-800 text-dark-100 rounded-lg p-3 max-w-xs">
                  {msg.assistant_response}
                </div>
              </motion.div>
            </div>
          ))
        )}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-dark-800 text-dark-100 rounded-lg p-3">
              <Loader size={18} className="animate-spin" />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t border-dark-700 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="input-field flex-1"
            disabled={loading}
          />
          <button type="submit" disabled={loading} className="btn-primary px-4">
            <Send size={20} />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ChatWindow;
