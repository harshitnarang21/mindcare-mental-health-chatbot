import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface Profile {
  id: string; // auth user id
  full_name: string | null;
  college: string | null;
  age: number | null;
  created_at?: string;
}

interface AuthCtx {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  needsProfile: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  upsertProfile: (p: Omit<Profile, "id">) => Promise<void>;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsProfile, setNeedsProfile] = useState(false);

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

  useEffect(() => {
    (async () => {
      if (!user) {
        setProfile(null);
        setNeedsProfile(false);
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, college, age, created_at")
        .eq("id", user.id)
        .maybeSingle();
      if (error) {
        // If table missing, ignore and don't block UI
        setProfile(null);
        setNeedsProfile(true);
        return;
      }
      setProfile(data ?? null);
      setNeedsProfile(!data || !data.full_name);
    })();
  }, [user]);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const upsertProfile = async (p: Omit<Profile, "id">) => {
    if (!user) return;
    const { error } = await supabase.from("profiles").upsert({ id: user.id, ...p });
    if (!error) {
      setProfile({ id: user.id, ...p });
      setNeedsProfile(false);
    }
  };

  const value = useMemo<AuthCtx>(() => ({ user, profile, loading, needsProfile, signInWithGoogle, signOut, upsertProfile }), [user, profile, loading, needsProfile]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
