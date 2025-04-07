/**
 * Mock Database Service
 * 
 * This service simulates the backend database operations without requiring a Python server.
 * It includes realistic medical data for demonstration purposes.
 */

// Add type definitions at the top of the file
interface DiseaseDetails {
  probability: number;
  factors: string[];
}

// Mock datastore data (similar to datastore1.csv)
const mockDatastore = [
  { 
    id: 1, 
    age: 22, 
    gender: 0, // Female 
    disease: 2, // Asthma
    bloodType: 0, // A+
    medication: 3,
    testResult: 1,
    ageBin: 0, // 0-30
    diseaseMedInteraction: 11,
    billingAmount: 1250.50
  },
  { 
    id: 2, 
    age: 60, 
    gender: 1, // Male
    disease: 1, // Diabetes
    bloodType: 7, // O-
    medication: 2,
    testResult: 0,
    ageBin: 2, // 50+
    diseaseMedInteraction: 8,
    billingAmount: 2450.75
  },
  { 
    id: 3, 
    age: 65, 
    gender: 1, // Male
    disease: 0, // Hypertension
    bloodType: 4, // AB+
    medication: 1,
    testResult: 1,
    ageBin: 2, // 50+
    diseaseMedInteraction: 3,
    billingAmount: 1875.25
  },
  { 
    id: 4, 
    age: 54, 
    gender: 0, // Female
    disease: 0, // Hypertension
    bloodType: 2, // B+
    medication: 1,
    testResult: 0,
    ageBin: 2, // 50+
    diseaseMedInteraction: 4,
    billingAmount: 1920.00
  },
  { 
    id: 5, 
    age: 64, 
    gender: 1, // Male
    disease: 1, // Diabetes
    bloodType: 1, // A-
    medication: 2,
    testResult: 1,
    ageBin: 2, // 50+
    diseaseMedInteraction: 9,
    billingAmount: 2180.50
  },
  { 
    id: 6, 
    age: 42, 
    gender: 0, // Female
    disease: 2, // Asthma
    bloodType: 6, // O+
    medication: 3,
    testResult: 0,
    ageBin: 1, // 30-50
    diseaseMedInteraction: 12,
    billingAmount: 1150.25
  },
  { 
    id: 7, 
    age: 35, 
    gender: 1, // Male
    disease: 3, // Arthritis
    bloodType: 0, // A+
    medication: 4,
    testResult: 1,
    ageBin: 1, // 30-50
    diseaseMedInteraction: 15,
    billingAmount: 975.50
  },
  { 
    id: 8, 
    age: 71, 
    gender: 0, // Female
    disease: 4, // Heart Disease
    bloodType: 2, // B+
    medication: 5,
    testResult: 1,
    ageBin: 2, // 50+
    diseaseMedInteraction: 20,
    billingAmount: 3250.75
  },
  { 
    id: 9, 
    age: 29, 
    gender: 1, // Male
    disease: 2, // Asthma
    bloodType: 6, // O+
    medication: 3,
    testResult: 0,
    ageBin: 0, // 0-30
    diseaseMedInteraction: 10,
    billingAmount: 850.25
  },
  { 
    id: 10, 
    age: 48, 
    gender: 0, // Female
    disease: 3, // Arthritis
    bloodType: 4, // AB+
    medication: 4,
    testResult: 1,
    ageBin: 1, // 30-50
    diseaseMedInteraction: 16,
    billingAmount: 1450.00
  },
  { 
    id: 11, 
    age: 58, 
    gender: 1, // Male
    disease: 0, // Hypertension
    bloodType: 1, // A-
    medication: 1,
    testResult: 1,
    ageBin: 2, // 50+
    diseaseMedInteraction: 5,
    billingAmount: 1350.25
  },
  { 
    id: 12, 
    age: 45, 
    gender: 0, // Female
    disease: 1, // Diabetes
    bloodType: 3, // B-
    medication: 2,
    testResult: 0,
    ageBin: 1, // 30-50
    diseaseMedInteraction: 7,
    billingAmount: 1725.50
  },
  { 
    id: 13, 
    age: 68, 
    gender: 1, // Male
    disease: 4, // Heart Disease
    bloodType: 5, // AB-
    medication: 5,
    testResult: 1,
    ageBin: 2, // 50+
    diseaseMedInteraction: 19,
    billingAmount: 2950.75
  },
  { 
    id: 14, 
    age: 33, 
    gender: 0, // Female
    disease: 2, // Asthma
    bloodType: 6, // O+
    medication: 3,
    testResult: 0,
    ageBin: 1, // 30-50
    diseaseMedInteraction: 13,
    billingAmount: 925.25
  },
  { 
    id: 15, 
    age: 52, 
    gender: 1, // Male
    disease: 3, // Arthritis
    bloodType: 2, // B+
    medication: 4,
    testResult: 1,
    ageBin: 2, // 50+
    diseaseMedInteraction: 17,
    billingAmount: 1575.50
  },
  { 
    id: 16, 
    age: 39, 
    gender: 0, // Female
    disease: 0, // Hypertension
    bloodType: 0, // A+
    medication: 1,
    testResult: 0,
    ageBin: 1, // 30-50
    diseaseMedInteraction: 2,
    billingAmount: 1150.00
  },
  { 
    id: 17, 
    age: 75, 
    gender: 1, // Male
    disease: 4, // Heart Disease
    bloodType: 7, // O-
    medication: 5,
    testResult: 1,
    ageBin: 2, // 50+
    diseaseMedInteraction: 21,
    billingAmount: 3450.25
  },
  { 
    id: 18, 
    age: 27, 
    gender: 0, // Female
    disease: 2, // Asthma
    bloodType: 3, // B-
    medication: 3,
    testResult: 0,
    ageBin: 0, // 0-30
    diseaseMedInteraction: 11,
    billingAmount: 825.75
  },
  { 
    id: 19, 
    age: 50, 
    gender: 1, // Male
    disease: 1, // Diabetes
    bloodType: 4, // AB+
    medication: 2,
    testResult: 1,
    ageBin: 1, // 30-50
    diseaseMedInteraction: 10,
    billingAmount: 1950.50
  },
  { 
    id: 20, 
    age: 62, 
    gender: 0, // Female
    disease: 3, // Arthritis
    bloodType: 5, // AB-
    medication: 4,
    testResult: 0,
    ageBin: 2, // 50+
    diseaseMedInteraction: 18,
    billingAmount: 1875.25
  }
];

