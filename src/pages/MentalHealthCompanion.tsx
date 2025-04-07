
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Send, 
  Mic, 
  MicOff, 
  Info, 
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Bot,
  Music,
  BookOpen,
  LineChart,
  Heart,
  Activity
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { analyzeUserMood, MoodAnalysisResult } from "@/lib/mood-analyzer";
import { BreathingExercise } from "@/components/mental-health/BreathingExercise";
import { MoodChart } from "@/components/mental-health/MoodChart";
import { JournalingPrompt } from "@/components/mental-health/JournalingPrompt";
import { MusicRecommendation } from "@/components/mental-health/MusicRecommendation";
import { Affirmations } from "@/components/mental-health/Affirmations";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface MoodData {
  date: Date;
  mood: number; // 0-100 scale
  anxiety: number; 
  stress: number;
}

const MentalHealthCompanion = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [moodHistory, setMoodHistory] = useState<MoodData[]>([]);
  const [currentMood, setCurrentMood] = useState<MoodAnalysisResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "AI Mental Health Companion | ArogyaAI+";
    
    // Initial welcome message
    setMessages([
      {
        id: "welcome",
        content: "Hello! I'm your AI mental health companion. I'm here to listen, analyze your mood, and provide personalized suggestions to improve your emotional wellbeing. How are you feeling today?",
        sender: "ai",
        timestamp: new Date()
      }
    ]);

    // Load mood history from localStorage if available
    const savedMoodHistory = localStorage.getItem("moodHistory");
    if (savedMoodHistory) {
      try {
        const parsed = JSON.parse(savedMoodHistory);
        // Convert string dates back to Date objects
        const parsedWithDates = parsed.map((item: any) => ({
          ...item,
          date: new Date(item.date)
        }));
        setMoodHistory(parsedWithDates);
      } catch (error) {
        console.error("Failed to parse mood history:", error);
      }
    } else {
      // Generate some sample data for the chart if no history exists
      generateSampleMoodData();
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save mood history to localStorage whenever it changes
  useEffect(() => {
    if (moodHistory.length > 0) {
      localStorage.setItem("moodHistory", JSON.stringify(moodHistory));
    }
  }, [moodHistory]);

  const generateSampleMoodData = () => {
    const sampleData: MoodData[] = [];
    const today = new Date();
    
    for (let i = 30; i > 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      sampleData.push({
        date,
        mood: 50 + Math.floor(Math.random() * 40) - 20,
        anxiety: 30 + Math.floor(Math.random() * 40),
        stress: 40 + Math.floor(Math.random() * 30)
      });
    }
    
    setMoodHistory(sampleData);
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
        setInput("I've been feeling quite stressed and anxious lately because of work deadlines. I'm not sleeping well and it's affecting my mood.");
        toast({
          title: "Voice recording completed",
          description: "Your message has been captured.",
        });
      }, 3000);
    }
  };

  const generateId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: generateId(),
      content: input,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Analyze mood from user input
    setTimeout(() => {
      const moodResult = analyzeUserMood(input);
      setCurrentMood(moodResult);
      
      // Add new mood data point
      const newMoodData: MoodData = {
        date: new Date(),
        mood: moodResult.mood * 100, // Convert 0-1 scale to 0-100
        anxiety: moodResult.anxiety * 100,
        stress: moodResult.stress * 100
      };
      
      setMoodHistory(prev => [...prev, newMoodData]);
      
      // Generate AI response based on mood analysis
      const aiResponse = generateResponseBasedOnMood(moodResult);
      
      const aiMessage: Message = {
        id: generateId(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      
      // Show toast with mood analysis result
      toast({
        title: `Mood Analysis: ${moodResult.primaryEmotion}`,
        description: `I've detected ${moodResult.mood * 100}% positive mood with ${moodResult.anxiety * 100}% anxiety levels.`,
      });
    }, 2000);
  };

  const generateResponseBasedOnMood = (moodResult: MoodAnalysisResult): string => {
    const { primaryEmotion, mood, anxiety, stress } = moodResult;
    
    if (anxiety > 0.6) {
      return `I notice you're experiencing significant anxiety (${Math.round(anxiety * 100)}%). Let's try a breathing exercise to help calm your nervous system. Would you like to try our guided 4-7-8 breathing technique? I can also suggest some calming music that might help reduce your anxiety levels.`;
    }
    
    if (stress > 0.6) {
      return `I can tell you're under a lot of stress right now (${Math.round(stress * 100)}%). Stress can affect both your mental and physical health. I'd recommend taking short breaks during your day and practicing mindfulness. Would you like to try a quick guided meditation or hear some positive affirmations?`;
    }
    
    if (mood < 0.4) {
      return `I'm sorry you're not feeling your best today. Your mood seems a bit low (${Math.round(mood * 100)}% positive). Sometimes writing down your thoughts can help process emotions. Would you like me to provide a journaling prompt? Or I could suggest some uplifting music that might help improve your mood.`;
    }
    
    if (mood > 0.7) {
      return `It's great to see you're in a positive mood today! Would you like to journal about what's going well in your life? This can help reinforce positive patterns and give you something to look back on during more challenging times.`;
    }
    
    return `Thank you for sharing how you're feeling. Based on our conversation, I've detected a mix of emotions. Would you like to explore some breathing exercises, listen to mood-enhancing music, or try journaling to process your thoughts?`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const resetChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        content: "Hello! I'm your AI mental health companion. I'm here to listen, analyze your mood, and provide personalized suggestions to improve your emotional wellbeing. How are you feeling today?",
        sender: "ai",
        timestamp: new Date()
      }
    ]);
    setCurrentMood(null);
    toast({
      title: "Chat Reset",
      description: "Your conversation has been reset. All previous messages have been cleared.",
    });
  };

  return (
    <div className="container py-8 px-4 md:px-6 max-w-7xl">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-3xl font-bold">AI Mental Health Companion</h1>
        <p className="text-muted-foreground">
          Chat with our AI companion for emotional support, mood tracking, and personalized wellbeing suggestions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader className="border-b flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-primary/10 text-primary">
                  <Bot size={18} />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">Mental Health Companion</CardTitle>
                <CardDescription>AI-powered emotional support</CardDescription>
              </div>
            </div>
            {currentMood && (
              <Badge 
                className={cn(
                  "px-3 py-1",
                  currentMood.mood > 0.6 
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                    : currentMood.mood < 0.4 
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" 
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                )}
              >
                {currentMood.mood > 0.6 
                  ? "Positive Mood" 
                  : currentMood.mood < 0.4 
                    ? "Low Mood" 
                    : "Neutral Mood"}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col h-[400px]">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={cn(
                      "flex",
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div 
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3 mb-1",
                        msg.sender === "user" 
                          ? "bg-primary text-primary-foreground rounded-tr-none" 
                          : "bg-secondary dark:bg-secondary/60 rounded-tl-none"
                      )}
                    >
                      <p>{msg.content}</p>
                      <div className={cn(
                        "text-xs mt-1",
                        msg.sender === "user" 
                          ? "text-primary-foreground/70" 
                          : "text-muted-foreground"
                      )}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-secondary dark:bg-secondary/60 rounded-2xl rounded-tl-none px-4 py-3">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                        <div className="h-2 w-2 bg-primary rounded-full animate-pulse delay-150"></div>
                        <div className="h-2 w-2 bg-primary rounded-full animate-pulse delay-300"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t p-3">
            <div className="flex items-center w-full space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleListening}
                className={isListening ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50" : ""}
                disabled={isLoading}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </Button>
              <Input
                placeholder="Tell me how you're feeling today..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading || isListening}
                className="flex-1"
              />
              <Button 
                onClick={sendMessage} 
                disabled={isLoading || !input.trim()}
              >
                <Send size={18} className="mr-2" />
                Send
              </Button>
            </div>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Tools & Resources</CardTitle>
              <CardDescription>
                Mental wellbeing support tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start" onClick={resetChat}>
                <RefreshCw size={16} className="mr-2" /> New Conversation
              </Button>
              
              <div className="border-t border-border pt-4">
                <h3 className="font-medium text-sm mb-2">Wellbeing Tools</h3>
                <div className="grid grid-cols-1 gap-2">
                  <Button variant="outline" className="justify-start">
                    <Activity size={16} className="mr-2" /> Breathing Exercises
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Music size={16} className="mr-2" /> Mood Music
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <BookOpen size={16} className="mr-2" /> Journal Prompts
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Heart size={16} className="mr-2" /> Daily Affirmations
                  </Button>
                </div>
              </div>
              
              <div className="border-t border-border pt-4">
                <h3 className="font-medium text-sm mb-2">Current Mood Metrics</h3>
                {currentMood ? (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Mood</span>
                        <span>{Math.round(currentMood.mood * 100)}%</span>
                      </div>
                      <Progress value={currentMood.mood * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Anxiety</span>
                        <span>{Math.round(currentMood.anxiety * 100)}%</span>
                      </div>
                      <Progress value={currentMood.anxiety * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Stress</span>
                        <span>{Math.round(currentMood.stress * 100)}%</span>
                      </div>
                      <Progress value={currentMood.stress * 100} className="h-2" />
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Share how you're feeling to see your mood analysis.
                  </div>
                )}
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 text-sm flex items-start space-x-2">
                <AlertCircle size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                <p className="text-yellow-800 dark:text-yellow-200">
                  This AI companion is not a substitute for professional mental health treatment. If you're experiencing a crisis, please contact emergency services.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Mood Trends</CardTitle>
              <CardDescription>
                Track your emotional patterns over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <MoodChart moodData={moodHistory} />
              </div>
              <div className="mt-4 flex justify-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                  <span>Mood</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                  <span>Anxiety</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                  <span>Stress</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">Wellbeing Tools</h2>
        <Tabs defaultValue="breathing">
          <TabsList className="mb-6">
            <TabsTrigger value="breathing">Breathing Exercises</TabsTrigger>
            <TabsTrigger value="music">Music Therapy</TabsTrigger>
            <TabsTrigger value="journal">Journaling</TabsTrigger>
            <TabsTrigger value="affirmations">Affirmations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="breathing">
            <BreathingExercise />
          </TabsContent>
          
          <TabsContent value="music">
            <MusicRecommendation currentMood={currentMood} />
          </TabsContent>
          
          <TabsContent value="journal">
            <JournalingPrompt currentMood={currentMood} />
          </TabsContent>
          
          <TabsContent value="affirmations">
            <Affirmations currentMood={currentMood} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MentalHealthCompanion;
