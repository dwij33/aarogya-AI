import { toast } from "@/components/ui/use-toast";

export interface SymptomAnalysisOptions {
  age?: number;
}

interface HealthCheckResponse {
  aiServiceAvailable: boolean;
  modelVersion?: string;
}

export interface SymptomAnalysisResult {
  success: boolean;
  modelUsed: string;
  results: {
    condition: string;
    confidence: number;
    description: string;
    recommendations: string[];
    urgency: "high" | "medium" | "low";
  }[];
}

export class SymptomDetectionService {
  /**
   * Analyzes the provided symptoms using AI models
   */
  static async analyzeSymptoms(
    symptoms: string,
    options?: SymptomAnalysisOptions
  ): Promise<SymptomAnalysisResult> {
    console.log("Analyzing symptoms:", symptoms);
    console.log("Options:", options);

    try {
      // Simulate AI processing time (500-3000ms)
      const processingTime = Math.floor(Math.random() * 2500) + 500;
      await new Promise((resolve) => setTimeout(resolve, processingTime));

      // Generate AI analysis based on symptoms
      const result = generateAISymptomAnalysis(symptoms, options?.age);
      
      return {
        success: true,
        modelUsed: "ArogyaGPT 1.2",
        results: result
      };
    } catch (error) {
      console.error("Error in symptom analysis:", error);
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description: "Using fallback analysis. AI service unavailable.",
      });

      // Provide fallback analysis
      return {
        success: false,
        modelUsed: "Fallback Model",
        results: getFallbackAnalysis(symptoms)
      };
    }
  }

  /**
   * Checks the health of the AI service
   */
  static async checkHealth(): Promise<HealthCheckResponse> {
    // Simulate a health check response
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const isAvailable = Math.random() > 0.1; // 90% chance of being available
    
    return {
      aiServiceAvailable: isAvailable,
      modelVersion: isAvailable ? "ArogyaGPT 1.2" : undefined
    };
  }
}

/**
 * Generates AI-based analysis of symptoms
 */
