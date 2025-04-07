
// Simple mood analysis model using natural language processing
// This is a simulated version; in a production environment, you'd integrate
// with a more sophisticated NLP model like HuggingFace's sentiment analysis

export interface MoodAnalysisResult {
  mood: number; // 0-1 scale, where 1 is very positive
  anxiety: number; // 0-1 scale, where 1 is highly anxious
  stress: number; // 0-1 scale, where 1 is highly stressed
  primaryEmotion: string; // The main detected emotion
  secondaryEmotions: string[]; // Secondary emotions detected
}

// Keywords for different emotional states
const POSITIVE_KEYWORDS = [
  "happy", "joy", "excited", "grateful", "thankful", "content", "peaceful", 
  "optimistic", "great", "good", "wonderful", "fantastic", "excellent", "amazing", 
  "blessed", "fortunate", "pleased", "glad", "enjoying", "positive"
];

const NEGATIVE_KEYWORDS = [
  "sad", "depressed", "unhappy", "miserable", "down", "low", "disappointed", 
  "upset", "heartbroken", "devastated", "hopeless", "gloomy", "dejected", "bad",
  "terrible", "awful", "horrible", "failed", "negative", "worst"
];

const ANXIETY_KEYWORDS = [
  "anxious", "worried", "nervous", "uneasy", "afraid", "fearful", "panicked", 
  "tense", "apprehensive", "dread", "panic", "terror", "phobia", "scared", 
  "frightened", "terrified", "concerned", "stressed", "overthinking", "restless",
  "insecure", "on edge", "uncomfortable"
];

const STRESS_KEYWORDS = [
  "stressed", "overwhelmed", "pressure", "burden", "workload", "deadline", 
  "exhausted", "tired", "drained", "burnout", "overworked", "fatigued", 
  "strain", "tense", "hassled", "frazzled", "busy", "hectic", "chaos", "rushed",
  "hurry", "time-pressure", "overloaded"
];

// Map emotions to categories for better labeling
const EMOTION_MAP: Record<string, string[]> = {
  "Happy": ["happy", "joy", "excited", "pleased", "glad", "enjoying"],
  "Grateful": ["grateful", "thankful", "blessed", "fortunate", "appreciative"],
  "Content": ["content", "peaceful", "satisfied", "calm", "relaxed"],
  "Optimistic": ["optimistic", "hopeful", "positive", "looking forward"],
  "Sad": ["sad", "unhappy", "down", "low", "disappointed", "upset", "heartbroken"],
  "Depressed": ["depressed", "hopeless", "gloomy", "dejected", "miserable"],
  "Anxious": ["anxious", "worried", "nervous", "uneasy", "apprehensive"],
  "Fearful": ["afraid", "fearful", "scared", "frightened", "terrified"],
  "Stressed": ["stressed", "overwhelmed", "pressure", "burden", "overworked"],
  "Exhausted": ["exhausted", "tired", "drained", "burnout", "fatigued"],
  "Angry": ["angry", "frustrated", "annoyed", "irritated", "mad"],
  "Confused": ["confused", "uncertain", "unsure", "lost", "perplexed"]
};

/**
 * Analyzes text to determine mood, anxiety, and stress levels
 */
export function analyzeUserMood(text: string): MoodAnalysisResult {
  const lowerText = text.toLowerCase();
  
  // Count keyword occurrences
  const positiveCount = countKeywords(lowerText, POSITIVE_KEYWORDS);
  const negativeCount = countKeywords(lowerText, NEGATIVE_KEYWORDS);
  const anxietyCount = countKeywords(lowerText, ANXIETY_KEYWORDS);
  const stressCount = countKeywords(lowerText, STRESS_KEYWORDS);
  
  // Calculate mood score (0-1)
  const totalSentimentWords = positiveCount + negativeCount;
  const moodScore = totalSentimentWords > 0 
    ? 0.5 + ((positiveCount - negativeCount) / (2 * totalSentimentWords))
    : 0.5;
  
  // Calculate anxiety score (0-1)
  const anxietyScore = calculateIntensityScore(anxietyCount, lowerText.length);
  
  // Calculate stress score (0-1)
  const stressScore = calculateIntensityScore(stressCount, lowerText.length);
  
  // Determine primary emotion
  const primaryEmotion = determinePrimaryEmotion(
    lowerText, 
    moodScore, 
    anxietyScore,
    stressScore
  );
  
  // Determine secondary emotions
  const secondaryEmotions = determineSecondaryEmotions(
    lowerText, 
    primaryEmotion
  );
  
  return {
    mood: moodScore,
    anxiety: anxietyScore,
    stress: stressScore,
    primaryEmotion,
    secondaryEmotions
  };
}

function countKeywords(text: string, keywords: string[]): number {
  return keywords.reduce((count, word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    const matches = text.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);
}

function calculateIntensityScore(keywordCount: number, textLength: number): number {
  // Normalize by text length to avoid bias from long texts
  const normalizedCount = keywordCount / (textLength / 100);
  
  // Convert to 0-1 scale with diminishing returns
  return Math.min(0.9, normalizedCount / 10);
}

function determinePrimaryEmotion(
  text: string, 
  moodScore: number, 
  anxietyScore: number,
  stressScore: number
): string {
  // Check highest intensity
  const scores = [
    { type: "mood", value: Math.abs(moodScore - 0.5) * 2 },
    { type: "anxiety", value: anxietyScore },
    { type: "stress", value: stressScore }
  ];
  
  scores.sort((a, b) => b.value - a.value);
  
  if (scores[0].type === "mood") {
    if (moodScore > 0.6) {
      // Positive emotions
      for (const [emotion, keywords] of Object.entries(EMOTION_MAP)) {
        if (["Happy", "Grateful", "Content", "Optimistic"].includes(emotion)) {
          if (keywords.some(word => text.includes(word))) {
            return emotion;
          }
        }
      }
      return "Happy"; // Default positive
    } else {
      // Negative emotions
      for (const [emotion, keywords] of Object.entries(EMOTION_MAP)) {
        if (["Sad", "Depressed"].includes(emotion)) {
          if (keywords.some(word => text.includes(word))) {
            return emotion;
          }
        }
      }
      return "Sad"; // Default negative
    }
  } else if (scores[0].type === "anxiety") {
    for (const [emotion, keywords] of Object.entries(EMOTION_MAP)) {
      if (["Anxious", "Fearful"].includes(emotion)) {
        if (keywords.some(word => text.includes(word))) {
          return emotion;
        }
      }
    }
    return "Anxious"; // Default anxiety
  } else {
    for (const [emotion, keywords] of Object.entries(EMOTION_MAP)) {
      if (["Stressed", "Exhausted"].includes(emotion)) {
        if (keywords.some(word => text.includes(word))) {
          return emotion;
        }
      }
    }
    return "Stressed"; // Default stress
  }
}

function determineSecondaryEmotions(text: string, primary: string): string[] {
  const secondaryEmotions: string[] = [];
  
  for (const [emotion, keywords] of Object.entries(EMOTION_MAP)) {
    if (emotion !== primary && keywords.some(word => text.includes(word))) {
      secondaryEmotions.push(emotion);
    }
    
    if (secondaryEmotions.length >= 2) break; // Get top 2 secondary emotions
  }
  
  return secondaryEmotions;
}
