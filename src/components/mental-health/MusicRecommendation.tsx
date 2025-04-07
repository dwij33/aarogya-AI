
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { MoodAnalysisResult } from "@/lib/mood-analyzer";
import { Music, Heart, SkipForward, Play, Pause, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface MusicRecommendationProps {
  currentMood: MoodAnalysisResult | null;
}

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  category: string;
  coverImage: string;
}

const musicLibrary: MusicTrack[] = [
  {
    id: "calm1",
    title: "Ocean Waves",
    artist: "Nature Sounds",
    duration: "3:45",
    category: "calm",
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    id: "calm2",
    title: "Peaceful Meditation",
    artist: "Mindfulness",
    duration: "5:20",
    category: "calm",
    coverImage: "https://images.unsplash.com/photo-1519834022362-cf872bbcaa31"
  },
  {
    id: "calm3",
    title: "Forest Whispers",
    artist: "Ambient Sounds",
    duration: "4:30",
    category: "calm",
    coverImage: "https://images.unsplash.com/photo-1448375240586-882707db888b"
  },
  {
    id: "uplifting1",
    title: "Morning Joy",
    artist: "Happy Vibes",
    duration: "3:22",
    category: "uplifting",
    coverImage: "https://images.unsplash.com/photo-1443890923422-7819ed4101c0"
  },
  {
    id: "uplifting2",
    title: "Sunny Days",
    artist: "Positive Energy",
    duration: "4:10",
    category: "uplifting",
    coverImage: "https://images.unsplash.com/photo-1419833173245-f59e1b93f9ee"
  },
  {
    id: "uplifting3",
    title: "Fresh Start",
    artist: "Motivation",
    duration: "3:55",
    category: "uplifting",
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
  },
  {
    id: "focus1",
    title: "Deep Concentration",
    artist: "Study Music",
    duration: "6:15",
    category: "focus",
    coverImage: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45"
  },
  {
    id: "focus2",
    title: "Productive Flow",
    artist: "Work Rhythm",
    duration: "4:45",
    category: "focus",
    coverImage: "https://images.unsplash.com/photo-1464823063530-08f10ed1a2dd"
  },
  {
    id: "focus3",
    title: "Mind Clarity",
    artist: "Concentration Beats",
    duration: "5:30",
    category: "focus",
    coverImage: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1"
  },
  {
    id: "sleep1",
    title: "Dreamy Night",
    artist: "Sleep Sounds",
    duration: "8:00",
    category: "sleep",
    coverImage: "https://images.unsplash.com/photo-1491466424936-e304919aada7"
  },
  {
    id: "sleep2",
    title: "Gentle Lullaby",
    artist: "Deep Sleep",
    duration: "7:20",
    category: "sleep",
    coverImage: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3"
  },
  {
    id: "sleep3",
    title: "Night Whispers",
    artist: "Relaxation",
    duration: "6:40",
    category: "sleep",
    coverImage: "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e"
  }
];

