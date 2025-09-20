import { useEffect, useMemo, useRef, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Send, ShieldAlert, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";

interface Msg { 
  id: string; 
  role: "user" | "assistant"; 
  text: string;
  isError?: boolean;
}

// ✅ KEEP YOUR EXACT API ENDPOINT LOGIC - NO CHANGES
const getApiEndpoint = () => {
  if (typeof window !== 'undefined') {
    // Check if we're on localhost (development)
    const isLocal = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' ||
                   window.location.hostname.includes('localhost');
    
    return isLocal 
      ? '/api/ai-chat'  // Local development
      : '/.netlify/functions/api/ai-chat';  // Production on Netlify
  }
  return '/api/ai-chat';  // Fallback for SSR
};

export default function ChatWidget() {
  // ✨ NEW: Add auth context for personalization
  const { profile, getUserGreeting, getExtendedProfile, hasExtendedProfile } = useAuth();
  
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // ✨ ENHANCED: Personalized seed message based on user profile
  const personalizedSeed: Msg[] = useMemo(() => {
    if (!profile?.full_name) {
      // ✅ Default message for non-registered users (your existing)
      return [
        { id: "a0", role: "assistant", text: "Hi, I'm your AI First‑Aid. I can offer short coping strategies and point you to help. If this is an emergency, call your local emergency number immediately." }
      ];
    }

    // ✨ NEW: Personalized messages for registered users
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

  // ✨ NEW: Dynamic messages state that updates when user profile changes
  const [messages, setMessages] = useState<Msg[]>(personalizedSeed);

  // ✨ NEW: Update messages when profile changes
  useEffect(() => {
    setMessages(personalizedSeed);
  }, [personalizedSeed]);

  // ✅ KEEP YOUR EXISTING useEffect - NO CHANGES
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  // ✨ ENHANCED: Personalized quick responses based on user profile
  const quick = useMemo(() => {
    const extendedProfile = getExtendedProfile();
    const baseSuggestions = [
      { label: "I feel anxious", text: "I feel anxious about studies" },
      { label: "Can't sleep", text: "I am having trouble sleeping" },
      { label: "Feeling low", text: "I feel sad and unmotivated" },
      { label: "Academic stress", text: "I'm overwhelmed with coursework" },
    ];

    // ✨ Add personalized suggestions based on user's concerns
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

      // Mix personalized with base suggestions (max 4-5 total)
      return [...personalizedSuggestions.slice(0, 2), ...baseSuggestions.slice(0, 3)];
    }

    return baseSuggestions;
  }, [getExtendedProfile]);

  // ✅ KEEP YOUR EXACT localRespond FUNCTION - NO CHANGES
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

  // ✅ KEEP YOUR EXACT send FUNCTION - NO CHANGES
  async function send(text?: string) {
    const value = (text ?? input).trim();
    if (!value || isLoading) return;
    
    const u: Msg = { id: crypto.randomUUID(), role: "user", text: value };
    setMessages((m) => [...m, u]);
    setInput("");
    setIsLoading(true);

    try {
      // ✅ KEEP YOUR EXACT API LOGIC - NO CHANGES
      const apiEndpoint = getApiEndpoint();
      console.log('🔗 Using API endpoint:', apiEndpoint); // Debug log
      
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
      
      console.log('✅ AI Response received:', textResp.substring(0, 50) + '...'); // Debug log
      
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
            </DrawerTitle>
            <DrawerDescription>
              {profile?.full_name 
                ? `Personalized mental health support for ${profile.full_name.split(' ')[0]}. Not a diagnosis.`
                : "Private and stigma‑free mental health support. Not a diagnosis."
              }
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 pb-4">
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
                  profile?.full_name 
                    ? `Share what's on your mind, ${profile.full_name.split(' ')[0]}...`
                    : "Type your message…"
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                disabled={isLoading}
              />
              <Button 
                onClick={() => send()} 
                aria-label="Send"
                disabled={!input.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
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
