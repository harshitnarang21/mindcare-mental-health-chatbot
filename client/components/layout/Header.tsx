import { Button } from "@/components/ui/button";
import { Menu, User, LogOut, Heart, Clock, GraduationCap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthProvider";

function AuthActions() {
  const { user, profile, signInWithGoogle, signOut, getUserGreeting, getExtendedProfile, hasExtendedProfile } = useAuth();
  
  if (!user) {
    return (
      <button 
        onClick={signInWithGoogle} 
        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-accent px-3 py-1.5 rounded-md"
      >
        <User className="h-4 w-4" />
        Sign in with Google
      </button>
    );
  }

  // Enhanced user display with personalized info
  const extendedProfile = getExtendedProfile();
  const hasExtended = hasExtendedProfile();

  return (
    <div className="flex items-center gap-3">
      {/* Enhanced user greeting with context */}
      <div className="flex items-center gap-2">
        {profile?.full_name ? (
          <div className="text-right">
            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">
                  {getUserGreeting()}
                </p>
                {/* Show additional context based on profile */}
                {hasExtended && (
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {profile.college && (
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-3 w-3" />
                        {profile.college.length > 20 ? profile.college.substring(0, 20) + '...' : profile.college}
                      </div>
                    )}
                    {extendedProfile?.stressLevel && (
                      <div className="flex items-center gap-1">
                        <Heart className={cn(
                          "h-3 w-3",
                          extendedProfile.stressLevel === 'high' || extendedProfile.stressLevel === 'severe' 
                            ? "text-red-500" 
                            : extendedProfile.stressLevel === 'moderate' 
                            ? "text-yellow-500" 
                            : "text-green-500"
                        )} />
                        Stress: {extendedProfile.stressLevel}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Mobile: Just show first name */}
              <div className="sm:hidden">
                <span className="text-sm text-muted-foreground">
                  Hi, {profile.full_name.split(" ")[0]}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Welcome!</span>
        )}
      </div>

      {/* Enhanced sign out button */}
      <button 
        onClick={signOut} 
        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-accent px-2 py-1 rounded-md"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Sign out</span>
      </button>
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, profile, hasExtendedProfile } = useAuth();
  
  const nav = [
    { label: "Home", href: "/#top" },
    { label: "Features", href: "/#features" },
    { label: "Resources", href: "/#resources" },
    { label: "Community", href: "/community" },
    { label: "About", href: "/#about" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        {/* Enhanced Logo with Mental Health Branding */}
        <a href="/" className="flex items-center gap-2">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary via-blue-500 to-teal-500 text-white shadow-lg">
            <Heart className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <div className="text-base font-semibold tracking-tight">MINDCARE</div>
            <div className="text-xs text-muted-foreground">
              {user && profile ? 'Your AI wellness companion' : 'Student wellbeing'}
            </div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((n) => (
            <a 
              key={n.href} 
              href={n.href} 
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {n.label}
            </a>
          ))}
          
          <AuthActions />
          
          {/* Enhanced CTA Button with personalization */}
          <a href="/#self-check" className="hidden md:inline-block">
            <Button size="sm" className="bg-gradient-to-r from-primary to-teal-500 hover:from-primary/90 hover:to-teal-500/90">
              {user && profile ? (
                hasExtendedProfile() ? "AI Chat" : "Complete Profile"
              ) : (
                "Start Self‑Check"
              )}
            </Button>
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Enhanced Mobile Menu */}
      <div className={cn("border-t md:hidden", open ? "block" : "hidden")}> 
        <div className="mx-auto grid max-w-6xl gap-2 px-4 py-3">
          {nav.map((n) => (
            <a 
              key={n.href} 
              href={n.href} 
              className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {n.label}
            </a>
          ))}
          
          <div className="px-2 py-2">
            <AuthActions />
          </div>
          
          {/* Enhanced mobile CTA */}
          <a href="/#self-check" className="px-2 py-2">
            <Button className="w-full bg-gradient-to-r from-primary to-teal-500" size="sm">
              {user && profile ? (
                hasExtendedProfile() ? "Open AI Chat" : "Complete Your Profile"
              ) : (
                "Start Self‑Check"
              )}
            </Button>
          </a>

          {/* Additional mobile-only quick access for logged in users */}
          {user && profile && hasExtendedProfile() && (
            <div className="border-t mt-2 pt-2">
              <div className="px-2 py-1 text-xs text-muted-foreground">Quick Actions</div>
              <a href="/#booking" className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Book Session
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
