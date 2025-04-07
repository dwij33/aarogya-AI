import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { 
  Send, User, Bot, Loader2, RefreshCw, ChevronDown, ChevronUp,
  Clock, CalendarDays, Utensils, Calendar, Apple, Carrot, Beef, Heart
} from "lucide-react";
import MealPlanDisplay from "./MealPlanDisplay";
import NutritionProfile from "./NutritionProfile";
import { generateDietResponse } from "@/lib/diet-advisor";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  mealPlan?: MealPlan | null;
}

interface MealPlan {
  title: string;
  description: string;
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  meals: Meal[];
  healthTips: string[];
  nutritionGoals: string[];
}

interface Meal {
  name: string;
  time: string;
  foods: Food[];
  calories: number;
}

interface Food {
  name: string;
  portion: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  category: "protein" | "vegetable" | "fruit" | "grain" | "dairy" | "fat";
}

export default function DietAdvisor() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "👋 Hello! I'm your AI Nutrition Assistant powered by ArogyaGPT. I can help create personalized meal plans based on your health goals, dietary preferences, and any specific conditions. What are your nutrition goals today?",
      role: "assistant",
      timestamp: new Date(),
      mealPlan: null
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      role: "user",
      timestamp: new Date(),
      mealPlan: null
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);
    
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await generateDietResponse(inputValue, messages);
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: response.textResponse,
        role: "assistant",
        timestamp: new Date(),
        mealPlan: response.mealPlan
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate nutrition advice. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetConversation = () => {
    setMessages([
      {
        id: "welcome",
        content: "👋 Hello! I'm your AI Nutrition Assistant powered by ArogyaGPT. I can help create personalized meal plans based on your health goals, dietary preferences, and any specific conditions. What are your nutrition goals today?",
        role: "assistant",
        timestamp: new Date(),
        mealPlan: null
      }
    ]);
  };

  const renderMessage = (message: Message) => {
    return (
      <div 
        key={message.id} 
        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}
      >
        <div 
          className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
        >
          <div className="flex-shrink-0 mt-1">
            <Avatar className={message.role === "assistant" ? "bg-health-green text-white" : "bg-primary/10"}>
              {message.role === "assistant" ? <Bot size={18} /> : <User size={18} />}
            </Avatar>
          </div>
          
          <div 
            className={`mx-2 p-3 rounded-lg ${
              message.role === "assistant" 
                ? "bg-card border shadow-sm" 
                : "bg-primary text-primary-foreground"
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs opacity-70">
                {message.role === "assistant" ? "AI Nutrition Assistant" : "You"}
              </span>
              <span className="text-xs opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="whitespace-pre-wrap">{message.content}</div>
            
            {message.mealPlan && (
              <div className="mt-4">
                <div 
                  className="flex justify-between items-center cursor-pointer" 
                  onClick={() => setShowDetails(!showDetails)}
                >
                  <Badge className="bg-health-green">Personalized Meal Plan</Badge>
                  <Button variant="ghost" size="sm">
                    {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </Button>
                </div>
                
                {showDetails && (
                  <MealPlanDisplay mealPlan={message.mealPlan} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <Tabs defaultValue="chat">
          <TabsList className="w-full">
            <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
            <TabsTrigger value="profile" className="flex-1">Nutrition Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="p-0">
            <CardContent className="p-0">
              <div className="flex flex-col h-[600px]">
                <div className="px-4 py-2 border-b flex justify-between items-center">
                  <div className="flex items-center">
                    <Bot className="h-5 w-5 text-health-green mr-2" />
                    <span className="font-medium">ArogyaGPT Nutrition</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetConversation}
                    title="Reset conversation"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                
                <ScrollArea className="flex-grow px-4 py-4">
                  {messages.map(message => renderMessage(message))}
                  <div ref={messagesEndRef} />
                  
                  {isProcessing && (
                    <div className="flex justify-start mb-4">
                      <div className="flex flex-row">
                        <Avatar className="bg-health-green text-white mt-1">
                          <Bot size={18} />
                        </Avatar>
                        <div className="mx-2 p-3 rounded-lg bg-card border shadow-sm flex items-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span>Creating your personalized nutrition plan...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </ScrollArea>
                
                <div className="p-4 border-t">
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Describe your health goals, dietary preferences, or ask for nutrition advice..."
                      disabled={isProcessing}
                    />
                    <Button 
                      type="submit" 
                      disabled={!inputValue.trim() || isProcessing}
                    >
                      {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="profile">
            <NutritionProfile />
          </TabsContent>
        </Tabs>
      </Card>
      
      <Card className="hidden lg:block">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Nutrition Quick Tips</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Apple className="h-5 w-5 text-health-green" />
              </div>
              <div>
                <h4 className="font-medium">Eat the Rainbow</h4>
                <p className="text-sm text-muted-foreground">Consume fruits and vegetables of different colors for a variety of nutrients.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Carrot className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h4 className="font-medium">Portion Control</h4>
                <p className="text-sm text-muted-foreground">Use smaller plates and be mindful of serving sizes to avoid overeating.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Beef className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h4 className="font-medium">Protein Balance</h4>
                <p className="text-sm text-muted-foreground">Include a variety of protein sources like lean meats, legumes, and plant proteins.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Heart className="h-5 w-5 text-pink-500" />
              </div>
              <div>
                <h4 className="font-medium">Healthy Fats</h4>
                <p className="text-sm text-muted-foreground">Choose unsaturated fats from sources like avocados, nuts, and olive oil.</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-2">Sample Queries:</h4>
              <div className="space-y-2">
                <div 
                  className="text-sm p-2 bg-primary/10 rounded-md cursor-pointer hover:bg-primary/20"
                  onClick={() => {
                    setInputValue("I want to lose 10kg. I'm vegetarian and have diabetes.");
                  }}
                >
                  "I want to lose 10kg. I'm vegetarian and have diabetes."
                </div>
                <div 
                  className="text-sm p-2 bg-primary/10 rounded-md cursor-pointer hover:bg-primary/20"
                  onClick={() => {
                    setInputValue("I need a high protein meal plan for muscle building. I'm lactose intolerant.");
                  }}
                >
                  "I need a high protein meal plan for muscle building. I'm lactose intolerant."
                </div>
                <div 
                  className="text-sm p-2 bg-primary/10 rounded-md cursor-pointer hover:bg-primary/20"
                  onClick={() => {
                    setInputValue("What should I eat to improve my heart health?");
                  }}
                >
                  "What should I eat to improve my heart health?"
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 