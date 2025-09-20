import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

// ✅ KEEP YOUR EXACT EXISTING INTERFACE - NO CHANGES
export interface Profile {
  id: string; // auth user id
  full_name: string | null;
  college: string | null;
  age: number | null;
  created_at?: string;
  // ✨ NEW: Optional field for enhanced data (backward compatible)
  extended_profile?: string | null;
}

// ✅ KEEP YOUR EXACT EXISTING INTERFACE - JUST ADD SAFE HELPERS
interface AuthCtx {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  needsProfile: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  upsertProfile: (p: Omit<Profile, "id">) => Promise<void>;
  // ✨ NEW: Safe helper functions (don't break anything)
  getUserGreeting: () => string;
  getExtendedProfile: () => any;
  hasExtendedProfile: () => boolean;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // ✅ KEEP ALL YOUR EXISTING STATE - NO CHANGES
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsProfile, setNeedsProfile] = useState(false);

  // ✅ KEEP YOUR EXACT EXISTING useEffect - NO CHANGES
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      sub.subscription.unsubscribe();
      mounted = false;
    };
  }, []);

  // 🔧 FIXED: Enhanced profile fetching with better needsProfile logic
  useEffect(() => {
    (async () => {
      if (!user) {
        setProfile(null);
        setNeedsProfile(false);
        return;
      }
      
      console.log("🔍 Fetching profile for user:", user.id); // Debug log
      
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, college, age, created_at, extended_profile")
        .eq("id", user.id)
        .maybeSingle();
        
      if (error) {
        console.log("❌ Profile fetch error:", error); // Debug log
        setProfile(null);
        setNeedsProfile(true);
        return;
      }
      
      console.log("📋 Profile data received:", data); // Debug log
      
      setProfile(data ?? null);
      
      // 🔧 FIXED: Better needsProfile detection
      const hasBasicProfile = data && data.full_name && data.full_name.trim().length > 0;
      console.log("✅ Has basic profile:", hasBasicProfile, "needsProfile will be:", !hasBasicProfile); // Debug log
      
      setNeedsProfile(!hasBasicProfile);
    })();
  }, [user]);

  // ✅ KEEP YOUR EXACT EXISTING FUNCTIONS - NO CHANGES
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  // 🔧 ENHANCED: Better upsert function with proper state updates
  const upsertProfile = async (p: Omit<Profile, "id">) => {
    if (!user) return;
    
    console.log("💾 Upserting profile:", p); // Debug log
    
    // ✅ This will work with your existing DB structure AND new enhanced fields
    const { data, error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, ...p })
      .select()
      .single();
      
    console.log("📤 Upsert result:", { data, error }); // Debug log
    
    if (!error && data) {
      setProfile(data);
      // 🔧 FIXED: Properly determine needsProfile based on actual data
      const hasBasicProfile = data.full_name && data.full_name.trim().length > 0;
      setNeedsProfile(!hasBasicProfile);
      console.log("✅ Profile saved successfully, needsProfile set to:", !hasBasicProfile);
    } else {
      console.error("❌ Profile upsert failed:", error);
    }
  };

  // ✨ NEW: Safe helper functions (don't break existing functionality)
  const getUserGreeting = (): string => {
    if (!profile?.full_name) return "Welcome to MindCare";
    
    const firstName = profile.full_name.split(' ')[0];
    const hour = new Date().getHours();
    
    let timeGreeting = '';
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 17) timeGreeting = 'Good afternoon';
    else timeGreeting = 'Good evening';
    
    return `${timeGreeting}, ${firstName}!`;
  };

  const getExtendedProfile = (): any => {
    if (!profile?.extended_profile) return null;
    try {
      return JSON.parse(profile.extended_profile);
    } catch {
      return null; // Safe fallback if JSON is invalid
    }
  };

  const hasExtendedProfile = (): boolean => {
    const extended = getExtendedProfile();
    return extended && extended.profileVersion === "enhanced";
  };

  // ✅ ENHANCED VALUE WITH NEW HELPERS (backward compatible)
  const value = useMemo<AuthCtx>(() => ({ 
    // ✅ KEEP ALL YOUR EXISTING VALUES
    user, 
    profile, 
    loading, 
    needsProfile, 
    signInWithGoogle, 
    signOut, 
    upsertProfile,
    // ✨ NEW: Safe helper functions
    getUserGreeting,
    getExtendedProfile,
    hasExtendedProfile
  }), [user, profile, loading, needsProfile]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// ✅ KEEP YOUR EXACT EXISTING HOOK - NO CHANGES
export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
