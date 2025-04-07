import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { 
  Alert,
  AlertTitle,
  AlertDescription 
} from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { FileUp, FileText, AlertTriangle, Check, X, Loader2, Brain, Sparkles } from "lucide-react";
import { PrescriptionAnalyzerService, PrescriptionAnalysisResult } from "@/services/prescriptionAnalyzer";

interface PrescriptionAnalyzerProps {
  onAnalysisComplete?: (result: PrescriptionAnalysisResult) => void;
}

export default function PrescriptionAnalyzer({ onAnalysisComplete }: PrescriptionAnalyzerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PrescriptionAnalysisResult | null>(null);
  const { toast } = useToast();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!selectedFile.type.includes('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)"
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 5MB"
        });
        return;
      }
      
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
      
      // Reset analysis when new file is selected
      setAnalysisResult(null);
    }
  };

  // Analyze prescription
  const analyzePrescription = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a prescription image to analyze"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const result = await PrescriptionAnalyzerService.analyzePrescription(file);
      setAnalysisResult(result);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
      
      toast({
        title: "Analysis Complete",
        description: "Prescription successfully analyzed"
      });
    } catch (error) {
      console.error("Error analyzing prescription:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Unable to analyze the prescription. Please try again."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setPreview(null);
    setAnalysisResult(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return "bg-red-500 text-white";
      case 'medium': return "bg-yellow-500 text-white";
      case 'low': return "bg-blue-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Upload Prescription</h3>
              <p className="text-sm text-muted-foreground">
                Upload a clear image of your prescription for analysis
              </p>
              
              {!preview ? (
                <div 
                  className="border-2 border-dashed rounded-lg p-12 text-center border-primary/20 hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('prescription-upload')?.click()}
                >
                  <FileUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm font-medium">Click to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Support for JPG, PNG, GIF (max 5MB)
                  </p>
                  <Input 
                    id="prescription-upload"
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={preview} 
                      alt="Prescription preview" 
                      className="object-contain w-full h-full"
                    />
                    <Button 
                      size="sm" 
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={resetAnalysis}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center text-sm">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="truncate">{file?.name}</span>
                    <span className="ml-auto text-muted-foreground">
                      {Math.round(file ? file.size / 1024 : 0)} KB
                    </span>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button 
                  onClick={analyzePrescription} 
                  disabled={!file || isAnalyzing}
                  className="w-full md:w-auto"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>Analyze Prescription</>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Analysis Results */}
        <Card>
          <CardContent className="p-6">
            {!analysisResult ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 min-h-[300px]">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Prescription Analysis</h3>
                <p className="text-sm text-muted-foreground mt-2 mb-4">
                  Upload a prescription image to see the detailed analysis
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Add the AI model badge near the top */}
                {analysisResult?.aiAnalysis && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-purple-100 border-purple-300 text-purple-800 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        <span>AI Powered</span>
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Using {analysisResult.aiAnalysis.modelUsed}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-muted-foreground">Confidence:</span>
                      <span className="font-medium">{(analysisResult.aiAnalysis.confidenceScore * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                )}
                
                {/* Add an AI recommendations section */}
                {analysisResult?.aiAnalysis?.recommendations && analysisResult.aiAnalysis.recommendations.length > 0 && (
                  <Card className="border-purple-200 bg-purple-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="h-5 w-5 text-purple-600" />
                        <h3 className="font-medium text-purple-800">AI Recommendations</h3>
                      </div>
                      <ul className="space-y-2">
                        {analysisResult.aiAnalysis.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium">Analysis Results</h3>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Processed
                  </Badge>
                </div>
                
                <Tabs defaultValue="medications">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="medications">Medications</TabsTrigger>
                    <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
                    <TabsTrigger value="warnings">Warnings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="medications" className="space-y-4">
                    {analysisResult.medications.map((med, index) => (
                      <div key={index} className="border rounded-lg p-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{med.name}</h4>
                          <Badge variant="outline">{med.dosage}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Frequency:</span> {med.frequency}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration:</span> {med.duration}
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="diagnoses" className="space-y-4">
                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium mb-2">Diagnosed Conditions</h4>
                      <ul className="space-y-1">
                        {analysisResult.diagnoses.map((diagnosis, index) => (
                          <li key={index} className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                            {diagnosis}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium mb-2">Doctor's Notes</h4>
                      <p className="text-sm">{analysisResult.doctorNotes}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="warnings" className="space-y-4">
                    {analysisResult.warningFlags.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Warning Flags</h4>
                        {analysisResult.warningFlags.map((flag, index) => (
                          <Alert key={index} variant="destructive" className="py-2">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle className="ml-2 text-sm font-medium flex items-center">
                              {flag.type}
                              <Badge className={`ml-2 ${getSeverityColor(flag.severity)}`}>
                                {flag.severity}
                              </Badge>
                            </AlertTitle>
                            <AlertDescription className="ml-2 text-sm">
                              {flag.message}
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    )}
                    
                    {analysisResult.interactions.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Drug Interactions</h4>
                        {analysisResult.interactions.map((interaction, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex items-center mb-2">
                              <span className="text-sm font-medium">
                                {interaction.medications.join(" + ")}
                              </span>
                              <Badge className={`ml-2 ${getSeverityColor(interaction.severity)}`}>
                                {interaction.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{interaction.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 