export function MusicRecommendation({ currentMood }: MusicRecommendationProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("calm");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [volume, setVolume] = useState([70]);
  const { toast } = useToast();

  // Get recommended music category based on mood
  function getRecommendedCategory(): string {
    if (!currentMood) return "calm";
    
    if (currentMood.anxiety > 0.6) return "calm";
    if (currentMood.stress > 0.6) return "calm";
    if (currentMood.mood < 0.4) return "uplifting";
    if (currentMood.primaryEmotion === "Exhausted") return "focus";
    return "uplifting";
  }

  // Filter tracks by category
  const filteredTracks = musicLibrary.filter(track => track.category === selectedCategory);

  // Play a track
  function playTrack(track: MusicTrack) {
    if (currentTrack?.id === track.id) {
      // Toggle play/pause for current track
      setIsPlaying(!isPlaying);
    } else {
      // Play new track
      setCurrentTrack(track);
      setIsPlaying(true);
    }
    
    toast({
      title: isPlaying ? "Paused" : "Now Playing",
      description: isPlaying ? "" : `${track.title} by ${track.artist}`
    });
  }

  // Skip to next track
  function skipToNext() {
    if (!currentTrack) return;
    
    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % filteredTracks.length;
    const nextTrack = filteredTracks[nextIndex];
    
    setCurrentTrack(nextTrack);
    setIsPlaying(true);
    
    toast({
      title: "Now Playing",
      description: `${nextTrack.title} by ${nextTrack.artist}`
    });
  }

  // Handle volume change
  function handleVolumeChange(values: number[]) {
    setVolume(values);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Music for Your Mood</h3>
          <p className="text-sm text-muted-foreground">
            Listen to music that helps balance your emotional state
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            size="sm"
            variant={selectedCategory === "calm" ? "default" : "outline"}
            onClick={() => setSelectedCategory("calm")}
          >
            Calming
          </Button>
          <Button 
            size="sm"
            variant={selectedCategory === "uplifting" ? "default" : "outline"}
            onClick={() => setSelectedCategory("uplifting")}
          >
            Uplifting
          </Button>
          <Button 
            size="sm"
            variant={selectedCategory === "focus" ? "default" : "outline"}
            onClick={() => setSelectedCategory("focus")}
          >
            Focus
          </Button>
          <Button 
            size="sm"
            variant={selectedCategory === "sleep" ? "default" : "outline"}
            onClick={() => setSelectedCategory("sleep")}
          >
            Sleep
          </Button>
        </div>
      </div>

      {currentMood && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Music size={18} className="text-primary" />
              <p className="text-sm">
                <span className="font-medium">Recommended for your mood: </span> 
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-sm"
                  onClick={() => setSelectedCategory(getRecommendedCategory())}
                >
                  {getRecommendedCategory() === "calm" ? "Calming music" :
                   getRecommendedCategory() === "uplifting" ? "Uplifting music" :
                   getRecommendedCategory() === "focus" ? "Focus music" : "Sleep music"}
                </Button>
                {" "}to help balance your emotional state.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredTracks.map((track) => (
          <Card 
            key={track.id}
            className={cn(
              "overflow-hidden cursor-pointer transition-all hover:shadow-md",
              currentTrack?.id === track.id ? "ring-2 ring-primary" : ""
            )}
            onClick={() => playTrack(track)}
          >
            <div className="aspect-square relative">
              <img 
                src={`${track.coverImage}?w=300&h=300&fit=crop&crop=entropy&auto=format&q=60`}
                alt={track.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button 
                  variant="secondary" 
                  size="icon"
                  className="rounded-full bg-white/80 hover:bg-white text-black"
                >
                  {currentTrack?.id === track.id && isPlaying ? (
                    <Pause size={24} />
                  ) : (
                    <Play size={24} />
                  )}
                </Button>
              </div>
              {currentTrack?.id === track.id && (
                <div className="absolute top-2 right-2">
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    {isPlaying ? "Playing" : "Paused"}
                  </span>
                </div>
              )}
            </div>
            <CardContent className="py-3">
              <h4 className="font-medium">{track.title}</h4>
              <p className="text-sm text-muted-foreground">{track.artist}</p>
              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                <span>{track.duration}</span>
                <button 
                  className="hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast({
                      title: "Added to Favorites",
                      description: `${track.title} has been added to your favorites.`
                    });
                  }}
                >
                  <Heart size={14} />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {currentTrack && (
        <Card className="sticky bottom-0 mt-8">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src={`${currentTrack.coverImage}?w=60&h=60&fit=crop&crop=entropy&auto=format&q=60`}
                  alt={currentTrack.title}
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <h4 className="font-medium">{currentTrack.title}</h4>
                  <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => playTrack(currentTrack)}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={skipToNext}
                >
                  <SkipForward size={20} />
                </Button>
                <div className="hidden sm:flex items-center space-x-2 min-w-[140px]">
                  <Volume2 size={16} />
                  <Slider
                    value={volume}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="w-24"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
