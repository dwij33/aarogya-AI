import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent,
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  AlertCircle, 
  Mic, 
  MicOff, 
  Send, 
  Bot,
  User,
  Loader2,
  ChevronDown, 
  HelpCircle,
  Info,
  Brain
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SymptomDetectionService } from "@/services/symptomDetection";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
  analysis?: {
    conditions: {
      name: string;
      confidence: number;
      description: string;
      recommendations: string[];
      urgency?: "high" | "medium" | "low";
    }[];
    modelUsed?: string;
  };
}

const SymptomChecker = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI health assistant. Please describe your symptoms, and I'll analyze them to provide a preliminary assessment. Remember to include details like when symptoms started, their severity, and your age for more accurate results.",
      role: "assistant",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isAIServiceAvailable, setIsAIServiceAvailable] = useState<boolean>(true);
  const [aiModelInfo, setAiModelInfo] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    document.title = "AI Symptom Checker | ArogyaAI+";
    
    // Check AI service health on component mount
    const checkAIServiceHealth = async () => {
      try {
        const healthStatus = await SymptomDetectionService.checkHealth();
        setIsAIServiceAvailable(healthStatus.aiServiceAvailable);
        setAiModelInfo(healthStatus.modelVersion);
        
        if (healthStatus.aiServiceAvailable) {
          console.log("AI health service available:", healthStatus.modelVersion);
        } else {
          console.warn("AI health service unavailable, using fallback");
          toast({
            variant: "destructive",
            title: "Basic Analysis Mode",
            description: "AI service not available. Using basic analysis only.",
          });
        }
      } catch (error) {
        console.error('Failed to check AI service health:', error);
        setIsAIServiceAvailable(false);
      }
    };
    
    checkAIServiceHealth();
  }, [toast]);

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
        description: "Your symptoms have been captured.",
      });
    } else {
      setIsListening(true);
      toast({
        title: "Listening for symptoms",
        description: "Please describe your symptoms clearly.",
      });
      
      // Simulate voice recognition (in a real app, this would use the Web Speech API)
      setTimeout(() => {
        setIsListening(false);
        setInputValue("I've been experiencing persistent headaches and dizziness for the past 3 days. I also feel a bit nauseous, especially in the morning. I'm 35 years old.");
        toast({
          title: "Voice recording completed",
          description: "Your symptoms have been captured.",
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
      role: "assistant",
      timestamp: new Date(),
      isLoading: true,
    };
    
    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInputValue("");
    
    // Focus input field again
    inputRef.current?.focus();
    
    try {
      // Extract age if present
      const age = extractAgeFromText(inputValue);
      
      // Request analysis from symptom detection service
      const result = await SymptomDetectionService.analyzeSymptoms(inputValue, { age });
      
      // Generate conversational response based on analysis
      let response = generateConversationalResponse(result, inputValue);
      
      // Update AI message with response and analysis data
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiResponseId 
            ? {
                ...msg, 
                content: response, 
                isLoading: false,
                analysis: {
                  conditions: result.results,
                  modelUsed: result.modelUsed
                }
              }
            : msg
        )
      );
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      
      // Update AI message with error
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiResponseId 
            ? {
                ...msg, 
                content: "I'm sorry, I encountered an error while analyzing your symptoms. Please try again or describe your symptoms differently.", 
                isLoading: false 
              }
            : msg
        )
      );
      
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Unable to analyze symptoms. Please try again.",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Helper function to generate conversational response based on analysis
  const generateConversationalResponse = (result: any, userInput: string) => {
    if (!result || !result.results || result.results.length === 0) {
      return "I couldn't identify specific conditions based on the symptoms you described. Could you provide more details about what you're experiencing?";
    }
    
    const conditions = result.results;
    const topCondition = conditions[0];
    const urgency = getUrgencyLevel(conditions);
    
    let response = "";
    
    // Opening remarks based on input
    response += getOpeningRemarks(userInput) + " ";
    
    // Main analysis
    response += `Based on your symptoms, I think you may be experiencing **${topCondition.condition}** (${topCondition.confidence}% confidence). ${topCondition.description}\n\n`;
    
    // Add recommendations
    response += "**Recommendations:**\n";
    topCondition.recommendations.forEach(rec => {
      response += `- ${rec}\n`;
    });
    
    // Mention other possible conditions if present
    if (conditions.length > 1) {
      response += "\nI've also identified other potential conditions that match your symptoms:\n";
      for (let i = 1; i < Math.min(conditions.length, 3); i++) {
        response += `- **${conditions[i].condition}** (${conditions[i].confidence}% confidence)\n`;
      }
    }
    
    // Urgency notice
    if (urgency === "high") {
      response += "\n⚠️ **Some of these symptoms may require urgent medical attention. Please consider consulting a healthcare provider soon.**";
    } else if (urgency === "medium") {
      response += "\n**Consider scheduling a doctor's appointment if symptoms persist or worsen.**";
    } else {
      response += "\n**Monitor your symptoms and rest. If they persist for more than a few days, consider consulting a healthcare provider.**";
    }
    
    // Disclaimer
    response += "\n\n*Remember: This is not a medical diagnosis. Always consult with healthcare professionals for proper medical advice.*";
    
    return response;
  };
  
  const getOpeningRemarks = (input: string) => {
    const remarks = [
      "I've analyzed your symptoms.",
      "Thank you for providing those details.",
      "I've reviewed the symptoms you described.",
      "Based on the information you've shared,",
      "After analyzing your symptoms,"
    ];
    
    return remarks[Math.floor(Math.random() * remarks.length)];
  };
  
  const getUrgencyLevel = (conditions: any[]): "low" | "medium" | "high" => {
    if (!conditions || conditions.length === 0) return "low";
    
    // Check if any condition has high urgency
    for (const condition of conditions) {
      if (condition.urgency === "high") return "high";
    }
    
    // Check if any of the top 3 conditions has medium urgency
    for (let i = 0; i < Math.min(conditions.length, 3); i++) {
      if (conditions[i].urgency === "medium") return "medium";
    }
    
    return "low";
  };

  const extractAgeFromText = (text: string): number | undefined => {
    // This regex looks for patterns like "I am 34", "I'm 34 years old", etc.
    const agePatterns = [
      /\b(?:I am|I'm)\s+(\d{1,3})(?:\s+years?\s+old)?\b/i,
      /\bage(?:\s+(?:is|of))?\s+(\d{1,3})\b/i,
      /\b(\d{1,3})(?:\s+years?\s+old)\b/i,
    ];
    
    for (const pattern of agePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const age = parseInt(match[1], 10);
        if (age > 0 && age < 120) { // Sanity check
          return age;
        }
      }
    }
    
    return undefined;
  };

  const getUrgencyBadge = (urgency?: "high" | "medium" | "low") => {
    if (!urgency) return null;
    
    const colors = {
      high: "bg-red-500 text-white",
      medium: "bg-yellow-500 text-white",
      low: "bg-green-500 text-white"
    };
    
    return (
      <Badge className={colors[urgency]}>
        {urgency === "high" ? "Urgent" : urgency === "medium" ? "Moderate" : "Low"} Priority
      </Badge>
    );
  };

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user';
    
    return (
      <div 
        key={message.id} 
        className={cn(
          "py-6",
          isUser ? "bg-background" : "bg-muted/50"
        )}
      >
        <div className="container max-w-4xl flex gap-4 items-start">
          <Avatar className={cn("mt-1", isUser ? "bg-primary" : "bg-health-green")}>
            <AvatarFallback>
              {isUser ? <User size={18} /> : <Bot size={18} />}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {isUser ? "You" : "AI Health Assistant"}
              </span>
              
              {!isUser && message.analysis?.modelUsed && (
                <Badge variant="outline" className="text-xs px-2 py-0 h-5 bg-blue-50 text-blue-700 border-blue-200">
                  <Brain size={12} className="mr-1" />
                  {message.analysis.modelUsed}
                </Badge>
              )}
              
              {message.analysis?.conditions?.[0]?.urgency && !isUser && (
                getUrgencyBadge(message.analysis.conditions[0].urgency)
              )}
            </div>
            
            {message.isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 size={18} className="animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Analyzing symptoms...</span>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                {message.content.split('\n').map((text, index) => (
                  <p key={index} className={text.startsWith('**') ? 'font-semibold' : ''}>
                    {text.replace(/\*\*(.*?)\*\*/g, '$1')}
                  </p>
                ))}
              </div>
            )}
            
            {!isUser && message.analysis?.conditions && message.analysis.conditions.length > 0 && (
              <div className="mt-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="text-sm">
                      <Info className="mr-2 h-4 w-4" /> View Detailed Analysis
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-72" align="start">
                    {message.analysis.conditions.map((condition, index) => (
                      <DropdownMenuItem key={index} className="flex flex-col items-start py-2">
                        <div className="w-full">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{condition.name}</span>
                            <span className="text-xs">{condition.confidence}%</span>
                          </div>
                          <div className="w-full bg-secondary h-1.5 rounded-full">
                            <div 
                              className={cn(
                                "h-full rounded-full",
                                condition.confidence > 75 ? "bg-red-500" :
                                condition.confidence > 50 ? "bg-yellow-500" :
                                "bg-green-500"
                              )}
                              style={{ width: `${condition.confidence}%` }}
                            />
                          </div>
                          <p className="text-xs mt-1 text-muted-foreground">{condition.description}</p>
                        </div>
                      </DropdownMenuItem>
                    ))}
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
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="container py-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI Symptom Checker</h1>
            <p className="text-sm text-muted-foreground">
              Describe your symptoms for AI-powered health assessment
            </p>
          </div>
          {isAIServiceAvailable && aiModelInfo && (
            <Badge className="bg-health-green text-white">
              <Brain className="mr-1 h-4 w-4" />
              Powered by {aiModelInfo}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pt-4 pb-0">
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </div>
      
      <div className="border-t p-4">
        <div className="container max-w-4xl">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleListening}
              className={isListening ? "bg-red-100 text-red-500 border-red-200" : ""}
            >
              {isListening ? <MicOff /> : <Mic />}
            </Button>
            
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your symptoms (e.g., 'I have a headache and fever for 2 days')"
                className="pr-20"
                disabled={messages.some(m => m.isLoading)}
              />
              <Button
                className="absolute right-1 top-1 h-8"
                size="sm"
                onClick={sendMessage}
                disabled={!inputValue.trim() || messages.some(m => m.isLoading)}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-2 text-xs text-center text-muted-foreground flex items-center justify-center">
            <HelpCircle className="h-3 w-3 mr-1" />
            <span>For better results, include age, symptom duration, and severity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
