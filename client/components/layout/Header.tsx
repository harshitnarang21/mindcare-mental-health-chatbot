import { Button } from "@/components/ui/button";
import { Menu, User, LogOut, Heart, Clock, GraduationCap, Trophy, Crown, Sparkles, Zap, Home, Users, Brain } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthProvider";
import { useNavigate } from "react-router-dom";

function AuthActions() {
  const { user, profile, signInWithGoogle, signOut, getUserGreeting, getExtendedProfile, hasExtendedProfile } = useAuth();

  if (!user) {
    return (
      <Button 
        onClick={signInWithGoogle} 
        className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white border-0 font-semibold px-6 py-2 shadow-lg transform hover:scale-105 transition-all duration-200"
      >
        <User className="w-4 h-4 mr-2" />
        Sign In
      </Button>
    );
  }

  // Enhanced user display with personalized info
  const extendedProfile = getExtendedProfile();
  const hasExtended = hasExtendedProfile();

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3 bg-gray-800/50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-900">
              {user.displayName?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-200">{getUserGreeting()}</p>
            {/* Show additional context based on profile */}
            {hasExtended && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                {extendedProfile.college && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" />
                    {extendedProfile.college}
                  </span>
                )}
                {extendedProfile.karmaPoints && (
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-yellow-400" />
                    {extendedProfile.karmaPoints} pts
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={signOut}
        className="text-gray-300 hover:text-white hover:bg-gray-800/50 p-2"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navigationItems = [
    {
      name: "Home",
      path: "/",
      icon: Home,
      description: "Main dashboard"
    },
    {
      name: "Shantah",
      path: "/shantah",
      icon: Brain,
      description: "AI Wellness Platform"
    },
    {
      name: "Karma Arena",
      path: "/karma-arena", 
      icon: Trophy,
      description: "Gamified Rewards"
    },
    {
      name: "Community",
      path: "/community",
      icon: Users,
      description: "Connect & Share"
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-lg border-b border-gray-700/50 shadow-lg">
      {/* Premium Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-yellow-500/5 to-orange-500/5"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Premium Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavigation('/')}
          >
            {/* Premium Logo Icon */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-orange-400/25 transition-all duration-200">
                <Crown className="w-6 h-6 text-gray-900 group-hover:scale-110 transition-transform duration-200" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-gray-900" />
              </div>
            </div>
            
            {/* Premium Brand Text */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold leading-none">
                <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                  Mind
                </span>
                <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Care
                </span>
              </h1>
              <p className="text-xs text-orange-300 font-medium leading-none">
                India's First AI Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 group relative",
                  "hover:shadow-lg hover:shadow-orange-500/10"
                )}
              >
                <item.icon className="w-4 h-4 mr-2 group-hover:text-orange-400 transition-colors duration-200" />
                <span className="font-medium">{item.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-yellow-500/0 to-orange-500/0 group-hover:from-orange-500/10 group-hover:via-yellow-500/10 group-hover:to-orange-500/10 rounded-md transition-all duration-200"></div>
              </Button>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex">
            <AuthActions />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-gray-300 hover:text-white hover:bg-gray-800/50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-700/50">
            <div className="flex flex-col space-y-2 pt-4">
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  onClick={() => handleNavigation(item.path)}
                  className="justify-start text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 group"
                >
                  <item.icon className="w-4 h-4 mr-3 group-hover:text-orange-400 transition-colors duration-200" />
                  <div className="text-left">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Button>
              ))}
              <div className="pt-4 border-t border-gray-700/50 mt-4">
                <AuthActions />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