function generateAISymptomAnalysis(symptoms: string, age?: number): SymptomAnalysisResult["results"] {
  const lowerSymptoms = symptoms.toLowerCase();
  
  // Common condition patterns to match against
  const conditions = [
    // Respiratory conditions
    {
      keywords: ["cough", "fever", "congestion", "sore throat", "runny nose", "stuffy"],
      condition: "Common Cold",
      confidence: 85,
      description: "The common cold is a viral infection affecting the upper respiratory tract. It's usually harmless and resolves within 7-10 days.",
      recommendations: [
        "Rest and stay hydrated",
        "Take over-the-counter cold medications to relieve symptoms",
        "Use a humidifier to ease congestion",
        "Try saltwater gargles for sore throat"
      ],
      urgency: "low" as const
    },
    {
      keywords: ["cough", "fever", "chills", "shortness of breath", "chest pain", "phlegm"],
      condition: "Pneumonia",
      confidence: 75,
      description: "Pneumonia is an infection that inflames the air sacs in one or both lungs, which may fill with fluid. It can range from mild to life-threatening.",
      recommendations: [
        "Seek immediate medical attention",
        "Complete the full course of prescribed antibiotics if bacterial",
        "Rest and drink plenty of fluids",
        "Take fever reducers as recommended by your doctor"
      ],
      urgency: "high" as const
    },
    {
      keywords: ["wheezing", "cough", "shortness of breath", "chest tightness", "difficulty breathing"],
      condition: "Asthma",
      confidence: 80,
      description: "Asthma is a chronic condition affecting the airways, causing them to narrow and swell, producing extra mucus and making breathing difficult.",
      recommendations: [
        "Use prescribed inhalers as directed",
        "Avoid known triggers",
        "Follow your asthma action plan",
        "Consult your doctor if symptoms worsen"
      ],
      urgency: "medium" as const
    },
    // Gastrointestinal conditions
    {
      keywords: ["nausea", "vomiting", "diarrhea", "stomach pain", "stomach cramps", "abdominal"],
      condition: "Gastroenteritis",
      confidence: 82,
      description: "Gastroenteritis is an intestinal infection marked by diarrhea, abdominal cramps, nausea or vomiting, and sometimes fever. It's often called the stomach flu.",
      recommendations: [
        "Stay hydrated with clear fluids",
        "Eat bland, easy-to-digest foods",
        "Avoid dairy products, caffeine, and spicy foods",
        "Use over-the-counter medications for symptom relief as needed"
      ],
      urgency: "medium" as const
    },
    {
      keywords: ["heartburn", "chest pain", "regurgitation", "bitter taste", "acid", "burning"],
      condition: "Acid Reflux (GERD)",
      confidence: 78,
      description: "Gastroesophageal reflux disease (GERD) occurs when stomach acid frequently flows back into the esophagus, causing irritation and discomfort.",
      recommendations: [
        "Avoid trigger foods like spicy or fatty foods",
        "Don't lie down immediately after eating",
        "Elevate the head of your bed",
        "Consider over-the-counter antacids"
      ],
      urgency: "low" as const
    },
    // Neurological conditions
    {
      keywords: ["headache", "pain", "throbbing", "migraine", "light sensitivity", "noise sensitivity"],
      condition: "Migraine",
      confidence: 80,
      description: "Migraines are intense, debilitating headaches often accompanied by nausea, vomiting, and sensitivity to light and sound.",
      recommendations: [
        "Rest in a quiet, dark room",
        "Apply cold compresses to your forehead",
        "Take prescribed migraine medications early in the attack",
        "Try over-the-counter pain relievers like ibuprofen or acetaminophen"
      ],
      urgency: "low" as const
    },
    {
      keywords: ["fatigue", "tired", "exhaustion", "no energy", "weakness", "lethargy"],
      condition: "Chronic Fatigue Syndrome",
      confidence: 65,
      description: "Chronic fatigue syndrome (CFS) is characterized by extreme fatigue that can't be explained by an underlying medical condition. The fatigue worsens with physical or mental activity.",
      recommendations: [
        "Develop a consistent sleep routine",
        "Pace yourself and avoid overexertion",
        "Gradually increase activity levels",
        "Consider cognitive behavioral therapy"
      ],
      urgency: "low" as const
    },
    // Orthopedic conditions
    {
      keywords: ["joint pain", "swelling", "stiffness", "arthritis", "inflammation"],
      condition: "Osteoarthritis",
      confidence: 75,
      description: "Osteoarthritis is a degenerative joint disease that occurs when the protective cartilage that cushions the ends of your bones wears down over time, causing pain and stiffness.",
      recommendations: [
        "Try low-impact exercises like swimming or walking",
        "Use hot and cold therapy for pain relief",
        "Consider over-the-counter pain relievers",
        "Maintain a healthy weight to reduce stress on joints"
      ],
      urgency: "low" as const
    },
    // Dermatological conditions
    {
      keywords: ["rash", "itching", "skin", "hives", "bumps", "irritation"],
      condition: "Contact Dermatitis",
      confidence: 75,
      description: "Contact dermatitis is a red, itchy rash caused by direct contact with a substance or an allergic reaction. The rash isn't contagious or life-threatening, but it can be uncomfortable.",
      recommendations: [
        "Avoid the irritant or allergen",
        "Apply over-the-counter hydrocortisone cream",
        "Take antihistamines for itching",
        "Use cool, wet compresses to soothe skin"
      ],
      urgency: "low" as const
    },
    // Mental health
    {
      keywords: ["anxious", "anxiety", "worry", "stress", "panic", "fear"],
      condition: "Generalized Anxiety Disorder",
      confidence: 65,
      description: "Generalized Anxiety Disorder (GAD) involves persistent and excessive worry about various things that's difficult to control and interferes with daily activities.",
      recommendations: [
        "Practice relaxation techniques like deep breathing",
        "Engage in regular physical activity",
        "Consider cognitive behavioral therapy",
        "Talk to your doctor about treatment options"
      ],
      urgency: "medium" as const
    },
    {
      keywords: ["sad", "depression", "hopeless", "loss of interest", "sleep problems", "appetite changes"],
      condition: "Depression",
      confidence: 68,
      description: "Depression is a mood disorder characterized by persistently low mood and a feeling of sadness and loss of interest. It affects how you feel, think and behave.",
      recommendations: [
        "Reach out to a mental health professional",
        "Stay connected with supportive friends and family",
        "Establish a routine and set small goals",
        "Consider therapy and/or medication options"
      ],
      urgency: "medium" as const
    },
    // AIDS/HIV
    {
      keywords: ["weight loss", "night sweats", "fever", "fatigue", "swollen lymph nodes", "hiv", "aids"],
      condition: "HIV/AIDS",
      confidence: 60,
      description: "HIV (Human Immunodeficiency Virus) attacks the body's immune system. If not treated, it can lead to AIDS (Acquired Immunodeficiency Syndrome), which severely compromises the immune system's ability to fight infections.",
      recommendations: [
        "Get tested for HIV immediately",
        "Consult with an infectious disease specialist",
        "Start antiretroviral therapy if diagnosed",
        "Practice safe sex and other preventive measures"
      ],
      urgency: "high" as const
    },
    // Cancer (various types)
    {
      keywords: ["lump", "breast", "breast pain", "nipple discharge", "breast changes"],
      condition: "Possible Breast Cancer",
      confidence: 55,
      description: "Breast cancer is a disease in which cells in the breast grow out of control. It can occur in both men and women, but is much more common in women.",
      recommendations: [
        "Schedule a mammogram and clinical breast exam immediately",
        "Consult with a healthcare provider about any breast changes",
        "Discuss family history and risk factors with your doctor",
        "Consider genetic counseling if you have family history"
      ],
      urgency: "high" as const
    },
    {
      keywords: ["blood in stool", "change in bowel habits", "rectal bleeding", "abdominal pain", "unexplained weight loss", "colon", "colorectal"],
      condition: "Possible Colorectal Cancer",
      confidence: 58,
      description: "Colorectal cancer starts in the colon or rectum. It typically begins as small, noncancerous clumps of cells called polyps that form on the inside of the colon and can become cancerous over time.",
      recommendations: [
        "Schedule a colonoscopy as soon as possible",
        "Consult with a gastroenterologist",
        "Don't ignore changes in bowel habits or blood in stool",
        "Discuss screening options based on your age and risk factors"
      ],
      urgency: "high" as const
    },
    {
      keywords: ["coughing up blood", "persistent cough", "chest pain", "shortness of breath", "wheezing", "unexplained weight loss", "lung"],
      condition: "Possible Lung Cancer",
      confidence: 56,
      description: "Lung cancer is a type of cancer that begins in the lungs and most often occurs in people who smoke, though it can also occur in non-smokers.",
      recommendations: [
        "See a pulmonologist immediately",
        "Get a chest X-ray or CT scan",
        "If you smoke, talk to your doctor about quitting",
        "Avoid secondhand smoke and other lung irritants"
      ],
      urgency: "high" as const
    },
    {
      keywords: ["changing mole", "new mole", "skin cancer", "melanoma", "dark spot", "asymmetrical mole", "itchy mole"],
      condition: "Possible Skin Cancer/Melanoma",
      confidence: 57,
      description: "Melanoma is the most serious type of skin cancer that develops in the cells that produce melanin. It can form in your eyes and, rarely, inside your body.",
      recommendations: [
        "See a dermatologist immediately for skin examination",
        "Document any changes in moles with photos",
        "Use sun protection and avoid tanning beds",
        "Learn the ABCDE rule for identifying suspicious moles"
      ],
      urgency: "high" as const
    },
    // Diabetes
    {
      keywords: ["excessive thirst", "frequent urination", "extreme hunger", "unexplained weight loss", "fatigue", "blurred vision", "diabetes"],
      condition: "Possible Diabetes",
      confidence: 75,
      description: "Diabetes is a chronic health condition that affects how your body turns food into energy, resulting in too much sugar in your bloodstream.",
      recommendations: [
        "Schedule a fasting blood glucose test",
        "Monitor your carbohydrate intake",
        "Maintain a healthy weight through diet and exercise",
        "Consult with an endocrinologist if diagnosed"
      ],
      urgency: "medium" as const
    },
    // Heart Diseases
    {
      keywords: ["chest pain", "pressure", "discomfort", "shortness of breath", "pain radiating arm", "heart attack", "indigestion", "nausea", "cold sweat"],
      condition: "Possible Heart Attack",
      confidence: 85,
      description: "A heart attack occurs when blood flow to the heart is severely reduced or blocked, causing damage to the heart muscle.",
      recommendations: [
        "Call emergency services immediately (911)",
        "Chew aspirin if advised by medical professionals",
        "Sit or lay down to reduce stress on the heart",
        "Track the time symptoms began"
      ],
      urgency: "high" as const
    },
    {
      keywords: ["palpitations", "fluttering", "racing heartbeat", "irregular heartbeat", "chest discomfort", "shortness of breath", "lightheaded"],
      condition: "Possible Arrhythmia",
      confidence: 70,
      description: "An arrhythmia is an irregular heartbeat that may make your heart beat too quickly, too slowly, or with an irregular pattern.",
      recommendations: [
        "Consult with a cardiologist",
        "Consider wearing a heart monitor",
        "Avoid caffeine and stimulants",
        "Record when episodes occur and what triggers them"
      ],
      urgency: "medium" as const
    },
    // Stroke
    {
      keywords: ["sudden numbness", "facial drooping", "arm weakness", "speech difficulty", "confusion", "trouble seeing", "trouble walking", "severe headache", "stroke"],
      condition: "Possible Stroke",
      confidence: 90,
      description: "A stroke occurs when the blood supply to part of your brain is interrupted or reduced, preventing brain tissue from getting oxygen and nutrients.",
      recommendations: [
        "Call emergency services immediately (911)",
        "Note the time symptoms started",
        "Use the FAST method to check for signs: Face drooping, Arm weakness, Speech difficulty, Time to call 911",
        "Don't take aspirin or other medications unless directed by emergency personnel"
      ],
      urgency: "high" as const
    },
    // Alzheimer's Disease
    {
      keywords: ["memory loss", "confusion", "difficulty finding words", "getting lost", "forgetting names", "alzheimer", "dementia", "personality changes"],
      condition: "Possible Alzheimer's Disease",
      confidence: 65,
      description: "Alzheimer's disease is a progressive neurologic disorder that causes the brain to shrink and brain cells to die, leading to dementia symptoms that gradually worsen over time.",
      recommendations: [
        "Consult with a neurologist",
        "Schedule cognitive testing",
        "Consider support groups for patients and caregivers",
        "Develop a care plan with healthcare providers"
      ],
      urgency: "medium" as const
    },
    // Tuberculosis (TB)
    {
      keywords: ["persistent cough", "coughing up blood", "chest pain", "fatigue", "weight loss", "night sweats", "fever", "tuberculosis", "tb"],
      condition: "Possible Tuberculosis",
      confidence: 70,
      description: "Tuberculosis (TB) is a potentially serious infectious disease that mainly affects your lungs. It's caused by bacteria that spread from person to person through tiny droplets released into the air.",
      recommendations: [
        "Get tested for TB immediately",
        "Isolate yourself to prevent spreading infection",
        "Complete the full course of antibiotics if diagnosed",
        "Identify and inform close contacts who may need testing"
      ],
      urgency: "high" as const
    },
    // Malaria
    {
      keywords: ["fever", "chills", "sweating", "headache", "nausea", "vomiting", "muscle pain", "fatigue", "malaria", "mosquito", "travel"],
      condition: "Possible Malaria",
      confidence: 72,
      description: "Malaria is a serious disease caused by a parasite that is transmitted through the bite of infected mosquitoes. It's common in tropical regions and can be life-threatening if not treated promptly.",
      recommendations: [
        "See a doctor immediately for blood tests",
        "Inform your doctor about any recent travel to endemic areas",
        "Complete the full course of antimalarial medication if diagnosed",
        "Use mosquito nets and repellents to prevent future infection"
      ],
      urgency: "high" as const
    },
    // Hepatitis
    {
      keywords: ["yellow skin", "jaundice", "fatigue", "abdominal pain", "loss of appetite", "nausea", "vomiting", "dark urine", "hepatitis", "liver"],
      condition: "Possible Hepatitis",
      confidence: 75,
      description: "Hepatitis is inflammation of the liver tissue. It can be caused by viral infections, alcohol consumption, toxins, and certain medications, among other causes.",
      recommendations: [
        "Get blood tests for hepatitis viruses",
        "Avoid alcohol and medications that can harm the liver",
        "Maintain good hygiene and safe food practices",
        "Consult with a hepatologist or gastroenterologist"
      ],
      urgency: "high" as const
    }
  ];
  
  // Age-specific conditions
  const childConditions = [
    {
      keywords: ["rash", "fever", "sore throat", "red spots"],
      condition: "Hand, Foot, and Mouth Disease",
      confidence: 75,
      description: "Hand, foot, and mouth disease is a common viral infection that causes sores in the mouth and a rash on the hands and feet, primarily affecting children under 5 years old.",
      recommendations: [
        "Ensure your child drinks plenty of fluids",
        "Offer cold, soft foods that don't irritate mouth sores",
        "Use over-the-counter pain relievers as needed",
        "Keep your child home to prevent spreading the infection"
      ],
      urgency: "medium" as const
    },
    {
      keywords: ["ear pain", "fever", "irritability", "ear tugging", "difficulty sleeping"],
      condition: "Ear Infection",
      confidence: 82,
      description: "Ear infections occur when fluid builds up in the middle ear, causing inflammation and pain. They're especially common in children due to their smaller Eustachian tubes.",
      recommendations: [
        "Use over-the-counter pain relievers as directed",
        "Apply a warm compress to the affected ear",
        "See a pediatrician for proper diagnosis and treatment",
        "Complete the full course of antibiotics if prescribed"
      ],
      urgency: "medium" as const
    }
  ];
  
  const elderlyConditions = [
    {
      keywords: ["dizzy", "dizziness", "balance", "falling", "unsteady"],
      condition: "Vertigo",
      confidence: 78,
      description: "Vertigo is the sensation that you, or the environment around you, is moving or spinning, often causing balance problems that are more common in older adults.",
      recommendations: [
        "Sit or lie down immediately when feeling dizzy",
        "Avoid sudden changes in position",
        "Consider vestibular rehabilitation therapy",
        "Consult a doctor for proper diagnosis and treatment"
      ],
      urgency: "medium" as const
    },
    {
      keywords: ["memory", "forgetful", "confusion", "disorientation"],
      condition: "Mild Cognitive Impairment",
      confidence: 65,
      description: "Mild cognitive impairment (MCI) involves cognitive changes that are noticeable but not severe enough to interfere with daily life or independent function.",
      recommendations: [
        "Engage in regular mental activities",
        "Maintain social connections",
        "Follow a healthy diet and exercise routine",
        "Consult a specialist for proper evaluation"
      ],
      urgency: "medium" as const
    }
  ];
  
  // Add age-specific conditions based on detected age
  if (age !== undefined) {
    if (age < 18) {
      conditions.push(...childConditions);
    } else if (age > 65) {
      conditions.push(...elderlyConditions);
    }
  }
  
  // Match symptoms against conditions
  const matchedConditions = conditions
    .map(condition => {
      const matchCount = condition.keywords.filter(keyword => 
        lowerSymptoms.includes(keyword)
      ).length;
      
      const matchPercentage = matchCount / condition.keywords.length;
      
      // Adjust confidence based on match percentage
      const adjustedConfidence = Math.round(
        condition.confidence * (0.5 + matchPercentage * 0.5)
      );
      
      return {
        ...condition,
        confidence: matchCount > 0 ? adjustedConfidence : 0
      };
    })
    .filter(condition => condition.confidence > 0)
    .sort((a, b) => b.confidence - a.confidence);
  
  // Return top matches (up to 5)
  if (matchedConditions.length === 0) {
    // No matches found, return a generic response
    return [{
      condition: "Unspecified Symptoms",
      confidence: 30,
      description: "The symptoms described don't clearly match any specific condition in our database. This could be due to vague symptoms, a rare condition, or insufficient information.",
      recommendations: [
        "Provide more details about your symptoms",
        "Consider consulting with a healthcare provider",
        "Monitor your symptoms and note any changes",
        "Stay hydrated and rest"
      ],
      urgency: "medium" as const
    }];
  }
  
  return matchedConditions.slice(0, 5);
}

