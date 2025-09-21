import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  Plus, 
  Crown,
  Sparkles,
  Zap,
  BookOpen,
  TrendingUp,
  Clock,
  Trophy,
  Send,
  Shield,
  AlertTriangle
} from "lucide-react";

// For Vite, use import.meta.env instead of process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Simple mock data for development if Supabase is not configured
const mockPosts = [
  {
    id: '1',
    content: 'Just completed my first week using Krishna\'s Time Machine feature! The stress prediction helped me prepare better for my exams. Thanks MindCare team! 🙏',
    author: 'Arjun Sharma',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: '2',
    content: 'Anyone else feeling overwhelmed with semester exams? Looking for study buddies and stress management tips. The Karma Arena challenges are helping but could use more support.',
    author: 'Priya Mehta',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
  },
  {
    id: '3',
    content: 'Weekly reminder: You are not alone in this journey. Reached out to the AI chatbot today and it really helped me process my thoughts. Mental health matters! ❤️',
    author: 'Rajesh Kumar',
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
  }
];

interface Post {
  id: string;
  content: string;
  author: string;
  created_at: string;
}

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const categories = [
    { id: 'all', name: 'All Posts', icon: Users, color: 'from-gray-400 to-gray-600' },
    { id: 'support', name: 'Support', icon: Heart, color: 'from-red-400 to-pink-500' },
    { id: 'study', name: 'Study Tips', icon: BookOpen, color: 'from-blue-400 to-purple-500' },
    { id: 'wellness', name: 'Wellness', icon: Zap, color: 'from-green-400 to-teal-500' },
    { id: 'success', name: 'Success Stories', icon: Trophy, color: 'from-yellow-400 to-orange-500' },
  ];

  useEffect(() => {
    // Use mock data for now, you can integrate Supabase later
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  function createPost() {
    if (!newPost.trim()) return;
    
    setPosting(true);
    
    // Simulate post creation
    setTimeout(() => {
      const newPostObj: Post = {
        id: Date.now().toString(),
        content: newPost,
        author: 'Anonymous Student',
        created_at: new Date().toISOString()
      };
      
      setPosts(prev => [newPostObj, ...prev]);
      toast.success('Post shared successfully!');
      setNewPost('');
      setPosting(false);
    }, 500);
  }

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-yellow-500/5 to-orange-500/5"></div>
      <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-orange-400/10 to-yellow-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Premium Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/30 rounded-full backdrop-blur-sm">
            <Shield className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-orange-200">Safe Campus Community</span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              Student
            </span>
            <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
              {' '}Community
            </span>
          </h1>
          
          <p className="text-lg text-gray-300 mb-2">
            Peer space for students. Posts are public to your campus.
          </p>
          <p className="text-sm text-orange-300 flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Avoid sharing identifying details for your privacy
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              onClick={() => setActiveTab(category.id)}
              className={`px-4 py-2 rounded-full backdrop-blur-sm border transition-all duration-200 ${
                activeTab === category.id
                  ? `bg-gradient-to-r ${category.color} text-white border-transparent shadow-lg`
                  : 'bg-gray-800/30 text-gray-300 border-gray-700/50 hover:bg-gray-800/50'
              }`}
            >
              <category.icon className="w-4 h-4 mr-2" />
              {category.name}
            </Button>
          ))}
        </div>

        {/* Create Post Section */}
        <Card className="mb-8 bg-gray-800/50 backdrop-blur-sm border-gray-700/50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-200">
              <Plus className="w-5 h-5 text-orange-400" />
              Share Something Supportive
            </CardTitle>
            <CardDescription className="text-gray-400">
              Your voice matters. Share your thoughts, experiences, or encouragement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What's on your mind? Share your thoughts, ask for support, or encourage others..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="bg-gray-900/50 border-gray-600/50 text-gray-200 placeholder-gray-500 min-h-[120px] resize-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50"
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {newPost.length}/500 characters
              </span>
              <Button
                onClick={createPost}
                disabled={!newPost.trim() || posting}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white border-0 shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                {posting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sharing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Share Post
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading community posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <Card className="bg-gray-800/30 backdrop-blur-sm border-gray-700/50 text-center py-12">
              <CardContent>
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">No posts yet</h3>
                <p className="text-gray-500">Be the first to share something supportive with your community!</p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-800/60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center justify-center shadow-lg">
                        <span className="text-sm font-bold text-gray-900">
                          {post.author.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-200">{post.author}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(post.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-700/50">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                      <Heart className="w-4 h-4 mr-1" />
                      Support
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 transition-colors">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Reply
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-400 hover:bg-green-400/10 transition-colors">
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Community Guidelines - FIXED VISIBILITY */}
        <Card className="mt-12 bg-gray-800/60 border-orange-400/50 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="w-5 h-5 text-orange-400" />
              Community Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-200 space-y-3">
            <p className="flex items-start gap-2">
              <span className="text-orange-400 font-bold">•</span>
              <span>Be kind and supportive to fellow students</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-orange-400 font-bold">•</span>
              <span>Respect privacy - avoid sharing personal identifying information</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-orange-400 font-bold">•</span>
              <span>Focus on mental wellness and academic support</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-orange-400 font-bold">•</span>
              <span>Report any inappropriate content to moderators</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
