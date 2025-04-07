import { 
  Clock, Utensils, ChevronDown, ChevronUp,
  Apple, Carrot, Beef, Wheat, Coffee, CircleDot
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface MealPlanDisplayProps {
  mealPlan: MealPlan;
}

interface MealPlan {
  title: string;
  description: string;
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  meals: Meal[];
  healthTips: string[];
  nutritionGoals: string[];
}

interface Meal {
  name: string;
  time: string;
  foods: Food[];
  calories: number;
}

interface Food {
  name: string;
  portion: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  category: "protein" | "vegetable" | "fruit" | "grain" | "dairy" | "fat";
}

export default function MealPlanDisplay({ mealPlan }: MealPlanDisplayProps) {
  const [expandedMeal, setExpandedMeal] = useState<number | null>(0);

  const toggleMeal = (index: number) => {
    setExpandedMeal(expandedMeal === index ? null : index);
  };

  const getFoodIcon = (category: string) => {
    switch (category) {
      case "protein":
        return <Beef className="h-4 w-4 text-red-500" />;
      case "vegetable":
        return <Carrot className="h-4 w-4 text-orange-500" />;
      case "fruit":
        return <Apple className="h-4 w-4 text-green-500" />;
      case "grain":
        return <Wheat className="h-4 w-4 text-amber-500" />;
      case "dairy":
        return <Coffee className="h-4 w-4 text-blue-300" />;
      case "fat":
        return <CircleDot className="h-4 w-4 text-yellow-500" />;
      default:
        return <Utensils className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="bg-primary/5 p-3 rounded-md">
        <h3 className="font-bold text-lg">{mealPlan.title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{mealPlan.description}</p>
        
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="bg-white/50 p-2 rounded-md text-center">
            <div className="text-xl font-bold">{mealPlan.dailyCalories}</div>
            <div className="text-xs text-muted-foreground">calories/day</div>
          </div>
          <div className="bg-white/50 p-2 rounded-md text-center">
            <div className="text-xl font-bold">{mealPlan.meals.length}</div>
            <div className="text-xs text-muted-foreground">meals/day</div>
          </div>
          <div className="bg-white/50 p-2 rounded-md text-center">
            <div className="text-xl font-bold">{mealPlan.healthTips.length}</div>
            <div className="text-xs text-muted-foreground">health tips</div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Macronutrient Distribution</h4>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Protein ({mealPlan.macros.protein}%)</span>
                <span>Carbs ({mealPlan.macros.carbs}%)</span>
                <span>Fats ({mealPlan.macros.fats}%)</span>
              </div>
              <div className="flex h-2 overflow-hidden rounded-full bg-primary/10">
                <div 
                  className="bg-red-500" 
                  style={{ width: `${mealPlan.macros.protein}%` }}
                />
                <div 
                  className="bg-amber-500" 
                  style={{ width: `${mealPlan.macros.carbs}%` }}
                />
                <div 
                  className="bg-blue-500" 
                  style={{ width: `${mealPlan.macros.fats}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {mealPlan.meals.map((meal, index) => (
          <Card key={index} className="overflow-hidden">
            <div 
              className="p-3 flex justify-between items-center cursor-pointer hover:bg-muted/50"
              onClick={() => toggleMeal(index)}
            >
              <div className="flex items-center">
                <Utensils className="h-4 w-4 mr-2 text-health-green" />
                <div>
                  <h4 className="font-medium">{meal.name}</h4>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{meal.time}</span>
                    <span className="mx-2">•</span>
                    <span>{meal.calories} cal</span>
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="flex gap-1 items-center">
                {meal.foods.length} items
                {expandedMeal === index ? 
                  <ChevronUp className="h-3 w-3" /> : 
                  <ChevronDown className="h-3 w-3" />
                }
              </Badge>
            </div>
            
            {expandedMeal === index && (
              <CardContent className="pb-3 pt-0 px-3 bg-card/50">
                <div className="divide-y">
                  {meal.foods.map((food, foodIndex) => (
                    <div key={foodIndex} className="py-2 flex justify-between items-center">
                      <div className="flex items-center">
                        {getFoodIcon(food.category)}
                        <div className="ml-2">
                          <div className="text-sm font-medium">{food.name}</div>
                          <div className="text-xs text-muted-foreground">{food.portion}</div>
                        </div>
                      </div>
                      <div className="text-xs font-medium">{food.calories} cal</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {mealPlan.healthTips.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Health Tips</h4>
          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
            {mealPlan.healthTips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {mealPlan.nutritionGoals.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Your Nutrition Goals</h4>
          <div className="flex flex-wrap gap-2">
            {mealPlan.nutritionGoals.map((goal, index) => (
              <Badge key={index} variant="secondary">{goal}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 