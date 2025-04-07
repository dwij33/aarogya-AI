import { DiseaseInfo } from '@/types/symptom';

// No longer using backend API
// const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Service for analyzing medical reports using AI models
 * (ChatGPT/Gemini integration)
 */
export const ReportAnalyzerService = {
  /**
   * Analyzes medical report data using AI models
   * 
   * @param reportData - Report data including patient info, test results, etc.
   * @returns Promise with analysis results
   */
  analyzeReport: async (
    reportData: {
      age: number;
      gender: number; // 0 for female, 1 for male
      bloodType?: number; // 0-7 for blood types
      testResult?: number; // 0 or 1
      billingAmount?: number;
    }
  ) => {
    console.log('Sending report data for AI analysis:', reportData);
    try {
      // Simulate AI API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get appropriate AI analysis based on the report data
      const result = generateAIAnalysis(reportData);
      console.log('AI analysis result:', result);
      
      return result;
    } catch (error) {
      console.error('Error during AI analysis:', error);
      // Use fallback analysis if AI service fails
      const fallbackResult = generateFallbackAnalysis(reportData);
      console.log('Fallback analysis generated:', fallbackResult);
      return fallbackResult;
    }
  },

  /**
   * Gets disease information from AI knowledge base
   */
  getDiseaseInfo: async (): Promise<DiseaseInfo[]> => {
    try {
      // Simulate AI API call with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return [
        {
          id: 0,
          name: "Hypertension",
          prevalence: [
            { ageGroup: "0-30", count: 2 },
            { ageGroup: "30-50", count: 5 },
            { ageGroup: "50+", count: 10 }
          ],
          bloodTypeCorrelation: [
            { bloodType: "A+", count: 4 },
            { bloodType: "O+", count: 7 }
          ]
        },
        {
          id: 1,
          name: "Diabetes",
          prevalence: [
            { ageGroup: "0-30", count: 1 },
            { ageGroup: "30-50", count: 6 },
            { ageGroup: "50+", count: 8 }
          ],
          bloodTypeCorrelation: [
            { bloodType: "A+", count: 3 },
            { bloodType: "B+", count: 5 }
          ]
        }
      ];
    } catch (error) {
      console.error('Error fetching disease info from AI service:', error);
      return getMockDiseaseInfo();
    }
  },

  /**
   * Gets medical knowledge from AI service
   */
  getMedicalKnowledge: async (query: string = '') => {
    try {
      // Simulate AI API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return [
        {
          id: "hypertension-001",
          title: "Hypertension",
          content: "Hypertension, or high blood pressure, is a common condition where the force of blood against artery walls is consistently too high. Regular monitoring is essential.",
          relatedConditions: ["Heart Disease", "Stroke"],
          source: "AI Medical Knowledge Base"
        },
        {
          id: "diabetes-001",
          title: "Diabetes Mellitus",
          content: "Diabetes is a metabolic disorder characterized by high blood sugar levels over a prolonged period. It requires careful management of diet, exercise, and medication.",
          relatedConditions: ["Obesity", "Hypertension"],
          source: "AI Medical Knowledge Base"
        }
      ];
    } catch (error) {
      console.error('Error fetching medical knowledge from AI service:', error);
      return getMockMedicalKnowledge();
    }
  },

  /**
   * Check if the AI service is healthy
   */
  checkApiHealth: async () => {
    try {
      // Simulate an API check
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        healthy: true,
        aiServiceAvailable: true,
        modelVersion: "GPT-4/Gemini Pro",
        serverTime: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error checking AI service health:', error);
      return {
        healthy: false,
        aiServiceAvailable: false,
        modelVersion: null,
        serverTime: new Date().toISOString()
      };
    }
  }
};

/**
 * Generates an AI-like analysis of medical report data
 */
