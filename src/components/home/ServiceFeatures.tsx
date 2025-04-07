import { ReactNode } from "react";
import { 
  Stethoscope, 
  Brain, 
  Calendar, 
  Users, 
  Apple, 
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
}

const ServiceCard = ({ title, description, icon, className }: ServiceCardProps) => {
  return (
    <div className={cn("flex flex-col p-6 bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow", className)}>
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export function ServiceFeatures() {
  const services = [
    {
      title: "AI Symptom Checker",
      description: "Get instant health assessments powered by advanced NLP for accurate symptom analysis.",
      icon: <Stethoscope className="h-6 w-6" />
    },
    {
      title: "Mental Health AI Chat",
      description: "Access 24/7 support with our specialized mental health chatbot for guidance and resources.",
      icon: <Brain className="h-6 w-6" />
    },
    {
      title: "Smart Appointment Scheduling",
      description: "Book appointments with doctors using our AI-powered scheduling system with instant confirmation.",
      icon: <Calendar className="h-6 w-6" />
    },
    {
      title: "Nearby Doctors in Pune",
      description: "Find top healthcare specialists in Pune with ratings, availability, and direct booking options.",
      icon: <Users className="h-6 w-6" />
    },
    {
      title: "Diet & Nutrition",
      description: "Receive personalized meal plans and nutrition advice based on your health profile.",
      icon: <Apple className="h-6 w-6" />
    },
    {
      title: "Disease Outbreak Alerts",
      description: "Get real-time alerts about health risks in your area to stay informed and safe.",
      icon: <AlertCircle className="h-6 w-6" />
    }
  ];

  return (
    <section className="container py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Our Services</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          ArogyaAI+ offers a comprehensive suite of AI-powered healthcare services
          designed to provide personalized care and support.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <ServiceCard 
            key={index}
            title={service.title}
            description={service.description}
            icon={service.icon}
          />
        ))}
      </div>
    </section>
  );
} 