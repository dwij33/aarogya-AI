
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { MoodAnalysisResult } from "@/lib/mood-analyzer";
import { RefreshCw, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AffirmationsProps {
  currentMood: MoodAnalysisResult | null;
}

interface Affirmation {
  text: string;
  category: string;
}

const affirmations: Affirmation[] = [
  // Self-Compassion
  { 
    text: "I treat myself with the same kindness I would offer a good friend.", 
    category: "self-compassion" 
  },
  { 
    text: "I am doing the best I can with the resources I have right now.", 
    category: "self-compassion" 
  },
  { 
    text: "It's okay to make mistakes. They help me learn and grow.", 
    category: "self-compassion" 
  },
  { 
    text: "I forgive myself for not having all the answers.", 
    category: "self-compassion" 
  },
  { 
    text: "My worth is not determined by my productivity.", 
    category: "self-compassion" 
  },
  
  // Strength
  { 
    text: "I have overcome challenges before, and I can do it again.", 
    category: "strength" 
  },
  { 
    text: "I am stronger than I think and braver than I believe.", 
    category: "strength" 
  },
  { 
    text: "Every experience I have is helping me develop resilience.", 
    category: "strength" 
  },
  { 
    text: "I can handle whatever comes my way today.", 
    category: "strength" 
  },
  { 
    text: "My strength is greater than any struggle.", 
    category: "strength" 
  },
  
  // Calm
  { 
    text: "I breathe in calm and breathe out tension.", 
    category: "calm" 
  },
  { 
    text: "I release what I cannot control.", 
    category: "calm" 
  },
  { 
    text: "This feeling is temporary. I will find peace again.", 
    category: "calm" 
  },
  { 
    text: "I am centered, peaceful, and grounded.", 
    category: "calm" 
  },
  { 
    text: "My mind is slowing down, and my body is relaxing.", 
    category: "calm" 
  },
  
  // Growth
  { 
    text: "I am constantly growing and evolving into my best self.", 
    category: "growth" 
  },
  { 
    text: "Every day is a fresh opportunity to learn something new.", 
    category: "growth" 
  },
  { 
    text: "I embrace change as a pathway to growth.", 
    category: "growth" 
  },
  { 
    text: "My potential to succeed is limitless.", 
    category: "growth" 
  },
  { 
    text: "I am becoming more confident and capable every day.", 
    category: "growth" 
  },
  
  // Joy
  { 
    text: "I give myself permission to enjoy this moment fully.", 
    category: "joy" 
  },
  { 
    text: "I attract positivity into my life by being positive.", 
    category: "joy" 
  },
  { 
    text: "There is beauty around me, and I choose to see it.", 
    category: "joy" 
  },
  { 
    text: "I deserve to experience joy and happiness.", 
    category: "joy" 
  },
  { 
    text: "My smile and positive attitude are contagious.", 
    category: "joy" 
  },
  
  // Self-Worth
  { 
    text: "I am enough exactly as I am.", 
    category: "self-worth" 
  },
  { 
    text: "My thoughts and feelings matter.", 
    category: "self-worth" 
  },
  { 
    text: "I honor my needs and take care of myself.", 
    category: "self-worth" 
  },
  { 
    text: "I am worthy of love and respect.", 
    category: "self-worth" 
  },
  { 
    text: "I trust myself and my inner wisdom.", 
    category: "self-worth" 
  }
];

export function Affirmations({ currentMood }: AffirmationsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation | null>(null);
  const [favoriteAffirmations, setFavoriteAffirmations] = useState<Affirmation[]>([]);
  const { toast } = useToast();

  // Get recommended affirmation category based on mood
  function getRecommendedCategory(): string {
    if (!currentMood) return "self-compassion";
    
    if (currentMood.anxiety > 0.6) return "calm";
    if (currentMood.stress > 0.6) return "calm";
    if (currentMood.mood < 0.4) return "self-compassion";
    if (currentMood.mood > 0.7) return "joy";
    return "strength";
  }

  // Initialize with a random affirmation on load
  useEffect(() => {
    generateAffirmation();
    
    // Load favorites from localStorage
    try {
      const savedFavorites = localStorage.getItem("favoriteAffirmations");
      if (savedFavorites) {
        setFavoriteAffirmations(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error("Failed to load favorites:", error);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (favoriteAffirmations.length > 0) {
      try {
        localStorage.setItem("favoriteAffirmations", JSON.stringify(favoriteAffirmations));
      } catch (error) {
        console.error("Failed to save favorites:", error);
      }
    }
  }, [favoriteAffirmations]);

  // Generate a new random affirmation
  function generateAffirmation() {
    const filteredAffirmations = selectedCategory === "all" 
      ? affirmations
      : affirmations.filter(a => a.category === selectedCategory);
    
    if (filteredAffirmations.length === 0) {
      setCurrentAffirmation(null);
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * filteredAffirmations.length);
    setCurrentAffirmation(filteredAffirmations[randomIndex]);
  }

  // Copy affirmation to clipboard
  function copyToClipboard() {
    if (!currentAffirmation) return;
    
    navigator.clipboard.writeText(currentAffirmation.text)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Affirmation copied to clipboard."
        });
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Failed to copy",
          description: "Could not copy to clipboard."
        });
      });
  }

  // Add or remove affirmation from favorites
  function toggleFavorite() {
    if (!currentAffirmation) return;
    
    const isAlreadyFavorite = favoriteAffirmations.some(
      fav => fav.text === currentAffirmation.text
    );
    
    if (isAlreadyFavorite) {
      setFavoriteAffirmations(prevFavs => 
        prevFavs.filter(fav => fav.text !== currentAffirmation.text)
      );
      toast({
        title: "Removed from favorites",
        description: "Affirmation removed from your favorites."
      });
    } else {
      setFavoriteAffirmations(prevFavs => [...prevFavs, currentAffirmation]);
      toast({
        title: "Added to favorites",
        description: "Affirmation added to your favorites."
      });
    }
  }

  // Check if current affirmation is in favorites
  const isCurrentFavorite = currentAffirmation ? 
    favoriteAffirmations.some(fav => fav.text === currentAffirmation.text) : 
    false;

  // Category buttons with friendly labels
  const categoryButtons = [
    { id: "all", label: "All Affirmations" },
    { id: "self-compassion", label: "Self-Compassion" },
    { id: "strength", label: "Inner Strength" },
    { id: "calm", label: "Finding Calm" },
    { id: "growth", label: "Growth Mindset" },
    { id: "joy", label: "Joy & Gratitude" },
    { id: "self-worth", label: "Self-Worth" }
  ];

  return (
    <div className="space-y-8">
      {currentMood && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm">
              <span className="font-medium">Based on your current mood, we recommend: </span>
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm"
                onClick={() => setSelectedCategory(getRecommendedCategory())}
              >
                {categoryButtons.find(c => c.id === getRecommendedCategory())?.label || "Affirmations"}
              </Button>
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-2 justify-center">
        {categoryButtons.map(category => (
          <Button
            key={category.id}
            size="sm"
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label}
          </Button>
        ))}
      </div>

      <Card className="mx-auto max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle>Daily Affirmation</CardTitle>
          <CardDescription>
            Positive statements to promote mental wellbeing
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {currentAffirmation ? (
            <div className="text-center py-6 px-4">
              <blockquote className="text-xl md:text-2xl font-medium italic">
                "{currentAffirmation.text}"
              </blockquote>
              <p className="mt-4 text-sm text-muted-foreground capitalize">
                Category: {currentAffirmation.category.replace("-", " ")}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground py-6">
              No affirmations available for the selected category.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center space-x-2">
          <Button variant="outline" onClick={generateAffirmation}>
            <RefreshCw className="mr-2 h-4 w-4" /> New Affirmation
          </Button>
          {currentAffirmation && (
            <>
              <Button variant="outline" onClick={copyToClipboard}>
                <Copy className="mr-2 h-4 w-4" /> Copy
              </Button>
              <Button 
                variant="outline" 
                onClick={toggleFavorite}
                className={cn(
                  isCurrentFavorite 
                    ? "bg-primary/10 text-primary hover:bg-primary/20" 
                    : ""
                )}
              >
                {isCurrentFavorite ? (
                  <>
                    <ThumbsUp className="mr-2 h-4 w-4 fill-current" /> Favorited
                  </>
                ) : (
                  <>
                    <ThumbsUp className="mr-2 h-4 w-4" /> Favorite
                  </>
                )}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      {favoriteAffirmations.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Your Favorite Affirmations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favoriteAffirmations.map((affirmation, index) => (
              <Card key={index} className="bg-secondary/30">
                <CardContent className="p-4">
                  <blockquote className="text-base italic">
                    "{affirmation.text}"
                  </blockquote>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground capitalize">
                      {affirmation.category.replace("-", " ")}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setFavoriteAffirmations(prevFavs => 
                          prevFavs.filter(fav => fav.text !== affirmation.text)
                        );
                        toast({
                          title: "Removed from favorites",
                          description: "Affirmation removed from your favorites."
                        });
                      }}
                    >
                      <ThumbsDown size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="bg-secondary/30 rounded-lg p-6 mt-8">
        <h3 className="font-medium mb-3">Benefits of Daily Affirmations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">Mental Benefits</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Reduces negative thoughts</li>
              <li>• Builds self-confidence</li>
              <li>• Creates positive mindset</li>
              <li>• Reduces anxiety symptoms</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Emotional Benefits</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Promotes emotional resilience</li>
              <li>• Increases feelings of security</li>
              <li>• Enhances self-compassion</li>
              <li>• Cultivates optimism</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">How to Practice</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Repeat daily, preferably morning</li>
              <li>• Say them aloud for greater effect</li>
              <li>• Personalize to your needs</li>
              <li>• Write them down for reinforcement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
