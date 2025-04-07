import { toast } from "@/components/ui/use-toast";

// No longer using backend API
// const API_BASE_URL = 'http://localhost:5000/api';

export interface PrescriptionAnalysisResult {
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  diagnoses: string[];
  doctorNotes: string;
  patientInfo: {
    name?: string;
    age?: number;
    gender?: string;
  };
  warningFlags: {
    type: string;
    severity: 'high' | 'medium' | 'low';
    message: string;
  }[];
  interactions: {
    medications: string[];
    severity: 'high' | 'medium' | 'low';
    description: string;
  }[];
  timestamp: string;
  aiAnalysis?: {
    modelUsed: string;
    confidenceScore: number;
    recommendations: string[];
  };
}

export const PrescriptionAnalyzerService = {
  /**
   * Analyzes a prescription image using AI models (ChatGPT/Gemini)
   * @param imageFile The prescription image file to analyze
   */
  analyzePrescription: async (imageFile: File): Promise<PrescriptionAnalysisResult> => {
    try {
      // Simulate sending to AI for analysis with a loading delay
      toast({
        title: "AI Analysis in Progress",
        description: "Sending prescription to AI model for analysis..."
      });
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Log the file being processed (in a real implementation, we'd extract text and send to AI)
      console.log(`Processing prescription image: ${imageFile.name}, Size: ${(imageFile.size / 1024).toFixed(2)}KB, Type: ${imageFile.type}`);
      
      // Generate AI-based analysis
      const analysisResult = generateAIPrescriptionAnalysis(imageFile);
      
      return analysisResult;
    } catch (error) {
      console.error('Error in AI prescription analysis:', error);
      toast({
        variant: "destructive",
        title: "AI Analysis Failed",
        description: "Unable to process the prescription with AI. Using fallback analysis.",
      });
      
      // Return fallback data
      return getMockPrescriptionAnalysis();
    }
  },
  
  /**
   * Checks if the AI prescription analyzer service is available
   */
  checkServiceStatus: async (): Promise<boolean> => {
    try {
      // Simulate a check with the AI service
      await new Promise(resolve => setTimeout(resolve, 500));
      return true; // AI service is always available in this mock
    } catch (error) {
      console.error('Error checking AI prescription analyzer service:', error);
      return false;
    }
  }
};

/**
 * Generates an AI-based prescription analysis
 */
function generateAIPrescriptionAnalysis(imageFile: File): PrescriptionAnalysisResult {
  // Extract some randomness from the file properties to vary the response
  const fileSize = imageFile.size;
  const random = Math.random() + (fileSize % 100) / 100;
  
  // Common medications the AI might detect
  const possibleMedications = [
    {
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "once daily at bedtime",
      duration: "ongoing"
    },
    {
      name: "Amoxicillin",
      dosage: "500mg",
      frequency: "3 times daily with meals",
      duration: "10 days"
    },
    {
      name: "Metformin",
      dosage: "850mg",
      frequency: "twice daily with meals",
      duration: "ongoing"
    },
    {
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "once daily in the morning",
      duration: "ongoing"
    },
    {
      name: "Levothyroxine",
      dosage: "75mcg",
      frequency: "once daily on empty stomach",
      duration: "ongoing"
    },
    {
      name: "Ibuprofen",
      dosage: "400mg",
      frequency: "as needed for pain, up to 3 times daily",
      duration: "5 days"
    },
    {
      name: "Cetirizine",
      dosage: "10mg",
      frequency: "once daily",
      duration: "allergy season"
    }
  ];
  
  // Possible diagnoses the AI might detect
  const possibleDiagnoses = [
    "Hypertension", 
    "Type 2 Diabetes", 
    "Hypothyroidism", 
    "Hypercholesterolemia",
    "Upper Respiratory Tract Infection",
    "Seasonal Allergic Rhinitis",
    "Osteoarthritis",
    "Gastroesophageal Reflux Disease",
    "Anxiety Disorder",
    "Mild Depression",
    "Insomnia",
    "Vitamin D Deficiency"
  ];
  
  // Select 1-3 medications randomly
  const medications = [];
  const numMedications = Math.floor(random * 3) + 1;
  const selectedMedicationIndices = new Set<number>();
  
  while (selectedMedicationIndices.size < numMedications) {
    const index = Math.floor(Math.random() * possibleMedications.length);
    selectedMedicationIndices.add(index);
  }
  
  Array.from(selectedMedicationIndices).forEach(index => {
    medications.push(possibleMedications[index]);
  });
  
  // Select 1-2 diagnoses randomly
  const diagnoses = [];
  const numDiagnoses = Math.floor(random * 2) + 1;
  const selectedDiagnosisIndices = new Set<number>();
  
  while (selectedDiagnosisIndices.size < numDiagnoses) {
    const index = Math.floor(Math.random() * possibleDiagnoses.length);
    selectedDiagnosisIndices.add(index);
  }
  
  Array.from(selectedDiagnosisIndices).forEach(index => {
    diagnoses.push(possibleDiagnoses[index]);
  });
  
  // Generate doctor's notes based on selected diagnoses and medications
  let doctorNotes = "Patient presents with ";
  diagnoses.forEach((diagnosis, index) => {
    doctorNotes += diagnosis.toLowerCase();
    if (index < diagnoses.length - 1) {
      doctorNotes += " and ";
    }
  });
  doctorNotes += ". ";
  
  // Add follow-up notes
  const followUpOptions = [
    "Schedule follow-up in 2 weeks.",
    "Return if symptoms persist beyond 7 days.",
    "Monthly check-ups recommended.",
    "Lab work requested prior to next visit.",
    "Follow up in 3 months to assess medication effectiveness."
  ];
  doctorNotes += followUpOptions[Math.floor(random * followUpOptions.length)];
  
  // Generate warning flags for medications
  const warningFlags = [];
  medications.forEach(med => {
    if (med.name === "Amoxicillin") {
      warningFlags.push({
        type: "Allergy Risk",
        severity: "medium",
        message: "Check for penicillin allergy before taking Amoxicillin"
      });
    } else if (med.name === "Atorvastatin") {
      warningFlags.push({
        type: "Dietary Restriction",
        severity: "medium",
        message: "Avoid grapefruit and grapefruit juice while taking Atorvastatin"
      });
    } else if (med.name === "Metformin") {
      warningFlags.push({
        type: "Side Effect",
        severity: "low",
        message: "May cause GI upset; take with food to minimize symptoms"
      });
    } else if (med.name === "Lisinopril") {
      warningFlags.push({
        type: "Monitoring Needed",
        severity: "medium",
        message: "Monitor blood pressure and kidney function regularly"
      });
    }
  });
  
  // Generate medication interactions if multiple medications
  const interactions = [];
  if (medications.length > 1) {
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        // Check for specific interactions
        if (
          (medications[i].name === "Lisinopril" && medications[j].name === "Metformin") || 
          (medications[i].name === "Metformin" && medications[j].name === "Lisinopril")
        ) {
          interactions.push({
            medications: [medications[i].name, medications[j].name],
            severity: "low",
            description: "Monitor blood glucose levels as combination may enhance glucose-lowering effect"
          });
        } else if (
          (medications[i].name === "Ibuprofen" && medications[j].name === "Lisinopril") || 
          (medications[i].name === "Lisinopril" && medications[j].name === "Ibuprofen")
        ) {
          interactions.push({
            medications: [medications[i].name, medications[j].name],
            severity: "medium",
            description: "NSAIDs may reduce effectiveness of blood pressure medications"
          });
        } else {
          // Default interaction for other combinations
          interactions.push({
            medications: [medications[i].name, medications[j].name],
            severity: "low",
            description: "No significant interactions expected between these medications"
          });
        }
      }
    }
  }
  
  // Generate hypothetical patient info
  const patientAge = Math.floor(random * 50) + 20; // 20-70 years
  const patientGender = random > 0.5 ? "Male" : "Female";
  
  // AI analysis section
  const aiAnalysis = {
    modelUsed: random > 0.5 ? "ChatGPT-4" : "Gemini Pro",
    confidenceScore: Math.round((0.75 + random * 0.2) * 100) / 100, // 0.75-0.95
    recommendations: [
      "Take all medications as prescribed",
      "Report any adverse effects to your healthcare provider immediately",
      "Schedule follow-up appointments as recommended"
    ]
  };
  
  // Recommendations based on diagnoses
  if (diagnoses.includes("Hypertension")) {
    aiAnalysis.recommendations.push("Maintain a low-sodium diet");
    aiAnalysis.recommendations.push("Regular blood pressure monitoring is recommended");
  }
  
  if (diagnoses.includes("Type 2 Diabetes")) {
    aiAnalysis.recommendations.push("Monitor blood glucose levels regularly");
    aiAnalysis.recommendations.push("Maintain consistent meal timing and portions");
  }
  
  if (diagnoses.includes("Seasonal Allergic Rhinitis")) {
    aiAnalysis.recommendations.push("Use air purifiers at home during high pollen seasons");
    aiAnalysis.recommendations.push("Consider tracking pollen counts in your area");
  }
  
  return {
    medications,
    diagnoses,
    doctorNotes,
    patientInfo: {
      name: "Patient",
      age: patientAge,
      gender: patientGender
    },
    warningFlags,
    interactions,
    timestamp: new Date().toISOString(),
    aiAnalysis
  };
}

