import { useEffect, useState, useCallback, useRef } from 'react';
import wsService from '../services/websocket';

/**
 * Custom hook for WebSocket integration
 * @param {string} wsUrl - WebSocket server URL
 * @returns {Object} WebSocket state and methods
 */
export const useWebSocket = (wsUrl = 'ws://localhost:8000/ws') => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listeningState, setListeningState] = useState(false);
  const [thinkingState, setThinkingState] = useState(false);
  const [speakingState, setSpeakingState] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [messages, setMessages] = useState([]);
  const unsubscribeRef = useRef([]);

  // Connect to WebSocket on mount
  useEffect(() => {
    const initializeWebSocket = async () => {
      try {
        setIsLoading(true);
        wsService.url = wsUrl;
        await wsService.connect();
        setIsConnected(true);
        setError(null);
      } catch (err) {
        console.error('WebSocket connection failed:', err);
        setError(err.message);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeWebSocket();

    return () => {
      wsService.disconnect();
    };
  }, [wsUrl]);

  // Subscribe to WebSocket events
  useEffect(() => {
    const unsubscribe = [];

    // Connected event
    unsubscribe.push(
      wsService.on('connected', (data) => {
        console.log('Connected:', data);
        setIsConnected(true);
        setError(null);
      })
    );

    // Disconnected event
    unsubscribe.push(
      wsService.on('disconnected', (data) => {
        console.log('Disconnected:', data);
        setIsConnected(false);
      })
    );

    // Listening event
    unsubscribe.push(
      wsService.on('listening', (data) => {
        console.log('Listening started:', data);
        setListeningState(true);
        setThinkingState(false);
        setSpeakingState(false);
      })
    );

    // Thinking event
    unsubscribe.push(
      wsService.on('thinking', (data) => {
        console.log('Thinking:', data);
        setListeningState(false);
        setThinkingState(true);
        setSpeakingState(false);
      })
    );

    // Speaking event
    unsubscribe.push(
      wsService.on('speaking', (data) => {
        console.log('Speaking:', data);
        setListeningState(false);
        setThinkingState(false);
        setSpeakingState(true);
      })
    );

    // Task created event
    unsubscribe.push(
      wsService.on('task_created', (data) => {
        console.log('Task created:', data);
        setTasks((prevTasks) => [...prevTasks, data]);
      })
    );

    // Reminder created event
    unsubscribe.push(
      wsService.on('reminder_created', (data) => {
        console.log('Reminder created:', data);
        setReminders((prevReminders) => [...prevReminders, data]);
      })
    );

    // Message event
    unsubscribe.push(
      wsService.on('message', (data) => {
        console.log('Message received:', data);
        setMessages((prevMessages) => [...prevMessages, data]);
      })
    );

    // Error event
    unsubscribe.push(
      wsService.on('error', (data) => {
        console.error('WebSocket error:', data);
        setError(data.message || 'Unknown error');
      })
    );

    unsubscribeRef.current = unsubscribe;

    return () => {
      unsubscribe.forEach((unsub) => unsub());
    };
  }, []);

  /**
   * Send a message to the server
   */
  const sendMessage = useCallback((text) => {
    return wsService.send('message', { text, timestamp: new Date().toISOString() });
  }, []);

  /**
   * Start listening
   */
  const startListening = useCallback(() => {
    return wsService.send('start_listening', {});
  }, []);

  /**
   * Stop listening
   */
  const stopListening = useCallback(() => {
    return wsService.send('stop_listening', {});
  }, []);

  /**
   * Send custom event
   */
  const sendEvent = useCallback((event, data) => {
    return wsService.send(event, data);
  }, []);

  /**
   * Clear tasks
   */
  const clearTasks = useCallback(() => {
    setTasks([]);
  }, []);

  /**
   * Clear reminders
   */
  const clearReminders = useCallback(() => {
    setReminders([]);
  }, []);

  /**
   * Clear messages
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  /**
   * Clear all
   */
  const clearAll = useCallback(() => {
    setTasks([]);
    setReminders([]);
    setMessages([]);
    setError(null);
  }, []);

  return {
    // Connection states
    isConnected,
    isLoading,
    error,

    // AI states
    listeningState,
    thinkingState,
    speakingState,

    // Data
    tasks,
    reminders,
    messages,

    // Methods
    sendMessage,
    startListening,
    stopListening,
    sendEvent,
    clearTasks,
    clearReminders,
    clearMessages,
    clearAll
  };
};

export default useWebSocket;
