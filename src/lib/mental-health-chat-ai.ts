import { MoodAnalysisResult } from "./mood-analyzer";

interface ExerciseRecommendation {
  title: string;
  description: string;
  duration: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  benefits: string[];
}

interface VideoRecommendation {
  title: string;
  creator: string;
  description: string;
  category: string;
  duration: string;
  tags: string[];
}

// Meditation exercises
const meditationExercises: ExerciseRecommendation[] = [
  {
    title: "5-Minute Breathing Meditation",
    description: "Focus on your breath, inhaling for 4 counts and exhaling for 6 counts. Notice the sensation of air entering and leaving your body.",
    duration: "5 minutes",
    difficulty: "easy",
    benefits: ["Reduces anxiety", "Improves focus", "Can be done anywhere"]
  },
  {
    title: "Body Scan Relaxation",
    description: "Starting from your toes and moving upward, focus your attention on each part of your body, relaxing each muscle group as you go.",
    duration: "10-15 minutes",
    difficulty: "moderate",
    benefits: ["Releases physical tension", "Improves mind-body connection", "Helps with insomnia"]
  },
  {
    title: "Loving-Kindness Meditation",
    description: "Focus on sending positive wishes first to yourself, then to loved ones, acquaintances, and eventually all beings. Repeat phrases like 'May I be happy, may I be healthy, may I be safe.'",
    duration: "15 minutes",
    difficulty: "moderate",
    benefits: ["Increases compassion", "Reduces negative emotions", "Improves social connection"]
  }
];

// Physical exercises for mental health
const physicalExercises: ExerciseRecommendation[] = [
  {
    title: "Morning Stretching Routine",
    description: "Gentle full-body stretches to release tension and wake up your body. Focus on neck, shoulders, back, and legs.",
    duration: "5-10 minutes",
    difficulty: "easy",
    benefits: ["Releases physical tension", "Improves circulation", "Increases energy"]
  },
  {
    title: "Mood-Boosting Walk",
    description: "A brisk walk outside, preferably in a natural setting like a park. Focus on your surroundings and try to notice five things you can see, four you can touch, three you can hear, two you can smell, and one you can taste.",
    duration: "20-30 minutes",
    difficulty: "easy",
    benefits: ["Releases endorphins", "Reduces rumination", "Connects you with nature"]
  },
  {
    title: "Stress-Relief Yoga Sequence",
    description: "A gentle yoga flow focusing on deep breathing and stress-relieving poses like child's pose, forward fold, and gentle twists.",
    duration: "15-20 minutes",
    difficulty: "moderate",
    benefits: ["Reduces cortisol levels", "Improves flexibility", "Calms the nervous system"]
  }
];

// Cognitive exercises
const cognitiveExercises: ExerciseRecommendation[] = [
  {
    title: "Thought Reframing Practice",
    description: "Identify a negative thought, write it down, challenge its accuracy, and reframe it in a more balanced way.",
    duration: "10 minutes",
    difficulty: "moderate",
    benefits: ["Reduces negative thinking", "Builds cognitive flexibility", "Improves mood"]
  },
  {
    title: "Gratitude Journal",
    description: "Write down three things you're grateful for today, no matter how small, and reflect on why they matter to you.",
    duration: "5 minutes",
    difficulty: "easy",
    benefits: ["Shifts focus to positive aspects", "Improves overall outlook", "Can be done anywhere"]
  },
  {
    title: "Worry Time Exercise",
    description: "Schedule a specific 15-minute period each day dedicated to worrying. Outside that time, delay worries by writing them down to address during your next worry time.",
    duration: "15 minutes",
    difficulty: "challenging",
    benefits: ["Contains worry to a specific time", "Reduces rumination", "Improves presence"]
  }
];

