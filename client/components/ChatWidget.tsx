import { useEffect, useMemo, useRef, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Send, ShieldAlert, AlertTriangle, Mic, MicOff, Volume2 } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface Msg { 
  id: string; 
  role: "user" | "assistant"; 
  text: string;
  isError?: boolean;
}

// ✅ EXACT API ENDPOINT LOGIC - NO CHANGES
const getApiEndpoint = () => {
  if (typeof window !== 'undefined') {
    const isLocal = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' ||
                   window.location.hostname.includes('localhost');
    
    return isLocal 
      ? '/api/ai-chat'
      : '/.netlify/functions/api/ai-chat';
  }
  return '/api/ai-chat';
};

export default function ChatWidget() {
  // ✅ EXISTING AUTH CONTEXT - NO CHANGES
  const { profile, getUserGreeting, getExtendedProfile, hasExtendedProfile } = useAuth();
  
  // ✅ EXISTING STATE - NO CHANGES
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // ✨ VOICE FUNCTIONALITY STATE
  const [chatMode, setChatMode] = useState<'text' | 'voice' | 'speech-only'>('text');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [currentSpeechResponse, setCurrentSpeechResponse] = useState<string>('');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // ✅ EXISTING PERSONALIZED SEED - NO CHANGES
  const personalizedSeed: Msg[] = useMemo(() => {
    if (!profile?.full_name) {
      return [
        { id: "a0", role: "assistant", text: "Hi, I'm your AI First‑Aid. I can offer short coping strategies and point you to help. If this is an emergency, call your local emergency number immediately." }
      ];
    }

    const extendedProfile = getExtendedProfile();
    const hasExtended = hasExtendedProfile();
    
    let personalizedMessage = `${getUserGreeting()} I'm your AI mental health assistant.`;
    
    if (hasExtended && extendedProfile?.stressLevel) {
      const stressLevel = extendedProfile.stressLevel;
      if (stressLevel === 'high' || stressLevel === 'severe') {
        personalizedMessage += " I understand you're experiencing high stress levels.";
      } else if (stressLevel === 'moderate') {
        personalizedMessage += " I see you're managing moderate stress.";
      } else {
        personalizedMessage += " I'm glad to see you're managing your stress well.";
      }
    }
    
    if (hasExtended && extendedProfile?.currentConcerns?.length > 0) {
      const concerns = extendedProfile.currentConcerns;
      if (concerns.includes('Anxiety')) {
        personalizedMessage += " I'm here to help with anxiety management techniques.";
      } else if (concerns.includes('Academic Pressure')) {
        personalizedMessage += " I understand academic pressures can be overwhelming.";
      } else if (concerns.includes('Sleep Issues')) {
        personalizedMessage += " I can help you with sleep improvement strategies.";
      }
    }
    
    if (profile.college) {
      personalizedMessage += ` How are things going at ${profile.college} today?`;
    } else {
      personalizedMessage += " How are you feeling today?";
    }

    return [
      { id: "a0", role: "assistant", text: personalizedMessage }
    ];
  }, [profile, getUserGreeting, getExtendedProfile, hasExtendedProfile]);

  // ✅ EXISTING MESSAGES STATE - NO CHANGES
  const [messages, setMessages] = useState<Msg[]>(personalizedSeed);

  // ✅ EXISTING useEffect - NO CHANGES
  useEffect(() => {
    setMessages(personalizedSeed);
  }, [personalizedSeed]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  // ✨ TEXT-TO-SPEECH FUNCTION
  const speakResponse = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      // Clean text for better speech
      const cleanText = text.replace(/[🆘😴💙🌟💚🧘‍♀️⚠️✅❌🎤🔊🎯⏳]/g, '').trim();
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.9;
      utterance.lang = 'en-US';
      
      const setVoiceAndSpeak = () => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          const preferredVoice = voices.find(voice => 
            (voice.name.includes('Google') && voice.lang.includes('en')) ||
            voice.name.includes('Samantha') ||
            voice.name.includes('Karen') ||
            voice.name.includes('Microsoft')
          ) || voices.find(voice => voice.lang.includes('en')) || voices[0];
          
          if (preferredVoice) utterance.voice = preferredVoice;
        }
        
        utterance.onend = () => {
          console.log('✅ Speech ended');
          resolve();
          
          // ✨ Auto-restart listening after AI finishes speaking
          if (chatMode === 'speech-only' && isVoiceActive) {
            setTimeout(() => {
              console.log('🔄 Auto-restarting listening...');
              resetTranscript();
              SpeechRecognition.startListening({ 
                continuous: true, 
                language: 'en-US',
                interimResults: true
              });
            }, 1000);
          }
        };
        
        utterance.onerror = (error) => {
          console.error('❌ Speech error:', error);
          resolve();
        };
        
        console.log('🗣️ Speaking:', cleanText.substring(0, 50) + '...');
        speechSynthesis.speak(utterance);
      };

      if (speechSynthesis.getVoices().length > 0) {
        setVoiceAndSpeak();
      } else {
        speechSynthesis.onvoiceschanged = () => {
          setVoiceAndSpeak();
          speechSynthesis.onvoiceschanged = null;
        };
      }
    });
  };

  // ✨ SPEECH INPUT PROCESSING
  useEffect(() => {
    if (transcript && !listening && (chatMode === 'speech-only' || chatMode === 'voice')) {
      const timer = setTimeout(() => {
        if (transcript.trim() && !isLoading) {
          console.log('🎤 Processing speech input:', transcript);
          
          if (chatMode === 'speech-only') {
            handleSpeechOnlyMessage(transcript);
          } else {
            send(transcript);
          }
          
          resetTranscript();
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [transcript, listening, chatMode, isLoading]);

  // ✨ SPEECH-ONLY MESSAGE HANDLER
  const handleSpeechOnlyMessage = async (speechText: string) => {
    if (isLoading) return;
    
    console.log('🎯 Handling speech-only message:', speechText);
    setCurrentSpeechResponse('Processing your message...');
    setIsLoading(true);

    const userMessage: Msg = { 
      id: crypto.randomUUID(), 
      role: "user", 
      text: speechText 
    };

    try {
      const apiEndpoint = getApiEndpoint();
      console.log('🔗 Using API endpoint:', apiEndpoint);
      
      const resp = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMessage].slice(-8)
        }),
      });

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
      }

      const data = await resp.json();
      const textResp = (data?.text && String(data.text).trim()) || localRespond(speechText);
      
      console.log('✅ AI Response received:', textResp.substring(0, 50) + '...');
      
      const assistantMessage: Msg = { 
        id: crypto.randomUUID(), 
        role: "assistant", 
        text: textResp 
      };
      
      // Update messages for context
      setMessages(prev => [...prev, userMessage, assistantMessage]);
      setCurrentSpeechResponse(textResp);
      
      // Speak the response
      await speakResponse(textResp);
      
      console.log('✅ Speech-to-Speech cycle completed');
      
    } catch (error) {
      console.error('❌ Speech API Error:', error);
      const fallbackResponse = localRespond(speechText);
      
      const assistantMessage: Msg = { 
        id: crypto.randomUUID(), 
        role: "assistant", 
        text: fallbackResponse,
        isError: true
      };
      
      setMessages(prev => [...prev, userMessage, assistantMessage]);
      setCurrentSpeechResponse(fallbackResponse);
      
      await speakResponse(fallbackResponse);
    } finally {
      setIsLoading(false);
    }
  };

  // ✨ START SPEECH-ONLY MODE WITH PERMISSION CHECK
  const startSpeechOnlyMode = async () => {
    if (!browserSupportsSpeechRecognition) {
      alert('Voice recognition not supported in this browser. Please use Chrome, Safari, or Edge.');
      return;
    }

    console.log('🎙️ Starting speech-only mode...');
    
    // Request microphone permission explicitly
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('✅ Microphone permission granted');
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('❌ Microphone permission denied:', error);
      alert('Please allow microphone access. Click the lock icon in the address bar and enable microphone permissions.');
      return;
    }

    setChatMode('speech-only');
    setIsVoiceActive(true);
    resetTranscript();
    setCurrentSpeechResponse('');
    
    const greeting = profile?.full_name 
      ? `Hello ${profile.full_name.split(' ')[0]}! I'm here to help with your mental health. What's on your mind today?`
      : "Hello! I'm your AI mental health assistant. How are you feeling today?";
    
    try {
      await speakResponse(greeting);
      console.log('✅ Greeting completed, starting to listen...');
    } catch (error) {
      console.error('❌ Greeting failed:', error);
      // Start listening anyway
      setTimeout(() => {
        console.log('🎤 Fallback - starting speech recognition...');
        SpeechRecognition.startListening({ 
          continuous: true, 
          language: 'en-US',
          interimResults: true
        });
      }, 1000);
    }
  };

  // ✨ STOP SPEECH-ONLY MODE
  const stopSpeechOnlyMode = () => {
    console.log('🛑 Stopping speech-only mode...');
    setChatMode('text');
    setIsVoiceActive(false);
    SpeechRecognition.stopListening();
    speechSynthesis.cancel();
    setCurrentSpeechResponse('');
  };

  // ✅ EXISTING QUICK RESPONSES - NO CHANGES
  const quick = useMemo(() => {
    const extendedProfile = getExtendedProfile();
    const baseSuggestions = [
      { label: "I feel anxious", text: "I feel anxious about studies" },
      { label: "Can't sleep", text: "I am having trouble sleeping" },
      { label: "Feeling low", text: "I feel sad and unmotivated" },
      { label: "Academic stress", text: "I'm overwhelmed with coursework" },
    ];

    if (extendedProfile?.currentConcerns) {
      const concerns = extendedProfile.currentConcerns;
      const personalizedSuggestions = [];

      if (concerns.includes('Anxiety') && !baseSuggestions.find(s => s.label === "I feel anxious")) {
        personalizedSuggestions.push({ label: "Anxiety help", text: "I need help managing my anxiety" });
      }
      if (concerns.includes('Academic Pressure')) {
        personalizedSuggestions.push({ label: "Study pressure", text: "I'm feeling overwhelmed with my studies" });
      }
      if (concerns.includes('Social Anxiety')) {
        personalizedSuggestions.push({ label: "Social anxiety", text: "I'm struggling with social situations" });
      }
      if (concerns.includes('Self-Esteem')) {
        personalizedSuggestions.push({ label: "Self-doubt", text: "I'm having issues with self-confidence" });
      }

      return [...personalizedSuggestions.slice(0, 2), ...baseSuggestions.slice(0, 3)];
    }

    return baseSuggestions;
  }, [getExtendedProfile]);

  // ✅ EXACT localRespond FUNCTION - NO CHANGES
  function localRespond(userText: string): string {
    const t = userText.toLowerCase();
    if (/suicid|self\s*harm|kill\s*myself|end\s*my\s*life/.test(t)) {
      return "I'm really sorry you're feeling this way. You deserve support right now. Please contact your local emergency number immediately or reach out to a crisis hotline. You're not alone, and help is available. 🆘";
    }
    if (/(anx|worry|panic)/.test(t)) {
      return "For anxiety: Try the 4-7-8 breathing technique - breathe in for 4, hold for 7, out for 8. Also try the 5-4-3-2-1 grounding: name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste. 🧘‍♀️";
    }
    if (/(sleep|insomnia|tired)/.test(t)) {
      return "For better sleep: Keep consistent bedtime, avoid screens 1 hour before bed, try progressive muscle relaxation, and ensure your room is cool and dark. Consider a brief journal to clear your mind. 😴";
    }
    if (/(sad|low|depress|empty)/.test(t)) {
      return "When feeling low: Try one small valued action (5-10 min), get some sunlight or bright light, reach out to a friend, practice self-compassion. Remember: feelings are temporary, you matter. 💙";
    }
    if (/(stress|burnout|overwhelm)/.test(t)) {
      return "For stress: Break tasks into smaller pieces, use the Pomodoro technique (25 min work, 5 min break), prioritize your top 3 tasks, and don't forget to take care of your basic needs. 🌟";
    }
    return "Thank you for sharing. Try taking 3 deep breaths right now. Remember, seeking help is a sign of strength. Consider talking to a counselor if these feelings persist. You deserve support. 💚";
  }

  // ✅ EXACT SEND FUNCTION - NO CHANGES (enhanced with voice)
  async function send(text?: string) {
    const value = (text ?? input).trim();
    if (!value || isLoading) return;
    
    const u: Msg = { id: crypto.randomUUID(), role: "user", text: value };
    setMessages((m) => [...m, u]);
    setInput("");
    setIsLoading(true);

    try {
      const apiEndpoint = getApiEndpoint();
      console.log('🔗 Using API endpoint:', apiEndpoint);
      
      const resp = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, u].slice(-8) }),
      });

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
      }

      const data = await resp.json();
      const textResp = (data?.text && String(data.text).trim()) || localRespond(value);
      
      const a: Msg = { 
        id: crypto.randomUUID(), 
        role: "assistant", 
        text: textResp 
      };
      setMessages((m) => [...m, a]);
      
      // Speak response in voice modes
      if (chatMode === 'voice') {
        speakResponse(textResp);
      }
      
      console.log('✅ AI Response received:', textResp.substring(0, 50) + '...');
      
    } catch (error) {
      console.error('❌ Chat API Error:', error);
      const fallbackResponse = localRespond(value);
      const a: Msg = { 
        id: crypto.randomUUID(), 
        role: "assistant", 
        text: `${fallbackResponse}\n\n⚠️ Note: AI service temporarily unavailable, using local response.`,
        isError: true
      };
      setMessages((m) => [...m, a]);
      
      if (chatMode === 'voice') {
        speakResponse(fallbackResponse);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-lg hover:bg-primary/90 transition-all"
      >
        <MessageCircle className="h-5 w-5" /> 
        <span className="hidden sm:inline">
          {profile?.full_name ? 'Chat Support' : 'Chat Support'}
        </span>
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="mx-auto max-w-2xl">
          <DrawerHeader className="px-4">
            <DrawerTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" /> 
              {profile?.full_name ? 'Your Personal AI Assistant' : 'AI First‑Aid Support'}
              {chatMode === 'speech-only' && (
                <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full animate-pulse">
                  🔴 Live Voice Chat
                </span>
              )}
              {chatMode === 'voice' && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  🎤 Voice Mode
                </span>
              )}
            </DrawerTitle>
            <DrawerDescription>
              {chatMode === 'speech-only' 
                ? "🎙️ Voice-only conversation - speak naturally, AI responds with voice"
                : chatMode === 'voice'
                ? "🎤 Voice + text mode - speak or type, AI responds with voice and text"
                : profile?.full_name 
                ? `Personalized mental health support for ${profile.full_name.split(' ')[0]}. Not a diagnosis.`
                : "Private and stigma‑free mental health support. Not a diagnosis."
              }
            </DrawerDescription>

            {/* ✨ CHAT MODE TOGGLE */}
            <div className="flex gap-2 mt-3">
              <Button 
                size="sm"
                variant={chatMode === 'text' ? 'default' : 'outline'}
                onClick={() => {
                  stopSpeechOnlyMode();
                  setChatMode('text');
                }}
                disabled={isLoading}
              >
                💬 Text
              </Button>
              <Button 
                size="sm"
                variant={chatMode === 'voice' ? 'default' : 'outline'}
                onClick={() => {
                  stopSpeechOnlyMode();
                  setChatMode('voice');
                }}
                disabled={isLoading}
              >
                🎤 Voice + Text
              </Button>
              {browserSupportsSpeechRecognition && (
                <Button 
                  size="sm"
                  variant={chatMode === 'speech-only' ? 'default' : 'outline'}
                  onClick={chatMode === 'speech-only' ? stopSpeechOnlyMode : startSpeechOnlyMode}
                  disabled={isLoading}
                  className={chatMode === 'speech-only' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
                >
                  {chatMode === 'speech-only' ? (
                    <>🛑 Stop Voice</>
                  ) : (
                    <>🎙️ Voice Only</>
                  )}
                </Button>
              )}
            </div>

            {/* ✨ DEBUG TEST BUTTON (temporary) */}
            {browserSupportsSpeechRecognition && (
              <Button 
                size="sm"
                variant="outline"
                onClick={() => {
                  console.log('🧪 Testing microphone...');
                  resetTranscript();
                  SpeechRecognition.startListening({ 
                    continuous: false, 
                    language: 'en-US',
                    interimResults: true
                  });
                  
                  setTimeout(() => {
                    console.log('Test transcript:', transcript);
                    if (!transcript) {
                      alert('❌ Microphone test failed. Check permissions and try Chrome browser.');
                    } else {
                      alert(`✅ Microphone working! Heard: "${transcript}"`);
                    }
                    SpeechRecognition.stopListening();
                  }, 3000);
                }}
                className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                🧪 Test Mic (3sec)
              </Button>
            )}
          </DrawerHeader>
          
          <div className="px-4 pb-4">
            {/* ✨ SPEECH-ONLY MODE INTERFACE */}
            {chatMode === 'speech-only' ? (
              <Card className="h-[45vh] sm:h-80 flex flex-col items-center justify-center bg-gradient-to-b from-red-50 to-red-100 border-red-200">
                <CardContent className="text-center space-y-4">
                  <div className="text-6xl">
                    {listening ? (
                      <span className="animate-pulse">🎤</span>
                    ) : isLoading ? (
                      <span className="animate-spin">🤖</span>
                    ) : (
                      <span className="animate-bounce">🔊</span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {listening ? (
                      <>
                        <h3 className="text-xl font-semibold text-green-800">Listening...</h3>
                        <p className="text-green-700">🎤 Speak now, I'm listening!</p>
                        {transcript && (
                          <div className="p-3 bg-green-100 rounded-lg border border-green-300 max-w-md mx-auto">
                            <p className="text-green-800 text-sm">"{transcript}"</p>
                          </div>
                        )}
                      </>
                    ) : isLoading ? (
                      <>
                        <h3 className="text-xl font-semibold text-blue-800">AI is thinking...</h3>
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="text-xl font-semibold text-purple-800">AI is speaking...</h3>
                        <p className="text-purple-700">
                          <Volume2 className="inline h-4 w-4 mr-1" />
                          Listen to the response
                        </p>
                        {currentSpeechResponse && (
                          <div className="p-3 bg-purple-100 rounded-lg border border-purple-300 max-w-md mx-auto">
                            <p className="text-purple-800 text-sm">"{currentSpeechResponse}"</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="mt-6 space-y-2">
                    <p className="text-xs text-gray-600">💡 Voice Tips:</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Speak clearly and naturally</li>
                      <li>• Wait for AI to finish speaking</li>
                      <li>• Conversation continues automatically</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* ✅ REGULAR CHAT INTERFACE */
              <>
                <Card className="h-[45vh] overflow-y-auto sm:h-80" ref={listRef}>
                  <CardContent className="space-y-3 py-4">
                    {messages.map((m) => (
                      <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
                        <div className={`inline-block rounded-lg px-3 py-2 max-w-[85%] ${
                          m.role === "user" 
                            ? "bg-primary text-primary-foreground" 
                            : m.isError
                            ? "bg-amber-100 text-amber-900 border border-amber-200"
                            : "bg-secondary text-foreground"
                        }`}>
                          {m.isError && (
                            <AlertTriangle className="inline h-4 w-4 mr-1" />
                          )}
                          <span className="whitespace-pre-wrap">{m.text}</span>
                        </div>
                      </div>
                    ))}
                    
                    {/* Voice transcript display */}
                    {chatMode === 'voice' && transcript && listening && (
                      <div className="text-right">
                        <div className="inline-block rounded-lg bg-blue-100 text-blue-900 px-3 py-2 max-w-[85%] border border-blue-200">
                          <Mic className="inline h-4 w-4 mr-1" />
                          <span className="italic">Listening: "{transcript}"</span>
                        </div>
                      </div>
                    )}
                    
                    {isLoading && (
                      <div className="text-left">
                        <div className="inline-block rounded-lg bg-secondary px-3 py-2">
                          <div className="flex items-center space-x-1">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                            <span className="ml-2 text-sm text-muted-foreground">
                              {profile?.full_name ? 'Your AI assistant is thinking...' : 'AI is thinking...'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {quick.map((q) => (
                    <Button 
                      key={q.label} 
                      size="sm" 
                      variant="secondary" 
                      onClick={() => send(q.text)}
                      disabled={isLoading}
                    >
                      {q.label}
                    </Button>
                  ))}
                </div>
                
                <div className="mt-3 flex items-center gap-2">
                  <Input
                    placeholder={
                      chatMode === 'voice'
                        ? "🎤 Speak or type your message..."
                        : profile?.full_name 
                        ? `Share what's on your mind, ${profile.full_name.split(' ')[0]}...`
                        : "Type your message…"
                    }
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                    disabled={isLoading}
                  />
                  
                  {/* Voice toggle for voice mode */}
                  {chatMode === 'voice' && browserSupportsSpeechRecognition && (
                    <Button 
                      variant={listening ? "default" : "outline"}
                      onClick={() => {
                        if (listening) {
                          SpeechRecognition.stopListening();
                        } else {
                          resetTranscript();
                          SpeechRecognition.startListening({ 
                            continuous: true, 
                            language: 'en-US',
                            interimResults: true
                          });
                        }
                      }}
                      disabled={isLoading}
                      className={listening ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  )}
                  
                  <Button 
                    onClick={() => send()} 
                    aria-label="Send"
                    disabled={!input.trim() || isLoading}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
            
            <div className="mt-3 rounded-md bg-amber-50 p-3 text-amber-900 dark:bg-amber-900/20 dark:text-amber-200">
              <p className="flex items-center gap-2 text-xs">
                <ShieldAlert className="h-4 w-4" /> 
                If you are in crisis or at risk of harm, contact local emergency services immediately.
              </p>
            </div>
            
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <a href="/#self-check" className="text-primary underline-offset-4 hover:underline">
                Try a self‑assessment
              </a>
              <span className="text-muted-foreground">•</span>
              <a href="/#booking" className="text-primary underline-offset-4 hover:underline">
                Book a confidential session
              </a>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
