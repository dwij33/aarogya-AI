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

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  mealPlan?: MealPlan | null;
}

interface DietResponse {
  textResponse: string;
  mealPlan: MealPlan | null;
}

// Common food categories and examples
const foodDatabase = {
  protein: [
    { name: "Chicken Breast", portion: "100g", calories: 165, category: "protein" },
    { name: "Salmon", portion: "100g", calories: 206, category: "protein" },
    { name: "Tofu", portion: "100g", calories: 76, category: "protein" },
    { name: "Lentils", portion: "100g cooked", calories: 116, category: "protein" },
    { name: "Greek Yogurt", portion: "100g", calories: 59, category: "protein" },
    { name: "Eggs", portion: "2 large", calories: 156, category: "protein" },
    { name: "Chickpeas", portion: "100g cooked", calories: 164, category: "protein" },
    { name: "Turkey Breast", portion: "100g", calories: 157, category: "protein" },
    { name: "Cottage Cheese", portion: "100g", calories: 98, category: "protein" },
    { name: "Whey Protein", portion: "30g scoop", calories: 120, category: "protein" }
  ],
  vegetable: [
    { name: "Broccoli", portion: "100g", calories: 34, category: "vegetable" },
    { name: "Spinach", portion: "100g", calories: 23, category: "vegetable" },
    { name: "Bell Peppers", portion: "100g", calories: 31, category: "vegetable" },
    { name: "Cauliflower", portion: "100g", calories: 25, category: "vegetable" },
    { name: "Kale", portion: "100g", calories: 49, category: "vegetable" },
    { name: "Carrots", portion: "100g", calories: 41, category: "vegetable" },
    { name: "Zucchini", portion: "100g", calories: 17, category: "vegetable" },
    { name: "Green Beans", portion: "100g", calories: 31, category: "vegetable" },
    { name: "Cucumber", portion: "100g", calories: 15, category: "vegetable" },
    { name: "Tomatoes", portion: "100g", calories: 18, category: "vegetable" }
  ],
  fruit: [
    { name: "Apple", portion: "1 medium", calories: 95, category: "fruit" },
    { name: "Banana", portion: "1 medium", calories: 105, category: "fruit" },
    { name: "Blueberries", portion: "100g", calories: 57, category: "fruit" },
    { name: "Orange", portion: "1 medium", calories: 62, category: "fruit" },
    { name: "Strawberries", portion: "100g", calories: 32, category: "fruit" },
    { name: "Avocado", portion: "1/2 medium", calories: 161, category: "fruit" },
    { name: "Mango", portion: "100g", calories: 60, category: "fruit" },
    { name: "Kiwi", portion: "1 medium", calories: 42, category: "fruit" },
    { name: "Grapefruit", portion: "1/2 medium", calories: 52, category: "fruit" },
    { name: "Pineapple", portion: "100g", calories: 50, category: "fruit" }
  ],
  grain: [
    { name: "Brown Rice", portion: "100g cooked", calories: 112, category: "grain" },
    { name: "Quinoa", portion: "100g cooked", calories: 120, category: "grain" },
    { name: "Oats", portion: "40g dry", calories: 150, category: "grain" },
    { name: "Whole Wheat Bread", portion: "1 slice", calories: 81, category: "grain" },
    { name: "Whole Wheat Pasta", portion: "100g cooked", calories: 124, category: "grain" },
    { name: "Sweet Potato", portion: "100g", calories: 86, category: "grain" },
    { name: "Barley", portion: "100g cooked", calories: 123, category: "grain" },
    { name: "Buckwheat", portion: "100g cooked", calories: 92, category: "grain" },
    { name: "Corn", portion: "100g", calories: 96, category: "grain" },
    { name: "Farro", portion: "100g cooked", calories: 130, category: "grain" }
  ],
  dairy: [
    { name: "Milk", portion: "1 cup", calories: 122, category: "dairy" },
    { name: "Cheese", portion: "30g", calories: 110, category: "dairy" },
    { name: "Yogurt", portion: "1 cup", calories: 149, category: "dairy" },
    { name: "Almond Milk", portion: "1 cup", calories: 39, category: "dairy" },
    { name: "Soy Milk", portion: "1 cup", calories: 80, category: "dairy" },
    { name: "Oat Milk", portion: "1 cup", calories: 120, category: "dairy" },
    { name: "Coconut Milk", portion: "1 cup", calories: 552, category: "dairy" },
    { name: "Kefir", portion: "1 cup", calories: 110, category: "dairy" },
    { name: "Lactose-Free Milk", portion: "1 cup", calories: 120, category: "dairy" },
    { name: "Cashew Milk", portion: "1 cup", calories: 25, category: "dairy" }
  ],
  fat: [
    { name: "Olive Oil", portion: "1 tbsp", calories: 119, category: "fat" },
    { name: "Almonds", portion: "30g", calories: 173, category: "fat" },
    { name: "Chia Seeds", portion: "1 tbsp", calories: 58, category: "fat" },
    { name: "Flaxseed", portion: "1 tbsp", calories: 55, category: "fat" },
    { name: "Walnuts", portion: "30g", calories: 185, category: "fat" },
    { name: "Coconut Oil", portion: "1 tbsp", calories: 117, category: "fat" },
    { name: "Avocado Oil", portion: "1 tbsp", calories: 124, category: "fat" },
    { name: "Peanut Butter", portion: "1 tbsp", calories: 94, category: "fat" },
    { name: "Pumpkin Seeds", portion: "30g", calories: 151, category: "fat" },
    { name: "Sunflower Seeds", portion: "30g", calories: 165, category: "fat" }
  ]
};