// Mapping disease IDs to names
const diseaseMapping = {
  0: "Hypertension",
  1: "Diabetes",
  2: "Asthma",
  3: "Arthritis",
  4: "Heart Disease"
};

// Mapping blood type IDs to names
const bloodTypeMapping = {
  0: "A+", 1: "A-", 2: "B+", 3: "B-", 
  4: "AB+", 5: "AB-", 6: "O+", 7: "O-"
};

// Mapping age bin IDs to ranges
const ageBinMapping = {
  0: "0-30",
  1: "30-50",
  2: "50+"
};

// Medical knowledge database
const medicalKnowledgeDB = {
  hypertension: {
    id: "HTN-001",
    name: "Hypertension",
    description: "A chronic condition in which the blood pressure in the arteries is elevated.",
    risk_factors: ["Age over 50", "Family history", "High sodium diet", "Obesity", "Sedentary lifestyle"],
    complications: ["Heart disease", "Stroke", "Kidney damage", "Vision loss"],
    treatments: ["Lifestyle modifications", "Diuretics", "ACE inhibitors", "Beta blockers"],
    prevention: ["Regular exercise", "Healthy diet", "Sodium restriction", "Limiting alcohol", "Not smoking"]
  },
  diabetes: {
    id: "DM-001",
    name: "Diabetes Mellitus",
    description: "A metabolic disorder characterized by high blood sugar over a prolonged period.",
    risk_factors: ["Family history", "Obesity", "Physical inactivity", "Age over 45", "Gestational diabetes"],
    complications: ["Heart disease", "Kidney disease", "Neuropathy", "Retinopathy"],
    treatments: ["Insulin therapy", "Oral medications", "Diet management", "Regular exercise"],
    prevention: ["Weight management", "Regular physical activity", "Balanced diet"]
  },
  asthma: {
    id: "ASTH-001",
    name: "Asthma",
    description: "A chronic condition affecting the airways in the lungs, causing breathing difficulty.",
    risk_factors: ["Allergies", "Family history", "Respiratory infections", "Air pollution", "Smoking"],
    complications: ["Sleep disturbances", "Permanent airway remodeling", "Work/school absenteeism"],
    treatments: ["Bronchodilators", "Inhaled corticosteroids", "Leukotriene modifiers", "Immunotherapy"],
    prevention: ["Avoiding triggers", "Regular medication", "Allergy management"]
  },
  arthritis: {
    id: "ARTH-001",
    name: "Arthritis",
    description: "Inflammation of one or more joints, causing pain and stiffness.",
    risk_factors: ["Age over 65", "Female gender", "Previous joint injury", "Obesity", "Family history"],
    complications: ["Joint deformity", "Reduced mobility", "Chronic pain"],
    treatments: ["Physical therapy", "Anti-inflammatory medications", "Joint replacement", "Weight management"],
    prevention: ["Joint-friendly exercise", "Maintaining healthy weight", "Avoiding joint injuries"]
  },
  heart_disease: {
    id: "HD-001",
    name: "Heart Disease",
    description: "A range of conditions affecting heart function and structure.",
    risk_factors: ["Hypertension", "High cholesterol", "Smoking", "Diabetes", "Family history", "Age"],
    complications: ["Heart failure", "Arrhythmias", "Heart attack", "Sudden cardiac death"],
    treatments: ["Medications", "Lifestyle changes", "Surgical procedures", "Cardiac rehabilitation"],
    prevention: ["Regular exercise", "Heart-healthy diet", "Not smoking", "Stress management"]
  }
};

