import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface VoiceChatProps {
  onVoiceMessage?: (message: string) => void;
}

interface ApiResponse {
  response: string;
  error?: string;
}

const VoiceChat: React.FC<VoiceChatProps> = ({ onVoiceMessage }) => {
  const [isVoiceMode, setIsVoiceMode] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Check browser support
  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="voice-chat-error">
        <p>Your browser doesn't support speech recognition.</p>
        <p>Please use Chrome, Safari, or Edge for voice features.</p>
      </div>
    );
  }

  // Send voice input to your existing Gemini API
  const sendToAI = async (message: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data: ApiResponse = await response.json();
      setAiResponse(data.response);
      
      // Convert AI response to speech
      speakResponse(data.response);
      
      // Optional callback
      onVoiceMessage?.(message);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = "Sorry, I couldn't process your request. Please try again.";
      setAiResponse(errorMessage);
      speakResponse(errorMessage);
    }
    setIsLoading(false);
  };

  // Text-to-Speech function with proper TypeScript typing
  const speakResponse = (text: string): void => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = 'en-IN'; // Indian English accent
    
    // Optional: Use different voices for different features
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') && voice.lang.includes('en')
      ) || voices[0];
      utterance.voice = preferredVoice;
    }
    
    speechSynthesis.speak(utterance);
  };

  // Start voice conversation
  const startVoiceChat = (): void => {
    setIsVoiceMode(true);
    resetTranscript();
    SpeechRecognition.startListening({ 
      continuous: true, 
      language: 'en-IN' // Indian English
    });
  };

  // Stop voice conversation
  const stopVoiceChat = (): void => {
    setIsVoiceMode(false);
    SpeechRecognition.stopListening();
    speechSynthesis.cancel(); // Stop any ongoing speech
  };

  // Auto-process when user stops speaking
  useEffect(() => {
    if (transcript && !listening && isVoiceMode) {
      const timer = setTimeout(() => {
        if (transcript.trim()) {
          sendToAI(transcript);
          resetTranscript();
        }
      }, 1000); // Wait 1 second after user stops speaking

      return () => clearTimeout(timer);
    }
  }, [transcript, listening, isVoiceMode]);

  return (
    <div className="voice-chat-container">
      <div className="voice-controls">
        {!isVoiceMode ? (
          <button 
            className="voice-start-btn"
            onClick={startVoiceChat}
            disabled={isLoading}
          >
            🎤 Start Voice Chat
          </button>
        ) : (
          <button 
            className="voice-stop-btn"
            onClick={stopVoiceChat}
          >
            ⏹️ Stop Voice Chat
          </button>
        )}
      </div>

      {isVoiceMode && (
        <div className="voice-status">
          <div className={`listening-indicator ${listening ? 'active' : ''}`}>
            {listening ? '🎤 Listening...' : '🤖 Processing...'}
          </div>
          
          {transcript && (
            <div className="transcript">
              <strong>You said:</strong> {transcript}
            </div>
          )}
          
          {isLoading && (
            <div className="ai-thinking">
              🤖 MindCare is thinking...
            </div>
          )}
          
          {aiResponse && (
            <div className="ai-response">
              <strong>MindCare:</strong> {aiResponse}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceChat;
