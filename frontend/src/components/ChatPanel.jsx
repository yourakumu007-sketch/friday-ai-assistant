import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Copy, Trash2 } from 'lucide-react';

const ChatPanel = ({ messages = [], onSendMessage, isLoading = false }) => {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && onSendMessage) {
      onSendMessage(input);
      setInput('');
    }
  };

  const copyToClipboard = (text, messageId) => {
    navigator.clipboard.writeText(text);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const groupedMessages = messages.reduce((acc, msg, idx) => {
    const dateStr = formatDate(msg.timestamp);
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push({ ...msg, id: msg.id || idx });
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900/50 to-slate-950/50 border border-cyan-900/30 rounded-lg overflow-hidden hover:border-cyan-900/50 transition-colors">
      {/* Header */}
      <div className="border-b border-cyan-900/30 px-4 py-3 flex items-center justify-between bg-slate-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <h2 className="font-semibold text-white">Chat with Friday</h2>
        </div>
        <span className="text-xs text-slate-400">{messages.length} messages</span>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {Object.entries(groupedMessages).length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col items-center justify-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm">No messages yet. Start a conversation!</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date}>
                {/* Date divider */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center my-4"
                >
                  <div className="bg-slate-800/50 px-3 py-1 rounded-full text-xs text-slate-500 border border-slate-700/50">
                    {date}
                  </div>
                </motion.div>

                {/* Messages */}
                <motion.div className="space-y-3" layout>
                  {msgs.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`group relative max-w-xs lg:max-w-md px-4 py-3 rounded-lg transition-all ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-r from-cyan-600/40 to-blue-600/40 border border-cyan-500/30 text-cyan-50 rounded-br-none'
                            : 'bg-slate-800/60 border border-slate-700/50 text-slate-100 rounded-bl-none'
                        }`}
                      >
                        {/* Message text */}
                        <p className="text-sm leading-relaxed break-words">{msg.text}</p>

                        {/* Message timestamp */}
                        <p className={`text-xs mt-2 ${
                          msg.sender === 'user' ? 'text-cyan-200/60' : 'text-slate-500'
                        }`}>
                          {formatTime(msg.timestamp)}
                        </p>

                        {/* Action buttons */}
                        <div className="absolute -right-10 top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => copyToClipboard(msg.text, msg.id)}
                            className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-cyan-400 transition-colors"
                            title="Copy message"
                          >
                            <Copy className="w-3 h-3" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-red-400 transition-colors"
                            title="Delete message"
                          >
                            <Trash2 className="w-3 h-3" />
                          </motion.button>
                        </div>

                        {/* Copy feedback */}
                        {copiedId === msg.id && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute -top-7 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                          >
                            Copied!
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <div className="bg-slate-800/60 border border-slate-700/50 px-4 py-3 rounded-lg rounded-bl-none">
                  <div className="flex gap-2 items-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="w-2 h-2 bg-cyan-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                      className="w-2 h-2 bg-cyan-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-cyan-400 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-cyan-900/30 p-4 bg-slate-900/50 backdrop-blur-sm"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Friday something..."
            disabled={isLoading}
            className="flex-1 bg-slate-800 border border-cyan-900/30 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium text-sm"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;
