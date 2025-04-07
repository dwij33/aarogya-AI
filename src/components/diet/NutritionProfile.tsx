import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { CardContent } from "@/components/ui/card";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const nutritionFormSchema = z.object({
  age: z.string().min(1, { message: "Age is required" }),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
  weight: z.string().min(1, { message: "Weight is required" }),
  height: z.string().min(1, { message: "Height is required" }),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very-active"], {
    required_error: "Activity level is required"
  }),
  goal: z.enum(["lose", "maintain", "gain"], {
    required_error: "Nutrition goal is required"
  }),
  dietType: z.enum(["omnivore", "vegetarian", "vegan", "pescatarian", "paleo", "keto", "other"], {
    required_error: "Diet type is required"
  }),
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
  dislikedFoods: z.string().optional(),
  preferredCuisines: z.array(z.string()).optional(),
  mealFrequency: z.enum(["2", "3", "4", "5", "6"], {
    required_error: "Meal frequency is required"
  }),
  cookingTime: z.enum(["minimal", "moderate", "extensive"], {
    required_error: "Cooking time preference is required"
  }),
  budget: z.enum(["low", "medium", "high"], {
    required_error: "Budget preference is required"
  }),
});

type NutritionFormValues = z.infer<typeof nutritionFormSchema>;

const defaultValues: Partial<NutritionFormValues> = {
  age: "",
  gender: "male",
  weight: "",
  height: "",
  activityLevel: "moderate",
  goal: "maintain",
  dietType: "omnivore",
  allergies: "",
  medicalConditions: "",
  dislikedFoods: "",
  preferredCuisines: [],
  mealFrequency: "3",
  cookingTime: "moderate",
  budget: "medium",
};

const cuisineOptions = [
  { id: "indian", label: "Indian" },
  { id: "italian", label: "Italian" },
  { id: "chinese", label: "Chinese" },
  { id: "mediterranean", label: "Mediterranean" },
  { id: "mexican", label: "Mexican" },
  { id: "japanese", label: "Japanese" },
  { id: "thai", label: "Thai" },
  { id: "american", label: "American" }
];

export default function NutritionProfile() {
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<NutritionFormValues>({
    resolver: zodResolver(nutritionFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: NutritionFormValues) {
    // In a real app, you would send this data to your backend
    console.log(data);
    toast({
      title: "Nutrition profile updated",
      description: "Your nutrition preferences have been saved.",
    });
    setIsEditing(false);
  }

  return (
    <CardContent className="py-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Your Nutrition Profile</h3>
        {!isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your age" 
                        {...field} 
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
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
                      disabled={!isEditing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your weight" 
                        {...field} 
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your height" 
                        {...field} 
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Activity & Goals</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="activityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Level</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!isEditing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select activity level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                        <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                        <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                        <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                        <SelectItem value="very-active">Very Active (2x training/day)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nutrition Goal</FormLabel>
                    <FormControl>
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        className="flex space-x-4"
                        disabled={!isEditing}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="lose" id="lose" />
                          <Label htmlFor="lose">Lose Weight</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="maintain" id="maintain" />
                          <Label htmlFor="maintain">Maintain</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="gain" id="gain" />
                          <Label htmlFor="gain">Gain Mass</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Dietary Preferences</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dietType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diet Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!isEditing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select diet type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="omnivore">Omnivore (Everything)</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="pescatarian">Pescatarian</SelectItem>
                        <SelectItem value="paleo">Paleo</SelectItem>
                        <SelectItem value="keto">Keto</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies & Intolerances</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., dairy, nuts, gluten" 
                        {...field} 
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormDescription>
                      Separate with commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medicalConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Conditions</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., diabetes, hypertension" 
                        className="resize-none"
                        {...field} 
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dislikedFoods"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disliked Foods</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., broccoli, seafood" 
                        {...field} 
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormDescription>
                      Separate with commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="preferredCuisines"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel>Preferred Cuisines</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {cuisineOptions.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="preferredCuisines"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-2 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), item.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        )
                                  }}
                                  disabled={!isEditing}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Meal Planning Preferences</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="mealFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meals Per Day</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!isEditing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select meal frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="2">2 meals per day</SelectItem>
                        <SelectItem value="3">3 meals per day</SelectItem>
                        <SelectItem value="4">4 meals per day</SelectItem>
                        <SelectItem value="5">5 meals per day</SelectItem>
                        <SelectItem value="6">6+ meals per day</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cookingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cooking Time</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!isEditing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cooking time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="minimal">Minimal (15 min or less)</SelectItem>
                        <SelectItem value="moderate">Moderate (30-45 min)</SelectItem>
                        <SelectItem value="extensive">Extensive (45+ min)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!isEditing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Budget-friendly</SelectItem>
                        <SelectItem value="medium">Moderate</SelectItem>
                        <SelectItem value="high">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Profile</Button>
            </div>
          )}
        </form>
      </Form>
    </CardContent>
  );
} 