// Mock database service
export const MockDatabaseService = {
  // Check health status
  checkHealth: () => {
    return {
      status: "healthy",
      datastore_available: true,
      ml_libraries_available: false,
      server_time: new Date().toISOString()
    };
  },

  // Analyze symptoms
  analyzeSymptoms: (symptomsText, userInfo) => {
    const age = userInfo?.age || 30;
    const ageBin = age >= 50 ? 2 : (age >= 30 ? 1 : 0);
    
    // Extract potential diseases from the symptoms text
    const results = [];
    
    if (symptomsText.toLowerCase().includes("headache") || 
        symptomsText.toLowerCase().includes("dizzy") || 
        symptomsText.toLowerCase().includes("pressure")) {
      results.push({
        condition: "Hypertension",
        confidence: 85,
        description: "Your symptoms align with high blood pressure patterns",
        recommendations: [
          "Monitor blood pressure regularly",
          "Reduce sodium intake",
          "Consider consulting with a cardiologist"
        ]
      });
    }
    
    if (symptomsText.toLowerCase().includes("thirst") || 
        symptomsText.toLowerCase().includes("fatigue") || 
        symptomsText.toLowerCase().includes("urination")) {
      results.push({
        condition: "Diabetes",
        confidence: 75,
        description: "Your symptoms suggest possible diabetes",
        recommendations: [
          "Have your blood sugar levels checked",
          "Monitor your carbohydrate intake",
          "Consider consulting with an endocrinologist"
        ]
      });
    }
    
    if (symptomsText.toLowerCase().includes("breath") || 
        symptomsText.toLowerCase().includes("cough") || 
        symptomsText.toLowerCase().includes("wheez")) {
      results.push({
        condition: "Asthma",
        confidence: 80,
        description: "Your symptoms are consistent with asthma",
        recommendations: [
          "Avoid known triggers",
          "Use an inhaler if prescribed",
          "Consider consulting with a pulmonologist"
        ]
      });
    }
    
    return {
      results: results,
      datastore_enhanced: true,
      age_related_patterns: {
        ageBin: ageBinMapping[ageBin],
        common_conditions: mockDatastore
          .filter(item => item.ageBin === ageBin)
          .reduce((acc, curr) => {
            const disease = diseaseMapping[curr.disease];
            acc[disease] = (acc[disease] || 0) + 1;
            return acc;
          }, {})
      }
    };
  },

  // Analyze medical report
  analyzeReport: (reportData) => {
    console.log("MockDatabaseService.analyzeReport called with:", reportData);
    const { age, gender, bloodType, testResult } = reportData;
    
    // Map age to age bin
    const ageBin = age >= 50 ? 2 : (age >= 30 ? 1 : 0);
    
    // Calculate disease probabilities based on the mock data
    const diseaseProbabilities: Record<string, DiseaseDetails> = {};
    
    Object.keys(diseaseMapping).forEach(diseaseId => {
      const diseaseName = diseaseMapping[diseaseId];
      
      // Base probability
      let probability = 50;
      const factors = [];
      
      // Age factor
      const ageMatchingRecords = mockDatastore.filter(
        item => item.disease === parseInt(diseaseId) && item.ageBin === ageBin
      ).length;
      
      if (ageMatchingRecords > 0) {
        probability += Math.min(20, ageMatchingRecords * 5);
        factors.push(`Age group ${ageBinMapping[ageBin]}`);
      }
      
      // Gender factor
      const genderMatchingRecords = mockDatastore.filter(
        item => item.disease === parseInt(diseaseId) && item.gender === gender
      ).length;
      
      if (genderMatchingRecords > 0) {
        probability += Math.min(15, genderMatchingRecords * 3);
        factors.push(`Gender: ${gender === 1 ? 'Male' : 'Female'}`);
      }
      
      // Blood type factor
      if (bloodType !== undefined) {
        const bloodTypeMatchingRecords = mockDatastore.filter(
          item => item.disease === parseInt(diseaseId) && item.bloodType === bloodType
        ).length;
        
        if (bloodTypeMatchingRecords > 0) {
          probability += Math.min(10, bloodTypeMatchingRecords * 2);
          factors.push(`Blood type: ${bloodTypeMapping[bloodType]}`);
        }
      }
      
      // Test result factor
      if (testResult !== undefined) {
        const testResultMatchingRecords = mockDatastore.filter(
          item => item.disease === parseInt(diseaseId) && item.testResult === testResult
        ).length;
        
        if (testResultMatchingRecords > 0) {
          probability += Math.min(25, testResultMatchingRecords * 8);
          factors.push(`Test result: ${testResult === 1 ? 'Positive' : 'Negative'}`);
        }
      }
      
      // Cap probability
      probability = Math.min(95, Math.max(5, probability));
      
      // Add some randomness
      probability = Math.round((probability + (Math.random() * 10 - 5)) * 10) / 10;
      
      diseaseProbabilities[diseaseName] = {
        probability,
        factors
      };
    });
    
    // Sort diseases by probability
    const sortedDiseases = Object.entries(diseaseProbabilities)
      .sort((a, b) => b[1].probability - a[1].probability);
    
    // Get top disease
    const topDisease = sortedDiseases[0][0];
    
    // Generate follow-up recommendations
    const followUps = [
      "Schedule a follow-up appointment in 3 months",
      "Regular monitoring of vital signs"
    ];
    
    if (topDisease === "Hypertension") {
      followUps.push(
        "Blood pressure monitoring at home",
        "Sodium-restricted diet",
        "Consider consulting with a cardiologist"
      );
    } else if (topDisease === "Diabetes") {
      followUps.push(
        "Regular blood glucose monitoring",
        "Dietary consultation",
        "Consider consulting with an endocrinologist"
      );
    } else if (topDisease === "Asthma") {
      followUps.push(
        "Peak flow monitoring",
        "Identify and avoid triggers",
        "Consider consulting with a pulmonologist"
      );
    } else if (topDisease === "Arthritis") {
      followUps.push(
        "Physical therapy assessment",
        "Pain management strategy",
        "Consider consulting with a rheumatologist"
      );
    } else if (topDisease === "Heart Disease") {
      followUps.push(
        "Lipid profile and cardiac enzymes",
        "Stress test evaluation",
        "Immediate consultation with a cardiologist"
      );
    }
    
    // Calculate health score
    let healthScore = 100;
    sortedDiseases.forEach(([diseaseName, details]: [string, DiseaseDetails]) => {
      const prob = details.probability;
      if (prob > 70) {
        healthScore -= (prob * 0.3);
      } else if (prob > 50) {
        healthScore -= (prob * 0.2);
      } else {
        healthScore -= (prob * 0.1);
      }
    });
    
    // Cap health score
    healthScore = Math.max(1, Math.min(100, Math.round(healthScore * 10) / 10));
    
    // Get medical knowledge for top diseases
    const medicalKnowledge = [];
    sortedDiseases.slice(0, 2).forEach(([diseaseName]) => {
      const diseaseKey = diseaseName.toLowerCase().replace(" ", "_");
      if (medicalKnowledgeDB[diseaseKey]) {
        medicalKnowledge.push(medicalKnowledgeDB[diseaseKey]);
      }
    });
    
    // Build response
    const warningFlags = [];
    sortedDiseases.forEach(([diseaseName, details]: [string, DiseaseDetails]) => {
      if (details.probability > 70) {
        warningFlags.push({
          condition: diseaseName,
          priority: details.probability > 85 ? "high" : "medium",
          message: `High probability of ${diseaseName} detected`
        });
      }
    });
    
    const result = {
      potentialConditions: sortedDiseases.slice(0, 3).map(([diseaseName, details]: [string, DiseaseDetails]) => ({
        name: diseaseName,
        probability: details.probability,
        riskFactors: details.factors
      })),
      medicalKnowledge,
      followUpRecommendations: followUps,
      healthScore,
      warningFlags,
      timestamp: new Date().toISOString()
    };
    
    console.log("MockDatabaseService.analyzeReport returning:", result);
    return result;
  },

  // Get disease information
  getDiseaseInfo: () => {
    const result = [];
    
    Object.entries(diseaseMapping).forEach(([diseaseId, diseaseName]) => {
      // Build prevalence data by age
      const prevalence = [];
      Object.entries(ageBinMapping).forEach(([ageBinId, ageBinName]) => {
        const count = mockDatastore.filter(
          item => item.disease === parseInt(diseaseId) && item.ageBin === parseInt(ageBinId)
        ).length;
        
        if (count > 0) {
          prevalence.push({
            ageGroup: ageBinName,
            count
          });
        }
      });
      
      // Build blood type correlation
      const bloodCorrelation = [];
      Object.entries(bloodTypeMapping).forEach(([bloodTypeId, bloodTypeName]) => {
        const count = mockDatastore.filter(
          item => item.disease === parseInt(diseaseId) && item.bloodType === parseInt(bloodTypeId)
        ).length;
        
        if (count > 0) {
          bloodCorrelation.push({
            bloodType: bloodTypeName,
            count
          });
        }
      });
      
      result.push({
        id: parseInt(diseaseId),
        name: diseaseName,
        prevalence,
        bloodTypeCorrelation: bloodCorrelation
      });
    });
    
    return result;
  },

  // Get medical knowledge
  getMedicalKnowledge: (query = "") => {
    if (query) {
      // Filter knowledge by query
      return Object.values(medicalKnowledgeDB).filter(data => 
        data.name.toLowerCase().includes(query.toLowerCase()) || 
        data.description.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      // Return all knowledge entries
      return Object.values(medicalKnowledgeDB);
    }
  }
}; 