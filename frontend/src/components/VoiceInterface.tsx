import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';
import VoiceSettings from './VoiceSettings';

const VoiceInterface: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative">
        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="absolute top-0 right-0 btn-secondary px-4 py-2 inline-flex items-center gap-2"
        >
          <Settings size={18} />
          Settings
        </button>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-8 flex justify-end"
            >
              <VoiceSettings onClose={() => setShowSettings(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Voice Recorder */}
        <div className="pt-16">
          <VoiceRecorder />
        </div>
      </div>
    </motion.div>
  );
};

export default VoiceInterface;