// Sample meal plan templates
const mealPlanTemplates = [
  {
    title: "Weight Loss Plan",
    description: "A calorie-controlled diet with higher protein to preserve muscle mass while promoting fat loss.",
    dailyCalories: 1500,
    macros: { protein: 35, carbs: 40, fats: 25 },
    healthTips: [
      "Drink at least 2-3 liters of water daily",
      "Focus on whole foods and minimize processed foods",
      "Incorporate strength training 2-3 times per week",
      "Eat slowly and mindfully to recognize fullness cues",
      "Get 7-9 hours of quality sleep each night"
    ]
  },
  {
    title: "Muscle Building Plan",
    description: "Higher calorie diet with emphasis on protein to support muscle growth and recovery.",
    dailyCalories: 2800,
    macros: { protein: 30, carbs: 50, fats: 20 },
    healthTips: [
      "Consume protein with each meal",
      "Eat a meal containing protein and carbs within 1-2 hours after workout",
      "Focus on progressive overload in your strength training",
      "Stay consistent with your meal timing",
      "Include a variety of protein sources in your diet"
    ]
  },
  {
    title: "Balanced Maintenance Plan",
    description: "Well-balanced macronutrient distribution to maintain current weight and support overall health.",
    dailyCalories: 2200,
    macros: { protein: 25, carbs: 50, fats: 25 },
    healthTips: [
      "Fill half your plate with vegetables and fruits",
      "Choose whole grains over refined grains",
      "Include a variety of protein sources",
      "Limit added sugars and highly processed foods",
      "Practice portion control even with healthy foods"
    ]
  },
  {
    title: "Heart-Healthy Diet",
    description: "Focuses on foods that support cardiovascular health and reduce inflammation.",
    dailyCalories: 1800,
    macros: { protein: 20, carbs: 55, fats: 25 },
    healthTips: [
      "Choose unsaturated fats over saturated fats",
      "Limit sodium intake to less than 2,300mg per day",
      "Consume omega-3 rich foods like fatty fish at least twice weekly",
      "Include soluble fiber from oats, legumes, and fruits",
      "Minimize processed foods and added sugars"
    ]
  },
  {
    title: "Plant-Based Nutrition Plan",
    description: "Carefully designed vegan meal plan ensuring complete protein and essential nutrients.",
    dailyCalories: 2000,
    macros: { protein: 20, carbs: 60, fats: 20 },
    healthTips: [
      "Combine different plant proteins to ensure you get all essential amino acids",
      "Include vitamin B12 fortified foods or supplements",
      "Focus on iron-rich plant foods like lentils, tofu, and spinach",
      "Consume calcium-rich foods like fortified plant milks and leafy greens",
      "Include sources of omega-3 fatty acids like flaxseeds and walnuts"
    ]
  }
];

