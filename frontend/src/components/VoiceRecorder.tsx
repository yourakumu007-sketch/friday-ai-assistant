import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, StopCircle, Volume2, Loader, RotateCw } from 'lucide-react';
import { useAppStore } from '../store/appStore';

interface AudioVisualizerProps {
  isListening: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isListening }) => {
  const bars = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="flex items-end justify-center gap-1 h-12">
      {bars.map((i) => (
        <motion.div
          key={i}
          animate={isListening ? { height: [8, Math.random() * 40 + 8, 8] } : { height: 8 }}
          transition={{
            duration: 0.5,
            repeat: isListening ? Infinity : 0,
            delay: i * 0.05,
          }}
          className="w-1 bg-gradient-to-t from-primary-500 to-accent-500 rounded-full"
        />
      ))}
    </div>
  );
};

const VoiceRecorder: React.FC = () => {
  const { language } = useAppStore();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      
      // Set language
      const languageMap: { [key: string]: string } = {
        en: 'en-US',
        hi: 'hi-IN',
        bn: 'bn-IN',
      };
      recognitionRef.current.lang = languageMap[language] || 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript('Listening...');
        audioChunksRef.current = [];
      };

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript(transcript);
          } else {
            interimTranscript += transcript;
          }
        }
        if (interimTranscript) {
          setTranscript(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setTranscript(`Error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    } else {
      setTranscript('Speech Recognition not supported');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      processTranscript(transcript);
    }
  };

  const processTranscript = async (text: string) => {
    if (!text || text === 'Listening...' || text.includes('Error')) return;

    setIsProcessing(true);
    try {
      // TODO: Send to backend for processing
      setResponse('Processing your command...');
      
      // Simulate response
      setTimeout(() => {
        setResponse('Command processed successfully');
        setIsProcessing(false);
      }, 1500);
    } catch (err) {
      console.error('Error processing transcript:', err);
      setResponse('Error processing command');
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setTranscript('');
    setResponse('');
    setIsListening(false);
    setIsProcessing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto"
    >
      <div className="glass rounded-2xl p-12 text-center">
        {/* Main Controls */}
        <div className="mb-12">
          <motion.div
            animate={isListening ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
            className="mb-8"
          >
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`w-40 h-40 rounded-full flex items-center justify-center mx-auto font-bold text-3xl transition-all ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white glow'
                  : isProcessing
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gradient-to-r from-primary-500 to-accent-500 hover:shadow-lg hover:shadow-primary-500/50 text-white'
              }`}
            >
              {isProcessing ? (
                <Loader size={64} className="animate-spin" />
              ) : isListening ? (
                <StopCircle size={64} />
              ) : (
                <Mic size={64} />
              )}
            </button>
          </motion.div>

          <h2 className="text-3xl font-bold mb-2 gradient-text">Voice Assistant</h2>
          <p className="text-dark-400 mb-8">
            {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Click to start speaking'}
          </p>

          {/* Audio Visualizer */}
          {(isListening || isProcessing) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <AudioVisualizer isListening={isListening} />
            </motion.div>
          )}
        </div>

        {/* Transcript */}
        {transcript && transcript !== 'Listening...' && !transcript.includes('Error') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-800 rounded-xl p-6 mb-6 text-left border border-dark-700"
          >
            <p className="text-sm text-dark-400 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              You said:
            </p>
            <p className="text-lg text-white">"{transcript}"</p>
          </motion.div>
        )}

        {/* Response */}
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 rounded-xl p-6 mb-6 text-left"
          >
            <div className="flex items-center gap-2 mb-2">
              <Volume2 size={18} className="text-primary-400 flex-shrink-0" />
              <p className="text-sm text-dark-400">FRIDAY's Response:</p>
            </div>
            <p className="text-lg text-white">{response}</p>
          </motion.div>
        )}

        {/* Controls */}
        {(transcript || response) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4 justify-center"
          >
            <button
              onClick={reset}
              className="btn-secondary px-6 py-3 inline-flex items-center gap-2"
            >
              <RotateCw size={18} />
              Try Again
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default VoiceRecorder;
