import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Send, 
  Mic, 
  MicOff, 
  RefreshCw,
  Bot,
  User,
  Music,
  BookOpen,
  Brain,
  Heart,
  Loader2,
  ChevronDown,
  Info,
  Youtube,
  Dumbbell
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { analyzeUserMood, MoodAnalysisResult } from "@/lib/mood-analyzer";
import { generateAIResponse } from "@/lib/mental-health-chat-ai";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'ai';
  timestamp: Date;
  isLoading?: boolean;
  analysis?: {
    mood?: MoodAnalysisResult;
    exercises?: {
      title: string;
      description: string;
      duration: string;
      difficulty: 'easy' | 'moderate' | 'challenging';
      benefits: string[];
    }[];
    videos?: {
      title: string;
      creator: string;
      description: string;
      category: string;
      duration: string;
      tags: string[];
    }[];
    musicRecommendations?: {
      title: string;
      artist: string;
      category: string;
    }[];
    articleRecommendations?: {
      title: string;
      description: string;
      category: string;
    }[];
  };
}

// Music recommendations database
const musicRecommendations = {
  calm: [
    { title: "Ocean Waves", artist: "Nature Sounds", category: "calm" },
    { title: "Peaceful Meditation", artist: "Mindfulness", category: "calm" },
    { title: "Forest Whispers", artist: "Ambient Sounds", category: "calm" }
  ],
  uplifting: [
    { title: "Morning Joy", artist: "Happy Vibes", category: "uplifting" },
    { title: "Sunny Days", artist: "Positive Energy", category: "uplifting" },
    { title: "Fresh Start", artist: "Motivation", category: "uplifting" }
  ],
  focus: [
    { title: "Deep Concentration", artist: "Study Music", category: "focus" },
    { title: "Productive Flow", artist: "Work Rhythm", category: "focus" },
    { title: "Mind Clarity", artist: "Concentration Beats", category: "focus" }
  ],
  sleep: [
    { title: "Dreamy Night", artist: "Sleep Sounds", category: "sleep" },
    { title: "Gentle Lullaby", artist: "Deep Sleep", category: "sleep" },
    { title: "Night Whispers", artist: "Relaxation", category: "sleep" }
  ]
};

// Articles database
const articleRecommendations = {
  anxiety: [
    { 
      title: "Understanding and Managing Anxiety", 
      description: "Learn about the root causes of anxiety and effective coping strategies.",
      category: "anxiety"
    },
    { 
      title: "Breathing Techniques for Immediate Anxiety Relief", 
      description: "Simple breathing exercises you can do anywhere to calm your nervous system.",
      category: "anxiety"
    },
    { 
      title: "Breaking the Cycle of Anxious Thoughts", 
      description: "How to recognize and interrupt patterns of anxious thinking.",
      category: "anxiety"
    }
  ],
  depression: [
    { 
      title: "Signs of Depression and When to Seek Help", 
      description: "Understanding depression symptoms and treatment options.",
      category: "depression"
    },
    { 
      title: "Small Steps for Managing Depression", 
      description: "Practical daily actions that can help improve your mood.",
      category: "depression"
    },
    { 
      title: "The Role of Exercise in Fighting Depression", 
      description: "How physical activity affects brain chemistry and mood.",
      category: "depression"
    }
  ],
  stress: [
    { 
      title: "The Science of Stress and Its Impact", 
      description: "Understanding how stress affects your body and mind.",
      category: "stress"
    },
    { 
      title: "Building Resilience to Life's Challenges", 
      description: "Strategies to strengthen your ability to cope with stressors.",
      category: "stress"
    },
    { 
      title: "Work-Life Balance in the Digital Age", 
      description: "Setting boundaries for better mental health in a connected world.",
      category: "stress"
    }
  ],
  general: [
    { 
      title: "The Foundations of Mental Wellbeing", 
      description: "Essential practices for maintaining good mental health.",
      category: "general"
    },
    { 
      title: "Mindfulness for Everyday Life", 
      description: "Simple ways to incorporate mindfulness into your daily routine.",
      category: "general"
    },
    { 
      title: "Building Healthy Relationships", 
      description: "How connections with others impact our mental health.",
      category: "general"
    }
  ]
};

