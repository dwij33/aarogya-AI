
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { MoodAnalysisResult } from "@/lib/mood-analyzer";

interface JournalingPromptProps {
  currentMood: MoodAnalysisResult | null;
}

interface JournalEntry {
  id: string;
  date: Date;
  prompt: string;
  response: string;
}

// Prompts organized by emotional state
const journalPrompts: Record<string, string[]> = {
  positive: [
    "What are three things that made you happy today?",
    "Describe a recent moment that brought you joy or peace.",
    "What personal strengths helped you succeed today?",
    "List five things you're grateful for in this moment.",
    "How did you practice self-care or kindness today?",
    "What's something you're looking forward to, and why?",
    "Write about someone who made a positive impact on your life recently.",
    "What positive changes have you noticed in yourself lately?",
    "Describe a challenge you overcame that you're proud of.",
    "What boundaries did you successfully maintain today?"
  ],
  negative: [
    "What difficult emotions are you experiencing, and where do you feel them in your body?",
    "If your emotions could speak, what would they say right now?",
    "Write a letter to yourself from the perspective of a compassionate friend.",
    "What are you struggling with that you need to release?",
    "What negative thought patterns have you noticed today?",
    "List three things you can do to comfort yourself when feeling low.",
    "What does your inner critic say, and how can you respond with kindness?",
    "When did you last feel truly at peace? What elements of that can you recreate?",
    "What fears are holding you back right now?",
    "What would help you feel safer or more supported right now?"
  ],
  anxious: [
    "What specific worries are on your mind right now?",
    "What's the worst that could happen, and how could you handle it?",
    "List what's in your control and what isn't about your current situation.",
    "What grounding techniques help you when you feel anxious?",
    "Describe your anxiety as if it were a character. What does it want?",
    "What are three realistic outcomes to what you're worried about?",
    "What have you successfully overcome in the past that seemed overwhelming?",
    "What small step could you take toward addressing your concerns?",
    "What would you tell a friend who was experiencing this same anxiety?",
    "How might things look different in a week, month, or year from now?"
  ],
  stressed: [
    "What are the main sources of stress in your life right now?",
    "List three boundaries you could set to reduce your stress.",
    "What tasks could you delegate or eliminate from your schedule?",
    "What physical sensations are you noticing when you're stressed?",
    "What activities help you unwind and release tension?",
    "How have you successfully managed stress in the past?",
    "What would your ideal, stress-free day look like?",
    "What expectations (from yourself or others) might you need to adjust?",
    "Write about a stressful situation from a different perspective.",
    "What would you need to hear right now to feel calmer?"
  ],
  neutral: [
    "What are you noticing about yourself today?",
    "How would you like to feel by the end of the day?",
    "What's something new you'd like to learn or experience?",
    "Describe your ideal day. What elements could you incorporate into today?",
    "What values are most important to you, and how did you honor them today?",
    "What relationships in your life would you like to nurture?",
    "What habits would you like to develop or release?",
    "What would make today meaningful for you?",
    "What are you curious about right now?",
    "How can you practice more presence in your daily activities?"
  ]
};

export function JournalingPrompt({ currentMood }: JournalingPromptProps) {
  const [currentPrompt, setCurrentPrompt] = useState<string>(getRandomPrompt("neutral"));
  const [journalEntry, setJournalEntry] = useState("");
  const [savedEntries, setSavedEntries] = useState<JournalEntry[]>([]);
  const { toast } = useToast();

  // Determine which prompt category to use based on mood
  function getPromptCategory(): keyof typeof journalPrompts {
    if (!currentMood) return "neutral";
    
    if (currentMood.anxiety > 0.6) return "anxious";
    if (currentMood.stress > 0.6) return "stressed";
    if (currentMood.mood > 0.6) return "positive";
    if (currentMood.mood < 0.4) return "negative";
    return "neutral";
  }

  // Get random prompt from appropriate category
  function getRandomPrompt(category: keyof typeof journalPrompts): string {
    const prompts = journalPrompts[category];
    return prompts[Math.floor(Math.random() * prompts.length)];
  }

  // Generate a new prompt
  function generateNewPrompt() {
    const category = getPromptCategory();
    const newPrompt = getRandomPrompt(category);
    setCurrentPrompt(newPrompt);
    toast({
      description: "New journaling prompt generated."
    });
  }

  // Save the journal entry
  function saveEntry() {
    if (!journalEntry.trim()) {
      toast({
        variant: "destructive",
        title: "Cannot save empty entry",
        description: "Please write something before saving."
      });
      return;
    }
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date(),
      prompt: currentPrompt,
      response: journalEntry
    };
    
    setSavedEntries(prev => [newEntry, ...prev]);
    
    // Save to local storage
    try {
      const existingEntries = localStorage.getItem("journalEntries");
      const parsedEntries = existingEntries ? JSON.parse(existingEntries) : [];
      localStorage.setItem("journalEntries", JSON.stringify([newEntry, ...parsedEntries]));
    } catch (error) {
      console.error("Failed to save to local storage:", error);
    }
    
    // Clear the current entry and generate a new prompt
    setJournalEntry("");
    generateNewPrompt();
    
    toast({
      title: "Journal entry saved",
      description: "Your thoughts have been recorded in your journal."
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Journaling</CardTitle>
          <CardDescription>
            Reflect on your thoughts and feelings through guided prompts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 bg-primary/5 p-4 rounded-lg border border-primary/20">
            <h3 className="text-lg font-medium">{currentPrompt}</h3>
          </div>
          <Textarea
            placeholder="Start writing your thoughts here..."
            className="min-h-[200px] resize-none"
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={generateNewPrompt}>
            <RefreshCw className="mr-2 h-4 w-4" /> New Prompt
          </Button>
          <Button onClick={saveEntry} disabled={!journalEntry.trim()}>
            <Save className="mr-2 h-4 w-4" /> Save Entry
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Benefits of Journaling</CardTitle>
          <CardDescription>
            How writing helps your mental health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                ✓
              </span>
              <span>Reduces stress and anxiety</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                ✓
              </span>
              <span>Increases self-awareness</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                ✓
              </span>
              <span>Helps process difficult emotions</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                ✓
              </span>
              <span>Improves problem-solving skills</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                ✓
              </span>
              <span>Enhances gratitude practice</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                ✓
              </span>
              <span>Creates a record of growth over time</span>
            </li>
          </ul>

          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium mb-2">Journaling Tips</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Write without judgment or self-criticism</li>
              <li>• Set aside a regular time each day</li>
              <li>• Don't worry about perfect writing</li>
              <li>• Be honest with yourself</li>
              <li>• Review past entries to see patterns</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      {savedEntries.length > 0 && (
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Journal Entries</CardTitle>
            <CardDescription>
              Review your past reflections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedEntries.slice(0, 4).map((entry) => (
                <Card key={entry.id} className="bg-secondary/30">
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground mb-1">
                      {entry.date.toLocaleDateString()} at {entry.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-sm font-medium mb-2 italic">
                      "{entry.prompt}"
                    </div>
                    <p className="text-sm">
                      {entry.response.length > 150 
                        ? `${entry.response.substring(0, 150)}...` 
                        : entry.response}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
