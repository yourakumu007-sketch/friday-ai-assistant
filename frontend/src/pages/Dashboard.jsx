import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Zap, Music, Cloud, Brain } from 'lucide-react';

const Dashboard = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I\'m Friday, your AI Assistant.', sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Review project documentation', completed: false },
    { id: 2, title: 'Update memory service', completed: true },
    { id: 3, title: 'Implement dashboard', completed: false }
  ]);
  const [memories, setMemories] = useState([
    { id: 1, key: 'user_preference', value: 'Dark mode enabled' },
    { id: 2, key: 'last_task', value: 'Dashboard creation' },
    { id: 3, key: 'favorite_music', value: 'Electronic' }
  ]);
  const [orbColor, setOrbColor] = useState('from-cyan-500 to-blue-500');
  const orbRef = useRef(null);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setMessages([...messages, { id: messages.length + 1, text: inputValue, sender: 'user' }]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { id: prev.length + 1, text: 'I understand. Processing your request...', sender: 'ai' }]);
    }, 500);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  // Animate orb
  useEffect(() => {
    const interval = setInterval(() => {
      const colors = [
        'from-cyan-500 to-blue-500',
        'from-purple-500 to-pink-500',
        'from-green-500 to-cyan-500',
        'from-blue-500 to-purple-500'
      ];
      setOrbColor(colors[Math.floor(Math.random() * colors.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Grid background effect */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(79, 172, 254, 0.1) 25%, rgba(79, 172, 254, 0.1) 26%, transparent 27%, transparent 74%, rgba(79, 172, 254, 0.1) 75%, rgba(79, 172, 254, 0.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(79, 172, 254, 0.1) 25%, rgba(79, 172, 254, 0.1) 26%, transparent 27%, transparent 74%, rgba(79, 172, 254, 0.1) 75%, rgba(79, 172, 254, 0.1) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-cyan-900/30 backdrop-blur-md bg-slate-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Brain className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  FRIDAY
                </h1>
              </div>
              <div className="text-sm text-cyan-400/70">AI Personal Assistant v1.0</div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Panel - Chat */}
            <div className="lg:col-span-1 flex flex-col">
              <div className="border border-cyan-900/30 rounded-lg bg-slate-900/50 backdrop-blur-sm h-96 lg:h-full flex flex-col overflow-hidden hover:border-cyan-900/50 transition-colors">
                <div className="border-b border-cyan-900/30 px-4 py-3 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-cyan-400" />
                  <h2 className="font-semibold">Chat</h2>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-3 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-cyan-600/30 text-cyan-100' : 'bg-slate-800 text-slate-300'}`}>
                        <p className="text-sm">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="border-t border-cyan-900/30 p-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Say something..."
                      className="flex-1 bg-slate-800 border border-cyan-900/30 rounded px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20"
                    />
                    <button
                      type="submit"
                      className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-2 rounded transition-colors"
                    >
                      <Zap className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Center - AI Orb */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center gap-8">
              {/* Orb */}
              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Outer glow rings */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 animate-pulse"></div>
                <div className="absolute inset-4 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 animate-pulse" style={{ animationDelay: '0.5s' }}></div>

                {/* Main orb */}
                <div ref={orbRef} className={`relative w-32 h-32 rounded-full bg-gradient-to-r ${orbColor} shadow-2xl cursor-pointer transform hover:scale-110 transition-all duration-500`} style={{
                  boxShadow: '0 0 60px rgba(79, 172, 254, 0.5), inset -2px -2px 10px rgba(0, 0, 0, 0.3)'
                }}>
                  <div className="absolute inset-2 rounded-full bg-gradient-to-t from-slate-950/50 to-transparent"></div>
                  <div className="absolute inset-0 rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl animate-pulse">◆</div>
                      <p className="text-xs text-white/80 mt-2">FRIDAY</p>
                    </div>
                  </div>
                </div>

                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                      animation: `orbit 4s linear infinite`,
                      transformOrigin: '0 0',
                      transform: `rotate(${i * 60}deg) translateX(100px)`,
                      opacity: 0.6
                    }}
                  />
                ))}
              </div>

              {/* Status indicator */}
              <div className="flex items-center justify-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-slate-400">AI Online • Ready to assist</span>
              </div>

              <style>{`
                @keyframes orbit {
                  from { transform: rotate(0deg) translateX(100px); }
                  to { transform: rotate(360deg) translateX(100px); }
                }
              `}</style>
            </div>

            {/* Right Panel - Tasks & Memory */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              {/* Tasks */}
              <div className="border border-cyan-900/30 rounded-lg bg-slate-900/50 backdrop-blur-sm overflow-hidden hover:border-cyan-900/50 transition-colors">
                <div className="border-b border-cyan-900/30 px-4 py-3 flex items-center gap-2 bg-slate-900/80">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <h2 className="font-semibold">Tasks</h2>
                </div>
                <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
                  {tasks.map(task => (
                    <label key={task.id} className="flex items-center gap-3 p-2 rounded hover:bg-slate-800/50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="w-4 h-4 rounded bg-slate-800 border-cyan-500/30 checked:bg-cyan-600 cursor-pointer"
                      />
                      <span className={`text-sm ${task.completed ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                        {task.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Memory */}
              <div className="border border-cyan-900/30 rounded-lg bg-slate-900/50 backdrop-blur-sm overflow-hidden hover:border-cyan-900/50 transition-colors">
                <div className="border-b border-cyan-900/30 px-4 py-3 flex items-center gap-2 bg-slate-900/80">
                  <Brain className="w-5 h-5 text-cyan-400" />
                  <h2 className="font-semibold">Memory</h2>
                </div>
                <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
                  {memories.map(mem => (
                    <div key={mem.id} className="text-xs bg-slate-800/50 rounded p-2 border border-cyan-900/20">
                      <p className="text-cyan-400 font-mono">{mem.key}</p>
                      <p className="text-slate-400 mt-1">{mem.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weather Widget */}
              <div className="border border-cyan-900/30 rounded-lg bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-sm p-4 hover:border-cyan-900/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Weather</p>
                    <p className="text-2xl font-bold">72°F</p>
                    <p className="text-xs text-slate-400">Clear Skies</p>
                  </div>
                  <Cloud className="w-12 h-12 text-cyan-400" />
                </div>
              </div>

              {/* Music Widget */}
              <div className="border border-cyan-900/30 rounded-lg bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-sm p-4 hover:border-cyan-900/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Now Playing</p>
                    <p className="text-sm font-semibold mt-1">Neon Dreams</p>
                    <p className="text-xs text-slate-400">Synthwave Mix</p>
                  </div>
                  <Music className="w-12 h-12 text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
