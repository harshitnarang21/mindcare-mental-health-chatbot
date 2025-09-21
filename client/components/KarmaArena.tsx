import React, { useState, useEffect } from 'react';
import { Trophy, Gift, Star, Zap, Target, Users, ShoppingCart, Coins, Award, Crown, Flame, Play, CheckCircle, Timer } from 'lucide-react';

interface User {
  id: string;
  name: string;
  college: string;
  karmaPoints: number;
  level: number;
  achievements: Achievement[];
  streak: number;
  rank: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  date?: Date;
}

interface VoucherItem {
  id: string;
  brand: string;
  title: string;
  description: string;
  image: string;
  originalPrice: number;
  karmaPrice: number;
  discount: number;
  category: 'shopping' | 'food' | 'entertainment' | 'education' | 'travel';
  availability: number;
  popular: boolean;
  studentExclusive: boolean;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  type: 'daily' | 'weekly' | 'special';
  progress: number;
  target: number;
  completed: boolean;
  timeLeft?: string;
  action: string;
}

const KarmaArena: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'arena' | 'shop' | 'leaderboard'>('arena');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherItem | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [challengeTimer, setChallengeTimer] = useState<number>(0);

  // Mock user data
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'user1',
    name: 'Arjuna Kumar',
    college: 'IIT Delhi',
    karmaPoints: 2450,
    level: 8,
    achievements: [],
    streak: 15,
    rank: 23
  });

  // Daily challenges with playable actions
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 'meditation-5min',
      title: 'Mindful Morning',
      description: 'Complete 5 minutes of meditation',
      icon: '🧘‍♀️',
      points: 50,
      type: 'daily',
      progress: 0,
      target: 1,
      completed: false,
      timeLeft: '18h 45m',
      action: 'Start 5-min guided meditation'
    },
    {
      id: 'stress-check-3',
      title: 'Stress Monitor',
      description: 'Check Shantah 3 times today',
      icon: '🕉️',
      points: 30,
      type: 'daily',
      progress: 0,
      target: 3,
      completed: false,
      timeLeft: '18h 45m',
      action: 'Monitor your stress levels'
    },
    {
      id: 'book-read-15min',
      title: 'Knowledge Seeker',
      description: 'Read for 15 minutes',
      icon: '📚',
      points: 40,
      type: 'daily',
      progress: 0,
      target: 1,
      completed: false,
      timeLeft: '18h 45m',
      action: 'Start reading session'
    },
    {
      id: 'gratitude-journal',
      title: 'Gratitude Practice',
      description: 'Write 3 things you\'re grateful for',
      icon: '🙏',
      points: 35,
      type: 'daily',
      progress: 0,
      target: 1,
      completed: false,
      timeLeft: '18h 45m',
      action: 'Open gratitude journal'
    }
  ]);

  // Voucher marketplace data
  const voucherItems: VoucherItem[] = [
    {
      id: 'amazon-500',
      brand: 'Amazon',
      title: 'Amazon Gift Card',
      description: 'Shop for anything on Amazon.in',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop',
      originalPrice: 500,
      karmaPrice: 2500,
      discount: 0,
      category: 'shopping',
      availability: 50,
      popular: true,
      studentExclusive: false
    },
    {
      id: 'swiggy-200',
      brand: 'Swiggy',
      title: 'Food Delivery Voucher',
      description: 'Order your favorite meals',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      originalPrice: 200,
      karmaPrice: 800,
      discount: 20,
      category: 'food',
      availability: 100,
      popular: true,
      studentExclusive: true
    },
    {
      id: 'spotify-99',
      brand: 'Spotify',
      title: 'Spotify Premium (1 Month)',
      description: 'Ad-free music streaming',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
      originalPrice: 99,
      karmaPrice: 400,
      discount: 0,
      category: 'entertainment',
      availability: 200,
      popular: true,
      studentExclusive: true
    },
    {
      id: 'flipkart-300',
      brand: 'Flipkart',
      title: 'Flipkart Voucher',
      description: 'Electronics, Fashion, Home & Kitchen',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop',
      originalPrice: 300,
      karmaPrice: 1500,
      discount: 0,
      category: 'shopping',
      availability: 75,
      popular: true,
      studentExclusive: false
    }
  ];

  // Timer for active challenges
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeChallenge && challengeTimer > 0) {
      interval = setInterval(() => {
        setChallengeTimer(prev => {
          if (prev <= 1) {
            completeChallenge(activeChallenge);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeChallenge, challengeTimer]);

  // Start a challenge
  const startChallenge = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge || challenge.completed) return;

    setActiveChallenge(challengeId);
    
    // Set timer based on challenge type
    const timers = {
      'meditation-5min': 300, // 5 minutes
      'book-read-15min': 900, // 15 minutes
      'stress-check-3': 10,   // 10 seconds for demo
      'gratitude-journal': 60  // 1 minute for demo
    };
    
    setChallengeTimer(timers[challengeId as keyof typeof timers] || 60);
    
    // Show encouragement message
    const messages = {
      'meditation-5min': '🧘‍♀️ Starting meditation... Find a quiet place and breathe deeply.',
      'book-read-15min': '📚 Time to read! Open your favorite book or article.',
      'stress-check-3': '🕉️ Checking stress levels... This helps track your wellness!',
      'gratitude-journal': '🙏 Think of 3 things you\'re grateful for today.'
    };
    
    alert(messages[challengeId as keyof typeof messages] || 'Challenge started!');
  };

  // Complete a challenge
  const completeChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => {
      if (challenge.id === challengeId) {
        const newProgress = Math.min(challenge.progress + 1, challenge.target);
        const isCompleted = newProgress >= challenge.target;
        
        if (isCompleted && !challenge.completed) {
          // Award points
          setCurrentUser(prevUser => ({
            ...prevUser,
            karmaPoints: prevUser.karmaPoints + challenge.points
          }));
          
          // Show success message
          setTimeout(() => {
            alert(`🎉 Challenge Complete!\n\n+${challenge.points} Karma Points earned!\n\nTotal Points: ${currentUser.karmaPoints + challenge.points}`);
          }, 100);
        }
        
        return {
          ...challenge,
          progress: newProgress,
          completed: isCompleted
        };
      }
      return challenge;
    }));
    
    setActiveChallenge(null);
    setChallengeTimer(0);
  };

  // Quick complete challenge (for demo)
  const quickCompleteChallenge = (challengeId: string) => {
    if (activeChallenge) return; // Don't allow if another challenge is active
    
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge || challenge.completed) return;

    // Instant completion for demo
    setChallenges(prev => prev.map(c => {
      if (c.id === challengeId) {
        setCurrentUser(prevUser => ({
          ...prevUser,
          karmaPoints: prevUser.karmaPoints + c.points
        }));
        
        // Show success message
        setTimeout(() => {
          alert(`🎉 Challenge Complete!\n\n${c.title} finished!\n+${c.points} Karma Points earned!\n\nTotal Points: ${currentUser.karmaPoints + c.points}`);
        }, 100);
        
        return { ...c, progress: c.target, completed: true };
      }
      return c;
    }));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const categories = [
    { id: 'all', name: 'All Vouchers', icon: '🛍️' },
    { id: 'shopping', name: 'Shopping', icon: '🛒' },
    { id: 'food', name: 'Food & Dining', icon: '🍽️' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  ];

  const getFilteredVouchers = () => {
    if (selectedCategory === 'all') return voucherItems;
    return voucherItems.filter(item => item.category === selectedCategory);
  };

  const handlePurchaseVoucher = (voucher: VoucherItem) => {
    if (currentUser.karmaPoints >= voucher.karmaPrice) {
      setCurrentUser(prev => ({
        ...prev,
        karmaPoints: prev.karmaPoints - voucher.karmaPrice
      }));
      alert(`🎉 Congratulations! You've redeemed ${voucher.title}!\n\n📧 Voucher code: DEMO${Math.random().toString(36).substr(2, 9).toUpperCase()}\n💝 Thank you for taking care of your mental health!`);
      setSelectedVoucher(null);
    } else {
      alert(`❌ Insufficient Karma Points!\n\nYou need ${voucher.karmaPrice - currentUser.karmaPoints} more points.\n\n💡 Complete challenges to earn points!`);
    }
  };

  // Arena Tab with Interactive Challenges
  const ArenaTab = () => (
    <div className="space-y-6">
      {/* User Stats Dashboard */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">{currentUser.karmaPoints}</div>
            <div className="text-purple-200">Karma Points</div>
            <Coins className="w-6 h-6 text-yellow-400 mx-auto mt-2" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">Level {currentUser.level}</div>
            <div className="text-purple-200">Wellness Level</div>
            <Star className="w-6 h-6 text-blue-400 mx-auto mt-2" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400">{currentUser.streak}</div>
            <div className="text-purple-200">Day Streak</div>
            <Flame className="w-6 h-6 text-orange-400 mx-auto mt-2" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">#{currentUser.rank}</div>
            <div className="text-purple-200">Campus Rank</div>
            <Trophy className="w-6 h-6 text-green-400 mx-auto mt-2" />
          </div>
        </div>
      </div>

      {/* Active Challenge Timer */}
      {activeChallenge && challengeTimer > 0 && (
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">🎯 Challenge In Progress</div>
            <div className="text-4xl font-mono font-bold mb-2">{formatTime(challengeTimer)}</div>
            <div className="text-green-100">
              {challenges.find(c => c.id === activeChallenge)?.title} - Keep going! 💪
            </div>
          </div>
        </div>
      )}

      {/* Daily Challenges - FULLY INTERACTIVE */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Target className="w-6 h-6 text-green-400" />
            Daily Challenges
          </h3>
          <div className="text-sm bg-green-600 text-white px-3 py-1 rounded-full">
            Earn up to {challenges.reduce((total, c) => total + (c.completed ? 0 : c.points), 0)} points today!
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className={`border rounded-lg p-4 transition-all ${
              challenge.completed 
                ? 'bg-green-900/20 border-green-600' 
                : activeChallenge === challenge.id 
                ? 'bg-blue-900/20 border-blue-600 animate-pulse'
                : 'bg-gray-800 border-gray-700'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{challenge.icon}</span>
                  <div>
                    <h4 className="font-semibold text-white">{challenge.title}</h4>
                    <p className="text-sm text-gray-400">{challenge.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${challenge.completed ? 'text-green-400' : 'text-yellow-400'}`}>
                    {challenge.completed ? '✅' : `+${challenge.points}`}
                  </div>
                  <div className="text-xs text-gray-400">{challenge.timeLeft}</div>
                </div>
              </div>
              
              {challenge.progress > 0 && !challenge.completed && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{challenge.progress}/{challenge.target}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{width: `${(challenge.progress / challenge.target) * 100}%`}}
                    />
                  </div>
                </div>
              )}
              
              {/* Interactive Challenge Buttons */}
              <div className="flex gap-2">
                {challenge.completed ? (
                  <div className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium text-center">
                    ✅ Completed
                  </div>
                ) : activeChallenge === challenge.id ? (
                  <div className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium text-center flex items-center justify-center gap-2">
                    <Timer className="w-4 h-4 animate-spin" />
                    In Progress... {formatTime(challengeTimer)}
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => startChallenge(challenge.id)}
                      disabled={!!activeChallenge}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                        activeChallenge 
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <Play className="w-4 h-4" />
                      Start
                    </button>
                    <button
                      onClick={() => quickCompleteChallenge(challenge.id)}
                      disabled={!!activeChallenge}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                        activeChallenge 
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      Quick Complete
                    </button>
                  </>
                )}
              </div>
              
              <div className="text-xs text-gray-500 mt-2">
                {challenge.completed ? 'Points earned!' : challenge.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Points Earning Guide */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-orange-400">💡 How to Earn More Points</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span>🧘‍♀️</span>
              <span>Daily meditation: 50 points</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📚</span>
              <span>Reading sessions: 40 points</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span>🕉️</span>
              <span>Stress monitoring: 30 points</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🙏</span>
              <span>Gratitude practice: 35 points</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Shop Tab (same as before but with better interaction)
  const ShopTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-900 to-blue-900 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">🛍️ Karma Store</h2>
            <p className="text-green-200">Exchange your wellness achievements for real rewards!</p>
          </div>
          <div className="text-center bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">{currentUser.karmaPoints}</div>
            <div className="text-green-200 text-sm">Available Points</div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Vouchers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredVouchers().map((voucher) => (
          <div key={voucher.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500 transition-colors">
            <div className="relative">
              <img 
                src={voucher.image} 
                alt={voucher.title}
                className="w-full h-48 object-cover"
              />
              {voucher.popular && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  🔥 Popular
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h4 className="font-semibold text-white text-lg mb-2">{voucher.title}</h4>
              <p className="text-gray-400 text-sm mb-3">{voucher.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">{voucher.karmaPrice}</span>
                  <span className="text-gray-400">points</span>
                </div>
                <div className="text-xs text-green-400">Worth ₹{voucher.originalPrice}</div>
              </div>
              
              <button
                onClick={() => setSelectedVoucher(voucher)}
                disabled={currentUser.karmaPoints < voucher.karmaPrice}
                className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                  currentUser.karmaPoints >= voucher.karmaPrice
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {currentUser.karmaPoints >= voucher.karmaPrice ? 'Redeem Now' : 'Insufficient Points'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Leaderboard Tab (simplified for space)
  const LeaderboardTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">🏆 Campus Leaderboard</h2>
        <p className="text-purple-200">You're ranked #{currentUser.rank} with {currentUser.karmaPoints} points!</p>
      </div>
      
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
        <div className="text-4xl mb-4">🏆</div>
        <div className="text-xl font-bold text-yellow-400 mb-2">You're in the Top 25!</div>
        <div className="text-gray-400">Complete more challenges to climb higher</div>
      </div>
    </div>
  );

  // Voucher Purchase Modal
  const VoucherModal = () => {
    if (!selectedVoucher) return null;

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full">
          <div className="p-6">
            <div className="text-center mb-6">
              <img 
                src={selectedVoucher.image} 
                alt={selectedVoucher.title}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold text-white mb-2">{selectedVoucher.title}</h3>
              <p className="text-gray-400">{selectedVoucher.description}</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Cost:</span>
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">{selectedVoucher.karmaPrice}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Your Balance:</span>
                <span className={`font-bold ${
                  currentUser.karmaPoints >= selectedVoucher.karmaPrice ? 'text-green-400' : 'text-red-400'
                }`}>
                  {currentUser.karmaPoints}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedVoucher(null)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePurchaseVoucher(selectedVoucher)}
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-lg font-semibold"
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black border-b border-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                🎮 MindCare Karma Arena
              </h1>
              <p className="text-gray-400">Turn wellness into rewards - Your mental health pays off!</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{currentUser.karmaPoints}</div>
                <div className="text-xs text-gray-400">Karma Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">Level {currentUser.level}</div>
                <div className="text-xs text-gray-400">Wellness Level</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="flex mb-6 bg-gray-900 rounded-xl p-2">
          <button
            onClick={() => setActiveTab('arena')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-colors ${
              activeTab === 'arena'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Trophy className="w-5 h-5" />
            Play & Earn
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-colors ${
              activeTab === 'shop'
                ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            Spend Points
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-colors ${
              activeTab === 'leaderboard'
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            Rankings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'arena' && <ArenaTab />}
        {activeTab === 'shop' && <ShopTab />}
        {activeTab === 'leaderboard' && <LeaderboardTab />}
      </div>

      {/* Voucher Purchase Modal */}
      <VoucherModal />
    </div>
  );
};

export default KarmaArena;