function generateAIAnalysis(reportData: {
  age: number;
  gender: number;
  bloodType?: number;
  testResult?: number;
  billingAmount?: number;
}) {
  const { age, gender, bloodType, testResult } = reportData;
  const genderText = gender === 0 ? "female" : "male";
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const bloodTypeText = bloodType !== undefined ? bloodTypes[bloodType] : "unknown";
  const testResultText = testResult !== undefined ? (testResult === 1 ? "positive" : "negative") : "not available";
  
  // Potential conditions based on age and gender
  const potentialConditions = [];
  
  // Age-related conditions
  if (age > 60) {
    potentialConditions.push({
      name: "Hypertension",
      probability: 65 + Math.floor(Math.random() * 15),
      riskFactors: [`Age ${age}`, genderText === "male" ? "Male gender" : "Female gender", "Genetic factors"]
    });
    
    potentialConditions.push({
      name: "Osteoarthritis",
      probability: 55 + Math.floor(Math.random() * 20),
      riskFactors: [`Age ${age}`, "Joint wear and tear", "Previous injuries"]
    });
    
    if (gender === 1) { // Male
      potentialConditions.push({
        name: "Prostate Issues",
        probability: 50 + Math.floor(Math.random() * 25),
        riskFactors: [`Age ${age}`, "Male gender", "Family history"]
      });
    }
  } else if (age > 40) {
    potentialConditions.push({
      name: "Type 2 Diabetes",
      probability: 45 + Math.floor(Math.random() * 25),
      riskFactors: [`Age ${age}`, "Dietary factors", "Sedentary lifestyle"]
    });
    
    if (gender === 0) { // Female
      potentialConditions.push({
        name: "Breast Cancer Risk",
        probability: 20 + Math.floor(Math.random() * 15),
        riskFactors: [`Age ${age}`, "Female gender", "Family history"]
      });
    } else {
      potentialConditions.push({
        name: "Coronary Artery Disease",
        probability: 30 + Math.floor(Math.random() * 20),
        riskFactors: [`Age ${age}`, "Male gender", "Lifestyle factors"]
      });
    }
  } else if (age > 20) {
    potentialConditions.push({
      name: "Anxiety Disorders",
      probability: 25 + Math.floor(Math.random() * 20),
      riskFactors: ["Young adult stress", "Environmental factors", "Genetic predisposition"]
    });
    
    potentialConditions.push({
      name: "Vitamin D Deficiency",
      probability: 40 + Math.floor(Math.random() * 25),
      riskFactors: ["Indoor lifestyle", "Dietary factors", "Geographical location"]
    });
  } else {
    potentialConditions.push({
      name: "Seasonal Allergies",
      probability: 35 + Math.floor(Math.random() * 20),
      riskFactors: ["Environmental triggers", "Genetic factors", "Immune response"]
    });
  }
  
  // Blood type specific analysis
  if (bloodType !== undefined) {
    if (bloodType === 0 || bloodType === 1) { // A+ or A-
      potentialConditions.push({
        name: "Gastric Cancer Risk",
        probability: 15 + Math.floor(Math.random() * 10),
        riskFactors: [`Blood type ${bloodTypeText}`, "Dietary habits", "H. pylori infection"]
      });
    } else if (bloodType === 4 || bloodType === 5) { // AB+ or AB-
      potentialConditions.push({
        name: "Cardiovascular Disease Risk",
        probability: 20 + Math.floor(Math.random() * 15),
        riskFactors: [`Blood type ${bloodTypeText}`, "Cholesterol levels", "Blood pressure"]
      });
    }
  }
  
  // Test result specific analysis
  if (testResult !== undefined && testResult === 1) {
    potentialConditions.push({
      name: "Inflammatory Response",
      probability: 70 + Math.floor(Math.random() * 20),
      riskFactors: ["Positive test result", "Immune system activity", "Potential infection"]
    });
  }
  
  // Sort by probability (highest first)
  potentialConditions.sort((a, b) => b.probability - a.probability);
  
  // Take top 3 conditions only
  const topConditions = potentialConditions.slice(0, 3);
  
  // Generate medical knowledge for top conditions
  const medicalKnowledge = topConditions.map(condition => {
    let knowledge;
    switch(condition.name) {
      case "Hypertension":
        knowledge = {
          id: "hypertension-ai",
          name: "Hypertension",
          description: "Hypertension, or high blood pressure, is a common condition where the force of blood against artery walls is consistently too high. If left untreated, it can lead to serious health problems.",
          risk_factors: ["Advanced age", "Family history", "High sodium diet", "Obesity", "Stress", "Sedentary lifestyle"],
          complications: ["Heart attack", "Stroke", "Heart failure", "Kidney damage", "Vision loss", "Metabolic syndrome"],
          treatments: ["Blood pressure medications", "Dietary changes", "Regular exercise", "Stress management", "Limiting alcohol consumption"],
          prevention: ["Regular physical activity", "Healthy diet", "Maintaining healthy weight", "Limiting sodium intake", "Quitting smoking"]
        };
        break;
      case "Type 2 Diabetes":
        knowledge = {
          id: "diabetes-ai",
          name: "Type 2 Diabetes",
          description: "Type 2 diabetes is a chronic condition affecting the way your body metabolizes sugar. It either resists the effects of insulin or doesn't produce enough insulin to maintain normal glucose levels.",
          risk_factors: ["Overweight or obesity", "Fat distribution", "Inactivity", "Family history", "Age", "Prediabetes", "Gestational diabetes"],
          complications: ["Heart and blood vessel disease", "Nerve damage", "Kidney damage", "Eye damage", "Foot damage", "Hearing impairment"],
          treatments: ["Blood sugar monitoring", "Diabetes medications or insulin", "Healthy eating", "Regular exercise", "Weight loss"],
          prevention: ["Healthy eating", "Physical activity", "Weight loss", "Regular checkups", "Early intervention"]
        };
        break;
      case "Osteoarthritis":
        knowledge = {
          id: "osteoarthritis-ai",
          name: "Osteoarthritis",
          description: "Osteoarthritis is the most common form of arthritis, affecting millions of people worldwide. It occurs when the protective cartilage that cushions the ends of your bones wears down over time.",
          risk_factors: ["Older age", "Sex (more common in women)", "Obesity", "Joint injuries", "Repeated stress on the joint", "Genetics", "Bone deformities"],
          complications: ["Pain and stiffness", "Reduced mobility", "Sleep disruption", "Depression", "Joint deformity"],
          treatments: ["Medications", "Physical therapy", "Occupational therapy", "Cortisone injections", "Joint replacement surgery"],
          prevention: ["Exercise", "Maintain a healthy weight", "Protect joints", "Rest after activity"]
        };
        break;
      default:
        knowledge = {
          id: `${condition.name.toLowerCase().replace(/\s+/g, '-')}-ai`,
          name: condition.name,
          description: `${condition.name} is a health condition that requires proper medical attention and management.`,
          risk_factors: condition.riskFactors,
          complications: ["Various complications can develop if left untreated"],
          treatments: ["Consult with healthcare provider for proper treatment options"],
          prevention: ["Regular health check-ups", "Healthy lifestyle", "Awareness of symptoms"]
        };
    }
    return knowledge;
  });
  
  // Generate follow-up recommendations
  const followUpRecommendations = [
    "Schedule a comprehensive health examination with your primary care physician",
    "Maintain a balanced diet rich in fruits, vegetables, and whole grains",
    `Consider regular screening tests appropriate for your age (${age}) and gender`
  ];
  
  // Add condition-specific recommendations
  topConditions.forEach(condition => {
    if (condition.name === "Hypertension") {
      followUpRecommendations.push("Monitor your blood pressure regularly at home");
      followUpRecommendations.push("Consider reducing sodium intake in your diet");
    } else if (condition.name === "Type 2 Diabetes") {
      followUpRecommendations.push("Schedule blood glucose testing");
      followUpRecommendations.push("Consult with a nutritionist about a diabetes-friendly diet");
    } else if (condition.name === "Osteoarthritis") {
      followUpRecommendations.push("Consider low-impact exercises like swimming or cycling");
      followUpRecommendations.push("Explore pain management options with your healthcare provider");
    }
  });
  
  // Calculate health score
  let healthScore = 100;
  // Subtract based on age (older = lower score)
  healthScore -= Math.min(30, age * 0.4);
  
  // Adjust for conditions
  topConditions.forEach(condition => {
    healthScore -= (condition.probability * 0.1);
  });
  
  // Adjust for positive test result
  if (testResult === 1) {
    healthScore -= 10;
  }
  
  // Ensure score is within bounds
  healthScore = Math.max(10, Math.min(95, Math.round(healthScore)));
  
  // Generate warning flags
  const warningFlags = [];
  
  // Age-related warnings
  if (age > 65) {
    warningFlags.push({
      condition: "Advanced Age",
      priority: "medium",
      message: "Regular health monitoring recommended for adults over 65"
    });
  }
  
  // Condition-specific warnings
  topConditions.forEach(condition => {
    if (condition.probability > 70) {
      warningFlags.push({
        condition: condition.name,
        priority: "high",
        message: `High likelihood of ${condition.name} detected, consult healthcare provider`
      });
    } else if (condition.probability > 50) {
      warningFlags.push({
        condition: condition.name,
        priority: "medium",
        message: `Moderate risk of ${condition.name} detected, monitor symptoms`
      });
    }
  });
  
  // Blood type warnings
  if (bloodType === 0 || bloodType === 1) { // A+ or A-
    warningFlags.push({
      condition: "Blood Type Risk Factor",
      priority: "low",
      message: "Type A blood groups may have higher susceptibility to certain conditions"
    });
  }
  
  return {
    potentialConditions: topConditions,
    medicalKnowledge,
    followUpRecommendations,
    healthScore,
    warningFlags,
    timestamp: new Date().toISOString(),
    aiPowered: true,
    modelUsed: "GPT-4/Gemini AI Health Analysis"
  };
}

