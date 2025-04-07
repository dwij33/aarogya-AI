import React, { useState, useEffect } from "react";
import { ReportAnalyzerService } from "@/services/reportAnalyzer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Activity, 
  AlertTriangle, 
  BookOpen, 
  CalendarCheck, 
  Database, 
  FileText, 
  Heart, 
  Info, 
  Search,
  Upload,
  FileImage,
  Pill,
  Thermometer
} from "lucide-react";
import PrescriptionAnalyzer from "@/components/PrescriptionAnalyzer";
import { PrescriptionAnalysisResult } from "@/services/prescriptionAnalyzer";

// Form schema validation
const reportFormSchema = z.object({
  age: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0 && parseInt(val) <= 120, {
    message: "Age must be between 0 and 120"
  }),
  gender: z.string(),
  bloodType: z.string().optional(),
  testResult: z.string().optional()
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

interface AnalysisResult {
  potentialConditions: {
    name: string;
    probability: number;
    riskFactors: string[];
  }[];
  medicalKnowledge: {
    id: string;
    name: string;
    description: string;
    risk_factors: string[];
    complications: string[];
    treatments: string[];
    prevention: string[];
  }[];
  followUpRecommendations: string[];
  healthScore: number;
  warningFlags: {
    condition: string;
    priority: "high" | "medium" | "low";
    message: string;
  }[];
  timestamp: string;
}

const ReportAnalyzer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [aiServiceAvailable, setAiServiceAvailable] = useState<boolean>(false);
  const [aiModelInfo, setAiModelInfo] = useState<{
    available: boolean;
    modelName?: string;
    version?: string;
  }>({
    available: false
  });
  const [prescriptionResult, setPrescriptionResult] = useState<PrescriptionAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>("manual");
  const { toast } = useToast();
  
  // Blood type mapping
  const bloodTypeLabels = {
    0: "A+", 1: "A-", 2: "B+", 3: "B-", 
    4: "AB+", 5: "AB-", 6: "O+", 7: "O-"
  };
  
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      age: "45",
      gender: "0", // Female
      bloodType: undefined,
      testResult: undefined
    },
  });
  
  useEffect(() => {
    // Check API health on component mount
    const checkApiHealth = async () => {
      try {
        const health = await ReportAnalyzerService.checkApiHealth();
        
        if (health.healthy) {
          console.log('AI Service is healthy');
          setAiModelInfo({
            available: health.aiServiceAvailable,
            modelName: health.modelVersion?.split('-')[0],
            version: health.modelVersion
          });
          
          toast({
            title: "Connected to AI service",
            description: health.aiServiceAvailable 
              ? `AI Model (${health.modelVersion}) is available for enhanced analysis` 
              : "Warning: AI service is not fully available",
            variant: health.aiServiceAvailable ? "default" : "destructive",
          });
        } else {
          console.error('AI Service is not healthy');
          toast({
            variant: "destructive",
            title: "AI Service Connection Failed",
            description: "Unable to connect to the AI analysis service. Fallback mode enabled.",
          });
        }
      } catch (error) {
        console.error('Failed to check AI service health', error);
      }
    };
    
    checkApiHealth();
  }, [toast]);
  
  useEffect(() => {
    // Check if AI service is available
    const checkAIService = async () => {
      try {
        const healthStatus = await ReportAnalyzerService.checkApiHealth();
        setAiServiceAvailable(healthStatus.aiServiceAvailable || false);
        
        if (healthStatus.aiServiceAvailable) {
          toast({
            title: "AI Service Connected",
            description: `Using ${healthStatus.modelVersion || 'advanced AI models'} for enhanced medical analysis.`,
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("Failed to check AI service status", error);
        setAiServiceAvailable(false);
      }
    };
    
    checkAIService();
  }, [toast]);
  
  const onSubmit = async (values: ReportFormValues) => {
    setIsLoading(true);
    console.log("Form submitted with values:", values);
    
    try {
      // Convert string values to appropriate types
      const processedData = {
        age: parseInt(values.age),
        gender: parseInt(values.gender),
        bloodType: values.bloodType ? parseInt(values.bloodType) : undefined,
        testResult: values.testResult ? parseInt(values.testResult) : undefined
      };
      
      console.log("Sending data to analyze-report:", processedData);
      const result = await ReportAnalyzerService.analyzeReport(processedData);
      console.log("Received analysis result:", result);
      
      // Validate that we have a result with the required structure
      if (!result || typeof result !== 'object') {
        console.error("Invalid response format:", result);
        throw new Error("Invalid response format: missing or invalid result object");
      }
      
      console.log("Setting analysis result state with:", result);
      setAnalysisResult(result);
      
      toast({
        title: "Analysis Complete",
        description: "Medical report has been analyzed using AI models and medical knowledge.",
      });
    } catch (error) {
      console.error("Failed to analyze report", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Unable to complete the analysis. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500 text-white";
      case "medium": return "bg-yellow-500 text-white";
      case "low": return "bg-blue-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };
  
  const getConditionBadgeColor = (probability: number) => {
    if (probability >= 70) return "bg-red-100 text-red-800 border-red-300";
    if (probability >= 40) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-green-100 text-green-800 border-green-300";
  };
  
  const handlePrescriptionAnalysisComplete = (result: PrescriptionAnalysisResult) => {
    setPrescriptionResult(result);
    
    // Optionally extract patient info from prescription to form
    if (result.patientInfo) {
      if (result.patientInfo.age) {
        form.setValue('age', result.patientInfo.age.toString());
      }
      
      if (result.patientInfo.gender) {
        const genderValue = result.patientInfo.gender.toLowerCase() === 'male' ? '1' : '0';
        form.setValue('gender', genderValue);
      }
    }
  };
  
  return (
    <div className="container py-8 px-4 md:px-6 max-w-6xl">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-3xl font-bold">Medical Report Analyzer</h1>
        <p className="text-muted-foreground">
          Analyze patient data using advanced AI models and medical science knowledge
        </p>
        {aiServiceAvailable && (
          <Badge className="bg-green-100 text-green-800 border border-green-300 w-fit">
            <Activity className="h-3.5 w-3.5 mr-1" />
            {aiModelInfo.version ? `Powered by ${aiModelInfo.version}` : "AI Powered Analysis"}
          </Badge>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">
            <FileText className="mr-2 h-4 w-4" />
            Manual Entry
          </TabsTrigger>
          <TabsTrigger value="prescription">
            <FileImage className="mr-2 h-4 w-4" />
            Prescription Upload
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 shadow-md">
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
                <CardDescription>
                  Enter patient details for analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="120" {...field} />
                          </FormControl>
                          <FormDescription>
                            Patient's age in years
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">Female</SelectItem>
                              <SelectItem value="1">Male</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Patient's biological gender
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bloodType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select blood type (optional)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">A+</SelectItem>
                              <SelectItem value="1">A-</SelectItem>
                              <SelectItem value="2">B+</SelectItem>
                              <SelectItem value="3">B-</SelectItem>
                              <SelectItem value="4">AB+</SelectItem>
                              <SelectItem value="5">AB-</SelectItem>
                              <SelectItem value="6">O+</SelectItem>
                              <SelectItem value="7">O-</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Patient's blood type if known
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="testResult"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Test Result</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select test result (optional)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">Negative</SelectItem>
                              <SelectItem value="1">Positive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Recent test result if available
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" /> Analyze Report
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2 shadow-md">
              {renderAnalysisResults()}
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="prescription" className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Upload Prescription</h2>
            <p className="text-muted-foreground">
              Upload an image of your prescription for automatic analysis of medications and diagnoses
            </p>
          </div>
          
          <PrescriptionAnalyzer onAnalysisComplete={handlePrescriptionAnalysisComplete} />
          
          {prescriptionResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Pill className="mr-2 h-5 w-5" />
                  Medication Analysis Summary
                </CardTitle>
                <CardDescription>
                  Combined analysis based on prescription and medical science knowledge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Medication Summary */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Prescribed Medications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {prescriptionResult.medications.map((med, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-secondary/10">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">{med.name}</h4>
                            <Badge>{med.dosage}</Badge>
                          </div>
                          <div className="text-sm space-y-1 text-muted-foreground">
                            <p>Take {med.frequency}</p>
                            <p>Duration: {med.duration}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Warning Summary */}
                  {prescriptionResult.warningFlags.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Important Warnings</h3>
                      <div className="space-y-2">
                        {prescriptionResult.warningFlags.map((warning, index) => (
                          <Alert key={index} className="border-yellow-200 bg-yellow-50">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <div className="ml-3">
                              <AlertTitle className="text-yellow-800">{warning.type}</AlertTitle>
                              <AlertDescription className="text-yellow-700 text-sm">
                                {warning.message}
                              </AlertDescription>
                            </div>
                          </Alert>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Diagnoses */}
                  {prescriptionResult.diagnoses.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Diagnoses</h3>
                      <div className="flex flex-wrap gap-2">
                        {prescriptionResult.diagnoses.map((diagnosis, index) => (
                          <Badge key={index} variant="outline" className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
                            {diagnosis}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Doctor's Notes */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Doctor's Notes</h3>
                    <div className="p-4 rounded-lg bg-muted/50 text-sm italic">
                      {prescriptionResult.doctorNotes}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => {
                        setActiveTab("manual");
                        toast({
                          title: "Information Transferred",
                          description: "Patient data has been transferred from the prescription"
                        });
                      }}
                    >
                      Continue to Advanced Analysis
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {!analysisResult && !prescriptionResult && (
        <div className="mt-10">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Our AI uses advanced medical knowledge to analyze your reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 text-blue-600 rounded-full p-2 mt-1">
                  <FileText size={16} />
                </div>
                <div>
                  <h4 className="font-medium">Report Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Our AI processes your medical report data to identify patterns and risk factors.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 text-green-600 rounded-full p-2 mt-1">
                  <Activity size={16} />
                </div>
                <div>
                  <h4 className="font-medium">Pattern Recognition</h4>
                  <p className="text-sm text-muted-foreground">
                    AI compares your results with medical knowledge and clinical databases.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 text-purple-600 rounded-full p-2 mt-1">
                  <BookOpen size={16} />
                </div>
                <div>
                  <h4 className="font-medium">Medical Knowledge</h4>
                  <p className="text-sm text-muted-foreground">
                    Leverages {aiModelInfo.modelName || "AI models"} trained on comprehensive medical literature.
                  </p>
                </div>
              </div>
              <div className="border-t pt-4 mt-4">
                <p className="text-sm text-muted-foreground flex items-center">
                  <AlertTriangle size={14} className="mr-2" />
                  This analysis is not a substitute for professional medical advice.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <CardFooter className="bg-muted/30 text-sm text-muted-foreground mt-8 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <p>This analysis is for informational purposes only and does not constitute medical advice. Always consult with a healthcare professional for proper diagnosis and treatment.</p>
        </div>
      </CardFooter>
    </div>
  );
  
  // Helper function to render analysis results
  function renderAnalysisResults() {
    console.log("Rendering analysis results with data:", analysisResult);
    
    if (!analysisResult) {
      console.log("No analysis result, showing empty state");
      return (
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-2">Medical Report Analysis</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Enter patient information on the left to generate a comprehensive analysis based on medical science knowledge and patterns from AI models.
          </p>
          <div className="flex flex-col space-y-4 w-full max-w-md">
            <div className="flex items-center p-2 bg-muted rounded-md">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <Activity className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-medium">Condition Analysis</h4>
                <p className="text-xs text-muted-foreground">
                  Identify potential conditions based on patient data
                </p>
              </div>
            </div>
            
            <div className="flex items-center p-2 bg-muted rounded-md">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <BookOpen className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-medium">Medical Knowledge</h4>
                <p className="text-xs text-muted-foreground">
                  Access detailed medical information for identified conditions
                </p>
              </div>
            </div>
            
            <div className="flex items-center p-2 bg-muted rounded-md">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <CalendarCheck className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-medium">Recommendations</h4>
                <p className="text-xs text-muted-foreground">
                  Get personalized follow-up recommendations
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      );
    }
    
    try {
      // Ensure that the analysis result has all required properties
      const healthScore = analysisResult.healthScore || 0;
      const potentialConditions = analysisResult.potentialConditions || [];
      const medicalKnowledge = analysisResult.medicalKnowledge || [];
      const followUpRecommendations = analysisResult.followUpRecommendations || [];
      const warningFlags = analysisResult.warningFlags || [];
      
      console.log("Processed analysis data:", {
        healthScore,
        potentialConditions: potentialConditions.length,
        medicalKnowledge: medicalKnowledge.length,
        followUpRecommendations: followUpRecommendations.length,
        warningFlags: warningFlags.length
      });
      
      // Create simple results if we have issues with the full rendering
      if (potentialConditions.length === 0 && followUpRecommendations.length === 0) {
        console.log("No detailed analysis results, showing simple view");
        return (
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Analysis Results</h2>
                <p className="text-sm text-muted-foreground">
                  Based on AI analysis and medical knowledge
                </p>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${getHealthScoreColor(healthScore)}`}>
                  {healthScore}
                </div>
                <div className="text-xs text-muted-foreground">Health Score</div>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium mb-3">Basic Analysis</h3>
              <p>Based on the provided information:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Age: {analysisResult.age || "Not specified"}</li>
                <li>Gender: {analysisResult.gender === 1 ? "Male" : "Female"}</li>
                <li>Blood Type: {analysisResult.bloodType !== undefined ? bloodTypeLabels[analysisResult.bloodType] : "Not specified"}</li>
                <li>Health Score: {healthScore}</li>
              </ul>
              <div className="mt-6">
                <Button onClick={() => setAnalysisResult(null)}>Reset Analysis</Button>
              </div>
            </div>
          </CardContent>
        );
      }
      
      return (
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Analysis Results</h2>
              <p className="text-sm text-muted-foreground">
                Based on AI analysis and medical knowledge
              </p>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getHealthScoreColor(healthScore)}`}>
                {healthScore}
              </div>
              <div className="text-xs text-muted-foreground">Health Score</div>
            </div>
          </div>
          
          {warningFlags.length > 0 && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="font-medium text-red-700">Warning Flags</h3>
              </div>
              <div className="space-y-2">
                {warningFlags.map((flag, index) => (
                  <div key={index} className="flex items-start">
                    <Badge className={getPriorityColor(flag.priority)}>
                      {flag.priority}
                    </Badge>
                    <span className="ml-2 text-sm">{flag.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <Tabs defaultValue="conditions" className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="conditions" className="flex-1">
                <Activity className="h-4 w-4 mr-2" />
                Potential Conditions
              </TabsTrigger>
              <TabsTrigger value="knowledge" className="flex-1">
                <BookOpen className="h-4 w-4 mr-2" />
                Medical Knowledge
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex-1">
                <CalendarCheck className="h-4 w-4 mr-2" />
                Recommendations
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="conditions" className="space-y-4">
              {potentialConditions.map((condition, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium">{condition.name}</h3>
                    <Badge className={getConditionBadgeColor(condition.probability)}>
                      {condition.probability}% probability
                    </Badge>
                  </div>
                  <Progress 
                    value={condition.probability} 
                    className="h-2 mb-4"
                  />
                  <div>
                    <h4 className="text-sm font-medium mb-2">Risk Factors:</h4>
                    <div className="flex flex-wrap gap-1">
                      {(condition.riskFactors || []).map((factor, i) => (
                        <Badge key={i} variant="outline" className="bg-secondary/50">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="knowledge" className="space-y-6">
              {medicalKnowledge.length > 0 ? (
                medicalKnowledge.map((knowledge, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2">{knowledge.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {knowledge.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Risk Factors:</h4>
                        <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                          {(knowledge.risk_factors || []).map((factor, i) => (
                            <li key={i}>{factor}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Complications:</h4>
                        <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                          {(knowledge.complications || []).map((complication, i) => (
                            <li key={i}>{complication}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Treatments:</h4>
                        <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                          {(knowledge.treatments || []).map((treatment, i) => (
                            <li key={i}>{treatment}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Prevention:</h4>
                        <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                          {(knowledge.prevention || []).map((prevention, i) => (
                            <li key={i}>{prevention}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Info className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p>No specific medical knowledge entries for this report.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="recommendations" className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start mb-2">
                  <FileText className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-700">Follow-up Recommendations</h3>
                    <p className="text-sm text-blue-600">
                      Based on the analysis of patient data and medical knowledge
                    </p>
                  </div>
                </div>
              </div>
              
              <ul className="space-y-3">
                {followUpRecommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 pt-4 border-t">
                <Button className="w-full sm:w-auto">
                  <Thermometer className="mr-2 h-4 w-4" />
                  Generate Follow-up Plan
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      );
    } catch (error) {
      console.error("Error rendering analysis results:", error);
      
      // Show error state
      return (
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">Analysis Error</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            There was an error processing the analysis results. Please try again.
          </p>
          <Button variant="outline" onClick={() => setAnalysisResult(null)}>
            Reset
          </Button>
        </CardContent>
      );
    }
  }
};

export default ReportAnalyzer; 