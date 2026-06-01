import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, StopCircle, Volume2 } from 'lucide-react';

const VoiceInterface: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start();
      setIsListening(true);
      setTranscript('Listening...');
    } catch (err) {
      console.error('Microphone error:', err);
      setTranscript('Unable to access microphone');
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsListening(false);
      setTranscript('Processing...');
      // TODO: Send audio to backend for processing
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto"
    >
      <div className="glass rounded-2xl p-12 text-center">
        <motion.div
          animate={isListening ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mb-8"
        >
          <button
            onClick={isListening ? stopListening : startListening}
            className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto font-bold text-xl transition-all ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gradient-to-r from-primary-500 to-accent-500 hover:shadow-lg hover:shadow-primary-500/50 text-white'
            }`}
          >
            {isListening ? (
              <StopCircle size={48} />
            ) : (
              <Mic size={48} />
            )}
          </button>
        </motion.div>

        <h2 className="text-2xl font-bold mb-4">Voice Assistant</h2>
        <p className="text-dark-400 mb-8">Click the button and say a command</p>

        {/* Transcript */}
        {transcript && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-dark-800 rounded-lg p-6 mb-6 text-left"
          >
            <p className="text-sm text-dark-400 mb-2">You said:</p>
            <p className="text-lg">{transcript}</p>
          </motion.div>
        )}

        {/* Response */}
        {response && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 rounded-lg p-6 text-left"
          >
            <div className="flex items-center gap-2 mb-2">
              <Volume2 size={18} className="text-primary-400" />
              <p className="text-sm text-dark-400">FRIDAY's Response:</p>
            </div>
            <p className="text-lg">{response}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default VoiceInterface;