/**
 * Fallback function that provides basic symptom matching
 */
function getFallbackAnalysis(symptoms: string): SymptomAnalysisResult["results"] {
  const lowerSymptoms = symptoms.toLowerCase();
  
  // Very basic symptom matching
  if (lowerSymptoms.includes("headache")) {
    return [{
      condition: "Tension Headache",
      confidence: 60,
      description: "Tension headaches are the most common type of headache and are often described as a feeling of pressure or tightness across the forehead.",
      recommendations: [
        "Rest in a quiet, dark room",
        "Use over-the-counter pain relievers",
        "Apply a cold compress to your forehead",
        "Practice stress-reducing techniques"
      ],
      urgency: "low"
    }];
  } else if (lowerSymptoms.includes("cough") || lowerSymptoms.includes("fever")) {
    return [{
      condition: "Respiratory Infection",
      confidence: 55,
      description: "Respiratory infections can affect the sinuses, throat, airways, or lungs. Common symptoms include coughing, fever, and congestion.",
      recommendations: [
        "Rest and stay hydrated",
        "Use over-the-counter medications as needed",
        "Monitor your symptoms",
        "Consult a healthcare provider if symptoms worsen"
      ],
      urgency: "medium"
    }];
  } else if (lowerSymptoms.includes("stomach") || lowerSymptoms.includes("nausea")) {
    return [{
      condition: "Stomach Upset",
      confidence: 50,
      description: "Stomach upset can be caused by various factors including food poisoning, overeating, or digestive issues.",
      recommendations: [
        "Stay hydrated with clear fluids",
        "Eat small, bland meals",
        "Avoid spicy, fatty, or acidic foods",
        "Use over-the-counter antacids if needed"
      ],
      urgency: "low"
    }];
  } else {
    return [{
      condition: "General Malaise",
      confidence: 40,
      description: "A general feeling of discomfort, illness, or uneasiness whose exact cause is difficult to identify.",
      recommendations: [
        "Rest and stay hydrated",
        "Monitor your symptoms",
        "Maintain a healthy diet and sleep schedule",
        "Consult a healthcare provider if symptoms persist"
      ],
      urgency: "low"
    }];
  }
} 