import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Crown,
  Sparkles,
  Heart,
  Shield,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ExternalLink,
  ArrowUp,
  Zap,
  Users,
  BookOpen,
  MessageCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Shantah", path: "/shantah", icon: Zap },
        { name: "Karma Arena", path: "/karma-arena", icon: Crown },
        { name: "Community", path: "/community", icon: Users },
        { name: "AI Chat", path: "/", icon: MessageCircle }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Mental Health Guide", path: "#", icon: BookOpen },
        { name: "Stress Management", path: "#", icon: Heart },
        { name: "Campus Support", path: "#", icon: Shield },
        { name: "Crisis Helplines", path: "#", icon: Phone }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", path: "#", icon: ExternalLink },
        { name: "Privacy Policy", path: "#", icon: Shield },
        { name: "Terms of Service", path: "#", icon: ExternalLink },
        { name: "Contact Us", path: "#", icon: Mail }
      ]
    }
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "#", color: "hover:text-blue-400" },
    { name: "Twitter", icon: Twitter, url: "#", color: "hover:text-cyan-400" },
    { name: "Instagram", icon: Instagram, url: "#", color: "hover:text-pink-400" },
    { name: "LinkedIn", icon: Linkedin, url: "#", color: "hover:text-blue-500" },
    { name: "YouTube", icon: Youtube, url: "#", color: "hover:text-red-400" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-yellow-500/5 to-orange-500/5"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-yellow-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1 space-y-6">
              {/* Logo and Brand */}
              <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-orange-400/25 transition-all duration-200">
                    <Crown className="w-7 h-7 text-gray-900 group-hover:scale-110 transition-transform duration-200" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 text-gray-900" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold leading-none">
                    <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                      Mind
                    </span>
                    <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                      Care
                    </span>
                  </h3>
                  <p className="text-xs text-orange-300 font-medium">
                    India's First AI Platform
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed">
                Transforming mental health support for students across India with AI-powered solutions, ancient wisdom, and modern gamification.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="text-sm">support@mindcare.in</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="text-sm">+91 1800-MINDCARE</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="text-sm">New Delhi, India</span>
                </div>
              </div>
            </div>

            {/* Navigation Sections */}
            {footerSections.map((section, index) => (
              <div key={section.title} className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full"></span>
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Button
                        variant="ghost"
                        onClick={() => link.path.startsWith('/') ? navigate(link.path) : window.open(link.path, '_blank')}
                        className="h-auto p-0 text-gray-400 hover:text-orange-300 transition-colors duration-200 text-left justify-start font-normal"
                      >
                        <link.icon className="w-4 h-4 mr-2 text-orange-400/70" />
                        {link.name}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media & Newsletter Section */}
        <div className="border-t border-gray-700/50 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm font-medium">Follow us:</span>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(social.url, '_blank')}
                    className={`w-10 h-10 p-0 bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 ${social.color} transition-all duration-200 hover:scale-110`}
                  >
                    <social.icon className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm font-medium">Stay updated:</span>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800/50 border border-gray-600/50 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 transition-colors"
                />
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white border-0 shadow-lg"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700/50 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Heart className="w-4 h-4 text-red-400" />
              <span>© 2025 MindCare. Made with care for student mental health.</span>
            </div>

            {/* Back to Top Button */}
            <Button
              onClick={scrollToTop}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-orange-300 transition-colors duration-200"
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              Back to Top
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-4 pt-4 border-t border-gray-800/50">
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-green-400" />
                GDPR Compliant
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-red-400" />
                Mental Health Certified
              </span>
              <span className="flex items-center gap-1">
                <Crown className="w-3 h-3 text-yellow-400" />
                Trusted by 50,000+ Students
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
