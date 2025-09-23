import React, { useEffect } from 'react';

interface KarmaArenaVoiceProps {
  points: number;
  level: number;
  achievement?: string;
}

const KarmaArenaVoice: React.FC<KarmaArenaVoiceProps> = ({ 
  points, 
  level, 
  achievement 
}) => {
  const announceAchievement = (message: string): void => {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1.2; // Faster for excitement
    utterance.pitch = 1.1; // Higher pitch for celebration
    utterance.volume = 0.8;
    utterance.lang = 'en-IN';
    
    speechSynthesis.speak(utterance);
  };

  // Auto-announce achievements
  useEffect(() => {
    if (achievement) {
      announceAchievement(`Congratulations! ${achievement}`);
    }
  }, [achievement]);

  const handlePointsAnnouncement = (): void => {
    announceAchievement(`You have ${points} karma points and you're at level ${level}!`);
  };

  return (
    <button 
      className="karma-voice-btn"
      onClick={handlePointsAnnouncement}
      title="Hear Your Progress"
    >
      🏆 Hear Progress
    </button>
  );
};

export default KarmaArenaVoice;
