import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, SkipForward, SkipBack, Heart, Shuffle, Repeat, Volume2 } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  genre: string;
  stressLevel: 'low' | 'moderate' | 'high' | 'severe';
  albumArt: string;
  audioUrl?: string;
  description: string;
  benefits: string[];
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  songs: Song[];
  coverImage: string;
  stressLevel: 'low' | 'moderate' | 'high' | 'severe';
}

const ShantahMusic: React.FC = () => {
  const { profile, getExtendedProfile } = useAuth();
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [userStressLevel, setUserStressLevel] = useState<'low' | 'moderate' | 'high' | 'severe'>('moderate');
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('recommended');

  // ✨ Curated music database based on stress levels
  const musicDatabase: Playlist[] = useMemo(() => [
    {
      id: 'low-stress',
      name: 'Peaceful Harmony',
      description: 'Gentle melodies for maintaining inner peace',
      stressLevel: 'low',
      coverImage: '/api/placeholder/300/300',
      songs: [
        {
          id: 's1',
          title: 'Krishna\'s Flute Meditation',
          artist: 'Shantah Collective',
          duration: '8:32',
          genre: 'Spiritual',
          stressLevel: 'low',
          albumArt: '/api/placeholder/60/60',
          description: 'Sacred flute melodies inspired by Krishna\'s divine music',
          benefits: ['Enhanced focus', 'Spiritual connection', 'Inner peace']
        },
        {
          id: 's2',
          title: 'Ganges Morning Ragas',
          artist: 'Ancient Wisdom',
          duration: '12:15',
          genre: 'Classical Indian',
          stressLevel: 'low',
          albumArt: '/api/placeholder/60/60',
          description: 'Traditional ragas played at sunrise by the holy river',
          benefits: ['Mental clarity', 'Emotional balance', 'Mindfulness']
        },
        {
          id: 's3',
          title: 'Vedic Chanting Harmony',
          artist: 'Temple Voices',
          duration: '15:47',
          genre: 'Devotional',
          stressLevel: 'low',
          albumArt: '/api/placeholder/60/60',
          description: 'Sacred Sanskrit mantras for deep meditation',
          benefits: ['Stress relief', 'Concentration', 'Spiritual growth']
        }
      ]
    },
    {
      id: 'moderate-stress',
      name: 'Calming Winds',
      description: 'Soothing sounds to reduce moderate stress',
      stressLevel: 'moderate',
      coverImage: '/api/placeholder/300/300',
      songs: [
        {
          id: 's4',
          title: 'Himalayan Singing Bowls',
          artist: 'Mindful Healing',
          duration: '10:23',
          genre: 'Healing',
          stressLevel: 'moderate',
          albumArt: '/api/placeholder/60/60',
          description: 'Tibetan singing bowls with nature sounds',
          benefits: ['Anxiety reduction', 'Mental calmness', 'Energy healing']
        },
        {
          id: 's5',
          title: 'Monsoon Rain & Sitar',
          artist: 'Nature\'s Symphony',
          duration: '18:30',
          genre: 'Ambient',
          stressLevel: 'moderate',
          albumArt: '/api/placeholder/60/60',
          description: 'Gentle rain sounds with melodic sitar',
          benefits: ['Stress relief', 'Better sleep', 'Emotional healing']
        },
        {
          id: 's6',
          title: 'Breathwork Guidance',
          artist: 'Wellness Guru',
          duration: '6:45',
          genre: 'Guided',
          stressLevel: 'moderate',
          albumArt: '/api/placeholder/60/60',
          description: 'Guided breathing with soft instrumental background',
          benefits: ['Anxiety control', 'Improved focus', 'Stress management']
        }
      ]
    },
    {
      id: 'high-stress',
      name: 'Deep Healing',
      description: 'Intensive healing music for high stress relief',
      stressLevel: 'high',
      coverImage: '/api/placeholder/300/300',
      songs: [
        {
          id: 's7',
          title: '528Hz Healing Frequency',
          artist: 'Frequency Healers',
          duration: '30:00',
          genre: 'Binaural',
          stressLevel: 'high',
          albumArt: '/api/placeholder/60/60',
          description: 'Love frequency for DNA repair and stress relief',
          benefits: ['Deep healing', 'Cellular repair', 'Emotional release']
        },
        {
          id: 's8',
          title: 'Ocean Depths Meditation',
          artist: 'Aquatic Serenity',
          duration: '25:18',
          genre: 'Nature',
          stressLevel: 'high',
          albumArt: '/api/placeholder/60/60',
          description: 'Deep ocean sounds for profound relaxation',
          benefits: ['Deep relaxation', 'Panic relief', 'Mental reset']
        },
        {
          id: 's9',
          title: 'Chakra Balancing Journey',
          artist: 'Energy Masters',
          duration: '45:12',
          genre: 'Healing',
          stressLevel: 'high',
          albumArt: '/api/placeholder/60/60',
          description: 'Complete chakra alignment with sound therapy',
          benefits: ['Energy balance', 'Trauma healing', 'Inner strength']
        }
      ]
    },
    {
      id: 'severe-stress',
      name: 'Emergency Calm',
      description: 'Immediate stress relief for crisis moments',
      stressLevel: 'severe',
      coverImage: '/api/placeholder/300/300',
      songs: [
        {
          id: 's10',
          title: 'Panic Relief Protocol',
          artist: 'Crisis Support',
          duration: '3:33',
          genre: 'Therapeutic',
          stressLevel: 'severe',
          albumArt: '/api/placeholder/60/60',
          description: 'Quick breathing technique with calming tones',
          benefits: ['Panic control', 'Immediate calm', 'Grounding']
        },
        {
          id: 's11',
          title: 'Emergency Grounding',
          artist: 'Mindful Response',
          duration: '5:00',
          genre: 'Guided',
          stressLevel: 'severe',
          albumArt: '/api/placeholder/60/60',
          description: '5-4-3-2-1 grounding technique with music',
          benefits: ['Anxiety attack relief', 'Present moment awareness', 'Stabilization']
        },
        {
          id: 's12',
          title: 'Safe Space Visualization',
          artist: 'Trauma Informed',
          duration: '12:00',
          genre: 'Therapeutic',
          stressLevel: 'severe',
          albumArt: '/api/placeholder/60/60',
          description: 'Guided safe space meditation with protective energy',
          benefits: ['Safety feeling', 'Trauma relief', 'Nervous system regulation']
        }
      ]
    }
  ], []);

  // ✨ Get user's stress level from profile
  useEffect(() => {
    const extendedProfile = getExtendedProfile();
    if (extendedProfile?.stressLevel) {
      setUserStressLevel(extendedProfile.stressLevel);
    }
  }, [getExtendedProfile]);

  // ✨ Get recommended playlist based on stress level
  const recommendedPlaylist = useMemo(() => {
    return musicDatabase.find(playlist => playlist.stressLevel === userStressLevel) || musicDatabase[1];
  }, [userStressLevel, musicDatabase]);

  // ✨ Play/Pause functionality
  const togglePlayPause = (song?: Song) => {
    if (song && song.id !== currentSong?.id) {
      setCurrentSong(song);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // ✨ Like/Unlike songs
  const toggleLike = (songId: string) => {
    const newLikedSongs = new Set(likedSongs);
    if (newLikedSongs.has(songId)) {
      newLikedSongs.delete(songId);
    } else {
      newLikedSongs.add(songId);
    }
    setLikedSongs(newLikedSongs);
  };

  // ✨ Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ✨ Song Row Component
  const SongRow: React.FC<{ song: Song; index: number; isActive?: boolean }> = ({ song, index, isActive }) => (
    <div className={`flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors ${isActive ? 'bg-blue-50 border border-blue-200' : ''}`}>
      <div className="w-8 text-center text-sm text-gray-500 mr-3">
        {isActive && isPlaying ? (
          <div className="flex space-x-1">
            <div className="w-1 h-4 bg-blue-500 animate-pulse"></div>
            <div className="w-1 h-4 bg-blue-500 animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-1 h-4 bg-blue-500 animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        ) : (
          <span>{index + 1}</span>
        )}
      </div>
      
      <div className="flex-1 flex items-center min-w-0">
        <div className="relative mr-3">
          <img 
            src={song.albumArt} 
            alt={song.title}
            className="w-12 h-12 rounded-md"
          />
          <button
            onClick={() => togglePlayPause(song)}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md opacity-0 hover:opacity-100 transition-opacity"
          >
            {isActive && isPlaying ? (
              <Pause className="h-5 w-5 text-white" />
            ) : (
              <Play className="h-5 w-5 text-white ml-0.5" />
            )}
          </button>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{song.title}</h4>
          <p className="text-sm text-gray-600 truncate">{song.artist}</p>
        </div>
      </div>

      <div className="hidden md:flex items-center space-x-4 mr-4">
        <Badge variant="secondary" className="text-xs">
          {song.genre}
        </Badge>
        <span className="text-sm text-gray-500">{song.duration}</span>
      </div>

      <button
        onClick={() => toggleLike(song.id)}
        className={`p-2 rounded-full hover:bg-gray-100 ${likedSongs.has(song.id) ? 'text-red-500' : 'text-gray-400'}`}
      >
        <Heart className={`h-5 w-5 ${likedSongs.has(song.id) ? 'fill-current' : ''}`} />
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🎵 Shantah Music Therapy
            </h1>
            <p className="text-gray-600">
              Personalized healing music based on your stress level: <Badge variant="outline">{userStressLevel}</Badge>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {profile?.full_name ? `Welcome, ${profile.full_name.split(' ')[0]}` : 'Welcome to healing music'}
            </p>
          </div>
        </div>
      </div>

      {/* Music Player Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="all">All Playlists</TabsTrigger>
              <TabsTrigger value="liked">Liked Songs</TabsTrigger>
              <TabsTrigger value="healing">Healing</TabsTrigger>
            </TabsList>

            {/* Recommended Tab */}
            <TabsContent value="recommended" className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={recommendedPlaylist.coverImage} 
                      alt={recommendedPlaylist.name}
                      className="w-32 h-32 rounded-lg shadow-lg"
                    />
                    <div>
                      <CardTitle className="text-2xl mb-2">{recommendedPlaylist.name}</CardTitle>
                      <p className="text-gray-600 mb-4">{recommendedPlaylist.description}</p>
                      <div className="flex items-center space-x-4">
                        <Button 
                          onClick={() => togglePlayPause(recommendedPlaylist.songs[0])}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Play className="h-5 w-5 mr-2" />
                          Play All
                        </Button>
                        <Button variant="outline">
                          <Shuffle className="h-5 w-5 mr-2" />
                          Shuffle
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recommendedPlaylist.songs.map((song, index) => (
                      <SongRow 
                        key={song.id} 
                        song={song} 
                        index={index}
                        isActive={currentSong?.id === song.id}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* All Playlists Tab */}
            <TabsContent value="all" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {musicDatabase.map((playlist) => (
                  <Card key={playlist.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <img 
                          src={playlist.coverImage} 
                          alt={playlist.name}
                          className="w-16 h-16 rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{playlist.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{playlist.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge 
                              variant={playlist.stressLevel === userStressLevel ? 'default' : 'secondary'}
                            >
                              {playlist.stressLevel} stress
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                setActiveTab('recommended');
                                // Logic to switch to this playlist
                              }}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Liked Songs Tab */}
            <TabsContent value="liked" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Liked Songs</CardTitle>
                </CardHeader>
                <CardContent>
                  {Array.from(likedSongs).length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No liked songs yet. Start exploring healing music!</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {musicDatabase
                        .flatMap(playlist => playlist.songs)
                        .filter(song => likedSongs.has(song.id))
                        .map((song, index) => (
                          <SongRow 
                            key={song.id} 
                            song={song} 
                            index={index}
                            isActive={currentSong?.id === song.id}
                          />
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Healing Tab */}
            <TabsContent value="healing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Therapeutic Music Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: "Reduces Cortisol", desc: "Lowers stress hormone levels by up to 68%", icon: "🧘‍♀️" },
                      { title: "Improves Sleep", desc: "Better sleep quality within 7 days", icon: "😴" },
                      { title: "Anxiety Relief", desc: "Clinically proven to reduce anxiety symptoms", icon: "💙" },
                      { title: "Focus Enhancement", desc: "Increases concentration and mental clarity", icon: "🎯" }
                    ].map((benefit, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                        <div className="text-2xl mb-2">{benefit.icon}</div>
                        <h3 className="font-semibold mb-1">{benefit.title}</h3>
                        <p className="text-sm text-gray-600">{benefit.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - Now Playing & Recommendations */}
        <div className="space-y-6">
          {/* Now Playing */}
          {currentSong && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Now Playing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <img 
                    src={currentSong.albumArt} 
                    alt={currentSong.title}
                    className="w-full max-w-48 mx-auto rounded-lg shadow-lg"
                  />
                  <div>
                    <h3 className="font-semibold">{currentSong.title}</h3>
                    <p className="text-gray-600">{currentSong.artist}</p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(currentTime / 300) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{formatTime(currentTime)}</span>
                      <span>{currentSong.duration}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center space-x-4">
                    <Button variant="ghost" size="sm">
                      <SkipBack className="h-5 w-5" />
                    </Button>
                    <Button 
                      onClick={() => togglePlayPause()}
                      className="bg-blue-500 hover:bg-blue-600 rounded-full p-3"
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6 text-white" />
                      ) : (
                        <Play className="h-6 w-6 text-white ml-0.5" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <SkipForward className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Benefits */}
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-2">Healing Benefits:</p>
                    <div className="flex flex-wrap gap-1">
                      {currentSong.benefits.map((benefit, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Wellness Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Songs Played</span>
                  <span className="font-semibold">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Meditation Minutes</span>
                  <span className="font-semibold">284</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Stress Reduced</span>
                  <span className="font-semibold text-green-600">-32%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Mood Improvement</span>
                  <span className="font-semibold text-blue-600">+18%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShantahMusic;