// Video recommendations
const videoRecommendations: VideoRecommendation[] = [
  {
    title: "How to Manage Depression Effectively",
    creator: "Dr. Emma Wilson",
    description: "Clinical psychologist Dr. Wilson explains evidence-based strategies for managing depression, including cognitive techniques and lifestyle changes.",
    category: "depression",
    duration: "15:42",
    tags: ["depression", "CBT", "self-care"]
  },
  {
    title: "Anxiety Relief: Guided Meditation for Immediate Calm",
    creator: "Mindful Living",
    description: "A gentle guided meditation specifically designed to reduce anxiety symptoms and bring a sense of calm during difficult moments.",
    category: "anxiety",
    duration: "12:18",
    tags: ["anxiety", "meditation", "relaxation"]
  },
  {
    title: "Understanding the Science of Stress",
    creator: "HealthScience Channel",
    description: "An informative explanation of how stress affects your body and brain, with practical tips for managing stress responses.",
    category: "stress",
    duration: "18:25",
    tags: ["stress", "science", "health"]
  },
  {
    title: "5-Minute Morning Yoga for Mental Clarity",
    creator: "Yoga with Sarah",
    description: "A quick morning yoga routine designed to start your day with mental clarity and positive energy.",
    category: "general",
    duration: "5:32",
    tags: ["yoga", "morning routine", "mental clarity"]
  },
  {
    title: "Breaking the Cycle of Negative Thoughts",
    creator: "Mind Matters",
    description: "Learn techniques to identify and break free from patterns of negative thinking that contribute to depression and anxiety.",
    category: "depression",
    duration: "22:15",
    tags: ["negative thoughts", "cognitive techniques", "depression"]
  },
  {
    title: "Sleep Better Tonight: Expert Tips",
    creator: "Sleep Science Academy",
    description: "Sleep specialist shares evidence-based strategies for improving sleep quality and addressing insomnia.",
    category: "sleep",
    duration: "16:47",
    tags: ["sleep", "insomnia", "relaxation"]
  }
];

// Response templates for different emotional states
const responseTemplates = {
  anxious: [
    "I notice you're feeling anxious right now. That's completely understandable, and I'm here to help you work through these feelings. Let's take a moment to focus on what might help you feel more grounded.",
    "Anxiety can be really challenging to deal with. I appreciate you sharing these feelings with me. Would it help to explore some calming techniques together?",
    "I hear that anxiety is present for you right now. Your feelings are valid, and it's important to acknowledge them. Let's think about some ways to help you find some relief."
  ],
  stressed: [
    "It sounds like you're under a lot of pressure right now. Stress can be overwhelming, but you don't have to face it alone. Let's think about ways to lighten this load.",
    "I can hear how stressed you're feeling. That's a lot to carry. What do you think would help you most right now - some relaxation techniques, problem-solving, or maybe just being heard?",
    "Stress can really take a toll on both your mind and body. I appreciate you sharing this with me. Let's explore some ways to help you find some relief and perspective."
  ],
  sad: [
    "I'm really sorry to hear you're feeling down. Sadness is a natural emotion, though it can be painful to experience. I'm here to listen and support you through this.",
    "It sounds like you're going through a difficult time. Thank you for trusting me with these feelings. Would it help to talk more about what's contributing to your sadness?",
    "I hear the sadness in what you're sharing, and I want you to know that it's okay to feel this way. These emotions are important messengers, and I'm here to help you understand what they might be telling you."
  ],
  depressed: [
    "What you're describing sounds like it might be depression. This is something many people experience, and while it can feel isolating, you're not alone in this. There are approaches that can help.",
    "Depression can make everything feel more difficult and drain the joy from things you used to enjoy. I'm truly sorry you're experiencing this. Would you like to explore some strategies that might help?",
    "Living with depression can be incredibly challenging. Thank you for being brave enough to share this. While I'm not a replacement for professional help, I can offer some support and resources."
  ],
  general: [
    "Thank you for sharing how you're feeling with me. Understanding our emotions is an important step toward mental wellbeing. How long have you been feeling this way?",
    "I appreciate you opening up about this. It takes courage to talk about our mental health. Is there anything specific that triggered these feelings, or have they been building over time?",
    "Thank you for trusting me with this. Would it be helpful to explore some mental wellness techniques together that might help with what you're experiencing?"
  ]
};

