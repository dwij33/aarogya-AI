/**
 * Types related to symptom detection and analysis
 * These types are used for integrating with the datastore1.csv 
 * through the backend API
 */

/**
 * Represents a request to analyze symptoms
 */
export interface SymptomAnalysisRequest {
  /** Text description of symptoms */
  symptoms: string;
  /** User information for more accurate analysis */
  userInfo: {
    /** User's age */
    age: number;
    /** User's geographical region */
    region: string;
    /** Whether the user has any chronic conditions */
    has_chronic_conditions: boolean;
  };
}

/**
 * Represents a possible medical condition identified from symptoms
 */
export interface Condition {
  /** Name of the condition */
  name: string;
  /** Confidence score (0-100) */
  probability: number;
  /** Description of the condition */
  description: string;
  /** Symptoms that matched this condition */
  symptoms: string[];
  /** Recommendation for this condition */
  recommendation: string;
}

/**
 * Risk assessment based on user profile
 */
export interface RiskFactors {
  /** Risk assessment based on age */
  age: string;
  /** Risk assessment based on geographical region */
  region: string;
  /** Risk assessment based on medical history */
  medicalHistory: string;
}

/**
 * Urgency levels for medical assessment
 */
export type UrgencyLevel = "low" | "medium" | "high";

/**
 * Complete analysis result from symptom detection
 */
export interface SymptomAnalysisResult {
  /** List of possible conditions sorted by probability */
  possibleConditions: Condition[];
  /** Risk factors assessment */
  riskFactors: RiskFactors;
  /** Overall urgency assessment */
  urgency: UrgencyLevel;
  /** Recommended next steps */
  nextSteps: string[];
}

/**
 * Response from the backend API for symptom analysis
 */
export interface SymptomAnalysisApiResponse {
  /** Array of potential conditions with confidence scores */
  results: {
    condition: string;
    confidence: number;
    matched_symptoms: string[];
  }[];
  /** Risk assessment based on user profile */
  user_risk_factors: {
    age: string;
    region: string; 
    history: string;
  };
}

/**
 * Disease information from datastore1.csv
 */
export interface DiseaseInfo {
  /** Disease identifier */
  id: number;
  /** Disease name */
  name: string;
  /** Disease prevalence by age group */
  prevalence: {
    ageGroup: string;
    count: number;
  }[];
  /** Disease correlation with blood types */
  bloodTypeCorrelation: {
    bloodType: string;
    count: number;
  }[];
} 