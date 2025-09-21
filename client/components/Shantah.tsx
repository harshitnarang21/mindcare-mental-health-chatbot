import React, { useState, useEffect } from 'react';
import { Heart, Zap, TrendingUp, AlertTriangle, Smartphone, Wifi, ChevronRight, Star, Clock, Users, Brain, Waves, Sun, Moon, Book, Download, Eye, BookOpen } from 'lucide-react';

// [All interfaces remain the same...]
interface StressData {
  level: number;
  heartRate: number;
  timestamp: Date;
  prediction?: string;
}

interface Alert {
  id: number;
  level: 'high' | 'moderate' | 'normal';
  message: string;
  time: string;
  type: 'stress' | 'dharma' | 'tsunami' | 'timemachine';
}

interface DharmaPhase {
  name: string;
  time: string;
  energy: string;
  recommendation: string;
  color: string;
}

interface PeerStress {
  name: string;
  level: number;
  impact: 'positive' | 'negative' | 'neutral';
}

interface MentalHealthBook {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  whyRead: string;
  stressLevels: number[];
  tags: string[];
  pages: number;
  readingTime: string;
  pdfUrl: string;
  rating: number;
  category: 'ancient' | 'modern' | 'practical' | 'spiritual';
}

const Shantah: React.FC = () => {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'books'>('dashboard');
  const [selectedBook, setSelectedBook] = useState<MentalHealthBook | null>(null);
  
  // All state variables
  const [stressLevel, setStressLevel] = useState<number>(45);
  const [heartRate, setHeartRate] = useState<number>(72);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [watchBattery, setWatchBattery] = useState<number>(85);
  const [stressRecoveryTime, setStressRecoveryTime] = useState<number>(23);
  const [stressTrend, setStressTrend] = useState<'improving' | 'stable' | 'declining'>('improving');
  
  const [currentDharmaPhase, setCurrentDharmaPhase] = useState<DharmaPhase>({
    name: 'Ratri Deep Rest',
    time: '10 PM - 4 AM',
    energy: 'Recovery Mode',
    recommendation: 'Prepare for sleep meditation',
    color: 'from-purple-900 to-indigo-900'
  });
  
  const [peerStressList, setPeerStressList] = useState<PeerStress[]>([
    { name: 'Study Group', level: 45, impact: 'neutral' },
    { name: 'Roommate', level: 78, impact: 'negative' },
    { name: 'Best Friend', level: 15, impact: 'positive' }
  ]);
  const [campusStressLevel, setCampusStressLevel] = useState<number>(62);

  // Books Library
  const mentalHealthBooks: MentalHealthBook[] = [
    {
      id: 'bhagavad-gita',
      title: 'Bhagavad Gita As It Is',
      author: 'A.C. Bhaktivedanta Swami Prabhupada',
      coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
      description: 'The eternal wisdom of Lord Krishna addressing Arjuna\'s mental crisis on the battlefield - the ultimate guide to overcoming anxiety, depression, and life\'s challenges.',
      whyRead: 'Written specifically for someone in mental distress (Arjuna), this offers divine psychotherapy techniques including detachment, duty without anxiety, and finding inner peace.',
      stressLevels: [0, 30, 70, 100],
      tags: ['Ancient Wisdom', 'Spiritual', 'Philosophy', 'Anxiety Relief'],
      pages: 972,
      readingTime: '25 hours',
      pdfUrl: '/demo-pdfs/bhagavad-gita.pdf',
      rating: 4.9,
      category: 'ancient'
    },
    {
      id: 'power-of-now',
      title: 'The Power of Now',
      author: 'Eckhart Tolle',
      coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
      description: 'A transformative guide to spiritual enlightenment through present-moment awareness, perfect for students overwhelmed by past regrets and future anxieties.',
      whyRead: 'Teaches you to break free from overthinking mind patterns that cause stress. Essential for students who get caught in anxiety loops about exams, career, and relationships.',
      stressLevels: [30, 70, 100],
      tags: ['Mindfulness', 'Present Moment', 'Overthinking', 'Spiritual Growth'],
      pages: 236,
      readingTime: '6 hours',
      pdfUrl: '/demo-pdfs/power-of-now.pdf',
      rating: 4.7,
      category: 'spiritual'
    },
    {
      id: 'anxiety-phobia-workbook',
      title: 'The Anxiety and Phobia Workbook',
      author: 'Edmund J. Bourne',
      coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
      description: 'A practical, step-by-step guide to overcoming anxiety disorders, panic attacks, and phobias using proven cognitive-behavioral techniques.',
      whyRead: 'Perfect for students with test anxiety, social anxiety, or panic attacks. Includes practical exercises, relaxation techniques, and cognitive restructuring methods.',
      stressLevels: [50, 70, 100],
      tags: ['CBT', 'Anxiety', 'Panic Attacks', 'Test Anxiety', 'Practical'],
      pages: 464,
      readingTime: '12 hours',
      pdfUrl: '/demo-pdfs/anxiety-workbook.pdf',
      rating: 4.6,
      category: 'practical'
    },
    {
      id: 'feeling-good',
      title: 'Feeling Good: The New Mood Therapy',
      author: 'David D. Burns',
      coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
      description: 'The classic guide to cognitive behavioral therapy (CBT) for overcoming depression, negative thinking, and mood disorders.',
      whyRead: 'Teaches you to identify and change negative thought patterns that fuel depression and anxiety. Includes practical exercises perfect for students dealing with academic pressure.',
      stressLevels: [40, 70, 100],
      tags: ['Depression', 'CBT', 'Negative Thinking', 'Mood Improvement'],
      pages: 736,
      readingTime: '18 hours',
      pdfUrl: '/demo-pdfs/feeling-good.pdf',
      rating: 4.8,
      category: 'practical'
    }
  ];

  // Get recommended books based on stress level
  const getRecommendedBooks = (currentStress: number): MentalHealthBook[] => {
    return mentalHealthBooks
      .filter(book => 
        (currentStress >= 0 && currentStress <= 30 && book.stressLevels.includes(0)) ||
        (currentStress > 30 && currentStress <= 70 && book.stressLevels.includes(30)) ||
        (currentStress > 70 && book.stressLevels.includes(70))
      )
      .sort((a, b) => b.rating - a.rating);
  };

  // Dharma phase updates
  useEffect(() => {
    const updateDharmaPhase = () => {
      const hour = new Date().getHours();
      const dharmaPhases: DharmaPhase[] = [
        { name: 'Brahma Muhurta', time: '4-6 AM', energy: 'Divine Creation', recommendation: 'Deep meditation & manifestation', color: 'from-orange-900 to-yellow-900' },
        { name: 'Surya Peak', time: '10 AM-2 PM', energy: 'Maximum Productivity', recommendation: 'Handle challenging tasks', color: 'from-yellow-600 to-orange-600' },
        { name: 'Sandhya Transition', time: '6-8 PM', energy: 'Energy Shift', recommendation: 'Gentle breathing exercises', color: 'from-orange-700 to-red-700' },
        { name: 'Ratri Deep Rest', time: '10 PM-4 AM', energy: 'Recovery Mode', recommendation: 'Prepare for sleep meditation', color: 'from-purple-900 to-indigo-900' }
      ];
      
      let phase: DharmaPhase;
      if (hour >= 4 && hour < 6) phase = dharmaPhases[0];
      else if (hour >= 10 && hour < 14) phase = dharmaPhases[1];
      else if (hour >= 18 && hour < 20) phase = dharmaPhases[2];
      else phase = dharmaPhases[3];
      
      setCurrentDharmaPhase(phase);
    };
    
    updateDharmaPhase();
    const interval = setInterval(updateDharmaPhase, 60000);
    return () => clearInterval(interval);
  }, []);

  // Real-time data simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isConnected && !showIntro) {
      interval = setInterval(() => {
        const newStress = Math.floor(Math.random() * 100);
        const newHR = 60 + Math.floor(Math.random() * 40);
        const newBattery = Math.max(0, watchBattery - 0.1);
        
        setStressLevel(newStress);
        setHeartRate(newHR);
        setLastUpdate(new Date());
        setWatchBattery(newBattery);

        const recovery = Math.floor(Math.random() * 45) + 5;
        setStressRecoveryTime(recovery);
        
        // Generate alerts
        if (newStress > 75) {
          const timeMachineAlert: Alert = {
            id: Date.now(),
            level: 'high',
            message: `Krishna's Time Vision: Your stress will normalize in ${recovery} minutes. Breathe with faith.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'timemachine'
          };
          setAlerts(prev => [timeMachineAlert, ...prev.slice(0, 3)]);
        }

        // Update peer stress
        setPeerStressList(prev => prev.map(peer => ({
          ...peer,
          level: Math.max(0, Math.min(100, peer.level + (Math.random() - 0.5) * 20)),
          impact: peer.level > 60 ? 'negative' : peer.level < 30 ? 'positive' : 'neutral'
        })));
        
        setCampusStressLevel(Math.floor(Math.random() * 100));
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected, showIntro, watchBattery]);

  const getStressColor = (level: number): string => {
    if (level < 30) return 'text-green-400';
    if (level < 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStressBgColor = (level: number): string => {
    if (level < 30) return 'bg-green-500';
    if (level < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStressStatus = (level: number): string => {
    if (level < 30) return 'Peaceful';
    if (level < 70) return 'Moderate';
    return 'Stressed';
  };

  const getKrishnaWisdom = (level: number): string => {
    if (level < 30) return 'योगस्थः कुरु कर्माणि - Remain steadfast in yoga';
    if (level < 70) return 'समत्वं योग उच्यते - Equanimity is called yoga';
    return 'तस्माद्योगाय युज्यस्व - Therefore, engage in yoga';
  };

  const getTimeMachineMessage = (): string => {
    const messages = [
      `🔮 Your future self at ${new Date(Date.now() + stressRecoveryTime * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} will thank you for this breath`,
      `⏰ Krishna's vision: Calm arrives in ${stressRecoveryTime} minutes`,
      `🌅 Your stress graph shows improvement ahead - trust the process`,
      `💫 Time travel meditation: Remember yesterday when you felt peaceful`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const connectAppleWatch = (): void => {
    setIsConnected(true);
    setShowIntro(false);
    
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const handleKnowMore = (): void => {
    setShowIntro(false);
  };

  const disconnectWatch = (): void => {
    setIsConnected(false);
    setAlerts([]);
    setWatchBattery(85);
  };

  // Book Library Component
  const BookLibrary: React.FC = () => {
    const recommendedBooks = getRecommendedBooks(stressLevel);

    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
            📚 Shantah Book Library
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Personalized book recommendations based on your current stress level ({stressLevel}%) and Krishna's ancient wisdom
          </p>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-400">Recommended for You</h3>
              <p className="text-sm text-gray-400">Based on your stress level: {stressLevel}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedBooks.map((book) => (
              <div key={book.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-orange-500 transition-colors">
                <img 
                  src={book.coverImage} 
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold text-white mb-2 line-clamp-2">{book.title}</h4>
                <p className="text-sm text-gray-400 mb-3">by {book.author}</p>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedBook(book)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button 
                    onClick={() => window.open(book.pdfUrl, '_blank')}
                    className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-500 hover:to-yellow-500 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Book Preview Modal
  const BookPreviewModal: React.FC<{ book: MentalHealthBook; onClose: () => void }> = ({ book, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-start gap-6 mb-6">
              <img 
                src={book.coverImage} 
                alt={book.title}
                className="w-48 h-64 object-cover rounded-lg"
              />
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">{book.title}</h2>
                  <button 
                    onClick={onClose}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <p className="text-lg text-gray-400 mb-4">by {book.author}</p>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-orange-400 mb-2">📖 About This Book</h3>
                  <p className="text-gray-300 mb-4">{book.description}</p>
                  
                  <h3 className="text-lg font-semibold text-green-400 mb-2">🎯 Why You Should Read This</h3>
                  <p className="text-gray-300">{book.whyRead}</p>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => window.open(book.pdfUrl, '_blank')}
                    className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-500 hover:to-yellow-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Introduction screen (same as before)
  if (showIntro) {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,165,0,0.1),rgba(255,215,0,0.05),transparent_70%)]"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="order-2 lg:order-1 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 blur-3xl scale-150 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-gray-800 to-black rounded-[3rem] p-8 shadow-2xl border border-gray-700">
                  <div className="bg-black rounded-[2.5rem] p-6" style={{width: '320px', height: '390px'}}>
                    <div className="h-full bg-gradient-to-b from-gray-900 to-black rounded-[2rem] p-6 flex flex-col border border-gray-800">
                      <div className="text-center mb-6">
                        <div className="text-white text-3xl font-light mb-1">
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="text-6xl mb-4 animate-bounce">🕉️</div>
                        <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text mb-2">
                          Shantah
                        </div>
                        <div className="text-sm text-gray-400 text-center">
                          शांत: - The Peaceful Lord
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-900/50 to-yellow-900/50 border border-orange-500/30 rounded-full mb-6">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-orange-300 text-sm font-medium">INTRODUCING</span>
              </div>

              <h1 className="text-6xl lg:text-7xl font-bold mb-6">
                <span className="block text-transparent bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 bg-clip-text">
                  SHANTAH
                </span>
                <span className="block text-2xl lg:text-3xl text-gray-400 font-light mt-2">
                  शांत: - The Peaceful Lord
                </span>
              </h1>

              <div className="mb-8">
                <p className="text-xl lg:text-2xl text-gray-300 font-light leading-relaxed mb-4">
                  "Where Ancient Wisdom Meets Quantum Wellness"
                </p>
                <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Experience Krishna's time-machine predictions, cosmic dharma cycles, peer stress protection, and personalized healing books.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={connectAppleWatch}
                  className="group bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-500 hover:to-yellow-500 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3"
                >
                  <span>🕉️</span>
                  <span>Experience Shantah</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={handleKnowMore}
                  className="group bg-black hover:bg-gray-900 border-2 border-orange-500/50 hover:border-orange-400 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  <span>Know More</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main App with FULL Apple Watch Dashboard
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with Navigation */}
      <div className="bg-black border-b border-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
                🕉️ Shantah (शांत:)
              </h1>
              <p className="text-gray-400">Krishna's Quantum Wellness Intelligence</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex bg-gray-900 rounded-xl p-1">
                <button
                  onClick={() => setActiveSection('dashboard')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === 'dashboard' 
                      ? 'bg-gradient-to-r from-orange-600 to-yellow-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  🏠 Dashboard
                </button>
                <button
                  onClick={() => setActiveSection('books')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === 'books' 
                      ? 'bg-gradient-to-r from-orange-600 to-yellow-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  📚 Books
                </button>
              </div>
              
              {/* Dharma Phase Indicator */}
              <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${currentDharmaPhase.color} border border-gray-700`}>
                <div className="text-center">
                  <div className="text-sm font-semibold text-white">{currentDharmaPhase.name}</div>
                  <div className="text-xs text-gray-300">{currentDharmaPhase.energy}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {activeSection === 'books' ? (
          <BookLibrary />
        ) : !isConnected ? (
          /* Connection Screen */
          <div className="text-center py-16">
            <div className="mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-900 border border-gray-800 rounded-full mb-6">
                <Smartphone className="w-12 h-12 text-orange-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Connect Your Apple Watch</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Experience Krishna's time-machine predictions, dharma sync, and personalized book recommendations
              </p>
            </div>

            <button 
              onClick={connectAppleWatch}
              className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-500 hover:to-yellow-500 px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl font-semibold text-lg"
            >
              <div className="flex items-center space-x-3">
                <span className="text-3xl">⌚</span>
                <div>
                  <div>Connect Apple Watch</div>
                  <div className="text-sm text-orange-200">Unlock All Features + Book Library</div>
                </div>
              </div>
            </button>
          </div>
        ) : (
          /* FULL APPLE WATCH DASHBOARD */
          <div className="space-y-6">
            
            {/* TOP ROW: Time Machine + Dharma Sync + Tsunami Warning */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* 🔮 KRISHNA'S TIME MACHINE */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🔮</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-300">Time Machine</h3>
                    <p className="text-xs text-gray-400">Krishna's Vision</p>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-purple-400 mb-1">{stressRecoveryTime}min</div>
                  <div className="text-sm text-gray-400">Until Peace Returns</div>
                </div>
                
                <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-3 mb-3">
                  <p className="text-purple-300 text-sm italic">"{getTimeMachineMessage()}"</p>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>Next prediction in 4 min</span>
                </div>
              </div>

              {/* ⏰ DHARMA SYNC */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-lg flex items-center justify-center">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-orange-300">Dharma Sync</h3>
                    <p className="text-xs text-gray-400">Cosmic Rhythm</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-lg font-semibold text-orange-400 mb-1">{currentDharmaPhase.name}</div>
                  <div className="text-sm text-gray-400 mb-2">{currentDharmaPhase.time}</div>
                  <div className="text-xs text-orange-300">{currentDharmaPhase.recommendation}</div>
                </div>
                
                <div className="bg-orange-900/20 border border-orange-800 rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentDharmaPhase.color} animate-pulse`}></div>
                    <span className="text-xs text-orange-300">{currentDharmaPhase.energy}</span>
                  </div>
                </div>
              </div>

              {/* 🌊 EMOTIONAL TSUNAMI WARNING */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                    <Waves className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-300">Tsunami Alert</h3>
                    <p className="text-xs text-gray-400">Peer Protection</p>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <div className={`text-2xl font-bold mb-1 ${campusStressLevel > 70 ? 'text-red-400' : campusStressLevel > 40 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {campusStressLevel}%
                  </div>
                  <div className="text-sm text-gray-400">Campus Stress Level</div>
                </div>
                
                <div className="space-y-2">
                  {peerStressList.map((peer, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{peer.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`${peer.impact === 'negative' ? 'text-red-400' : peer.impact === 'positive' ? 'text-green-400' : 'text-yellow-400'}`}>
                          {peer.level.toFixed(0)}%
                        </span>
                        <div className={`w-2 h-2 rounded-full ${peer.impact === 'negative' ? 'bg-red-400' : peer.impact === 'positive' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* MAIN DASHBOARD ROW */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* 🍎 APPLE WATCH DISPLAY */}
              <div className="xl:col-span-1">
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sticky top-6">
                  <h3 className="text-lg font-semibold mb-4 text-center flex items-center justify-center space-x-2">
                    <span>⌚</span>
                    <span>Apple Watch Series 9</span>
                  </h3>
                  
                  {/* Watch Face Mockup */}
                  <div className="bg-black rounded-3xl p-6 mx-auto border border-gray-800" style={{width: '280px', height: '340px'}}>
                    <div className="h-full bg-gradient-to-b from-gray-900 to-black rounded-2xl p-4 flex flex-col">
                      
                      {/* Watch Crown */}
                      <div className="absolute -right-2 top-20 w-3 h-8 bg-gray-700 rounded-r-lg"></div>
                      <div className="absolute -right-2 top-32 w-3 h-12 bg-gray-600 rounded-r-lg"></div>
                      
                      {/* Time */}
                      <div className="text-center mb-4">
                        <div className="text-white text-2xl font-light">
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                      </div>

                      {/* Stress Ring */}
                      <div className="flex-1 flex items-center justify-center">
                        <div className="relative">
                          <svg width="120" height="120" className="transform -rotate-90">
                            <circle
                              cx="60"
                              cy="60"
                              r="45"
                              stroke="#1f2937"
                              strokeWidth="8"
                              fill="none"
                            />
                            <circle
                              cx="60"
                              cy="60"
                              r="45"
                              stroke={stressLevel < 30 ? '#22c55e' : stressLevel < 70 ? '#eab308' : '#ef4444'}
                              strokeWidth="8"
                              fill="none"
                              strokeDasharray={`${stressLevel * 2.83} 283`}
                              strokeLinecap="round"
                              className="transition-all duration-1000"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                            <span className="text-lg font-bold">{stressLevel}%</span>
                            <span className="text-xs text-gray-400">{getStressStatus(stressLevel)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Watch Stats */}
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="text-center">
                          <div className="text-red-400 font-semibold">{heartRate}</div>
                          <div className="text-gray-500">BPM</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-400 font-semibold">{watchBattery.toFixed(0)}%</div>
                          <div className="text-gray-500">Battery</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Connection Status */}
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-green-400 mb-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm">All Systems Active</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      Last update: {lastUpdate.toLocaleTimeString()}
                    </div>
                    <button 
                      onClick={disconnectWatch}
                      className="mt-2 text-xs text-red-400 hover:text-red-300"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Dashboard */}
              <div className="xl:col-span-2 space-y-6">
                
                {/* Current Status with Krishna Wisdom */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Stress Monitor</h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      stressLevel < 30 ? 'bg-green-900 text-green-300' :
                      stressLevel < 70 ? 'bg-yellow-900 text-yellow-300' :
                      'bg-red-900 text-red-300'
                    }`}>
                      {getStressStatus(stressLevel)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-center mb-4">
                        <div className={`text-6xl font-bold mb-2 ${getStressColor(stressLevel)}`}>
                          {stressLevel}%
                        </div>
                        <div className="text-gray-400">Current Stress Level</div>
                      </div>
                      
                      <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
                        <div 
                          className={`h-3 rounded-full transition-all duration-1000 ${getStressBgColor(stressLevel)}`}
                          style={{width: `${stressLevel}%`}}
                        ></div>
                      </div>

                      <div className="bg-orange-900/20 border border-orange-800 rounded-lg p-4">
                        <div className="text-orange-300 text-sm font-medium mb-1">Krishna's Guidance:</div>
                        <div className="text-orange-100 text-sm italic">
                          "{getKrishnaWisdom(stressLevel)}"
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4 text-center">
                        <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold">{heartRate}</div>
                        <div className="text-sm text-gray-400">Heart Rate</div>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4 text-center">
                        <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold">
                          {stressTrend === 'improving' ? '↗️' : stressTrend === 'stable' ? '➡️' : '↘️'}
                        </div>
                        <div className="text-sm text-gray-400">Trend</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Alerts */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
                    Intelligent Alerts
                  </h3>
                  
                  {alerts.length > 0 ? (
                    <div className="space-y-3">
                      {alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            alert.type === 'timemachine' ? 'bg-purple-900/20 border-purple-800' :
                            alert.type === 'dharma' ? 'bg-orange-900/20 border-orange-800' :
                            alert.type === 'tsunami' ? 'bg-blue-900/20 border-blue-800' :
                            'bg-red-900/20 border-red-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-lg">
                              {alert.type === 'timemachine' ? '🔮' :
                               alert.type === 'dharma' ? '⏰' :
                               alert.type === 'tsunami' ? '🌊' : '⚠️'}
                            </div>
                            <span className={`text-sm ${
                              alert.type === 'timemachine' ? 'text-purple-300' :
                              alert.type === 'dharma' ? 'text-orange-300' :
                              alert.type === 'tsunami' ? 'text-blue-300' :
                              'text-red-300'
                            }`}>
                              {alert.message}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">{alert.time}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-8">
                      <div className="text-4xl mb-2">🕉️</div>
                      <div>All systems peaceful. Krishna watches over you.</div>
                    </div>
                  )}
                </div>

                {/* Enhanced Wellness Actions */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-green-400">
                    🧘‍♂️ Instant Wellness
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { icon: '🔮', text: 'Time Machine Meditation', time: '3 min', desc: 'Connect with future calm self' },
                      { icon: '⏰', text: 'Dharma Breathing', time: '5 min', desc: 'Sync with cosmic rhythm' },
                      { icon: '🌊', text: 'Tsunami Shield', time: '2 min', desc: 'Protect from peer stress' },
                      { icon: '🕉️', text: 'Krishna Mantra', time: '3 min', desc: 'Sacred sound healing' },
                    ].map((action, index) => (
                      <button
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-left"
                      >
                        <span className="text-2xl">{action.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{action.text}</div>
                          <div className="text-xs text-gray-400">{action.desc}</div>
                        </div>
                        <div className="text-xs text-gray-400">{action.time}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Books Access */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Book className="w-6 h-6 text-orange-400" />
                      <h3 className="text-lg font-semibold">Recommended Reading</h3>
                    </div>
                    <button 
                      onClick={() => setActiveSection('books')}
                      className="text-orange-400 hover:text-orange-300 text-sm flex items-center gap-1"
                    >
                      View All <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {getRecommendedBooks(stressLevel).slice(0, 4).map((book) => (
                      <div key={book.id} className="bg-gray-800 rounded-lg p-3">
                        <img src={book.coverImage} alt={book.title} className="w-full h-24 object-cover rounded mb-2" />
                        <h4 className="font-medium text-sm text-white mb-1 line-clamp-1">{book.title}</h4>
                        <p className="text-xs text-gray-400 mb-2">{book.author}</p>
                        <button 
                          onClick={() => setSelectedBook(book)}
                          className="w-full bg-orange-600 hover:bg-orange-500 text-white text-xs py-1 rounded"
                        >
                          Preview
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Book Preview Modal */}
      {selectedBook && (
        <BookPreviewModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
};

export default Shantah;
