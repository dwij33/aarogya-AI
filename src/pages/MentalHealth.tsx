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
  Bot 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const MentalHealth = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Mental Health Support | ArogyaAI+";
    
    setMessages([
      {
        id: "welcome",
        content: "Hello! I'm your mental health support assistant. I'm here to listen and provide guidance. How are you feeling today?",
        sender: "ai",
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      
      setTimeout(() => {
        setIsListening(false);
        setInput("I've been feeling anxious lately and having trouble sleeping.");
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
    
    setTimeout(() => {
      const responses = [
        "I understand that anxiety and sleep issues can be really challenging. Many people experience similar struggles. Have you noticed any specific triggers for your anxiety recently?",
        "I'm sorry to hear you're going through a difficult time. Anxiety and sleep problems often go hand in hand. Would you like to explore some relaxation techniques that might help?",
        "Thank you for sharing that with me. Trouble sleeping due to anxiety is common but can be really frustrating. Have you tried any coping strategies so far?",
        "It sounds like you're having a tough time right now. Anxiety can significantly impact our sleep quality. Would it help to talk about what might be causing these feelings?",
        "I appreciate you opening up about this. Sleep disruption is often connected to our mental state. Let's work together on some approaches that might help ease your anxiety."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage: Message = {
        id: generateId(),
        content: randomResponse,
        sender: "ai",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 2000);
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
        content: "Hello! I'm your mental health support assistant. I'm here to listen and provide guidance. How are you feeling today?",
        sender: "ai",
        timestamp: new Date()
      }
    ]);
    toast({
      title: "Chat Reset",
      description: "Your conversation has been reset. All previous messages have been cleared.",
    });
  };

  return (
    <div className="container py-8 px-4 md:px-6 max-w-5xl">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-3xl font-bold">Mental Health Support</h1>
        <p className="text-muted-foreground">
          Chat with our AI assistant for mental health support, guidance, and resources.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 shadow-md">
          <CardHeader className="border-b flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-health-blue-light text-health-blue-dark">
                  <Bot size={18} />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">Mental Health Assistant</CardTitle>
                <CardDescription>AI-powered support and guidance</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Online
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col h-[500px]">
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
                        <div className="h-2 w-2 bg-health-blue rounded-full animate-pulse"></div>
                        <div className="h-2 w-2 bg-health-blue rounded-full animate-pulse delay-150"></div>
                        <div className="h-2 w-2 bg-health-blue rounded-full animate-pulse delay-300"></div>
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
                placeholder="Type your message here..."
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

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Resources</CardTitle>
            <CardDescription>
              Support information and tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start" onClick={resetChat}>
                <RefreshCw size={16} className="mr-2" /> New Conversation
              </Button>
              
              <div className="border-t border-border pt-4">
                <h3 className="font-medium text-sm mb-2">Crisis Helplines</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="text-health-blue hover:underline flex items-center">
                      <span className="bg-health-blue-light text-health-blue-dark p-1 rounded-full mr-2">
                        <Phone size={12} />
                      </span>
                      National Helpline: 1800-599-0019
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-health-blue hover:underline flex items-center">
                      <span className="bg-health-blue-light text-health-blue-dark p-1 rounded-full mr-2">
                        <Phone size={12} />
                      </span>
                      Crisis Support: 9152987821
                    </a>
                  </li>
                </ul>
              </div>
              
              <div className="border-t border-border pt-4">
                <h3 className="font-medium text-sm mb-2">Self-Help Resources</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="text-health-blue hover:underline">
                      Breathing Exercises
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-health-blue hover:underline">
                      Mindfulness Techniques
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-health-blue hover:underline">
                      Sleep Improvement Guide
                    </a>
                  </li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 text-sm flex items-start space-x-2">
                <AlertCircle size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                <p className="text-yellow-800 dark:text-yellow-200">
                  This AI assistant is not a substitute for professional mental health treatment. If you're experiencing a crisis, please contact emergency services.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">Mental Health Support Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>How This AI Assistant Works</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Our mental health AI assistant uses natural language processing to provide supportive responses, resources, and coping strategies. It's designed to be a compassionate listener and guide.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="bg-health-green-light text-health-green rounded-full p-1 mr-2 mt-0.5">
                    <Check size={12} />
                  </div>
                  <span>Private and confidential conversations</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-health-green-light text-health-green rounded-full p-1 mr-2 mt-0.5">
                    <Check size={12} />
                  </div>
                  <span>Available 24/7 for immediate support</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-health-green-light text-health-green rounded-full p-1 mr-2 mt-0.5">
                    <Check size={12} />
                  </div>
                  <span>Evidence-based coping strategies</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>When to Seek Professional Help</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                While our AI can provide support, please seek professional help if you experience any of these symptoms:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="bg-health-red-light text-health-red rounded-full p-1 mr-2 mt-0.5">
                    <AlertTriangle size={12} />
                  </div>
                  <span>Thoughts of harming yourself or others</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-health-red-light text-health-red rounded-full p-1 mr-2 mt-0.5">
                    <AlertTriangle size={12} />
                  </div>
                  <span>Persistent feelings of hopelessness</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-health-red-light text-health-red rounded-full p-1 mr-2 mt-0.5">
                    <AlertTriangle size={12} />
                  </div>
                  <span>Significant changes in sleep or appetite</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-health-red-light text-health-red rounded-full p-1 mr-2 mt-0.5">
                    <AlertTriangle size={12} />
                  </div>
                  <span>Inability to perform daily activities</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                After chatting with our AI assistant, consider these next steps for continued support:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="bg-health-blue-light text-health-blue rounded-full p-1 mr-2 mt-0.5">
                    <CalendarDays size={12} />
                  </div>
                  <span>Schedule a teleconsultation with a mental health professional</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-health-blue-light text-health-blue rounded-full p-1 mr-2 mt-0.5">
                    <BookOpen size={12} />
                  </div>
                  <span>Explore our library of mental health resources</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-health-blue-light text-health-blue rounded-full p-1 mr-2 mt-0.5">
                    <Users size={12} />
                  </div>
                  <span>Join our moderated support communities</span>
                </li>
              </ul>
              <Button className="mt-4 w-full">
                Find a Therapist
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

function CalendarDays(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}

function Phone(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function Check(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function BookOpen(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function Users(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default MentalHealth;
