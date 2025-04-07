import { cn } from "@/lib/utils";
import { 
  MessageSquare, 
  Calendar, 
  Bell, 
  HelpCircle, 
  Heart, 
  AlertTriangle,
  MapPin, 
  BarChart,
  Users,
  Clock
} from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
  delay?: string;
}

function FeatureCard({ title, description, icon, colorClass, delay = "0" }: FeatureCardProps) {
  return (
    <div 
      className={cn(
        "health-card relative animate-in",
        delay && `transition-all duration-500 delay-[${delay}]`
      )}
    >
      <div className={cn("p-3 rounded-lg inline-flex items-center justify-center mb-4", colorClass)}>
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function FeatureSection() {
  const features = [
    {
      title: "AI Symptom Checker",
      description: "Get instant health assessments powered by advanced NLP for accurate symptom analysis.",
      icon: <HelpCircle className="h-5 w-5" />,
      colorClass: "bg-health-blue-light text-health-blue",
      delay: "100ms"
    },
    {
      title: "Mental Health AI Chat",
      description: "Access 24/7 support with our specialized mental health chatbot for guidance and resources.",
      icon: <MessageSquare className="h-5 w-5" />,
      colorClass: "bg-health-green-light text-health-green",
      delay: "200ms"
    },
    {
      title: "Medication Management",
      description: "Track medications, get reminders, and monitor adherence with our smart system.",
      icon: <Bell className="h-5 w-5" />,
      colorClass: "bg-health-orange-light text-health-orange",
      delay: "300ms"
    },
    {
      title: "Smart Appointment Scheduling",
      description: "Book appointments with doctors using our AI-powered scheduling system with instant confirmation.",
      icon: <Calendar className="h-5 w-5" />,
      colorClass: "bg-health-blue-light text-health-blue",
      delay: "400ms"
    },
    {
      title: "Nearby Doctors in Pune",
      description: "Find top healthcare specialists in Pune with ratings, availability, and direct booking options.",
      icon: <MapPin className="h-5 w-5" />,
      colorClass: "bg-health-green-light text-health-green",
      delay: "500ms"
    },
    {
      title: "Diet & Nutrition",
      description: "Receive personalized meal plans and nutrition advice based on your health profile.",
      icon: <Heart className="h-5 w-5" />,
      colorClass: "bg-health-red-light text-health-red",
      delay: "600ms"
    },
    {
      title: "Disease Outbreak Alerts",
      description: "Get real-time alerts about health risks in your area to stay informed and safe.",
      icon: <AlertTriangle className="h-5 w-5" />,
      colorClass: "bg-health-orange-light text-health-orange",
      delay: "700ms"
    },
    {
      title: "Local Health Resources",
      description: "Find nearby hospitals, clinics, pharmacies, and emergency services when needed.",
      icon: <Users className="h-5 w-5" />,
      colorClass: "bg-health-blue-light text-health-blue",
      delay: "800ms"
    }
  ];

  return (
    <section className="py-12 md:py-24 bg-secondary/40">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-[800px] mx-auto mb-12 md:mb-16 animate-in">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Comprehensive Healthcare at Your Fingertips
          </h2>
          <p className="text-muted-foreground md:text-lg">
            ArogyaAI+ offers a suite of AI-powered tools and services to help you manage your health effectively from anywhere.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              colorClass={feature.colorClass}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;
