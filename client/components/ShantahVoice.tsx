import React from 'react';

interface ShantahVoiceProps {
  wisdom: string;
  isEnabled: boolean;
}

const ShantahVoice: React.FC<ShantahVoiceProps> = ({ wisdom, isEnabled }) => {
  const speakWisdom = (text: string): void => {
    if (!isEnabled) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.7; // Slower for wisdom
    utterance.pitch = 0.9; // Deeper voice for gravitas
    utterance.lang = 'en-IN';
    
    // Try to find a male voice for Krishna's wisdom
    const voices = speechSynthesis.getVoices();
    const maleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('male') || 
      voice.name.toLowerCase().includes('david')
    );
    if (maleVoice) utterance.voice = maleVoice;
    
    speechSynthesis.speak(utterance);
  };

  return (
    <button 
      className="wisdom-voice-btn"
      onClick={() => speakWisdom(wisdom)}
      disabled={!isEnabled}
      title="Listen to Krishna's Wisdom"
    >
      🕉️ Hear Wisdom
    </button>
  );
};

export default ShantahVoice;
