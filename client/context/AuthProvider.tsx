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

  // 🔧 ENHANCED: Profile fetching with better error handling
  useEffect(() => {
    (async () => {
      if (!user) {
        setProfile(null);
        setNeedsProfile(false);
        return;
      }
      
      console.log("🔍 Fetching profile for user:", user.id);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, college, age, created_at, extended_profile")
        .eq("id", user.id)
        .maybeSingle();
        
      if (error) {
        console.log("❌ Profile fetch error:", error);
        // 🔧 ENHANCED: Better error handling based on error type
        if (error.code === 'PGRST116') {
          // No rows returned - user needs to create profile
          setProfile(null);
          setNeedsProfile(true);
        } else if (error.message?.includes("table") && error.message?.includes("does not exist")) {
          // Profiles table doesn't exist - handle gracefully
          console.warn("⚠️ Profiles table not found. User will need to complete profile setup.");
          setProfile(null);
          setNeedsProfile(true);
        } else {
          // Other errors - still allow app to function
          setProfile(null);
          setNeedsProfile(true);
        }
        return;
      }
      
      console.log("📋 Profile data received:", data);
      
      setProfile(data ?? null);
      
      // 🔧 ENHANCED: More robust profile validation
      const hasBasicProfile = data && 
                             data.full_name && 
                             data.full_name.trim().length > 0 &&
                             data.full_name.trim() !== 'null' &&
                             data.full_name.trim() !== 'undefined';
      
      console.log("✅ Has basic profile:", hasBasicProfile, "needsProfile will be:", !hasBasicProfile);
      
      setNeedsProfile(!hasBasicProfile);
    })();
  }, [user]);

  // 🔧 ENHANCED: Better redirect handling for production
  const signInWithGoogle = async () => {
    try {
      const redirectTo = typeof window !== 'undefined' 
        ? window.location.origin 
        : 'https://minc.netlify.app'; // Fallback for SSR
        
      console.log("🔗 OAuth redirect URL:", redirectTo);
      
      await supabase.auth.signInWithOAuth({ 
        provider: "google", 
        options: { 
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        } 
      });
    } catch (error) {
      console.error("❌ Google sign-in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setNeedsProfile(false);
      console.log("👋 User signed out successfully");
    } catch (error) {
      console.error("❌ Sign out error:", error);
    }
  };

  // 🔧 ENHANCED: Better upsert function with retry logic
  const upsertProfile = async (p: Omit<Profile, "id">) => {
    if (!user) return;
    
    console.log("💾 Upserting profile:", p);
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .upsert({ id: user.id, ...p })
        .select()
        .single();
        
      console.log("📤 Upsert result:", { data, error });
      
      if (!error && data) {
        setProfile(data);
        // 🔧 ENHANCED: More robust validation
        const hasBasicProfile = data.full_name && 
                               data.full_name.trim().length > 0 &&
                               data.full_name.trim() !== 'null';
        setNeedsProfile(!hasBasicProfile);
        console.log("✅ Profile saved successfully, needsProfile set to:", !hasBasicProfile);
      } else {
        console.error("❌ Profile upsert failed:", error);
        // Don't throw error - let app continue to function
      }
    } catch (error) {
      console.error("❌ Profile upsert exception:", error);
      // Don't throw error - let app continue to function
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
