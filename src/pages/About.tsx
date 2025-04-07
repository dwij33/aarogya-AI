import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Brain,
  Stethoscope,
  HeartPulse,
  Binary,
  Users,
  Shield,
  Globe,
  Laptop,
  CheckCircle,
  BarChart,
} from "lucide-react";

export default function About() {
  useEffect(() => {
    document.title = "About Us | ArogyaAI+";
  }, []);

  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">About ArogyaAI+</h1>
        <p className="text-xl text-muted-foreground">
          Revolutionizing healthcare with AI-powered solutions for everyone
        </p>
      </div>

      <Tabs defaultValue="mission" className="max-w-4xl mx-auto">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="mission">Our Mission</TabsTrigger>
          <TabsTrigger value="technology">Our Technology</TabsTrigger>
          <TabsTrigger value="impact">Our Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="mission" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Mission & Vision</CardTitle>
              <CardDescription>
                Transforming healthcare through artificial intelligence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                At ArogyaAI+, we believe that quality healthcare should be accessible to everyone, regardless of their location or economic background. Our mission is to leverage cutting-edge artificial intelligence to democratize healthcare access, improve diagnosis accuracy, and empower individuals to take control of their health.
              </p>
              <p>
                Founded in 2023, ArogyaAI+ was born from a simple yet powerful idea: that technology could bridge the gap in healthcare accessibility, especially in regions with limited medical infrastructure. Our team of healthcare professionals, AI specialists, and passionate technologists came together with a shared vision of creating a platform that could understand, analyze, and provide guidance on health concerns just like a human doctor would.
              </p>
              <p>
                We are committed to continuous innovation, maintaining the highest standards of medical accuracy, and ensuring that our technology serves humanity with compassion and ethical responsibility.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-primary/5">
              <CardHeader className="pb-2">
                <Heart className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-lg">Healthcare for All</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  We're committed to making advanced healthcare accessible to everyone, regardless of location or socioeconomic status.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5">
              <CardHeader className="pb-2">
                <Shield className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-lg">Ethical AI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  We develop our AI with strict ethical guidelines, ensuring privacy, fairness, and transparency in all our systems.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5">
              <CardHeader className="pb-2">
                <Globe className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-lg">Global Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Our solutions are designed to work across cultures and regions, with special focus on underserved communities.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="technology" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Technology</CardTitle>
              <CardDescription>
                Cutting-edge AI powering healthcare solutions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                ArogyaAI+ leverages state-of-the-art artificial intelligence, natural language processing, and machine learning algorithms trained on vast datasets of medical knowledge and real-world clinical data. Our systems are continuously learning and improving through feedback from healthcare professionals and patient interactions.
              </p>
              <p>
                Our technology stack includes advanced neural networks for medical image analysis, sophisticated natural language understanding for symptom assessment, and comprehensive knowledge graphs that connect symptoms, conditions, treatments, and outcomes in a contextually aware system.
              </p>
              <p>
                We maintain rigorous standards for data security and privacy, employing encryption, anonymization, and strict access controls to protect sensitive health information. All our AI models undergo extensive validation and testing by medical professionals to ensure accuracy and reliability.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span>Natural Language Processing</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">
                  Our advanced NLP models understand health concerns expressed in natural language, allowing users to describe symptoms in their own words.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Understands medical terminology and layman's terms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Processes contextual information for better accuracy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Supports multiple languages for global accessibility</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-primary" />
                  <span>Medical Data Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">
                  Our systems analyze medical reports, lab results, and imaging data to provide comprehensive health insights.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Identifies abnormalities and potential concerns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Translates complex medical data into understandable insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Tracks health trends over time for preventive care</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="impact" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Impact</CardTitle>
              <CardDescription>
                Transforming lives through accessible healthcare
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Since our inception, ArogyaAI+ has made a significant impact on healthcare accessibility and outcomes. Our platform has been used by over 500,000 individuals across 40+ countries, with particularly strong adoption in regions with limited access to healthcare professionals.
              </p>
              <p>
                Our AI Symptom Checker has helped identify early warning signs of serious conditions for thousands of users, enabling timely intervention. Our Mental Health Companion provides support to over 50,000 active users monthly, offering guidance, exercises, and resources for managing anxiety, depression, and stress.
              </p>
              <p>
                Through partnerships with healthcare providers, we've helped optimize patient flow, reduce unnecessary hospital visits, and improve healthcare resource allocation. Our technology continues to evolve based on real-world usage and feedback, constantly improving its accuracy and effectiveness.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Features Improving Lives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Stethoscope className="h-6 w-6 text-primary shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">AI Symptom Checker</h4>
                      <p className="text-sm text-muted-foreground">
                        Provides immediate, accurate health assessments using advanced NLP, helping users understand their symptoms and guiding them to appropriate care.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Brain className="h-6 w-6 text-primary shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Mental Health AI Chat</h4>
                      <p className="text-sm text-muted-foreground">
                        Offers 24/7 mental health support with personalized coping strategies, exercises, and resources for anxiety, depression, and stress management.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <HeartPulse className="h-6 w-6 text-primary shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Medical Report Analyzer</h4>
                      <p className="text-sm text-muted-foreground">
                        Translates complex medical reports into plain language, highlighting important results and providing context for better understanding.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Users className="h-6 w-6 text-primary shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Doctor Appointment System</h4>
                      <p className="text-sm text-muted-foreground">
                        Connects users with healthcare providers, enabling seamless appointment booking and follow-up care coordination.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Binary className="h-6 w-6 text-primary shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Personalized Health Insights</h4>
                      <p className="text-sm text-muted-foreground">
                        Uses AI to generate customized health recommendations based on user data, lifestyle, and medical history.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Laptop className="h-6 w-6 text-primary shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Diet & Nutrition Planning</h4>
                      <p className="text-sm text-muted-foreground">
                        Creates personalized meal plans based on health goals, dietary restrictions, and nutritional needs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Heart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
} 