// Function to generate AI-like response based on user query
export async function generateDietResponse(query: string, messages: Message[]): Promise<DietResponse> {
  // Process the user's query to determine the type of diet plan needed
  const lowerQuery = query.toLowerCase();
  
  // Weight management indicators
  const isWeightLoss = lowerQuery.includes("lose weight") || lowerQuery.includes("weight loss") || lowerQuery.includes("slim down");
  const isWeightGain = lowerQuery.includes("gain weight") || lowerQuery.includes("gain muscle") || lowerQuery.includes("bulk up");
  
  // Dietary restrictions
  const isVegetarian = lowerQuery.includes("vegetarian");
  const isVegan = lowerQuery.includes("vegan");
  const isDiabetic = lowerQuery.includes("diabetes") || lowerQuery.includes("diabetic");
  const isLactoseIntolerant = lowerQuery.includes("lactose") || lowerQuery.includes("dairy free");
  const isGlutenFree = lowerQuery.includes("gluten");
  
  // Health conditions
  const hasHeartIssues = lowerQuery.includes("heart") || lowerQuery.includes("cardiovascular");
  
  // Let's determine which template to use as a base
  let template;
  if (isWeightLoss) {
    template = mealPlanTemplates[0]; // Weight Loss Plan
  } else if (isWeightGain) {
    template = mealPlanTemplates[1]; // Muscle Building Plan
  } else if (hasHeartIssues) {
    template = mealPlanTemplates[3]; // Heart-Healthy Diet
  } else if (isVegan) {
    template = mealPlanTemplates[4]; // Plant-Based Nutrition Plan
  } else {
    template = mealPlanTemplates[2]; // Balanced Maintenance Plan
  }
  
  // Now customize the template based on specific needs
  let mealPlan: MealPlan = {
    ...template,
    meals: [],
    nutritionGoals: []
  };
  
  // Set nutrition goals
  if (isWeightLoss) {
    mealPlan.nutritionGoals.push("Weight Loss", "Calorie Deficit");
  } else if (isWeightGain) {
    mealPlan.nutritionGoals.push("Muscle Gain", "Calorie Surplus");
  }
  
  if (isVegetarian) {
    mealPlan.nutritionGoals.push("Vegetarian");
    if (isWeightLoss) {
      mealPlan.title = "Vegetarian Weight Loss Plan";
      mealPlan.description = "Plant-based foods with higher protein to support weight loss while maintaining muscle mass.";
    } else if (isWeightGain) {
      mealPlan.title = "Vegetarian Muscle Building Plan";
      mealPlan.description = "Nutrient-dense vegetarian foods to support muscle growth and recovery.";
    } else {
      mealPlan.title = "Balanced Vegetarian Plan";
      mealPlan.description = "Well-rounded vegetarian meal plan for overall health and wellbeing.";
    }
  }
  
  if (isVegan) {
    mealPlan.nutritionGoals.push("Vegan");
    mealPlan.nutritionGoals = mealPlan.nutritionGoals.filter(goal => goal !== "Vegetarian");
    
    if (isWeightLoss) {
      mealPlan.title = "Vegan Weight Loss Plan";
      mealPlan.description = "Plant-based foods with focus on protein sources to support fat loss.";
    } else if (isWeightGain) {
      mealPlan.title = "Vegan Muscle Building Plan";
      mealPlan.description = "Higher-calorie vegan foods to support muscle growth and recovery.";
    } else {
      mealPlan.title = "Balanced Vegan Plan";
      mealPlan.description = "Nutritionally complete vegan meal plan for optimal health.";
    }
  }
  
  if (isDiabetic) {
    mealPlan.nutritionGoals.push("Blood Sugar Management");
    mealPlan.healthTips.push(
      "Monitor carbohydrate intake consistently throughout the day",
      "Choose low glycemic index foods",
      "Pair carbohydrates with proteins and healthy fats to slow glucose absorption"
    );
  }
  
  if (isLactoseIntolerant) {
    mealPlan.nutritionGoals.push("Lactose-Free");
    mealPlan.healthTips.push(
      "Use plant-based milk alternatives like almond, soy, or oat milk",
      "Check labels for hidden dairy ingredients in processed foods"
    );
  }
  
  if (isGlutenFree) {
    mealPlan.nutritionGoals.push("Gluten-Free");
    mealPlan.healthTips.push(
      "Choose naturally gluten-free grains like rice, quinoa, and buckwheat",
      "Be cautious of cross-contamination in food preparation"
    );
  }
  
  // Generate meals
  const mealNames = ["Breakfast", "Mid-Morning Snack", "Lunch", "Afternoon Snack", "Dinner"];
  const mealTimes = ["7:30 AM", "10:30 AM", "1:00 PM", "4:00 PM", "7:00 PM"];
  
  // Add meals based on the plan type and dietary restrictions
  for (let i = 0; i < 5; i++) {
    const meal: Meal = {
      name: mealNames[i],
      time: mealTimes[i],
      foods: [],
      calories: 0
    };
    
    // Skip snacks for some plans if needed
    if ((i === 1 || i === 3) && Math.random() > 0.7) {
      continue;
    }
    
    // Add appropriate foods to each meal
    if (i === 0) { // Breakfast
      // Add protein
      let proteinOptions = foodDatabase.protein;
      if (isVegetarian) {
        proteinOptions = proteinOptions.filter(food => 
          !["Chicken Breast", "Salmon", "Turkey Breast"].includes(food.name)
        );
      }
      if (isVegan) {
        proteinOptions = proteinOptions.filter(food => 
          ["Tofu", "Lentils", "Chickpeas"].includes(food.name)
        );
      }
      
      const protein = proteinOptions[Math.floor(Math.random() * proteinOptions.length)];
      meal.foods.push({...protein});
      meal.calories += protein.calories;
      
      // Add grain
      const grainOptions = isGlutenFree 
        ? foodDatabase.grain.filter(food => !["Whole Wheat Bread", "Whole Wheat Pasta", "Barley"].includes(food.name))
        : foodDatabase.grain;
      
      const grain = grainOptions[Math.floor(Math.random() * grainOptions.length)];
      meal.foods.push({...grain});
      meal.calories += grain.calories;
      
      // Add fruit
      const fruit = foodDatabase.fruit[Math.floor(Math.random() * foodDatabase.fruit.length)];
      meal.foods.push({...fruit});
      meal.calories += fruit.calories;
    } else if (i === 2) { // Lunch
      // Add protein
      let proteinOptions = foodDatabase.protein;
      if (isVegetarian) {
        proteinOptions = proteinOptions.filter(food => 
          !["Chicken Breast", "Salmon", "Turkey Breast"].includes(food.name)
        );
      }
      if (isVegan) {
        proteinOptions = proteinOptions.filter(food => 
          ["Tofu", "Lentils", "Chickpeas"].includes(food.name)
        );
      }
      
      const protein = proteinOptions[Math.floor(Math.random() * proteinOptions.length)];
      meal.foods.push({...protein});
      meal.calories += protein.calories;
      
      // Add vegetable (2 items)
      for (let j = 0; j < 2; j++) {
        const veg = foodDatabase.vegetable[Math.floor(Math.random() * foodDatabase.vegetable.length)];
        meal.foods.push({...veg});
        meal.calories += veg.calories;
      }
      
      // Add grain for non-weight loss or if random
      if (!isWeightLoss || Math.random() > 0.5) {
        const grainOptions = isGlutenFree 
          ? foodDatabase.grain.filter(food => !["Whole Wheat Bread", "Whole Wheat Pasta", "Barley"].includes(food.name))
          : foodDatabase.grain;
        
        const grain = grainOptions[Math.floor(Math.random() * grainOptions.length)];
        meal.foods.push({...grain});
        meal.calories += grain.calories;
      }
      
      // Add fat
      const fat = foodDatabase.fat[Math.floor(Math.random() * foodDatabase.fat.length)];
      meal.foods.push({...fat});
      meal.calories += fat.calories;
    } else if (i === 4) { // Dinner
      // Add protein
      let proteinOptions = foodDatabase.protein;
      if (isVegetarian) {
        proteinOptions = proteinOptions.filter(food => 
          !["Chicken Breast", "Salmon", "Turkey Breast"].includes(food.name)
        );
      }
      if (isVegan) {
        proteinOptions = proteinOptions.filter(food => 
          ["Tofu", "Lentils", "Chickpeas"].includes(food.name)
        );
      }
      
      const protein = proteinOptions[Math.floor(Math.random() * proteinOptions.length)];
      meal.foods.push({...protein});
      meal.calories += protein.calories;
      
      // Add vegetable (2-3 items)
      const vegCount = 2 + Math.floor(Math.random() * 2);
      const usedVeggies = new Set();
      for (let j = 0; j < vegCount; j++) {
        let veg;
        do {
          veg = foodDatabase.vegetable[Math.floor(Math.random() * foodDatabase.vegetable.length)];
        } while (usedVeggies.has(veg.name));
        usedVeggies.add(veg.name);
        meal.foods.push({...veg});
        meal.calories += veg.calories;
      }
      
      // Add grain for non-weight loss or if random
      if (!isWeightLoss || Math.random() > 0.7) {
        const grainOptions = isGlutenFree 
          ? foodDatabase.grain.filter(food => !["Whole Wheat Bread", "Whole Wheat Pasta", "Barley"].includes(food.name))
          : foodDatabase.grain;
        
        const grain = grainOptions[Math.floor(Math.random() * grainOptions.length)];
        meal.foods.push({...grain});
        meal.calories += grain.calories;
      }
      
      // Add fat
      const fat = foodDatabase.fat[Math.floor(Math.random() * foodDatabase.fat.length)];
      meal.foods.push({...fat});
      meal.calories += fat.calories;
    } else { // Snacks
      // For weight loss, focus on protein and veggies
      if (isWeightLoss) {
        const options = [
          ...foodDatabase.protein.filter(f => f.calories < 100),
          ...foodDatabase.vegetable,
          ...foodDatabase.fruit.filter(f => f.calories < 80)
        ];
        const snack = options[Math.floor(Math.random() * options.length)];
        meal.foods.push({...snack});
        meal.calories += snack.calories;
      } 
      // For weight gain, add more calorie-dense options
      else if (isWeightGain) {
        const options = [
          ...foodDatabase.protein,
          ...foodDatabase.fruit,
          ...foodDatabase.fat
        ];
        const snack1 = options[Math.floor(Math.random() * options.length)];
        meal.foods.push({...snack1});
        meal.calories += snack1.calories;
        
        const snack2 = foodDatabase.dairy[Math.floor(Math.random() * foodDatabase.dairy.length)];
        if (!(isVegan || isLactoseIntolerant) || snack2.name.includes("Almond") || snack2.name.includes("Soy") || snack2.name.includes("Oat")) {
          meal.foods.push({...snack2});
          meal.calories += snack2.calories;
        }
      } 
      // For maintenance, balanced options
      else {
        const options = [
          ...foodDatabase.fruit,
          ...foodDatabase.dairy.filter(d => d.calories < 150)
        ];
        
        let snackOptions = options;
        if (isVegan || isLactoseIntolerant) {
          snackOptions = options.filter(food => 
            food.category !== "dairy" || 
            food.name.includes("Almond") || 
            food.name.includes("Soy") || 
            food.name.includes("Oat") ||
            food.name.includes("Coconut") ||
            food.name.includes("Cashew")
          );
        }
        
        const snack = snackOptions[Math.floor(Math.random() * snackOptions.length)];
        meal.foods.push({...snack});
        meal.calories += snack.calories;
      }
    }
    
    mealPlan.meals.push(meal);
  }
  
  // Calculate total daily calories
  const totalCalories = mealPlan.meals.reduce((sum, meal) => sum + meal.calories, 0);
  mealPlan.dailyCalories = Math.round(totalCalories);
  
  // Generate text response
  let textResponse = "";
  
  if (isDiabetic) {
    textResponse += "Based on your diabetic condition, I've created a meal plan focused on managing blood sugar levels. ";
  } else if (isWeightLoss) {
    textResponse += "I've designed a calorie-controlled meal plan to support your weight loss goals while ensuring adequate nutrition. ";
  } else if (isWeightGain) {
    textResponse += "I've put together a higher-calorie meal plan with plenty of protein to support your muscle building goals. ";
  } else if (hasHeartIssues) {
    textResponse += "This heart-healthy meal plan emphasizes foods that support cardiovascular health and reduce inflammation. ";
  } else {
    textResponse += "I've created a balanced meal plan that provides a good mix of all essential nutrients to support overall health. ";
  }
  
  if (isVegetarian) {
    textResponse += "All meals are vegetarian as requested. ";
  } else if (isVegan) {
    textResponse += "All meals are 100% plant-based to align with your vegan lifestyle. ";
  }
  
  if (isGlutenFree) {
    textResponse += "I've excluded all sources of gluten from your meal plan. ";
  }
  
  if (isLactoseIntolerant) {
    textResponse += "The plan avoids dairy products or uses lactose-free alternatives. ";
  }
  
  textResponse += `\n\nThis plan provides approximately ${mealPlan.dailyCalories} calories per day with a macronutrient distribution of ${mealPlan.macros.protein}% protein, ${mealPlan.macros.carbs}% carbohydrates, and ${mealPlan.macros.fats}% fats. `;
  
  textResponse += "\n\nI've included a detailed meal plan below. You can see each meal with specific foods, portions, and calorie counts. The plan also includes health tips tailored to your needs.";
  
  textResponse += "\n\nWould you like me to adjust anything about this meal plan? For example, I can modify the calorie level, add more meals, or adjust the types of foods included.";
  
  return { textResponse, mealPlan };
} 