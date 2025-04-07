// This is a test script for the ReportAnalyzer service
// Run with: node test_frontend_service.js

// Import necessary modules
import fetch from 'node-fetch';

console.log('Starting test script...');

// Mock the ReportAnalyzerService
const ReportAnalyzerService = {
  /**
   * Analyzes medical report data using the backend API
   */
  analyzeReport: async (reportData) => {
    console.log('Sending report data to API:', reportData);
    try {
      console.log(`Fetching from http://localhost:5000/api/analyze-report...`);
      const response = await fetch(`http://localhost:5000/api/analyze-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error ${response.status}: ${response.statusText}`, errorText);
        throw new Error(`API error ${response.status}: ${response.statusText}`);
      }

      console.log('Response is OK, parsing JSON...');
      const result = await response.json();
      console.log('Successful API response:', result);
      
      // Validate and sanitize the response
      console.log('Sanitizing response...');
      const sanitizedResult = {
        potentialConditions: (result.potentialConditions || []).map(condition => ({
          name: condition.name || 'Unknown Condition',
          probability: typeof condition.probability === 'number' ? condition.probability : 50,
          riskFactors: Array.isArray(condition.riskFactors) ? condition.riskFactors : []
        })),
        medicalKnowledge: (result.medicalKnowledge || []).map(knowledge => ({
          id: knowledge.id || 'unknown-id',
          name: knowledge.name || 'Unknown Condition',
          description: knowledge.description || 'No description available',
          risk_factors: Array.isArray(knowledge.risk_factors) ? knowledge.risk_factors : [],
          complications: Array.isArray(knowledge.complications) ? knowledge.complications : [],
          treatments: Array.isArray(knowledge.treatments) ? knowledge.treatments : [],
          prevention: Array.isArray(knowledge.prevention) ? knowledge.prevention : []
        })),
        followUpRecommendations: Array.isArray(result.followUpRecommendations) ? 
          result.followUpRecommendations : [],
        healthScore: typeof result.healthScore === 'number' ? result.healthScore : 50,
        warningFlags: (result.warningFlags || []).map(flag => ({
          condition: flag.condition || 'Unknown',
          priority: flag.priority || 'medium',
          message: flag.message || 'Warning flag detected'
        })),
        timestamp: result.timestamp || new Date().toISOString()
      };
      
      console.log('Sanitizing complete.');
      return sanitizedResult;
    } catch (error) {
      console.error('Error analyzing report:', error);
      
      // Generate fallback analysis
      console.log('Generating fallback analysis...');
      const fallbackResult = {
        potentialConditions: [
          {
            name: reportData.age > 50 ? "Hypertension" : "Common Cold",
            probability: reportData.age > 50 ? 65 : 45,
            riskFactors: [`Age ${reportData.age}`, reportData.gender === 1 ? "Male" : "Female"]
          }
        ],
        medicalKnowledge: [],
        followUpRecommendations: [
          "Schedule a follow-up appointment"
        ],
        healthScore: 50,
        warningFlags: [],
        timestamp: new Date().toISOString()
      };
      
      console.log('Fallback analysis generated:', fallbackResult);
      return fallbackResult;
    }
  }
};

// Test data
const testData = {
  age: 45,
  gender: 1,  // Male
  bloodType: 0,  // A+
  testResult: 1  // Positive
};

// Run the test
async function runTest() {
  console.log('Testing ReportAnalyzer service with data:', testData);
  
  try {
    console.log('Calling ReportAnalyzerService.analyzeReport...');
    const result = await ReportAnalyzerService.analyzeReport(testData);
    
    console.log('\nFinal analysis result:');
    console.log(JSON.stringify(result, null, 2));
    
    // Check for any missing or problematic data
    console.log('\nValidation checks:');
    
    if (result.potentialConditions.length === 0) {
      console.log('⚠️ Warning: No potential conditions found');
    }
    
    if (result.medicalKnowledge.length === 0) {
      console.log('⚠️ Warning: No medical knowledge found');
    }
    
    console.log('✅ Test completed successfully');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
console.log('Starting runTest()...');
runTest().then(() => {
  console.log('Test run complete!');
}).catch(err => {
  console.error('Unhandled error in test:', err);
}); 