import { useEffect, useMemo, useRef, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Send, ShieldAlert, AlertTriangle } from "lucide-react";

interface Msg { 
  id: string; 
  role: "user" | "assistant"; 
  text: string;
  isError?: boolean;
}

const seed: Msg[] = [
  { id: "a0", role: "assistant", text: "Hi, I'm your AI First‑Aid. I can offer short coping strategies and point you to help. If this is an emergency, call your local emergency number immediately." },
];

// ✅ FIXED: Environment-aware API endpoint
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
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const quick = useMemo(() => ([
    { label: "I feel anxious", text: "I feel anxious about studies" },
    { label: "Can't sleep", text: "I am having trouble sleeping" },
    { label: "Feeling low", text: "I feel sad and unmotivated" },
    { label: "Academic stress", text: "I'm overwhelmed with coursework" },
  ]), []);

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

  async function send(text?: string) {
    const value = (text ?? input).trim();
    if (!value || isLoading) return;
    
    const u: Msg = { id: crypto.randomUUID(), role: "user", text: value };
    setMessages((m) => [...m, u]);
    setInput("");
    setIsLoading(true);

    try {
      // ✅ FIXED: Use environment-aware API endpoint
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
        <span className="hidden sm:inline">Chat Support</span>
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="mx-auto max-w-2xl">
          <DrawerHeader className="px-4">
            <DrawerTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" /> AI First‑Aid Support
            </DrawerTitle>
            <DrawerDescription>
              Private and stigma‑free mental health support. Not a diagnosis.
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
                        <span className="ml-2 text-sm text-muted-foreground">AI is thinking...</span>
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
                placeholder="Type your message…"
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
