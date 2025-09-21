import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SelfAssessmentPHQ9 from "@/components/SelfAssessmentPHQ9";
import { HeartPulse, MessagesSquare, BookOpen, Users, BarChart3, Languages, Sparkles, Crown, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    // Navigate to Shantah (your main wellness platform)
    navigate('/shantah');
  };

  const handleExploreFeatures = () => {
    // Navigate to Community page to explore features
    navigate('/community');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Premium Background Effects - Applied throughout */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-yellow-500/5 to-orange-500/5"></div>
      <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-orange-400/10 to-yellow-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-orange-400/5 to-yellow-400/5 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* Premium Hero Section - KEEPING EXISTING */}
        <section className="relative py-24 px-6 text-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
          {/* Premium Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 animate-pulse"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 max-w-6xl mx-auto">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/30 rounded-full backdrop-blur-sm">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-orange-200">India's Most Advanced Platform</span>
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>

            {/* Main Hero Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                Mind
              </span>
              <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Care
              </span>
            </h1>

            {/* Premium Hero Tagline */}
            <div className="mb-8 space-y-2">
              <p className="text-xl md:text-2xl font-semibold text-gray-200 leading-relaxed max-w-4xl mx-auto">
                India's First AI-Powered Mental Wellness Platform with 
              </p>
              <p className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Ancient Wisdom & Modern Rewards
              </p>
            </div>

            {/* Premium Feature Highlights */}
            <div className="flex flex-wrap justify-center gap-6 mb-12 text-gray-300">
              <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700/50 backdrop-blur-sm">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Krishna's Time Machine</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700/50 backdrop-blur-sm">
                <MessagesSquare className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium">AI-Powered Therapy</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700/50 backdrop-blur-sm">
                <HeartPulse className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium">Karma Rewards</span>
              </div>
            </div>

            {/* Premium CTA Buttons - KEEPING FUNCTIONALITY */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={handleStartJourney}
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white border-0 shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Start Your Journey
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleExploreFeatures}
                className="px-8 py-4 text-lg font-semibold bg-gray-800/80 border-2 border-orange-400/60 text-orange-200 hover:bg-orange-500/20 hover:border-orange-400 hover:text-white backdrop-blur-sm transition-all duration-200"
              >
                Explore Features
              </Button>
            </div>
          </div>
        </section>

        {/* Premium Features Section - UPDATED THEME */}
        <section className="py-16 px-6 relative">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/30 rounded-full backdrop-blur-sm">
                <HeartPulse className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-orange-200">Comprehensive Support</span>
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                  Mental Health
                </span>
                <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  {' '}Ecosystem
                </span>
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-2">
                A structured, scalable support system designed for higher education.
              </p>
              <p className="text-sm text-orange-300">
                Short, campus‑ready content you can localize for your students.
              </p>
            </div>

            {/* Feature Cards - PREMIUM THEME */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: HeartPulse,
                  title: "Stress Assessment",
                  desc: "Real-time stress monitoring and personalized wellness recommendations",
                  gradient: "from-red-400 to-pink-500"
                },
                {
                  icon: MessagesSquare,
                  title: "AI Therapy Chat",
                  desc: "24/7 supportive conversations with our intelligent mental health assistant",
                  gradient: "from-blue-400 to-purple-500"
                },
                {
                  icon: BookOpen,
                  title: "Wellness Resources",
                  desc: "Curated mental health content and self-help materials",
                  gradient: "from-green-400 to-teal-500"
                },
                {
                  icon: Users,
                  title: "Community Support",
                  desc: "Connect with peers and share your journey in a safe environment",
                  gradient: "from-purple-400 to-indigo-500"
                },
                {
                  icon: BarChart3,
                  title: "Progress Tracking",
                  desc: "Monitor your mental health journey with detailed analytics",
                  gradient: "from-yellow-400 to-orange-500"
                },
                {
                  icon: Languages,
                  title: "Multi-language",
                  desc: "Support in multiple Indian languages for better accessibility",
                  gradient: "from-cyan-400 to-blue-500"
                }
              ].map((feature, index) => (
                <Card key={index} className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 shadow-xl hover:shadow-2xl hover:bg-gray-800/60 transition-all duration-300 group">
                  <CardHeader className="text-center">
                    <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-200 group-hover:text-white transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400 text-center group-hover:text-gray-300 transition-colors duration-300">
                      {feature.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* PHQ-9 Assessment Section - PREMIUM THEME */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/30 rounded-full backdrop-blur-sm">
                  <BarChart3 className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-orange-200">Mental Health Assessment</span>
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-200 mb-2">
                  Check Your Mental Wellness
                </h3>
                <p className="text-gray-400">
                  Take our scientifically-backed assessment to understand your mental health status
                </p>
              </div>
              <SelfAssessmentPHQ9 />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