// Follow-up questions to create more conversational depth
const followUpQuestions = [
  "How long have you been feeling this way?",
  "Is there anything specific that might have triggered these feelings?",
  "On a scale of 1-10, how intense would you say these feelings are for you right now?",
  "Have you noticed any patterns in when these feelings come up?",
  "What's one small thing that has helped you feel better in the past when you felt this way?",
  "Have you spoken to anyone else about how you're feeling?",
  "What would feeling better look like for you right now?",
  "Are there any specific areas of your life where these feelings are most challenging?",
  "What kind of support do you think would be most helpful for you right now?"
];

/**
 * Generates a personalized, ChatGPT-like response based on the user's input and mood analysis
 */
export function generateAIResponse(userInput: string, moodAnalysis: MoodAnalysisResult): {
  message: string;
  exercises: ExerciseRecommendation[];
  videos: VideoRecommendation[];
} {
  // Identify the emotional state for tailored response
  let emotionalState = 'general';
  
  if (moodAnalysis.anxiety > 0.6) {
    emotionalState = 'anxious';
  } else if (moodAnalysis.stress > 0.6) {
    emotionalState = 'stressed';
  } else if (moodAnalysis.mood < 0.3) {
    emotionalState = moodAnalysis.primaryEmotion === 'Depressed' ? 'depressed' : 'sad';
  }
  
  // Select a response template based on emotional state
  const templates = responseTemplates[emotionalState as keyof typeof responseTemplates];
  const baseResponse = templates[Math.floor(Math.random() * templates.length)];
  
  // Add a follow-up question to encourage conversation
  const followUp = followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];
  
  // Personalize response using content from user input
  let personalizedResponse = baseResponse;
  
  // Extract topics from user input
  const userTopics = extractTopics(userInput);
  if (userTopics.length > 0) {
    personalizedResponse += ` I notice you mentioned ${userTopics.join(' and ')}. `;
  }
  
  // Add recommendations based on mood analysis
  let recommendationText = '';
  
  if (moodAnalysis.anxiety > 0.5) {
    recommendationText += " Anxiety can be challenging, but there are techniques that can help reduce these feelings in the moment. I've included some breathing exercises and resources below that many people find helpful for anxiety.";
  } else if (moodAnalysis.stress > 0.5) {
    recommendationText += " When dealing with stress, it's important to find healthy ways to manage it before it affects your wellbeing. I've shared some stress-reduction techniques and resources that might help.";
  } else if (moodAnalysis.mood < 0.4) {
    recommendationText += " When you're feeling down, small steps can make a difference. I've included some activities and resources below that are known to help improve mood gradually.";
  } else {
    recommendationText += " Taking care of your mental health is always important. I've shared some general wellbeing resources below that you might find useful.";
  }
  
  // Compile the full response
  const fullResponse = `${personalizedResponse}${recommendationText} ${followUp}`;
  
  // Select relevant exercises based on mood
  const selectedExercises = selectExercisesBasedOnMood(moodAnalysis);
  
  // Select relevant videos based on mood
  const selectedVideos = selectVideosBasedOnMood(moodAnalysis);
  
  return {
    message: fullResponse,
    exercises: selectedExercises,
    videos: selectedVideos
  };
}

/**
 * Extracts potential topics from user input to personalize responses
 */
function extractTopics(input: string): string[] {
  const topics = [];
  const lowerInput = input.toLowerCase();
  
  // Common life areas that might be mentioned
  const lifeAreas = [
    { term: 'work', synonyms: ['job', 'career', 'workplace', 'boss', 'colleague'] },
    { term: 'relationship', synonyms: ['partner', 'spouse', 'boyfriend', 'girlfriend', 'wife', 'husband', 'marriage'] },
    { term: 'family', synonyms: ['parent', 'child', 'mother', 'father', 'sibling', 'brother', 'sister'] },
    { term: 'health', synonyms: ['illness', 'sick', 'pain', 'doctor', 'hospital', 'condition'] },
    { term: 'financial', synonyms: ['money', 'debt', 'bills', 'finances', 'afford', 'expensive'] },
    { term: 'sleep', synonyms: ['insomnia', 'tired', 'exhausted', 'rest', 'fatigue'] }
  ];
  
  lifeAreas.forEach(area => {
    if (lowerInput.includes(area.term) || 
        area.synonyms.some(synonym => lowerInput.includes(synonym))) {
      topics.push(area.term);
    }
  });
  
  return topics;
}

