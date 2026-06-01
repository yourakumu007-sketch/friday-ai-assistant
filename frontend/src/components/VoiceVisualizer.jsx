import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const VoiceVisualizer = ({ isActive = true, barCount = 12, volume = 0.5 }) => {
  const [audioData, setAudioData] = useState(Array(barCount).fill(0));
  const [isListening, setIsListening] = useState(false);
  const mediaStreamRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationIdRef = useRef(null);

  // Initialize audio context and start listening
  useEffect(() => {
    if (!isActive) {
      setIsListening(false);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      return;
    }

    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        analyserRef.current = analyser;
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

        setIsListening(true);

        // Animation loop
        const animate = () => {
          if (analyserRef.current && dataArrayRef.current) {
            analyserRef.current.getByteFrequencyData(dataArrayRef.current);

            // Downsample to barCount
            const barHeight = new Array(barCount).fill(0);
            const barsPerBucket = Math.floor(dataArrayRef.current.length / barCount);

            for (let i = 0; i < barCount; i++) {
              let sum = 0;
              for (let j = 0; j < barsPerBucket; j++) {
                sum += dataArrayRef.current[i * barsPerBucket + j];
              }
              barHeight[i] = (sum / barsPerBucket / 255) * volume;
            }

            setAudioData(barHeight);
          }
          animationIdRef.current = requestAnimationFrame(animate);
        };

        animate();
      } catch (error) {
        console.error('Error accessing microphone:', error);
        setIsListening(false);
      }
    };

    initAudio();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive, barCount, volume]);

  // Fallback animation when microphone is not available
  const fallbackAnimation = Array(barCount).fill(0).map((_, i) => ({
    delay: i * 0.05,
    duration: 0.5 + Math.random() * 0.3
  }));

  return (
    <div className="flex items-center justify-center gap-1 px-6 py-8 bg-gradient-to-r from-slate-900/50 to-slate-900/30 rounded-lg border border-cyan-900/30">
      {/* Status indicator */}
      <motion.div
        className="absolute top-3 right-3 flex items-center gap-2"
        animate={{ opacity: isListening ? 1 : 0.5 }}
      >
        <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500' : 'bg-slate-500'}`}>
          {isListening && (
            <motion.div
              className="w-full h-full rounded-full bg-green-500"
              animate={{ scale: [1, 1.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>
        <span className="text-xs text-slate-400">
          {isListening ? 'Listening' : 'Inactive'}
        </span>
      </motion.div>

      {/* Visualizer bars */}
      <div className="flex items-center justify-center gap-1 h-32">
        {audioData.map((value, index) => {
          const isEvenPosition = index % 2 === 0;
          const delay = isEvenPosition ? -0.05 : 0.05;

          return (
            <motion.div
              key={index}
              className="relative w-1.5 bg-gradient-to-t from-cyan-500 via-cyan-400 to-cyan-300 rounded-full"
              animate={{
                height: isListening ? `${Math.max(value * 100, 8)}%` : '8%',
                boxShadow: [
                  `0 0 0px rgba(34, 211, 238, 0)`,
                  `0 0 8px rgba(34, 211, 238, ${value})`,
                  `0 0 0px rgba(34, 211, 238, 0)`
                ]
              }}
              transition={{
                height: {
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                  delay: delay
                },
                boxShadow: {
                  duration: 0.3,
                  ease: 'easeInOut'
                }
              }}
              style={{
                minHeight: '8%',
                maxHeight: '100%'
              }}
            >
              {/* Gradient overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-cyan-600/50 to-transparent rounded-full"
                animate={{
                  opacity: value > 0.5 ? 1 : 0.5
                }}
              />

              {/* Highlight effect */}
              {value > 0.3 && (
                <motion.div
                  className="absolute top-0 left-0 right-0 h-1/3 bg-cyan-200/50 rounded-t-full"
                  animate={{
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Volume level indicator */}
      <motion.div
        className="absolute bottom-3 left-3 text-xs text-slate-500"
        animate={{ opacity: isListening ? 1 : 0.5 }}
      >
        <div className="flex items-center gap-2">
          <span>Vol:</span>
          <motion.span
            animate={{
              color: volume > 0.7 ? 'rgb(239, 68, 68)' : volume > 0.4 ? 'rgb(234, 179, 8)' : 'rgb(34, 197, 94)'
            }}
          >
            {Math.round(volume * 100)}%
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
};

export default VoiceVisualizer;
