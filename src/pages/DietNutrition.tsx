import { useEffect } from "react";
import DietAdvisor from "@/components/diet/DietAdvisor";

export default function DietNutrition() {
  useEffect(() => {
    document.title = "Diet & Nutrition | ArogyaAI+";
  }, []);

  return (
    <div className="container max-w-6xl py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Personalized Diet & Nutrition</h1>
        <p className="text-muted-foreground">
          Get customized meal plans and nutrition advice based on your health profile and preferences
        </p>
      </div>
      
      <DietAdvisor />
    </div>
  );
} 