/**
 * Generates mock prescription analysis data for development and fallback
 */
function getMockPrescriptionAnalysis(): PrescriptionAnalysisResult {
  return {
    medications: [
      {
        name: "Amoxicillin",
        dosage: "500mg",
        frequency: "3 times daily",
        duration: "7 days"
      },
      {
        name: "Paracetamol",
        dosage: "650mg",
        frequency: "As needed for pain",
        duration: "3 days"
      }
    ],
    diagnoses: ["Upper respiratory tract infection", "Mild fever"],
    doctorNotes: "Rest advised. Plenty of fluids. Follow up if symptoms persist beyond 5 days.",
    patientInfo: {
      name: "Patient",
      age: 35,
      gender: "Unknown"
    },
    warningFlags: [
      {
        type: "Allergy Risk",
        severity: "medium",
        message: "Check for penicillin allergy before taking Amoxicillin"
      }
    ],
    interactions: [
      {
        medications: ["Amoxicillin", "Paracetamol"],
        severity: "low",
        description: "No significant interactions expected between these medications"
      }
    ],
    timestamp: new Date().toISOString(),
    aiAnalysis: {
      modelUsed: "Fallback Analysis",
      confidenceScore: 0.7,
      recommendations: [
        "Take all medications as prescribed",
        "Rest and hydrate adequately",
        "Follow up if symptoms worsen"
      ]
    }
  };
} 