export function MentalHealthChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI mental health companion. Feel free to share how you're feeling, and I'll be here to listen and provide support. I can offer guidance, suggest helpful resources, and recommend exercises and videos to help with your mental wellbeing.",
      role: "ai",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      toast({
        title: "Voice recording stopped",
        description: "Your message has been captured.",
      });
    } else {
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Speak clearly to share how you're feeling.",
      });
      
      // Simulate voice recognition after a delay
      setTimeout(() => {
        setIsListening(false);
        setInputValue("I've been feeling quite anxious lately because of work stress. I'm having trouble sleeping and it's affecting my mood.");
        toast({
          title: "Voice recording completed",
          description: "Your message has been captured.",
        });
      }, 3000);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessageId = generateUniqueId();
    const aiResponseId = generateUniqueId();
    
    // Add user message
    const userMessage: Message = {
      id: userMessageId,
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };
    
    // Add AI message with loading state
    const loadingMessage: Message = {
      id: aiResponseId,
      content: "",
      role: "ai",
      timestamp: new Date(),
      isLoading: true,
    };
    
    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInputValue("");
    
    // Focus input field again
    inputRef.current?.focus();
    
    // Analyze mood and generate response
    setTimeout(() => {
      // Analyze user's mood
      const moodResult = analyzeUserMood(userMessage.content);
      
      // Get recommended music category based on mood
      const musicCategory = getMusicCategoryFromMood(moodResult);
      const recommendedMusic = musicRecommendations[musicCategory as keyof typeof musicRecommendations];
      
      // Get recommended articles based on mood
      const articleCategory = getArticleCategoryFromMood(moodResult);
      const recommendedArticles = articleRecommendations[articleCategory as keyof typeof articleRecommendations];
      
      // Generate AI response using the new advanced system
      const aiResponse = generateAIResponse(userMessage.content, moodResult);
      
      // Update AI message with response and analysis data
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiResponseId 
            ? {
                ...msg, 
                content: aiResponse.message, 
                isLoading: false,
                analysis: {
                  mood: moodResult,
                  musicRecommendations: recommendedMusic,
                  articleRecommendations: recommendedArticles,
                  exercises: aiResponse.exercises,
                  videos: aiResponse.videos
                }
              }
            : msg
        )
      );
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        content: "Hello! I'm your AI mental health companion. Feel free to share how you're feeling, and I'll be here to listen and provide support. I can offer guidance, suggest helpful resources, and recommend exercises and videos to help with your mental wellbeing.",
        role: "ai",
        timestamp: new Date(),
      }
    ]);
    
    toast({
      title: "Chat Reset",
      description: "Your conversation has been reset.",
    });
  };

  const getMusicCategoryFromMood = (mood: MoodAnalysisResult): string => {
    if (mood.anxiety > 0.6) return "calm";
    if (mood.stress > 0.6) return "calm";
    if (mood.mood < 0.4) return "uplifting";
    if (mood.primaryEmotion === "Exhausted") return "focus";
    return "uplifting";
  };

  const getArticleCategoryFromMood = (mood: MoodAnalysisResult): string => {
    if (mood.anxiety > 0.6) return "anxiety";
    if (mood.stress > 0.6) return "stress";
    if (mood.mood < 0.4) return "depression";
    return "general";
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const renderMusicRecommendations = (recommendations: any[]) => {
    return (
      <div className="mt-2 p-3 bg-secondary/20 rounded-md">
        <div className="flex items-center gap-2 mb-2">
          <Music className="h-4 w-4 text-primary" />
          <h4 className="font-medium text-sm">Music Recommendations</h4>
        </div>
        <ul className="space-y-1 text-sm">
          {recommendations.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-primary rounded-full"></span>
              <span className="font-medium">{item.title}</span>
              <span className="text-muted-foreground">by {item.artist}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderArticleRecommendations = (recommendations: any[]) => {
    return (
      <div className="mt-2 p-3 bg-secondary/20 rounded-md">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <h4 className="font-medium text-sm">Suggested Articles</h4>
        </div>
        <ul className="space-y-2 text-sm">
          {recommendations.map((item, index) => (
            <li key={index} className="border-l-2 border-primary pl-2">
              <div className="font-medium">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.description}</div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderExerciseRecommendations = (exercises: any[]) => {
    return (
      <div className="mt-2 p-3 bg-secondary/20 rounded-md">
        <div className="flex items-center gap-2 mb-2">
          <Dumbbell className="h-4 w-4 text-primary" />
          <h4 className="font-medium text-sm">Recommended Exercises</h4>
        </div>
        <ul className="space-y-2 text-sm">
          {exercises.map((exercise, index) => (
            <li key={index} className="border-l-2 border-primary pl-2">
              <div className="font-medium">{exercise.title}</div>
              <div className="text-xs mb-1">{exercise.description}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="bg-secondary/50 px-1.5 py-0.5 rounded">
                  {exercise.duration}
                </span>
                <span className="bg-secondary/50 px-1.5 py-0.5 rounded capitalize">
                  {exercise.difficulty}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {exercise.benefits.map((benefit, i) => (
                  <span key={i} className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">
                    {benefit}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderVideoRecommendations = (videos: any[]) => {
    return (
      <div className="mt-2 p-3 bg-secondary/20 rounded-md">
        <div className="flex items-center gap-2 mb-2">
          <Youtube className="h-4 w-4 text-primary" />
          <h4 className="font-medium text-sm">Recommended Videos</h4>
        </div>
        <ul className="space-y-2 text-sm">
          {videos.map((video, index) => (
            <li key={index} className="border-l-2 border-primary pl-2">
              <div className="font-medium">{video.title}</div>
              <div className="text-xs mb-1 text-muted-foreground">
                By {video.creator} • {video.duration}
              </div>
              <div className="text-xs mb-1">
                {video.description}
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {video.tags.map((tag, i) => (
                  <span key={i} className="text-xs px-1.5 py-0.5 bg-secondary/50 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user';
    
    return (
      <div 
        key={message.id} 
        className={cn(
          "py-4",
          isUser ? "bg-background" : "bg-muted/30"
        )}
      >
        <div className="mx-auto max-w-3xl px-4 flex gap-3 items-start">
          <Avatar className={cn("mt-0.5", isUser ? "bg-primary" : "bg-green-600")}>
            <AvatarFallback>
              {isUser ? <User size={16} /> : <Bot size={16} />}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                {isUser ? "You" : "Mental Health Assistant"}
              </span>
              
              {!isUser && (
                <Badge variant="outline" className="text-xs px-2 py-0 h-5 bg-blue-50 text-blue-700 border-blue-200">
                  <Brain size={10} className="mr-1" />
                  ArogyaGPT
                </Badge>
              )}
            </div>
            
            {message.isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-muted-foreground" />
                <span className="text-muted-foreground text-sm">Thinking...</span>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <p className="text-sm">{message.content}</p>
              </div>
            )}
            
            {!isUser && message.analysis && message.analysis.musicRecommendations && (
              renderMusicRecommendations(message.analysis.musicRecommendations)
            )}
            
            {!isUser && message.analysis && message.analysis.articleRecommendations && (
              renderArticleRecommendations(message.analysis.articleRecommendations)
            )}

            {!isUser && message.analysis && message.analysis.exercises && (
              renderExerciseRecommendations(message.analysis.exercises)
            )}

            {!isUser && message.analysis && message.analysis.videos && (
              renderVideoRecommendations(message.analysis.videos)
            )}
            
            {!isUser && message.analysis && message.analysis.mood && (
              <div className="mt-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Info className="mr-1 h-3 w-3" /> View Mood Analysis
                      <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start">
                    <div className="p-2 text-xs">
                      <div className="mb-2 font-medium">Primary Emotion: {message.analysis.mood.primaryEmotion}</div>
                      <div className="space-y-1.5">
                        <div>
                          <div className="flex justify-between">
                            <span>Positive Mood</span>
                            <span>{Math.round(message.analysis.mood.mood * 100)}%</span>
                          </div>
                          <div className="w-full bg-secondary h-1.5 rounded-full">
                            <div 
                              className="bg-green-500 h-1.5 rounded-full" 
                              style={{ width: `${message.analysis.mood.mood * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <span>Anxiety Level</span>
                            <span>{Math.round(message.analysis.mood.anxiety * 100)}%</span>
                          </div>
                          <div className="w-full bg-secondary h-1.5 rounded-full">
                            <div 
                              className="bg-yellow-500 h-1.5 rounded-full" 
                              style={{ width: `${message.analysis.mood.anxiety * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <span>Stress Level</span>
                            <span>{Math.round(message.analysis.mood.stress * 100)}%</span>
                          </div>
                          <div className="w-full bg-secondary h-1.5 rounded-full">
                            <div 
                              className="bg-red-500 h-1.5 rounded-full" 
                              style={{ width: `${message.analysis.mood.stress * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {!isVisible ? (
        <Card className="bg-white dark:bg-gray-900 shadow-lg border-0 w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Mental Health AI Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <p className="text-sm text-muted-foreground mb-4">
              Chat with our AI assistant for mental health support, guidance, and personalized recommendations.
            </p>
            <Button onClick={toggleVisibility} className="w-full">Start Chatting</Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white dark:bg-gray-900 shadow-lg border-0 w-full">
          <CardHeader className="pb-2 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Mental Health AI Chat
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={resetChat} className="h-8 w-8">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleVisibility} className="h-8">
                Minimize
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col h-[500px]">
              <ScrollArea className="flex-1 max-h-[450px]">
                {messages.map(renderMessage)}
                <div ref={messagesEndRef} />
              </ScrollArea>
              
              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleListening}
                    className={isListening ? "text-red-500" : ""}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  
                  <div className="relative flex-1">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Share how you're feeling..."
                      className="pr-10"
                    />
                    <Button
                      size="sm"
                      className="absolute right-1 top-1 h-7 w-7 p-0"
                      onClick={sendMessage}
                      disabled={!inputValue.trim() || messages.some(m => m.isLoading)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}