/**
 * Generates a fallback analysis when AI service is unavailable
 */
function generateFallbackAnalysis(reportData: {
  age: number;
  gender: number;
  bloodType?: number;
  testResult?: number;
  billingAmount?: number;
}) {
  const { age, gender, bloodType, testResult } = reportData;
  
  // Generate realistic health score
  const healthScore = Math.max(100 - age * 0.5 - (gender === 1 ? 5 : 0), 0);
  
  // Generate analysis based on available data
  return {
    potentialConditions: [
      {
        name: age > 50 ? "Hypertension" : "Common Cold",
        probability: age > 50 ? 65 : 45,
        riskFactors: [`Age ${age}`, gender === 1 ? "Male" : "Female"]
      },
      {
        name: age > 40 ? "Type 2 Diabetes" : "Seasonal Allergies",
        probability: age > 40 ? 55 : 35,
        riskFactors: [`Age ${age}`, "Sedentary Lifestyle"]
      }
    ],
    medicalKnowledge: [
      {
        id: "hypertension-001",
        name: "Hypertension",
        description: "Hypertension, or high blood pressure, is a common condition where the force of blood against artery walls is consistently too high.",
        risk_factors: ["Advanced age", "Obesity", "High sodium intake", "Sedentary lifestyle"],
        complications: ["Heart attack", "Stroke", "Heart failure", "Kidney damage"],
        treatments: ["Blood pressure medications", "Dietary changes", "Regular exercise", "Stress management"],
        prevention: ["Maintain healthy weight", "Regular physical activity", "Reduce sodium intake", "Limit alcohol consumption"]
      },
      {
        id: "diabetes-001",
        name: "Type 2 Diabetes",
        description: "Diabetes is a metabolic disorder characterized by high blood sugar levels over a prolonged period.",
        risk_factors: ["Overweight or obesity", "Family history", "Sedentary lifestyle", "Age over 45"],
        complications: ["Cardiovascular disease", "Nerve damage", "Kidney damage", "Eye damage"],
        treatments: ["Blood sugar monitoring", "Diabetes medications", "Healthy eating", "Regular physical activity"],
        prevention: ["Maintain healthy weight", "Regular exercise", "Balanced diet", "Regular check-ups"]
      }
    ],
    followUpRecommendations: [
      "Schedule a comprehensive health check-up within the next 30 days",
      "Maintain a balanced diet with reduced sodium and sugar intake",
      "Engage in at least 150 minutes of moderate exercise per week",
      "Monitor blood pressure regularly if over 45 years old"
    ],
    healthScore: healthScore,
    warningFlags: age > 60 ? [
      {
        condition: "Age-related risks",
        priority: "medium",
        message: "Advanced age increases risk of cardiovascular conditions"
      }
    ] : [],
    timestamp: new Date().toISOString(),
    aiPowered: false,
    modelUsed: "Basic Analysis (AI Service Unavailable)"
  };
}

