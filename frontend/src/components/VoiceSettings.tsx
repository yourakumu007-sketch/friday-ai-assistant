import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, RotateCcw } from 'lucide-react';
import { useAppStore } from '../store/appStore';

interface VoiceSettingsProps {
  onClose: () => void;
}

const VoiceSettings: React.FC<VoiceSettingsProps> = ({ onClose }) => {
  const { voiceEnabled, setVoiceEnabled, language } = useAppStore();
  const [voiceGender, setVoiceGender] = React.useState('female');
  const [speechRate, setSpeechRate] = React.useState(1);
  const [volume, setVolume] = React.useState(1);

  const testVoice = async () => {
    const testText = {
      en: "Hello, I am FRIDAY, your AI assistant.",
      hi: "नमस्ते, मैं फ्राइडे, आपका एआई सहायक हूं।",
      bn: "আমি FRIDAY, আপনার এআই সহায়ক।",
    }[language] || "Hello, I am FRIDAY";

    // TODO: Play test audio
    alert(`Playing: "${testText}"`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass rounded-2xl p-8 max-w-md"
    >
      <h2 className="text-2xl font-bold mb-6 gradient-text">Voice Settings</h2>

      {/* Enable/Disable */}
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={voiceEnabled}
            onChange={(e) => setVoiceEnabled(e.target.checked)}
            className="w-5 h-5 accent-primary-500 cursor-pointer"
          />
          <span className="text-light">Enable Voice Assistant</span>
        </label>
      </div>

      {voiceEnabled && (
        <>
          {/* Voice Gender */}
          <div className="mb-6">
            <label className="block text-dark-300 mb-3 font-medium">Voice Gender</label>
            <div className="grid grid-cols-2 gap-2">
              {['female', 'male'].map((gender) => (
                <button
                  key={gender}
                  onClick={() => setVoiceGender(gender)}
                  className={`py-2 px-4 rounded-lg transition-colors capitalize ${
                    voiceGender === gender
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          {/* Speech Rate */}
          <div className="mb-6">
            <label className="block text-dark-300 mb-3 font-medium">
              Speech Rate: {(speechRate * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-full accent-primary-500"
            />
            <div className="flex justify-between text-xs text-dark-500 mt-2">
              <span>Slow</span>
              <span>Normal</span>
              <span>Fast</span>
            </div>
          </div>

          {/* Volume */}
          <div className="mb-6">
            <label className="block text-dark-300 mb-3 font-medium">
              Volume: {(volume * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-primary-500"
            />
          </div>

          {/* Test Button */}
          <button
            onClick={testVoice}
            className="btn-secondary w-full mb-6 inline-flex items-center justify-center gap-2"
          >
            <Volume2 size={18} />
            Test Voice
          </button>
        </>
      )}

      {/* Reset */}
      <button
        onClick={() => {
          setVoiceGender('female');
          setSpeechRate(1);
          setVolume(1);
        }}
        className="btn-secondary w-full mb-4 inline-flex items-center justify-center gap-2"
      >
        <RotateCcw size={18} />
        Reset to Default
      </button>

      {/* Close */}
      <button onClick={onClose} className="btn-primary w-full">
        Done
      </button>
    </motion.div>
  );
};

export default VoiceSettings;