/**
 * Selects relevant exercises based on the user's mood analysis
 */
function selectExercisesBasedOnMood(moodAnalysis: MoodAnalysisResult): ExerciseRecommendation[] {
  const selectedExercises: ExerciseRecommendation[] = [];
  
  // First, select a meditation exercise based on emotional state
  if (moodAnalysis.anxiety > 0.5) {
    // High anxiety - breathing meditation is good
    selectedExercises.push(meditationExercises[0]);
  } else if (moodAnalysis.mood < 0.4) {
    // Low mood - loving-kindness can help
    selectedExercises.push(meditationExercises[2]);
  } else {
    // General or stress - body scan is good
    selectedExercises.push(meditationExercises[1]);
  }
  
  // Next, add a physical exercise
  if (moodAnalysis.stress > 0.6) {
    // High stress - yoga can help
    selectedExercises.push(physicalExercises[2]);
  } else if (moodAnalysis.mood < 0.4) {
    // Low mood - walking in nature is good
    selectedExercises.push(physicalExercises[1]);
  } else {
    // General - morning stretching is accessible
    selectedExercises.push(physicalExercises[0]);
  }
  
  // Finally, add a cognitive exercise
  if (moodAnalysis.mood < 0.4) {
    // Low mood - gratitude journal can help
    selectedExercises.push(cognitiveExercises[1]);
  } else if (moodAnalysis.anxiety > 0.5) {
    // High anxiety - worry time exercise
    selectedExercises.push(cognitiveExercises[2]);
  } else {
    // General or stress - thought reframing
    selectedExercises.push(cognitiveExercises[0]);
  }
  
  return selectedExercises;
}

/**
 * Selects relevant videos based on the user's mood analysis
 */
function selectVideosBasedOnMood(moodAnalysis: MoodAnalysisResult): VideoRecommendation[] {
  const selectedVideos: VideoRecommendation[] = [];
  
  // Select primary video based on strongest emotional signature
  if (moodAnalysis.anxiety > 0.6) {
    // High anxiety
    selectedVideos.push(videoRecommendations.find(v => v.category === 'anxiety')!);
  } else if (moodAnalysis.stress > 0.6) {
    // High stress
    selectedVideos.push(videoRecommendations.find(v => v.category === 'stress')!);
  } else if (moodAnalysis.mood < 0.4) {
    // Low mood/depression
    selectedVideos.push(videoRecommendations.find(v => v.category === 'depression')!);
  } else {
    // General wellbeing
    selectedVideos.push(videoRecommendations.find(v => v.category === 'general')!);
  }
  
  // Add a secondary video that's different but might be helpful
  let secondaryCategory = '';
  
  if (moodAnalysis.primaryEmotion === 'Anxious' || moodAnalysis.primaryEmotion === 'Fearful') {
    secondaryCategory = 'sleep'; // Anxiety often affects sleep
  } else if (moodAnalysis.primaryEmotion === 'Stressed' || moodAnalysis.primaryEmotion === 'Exhausted') {
    secondaryCategory = 'general'; // Stress might benefit from general wellness
  } else {
    secondaryCategory = 'depression'; // For other states, depression resources can be widely applicable
  }
  
  const secondaryVideo = videoRecommendations.find(v => v.category === secondaryCategory);
  if (secondaryVideo && !selectedVideos.includes(secondaryVideo)) {
    selectedVideos.push(secondaryVideo);
  }
  
  return selectedVideos;
} 