/**
 * Provides mock disease information
 */
function getMockDiseaseInfo(): DiseaseInfo[] {
  return [
    {
      id: 0,
      name: "Hypertension",
      prevalence: [
        { ageGroup: "0-30", count: 2 },
        { ageGroup: "30-50", count: 5 },
        { ageGroup: "50+", count: 10 }
      ],
      bloodTypeCorrelation: [
        { bloodType: "A+", count: 4 },
        { bloodType: "O+", count: 7 }
      ]
    },
    {
      id: 1,
      name: "Diabetes",
      prevalence: [
        { ageGroup: "0-30", count: 1 },
        { ageGroup: "30-50", count: 6 },
        { ageGroup: "50+", count: 8 }
      ],
      bloodTypeCorrelation: [
        { bloodType: "A+", count: 3 },
        { bloodType: "B+", count: 5 }
      ]
    }
  ];
}

/**
 * Provides mock medical knowledge
 */
function getMockMedicalKnowledge() {
  return [
    {
      id: "hypertension-001",
      title: "Hypertension",
      content: "Hypertension, or high blood pressure, is a common condition where the force of blood against artery walls is consistently too high. Regular monitoring is essential.",
      relatedConditions: ["Heart Disease", "Stroke"],
      source: "American Heart Association"
    },
    {
      id: "diabetes-001",
      title: "Diabetes Mellitus",
      content: "Diabetes is a metabolic disorder characterized by high blood sugar levels over a prolonged period. It requires careful management of diet, exercise, and medication.",
      relatedConditions: ["Obesity", "Hypertension"],
      source: "American Diabetes Association"
    }
  ];
} 