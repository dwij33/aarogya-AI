
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type BreathingPhase = "inhale" | "hold" | "exhale" | "rest";

interface BreathingPattern {
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  rest: number;
}

const breathingPatterns: BreathingPattern[] = [
  {
    name: "4-7-8 Breathing",
    description: "Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Helps reduce anxiety and aid sleep.",
    inhale: 4,
    hold: 7,
    exhale: 8,
    rest: 1
  },
  {
    name: "Box Breathing",
    description: "Equal counts of 4 for inhale, hold, exhale, and rest. Used by Navy SEALs for stress management.",
    inhale: 4,
    hold: 4,
    exhale: 4,
    rest: 4
  },
  {
    name: "Calm Breathing",
    description: "Slower breathing pattern to induce relaxation and reduce stress response.",
    inhale: 5,
    hold: 2,
    exhale: 6,
    rest: 2
  }
];

export function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [currentPattern, setCurrentPattern] = useState<BreathingPattern>(breathingPatterns[0]);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>("inhale");
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalCycles, setTotalCycles] = useState(0);
  const [expandCircle, setExpandCircle] = useState(false);
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Calculate total cycle time
  const totalCycleTime = currentPattern.inhale + currentPattern.hold + 
                         currentPattern.exhale + currentPattern.rest;

  // Effect to handle the breathing timer
  useEffect(() => {
    if (isActive) {
      // Initialize phase
      if (timeLeft === 0) {
        setCurrentPhase("inhale");
        setTimeLeft(currentPattern.inhale);
        setExpandCircle(true);
      }

      timerRef.current = window.setTimeout(() => {
        if (timeLeft > 1) {
          // Continue current phase
          setTimeLeft(timeLeft - 1);
        } else {
          // Move to next phase
          let nextPhase: BreathingPhase;
          let nextDuration: number;
          let shouldExpand: boolean;

          switch (currentPhase) {
            case "inhale":
              nextPhase = "hold";
              nextDuration = currentPattern.hold;
              shouldExpand = true;
              break;
            case "hold":
              nextPhase = "exhale";
              nextDuration = currentPattern.exhale;
              shouldExpand = false;
              break;
            case "exhale":
              nextPhase = "rest";
              nextDuration = currentPattern.rest;
              shouldExpand = false;
              break;
            case "rest":
              nextPhase = "inhale";
              nextDuration = currentPattern.inhale;
              shouldExpand = true;
              setTotalCycles(prev => prev + 1);
              break;
            default:
              nextPhase = "inhale";
              nextDuration = currentPattern.inhale;
              shouldExpand = true;
          }

          setCurrentPhase(nextPhase);
          setTimeLeft(nextDuration);
          setExpandCircle(shouldExpand);
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, timeLeft, currentPhase, currentPattern]);

  const handleStartStop = () => {
    if (isActive) {
      // Stop the exercise
      setIsActive(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      toast({
        title: "Breathing exercise paused",
        description: `You completed ${totalCycles} full cycles.`
      });
    } else {
      // Start the exercise
      setIsActive(true);
      setTimeLeft(0); // Will reset in the effect
      toast({
        title: "Breathing exercise started",
        description: `Follow the ${currentPattern.name} pattern.`
      });
    }
  };

  const handleReset = () => {
    setIsActive(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentPhase("inhale");
    setTimeLeft(0);
    setTotalCycles(0);
    setExpandCircle(false);
    toast({
      title: "Breathing exercise reset",
      description: "Ready to begin when you are."
    });
  };

  const changePattern = (pattern: BreathingPattern) => {
    if (isActive) {
      handleReset();
    }
    setCurrentPattern(pattern);
    toast({
      title: `Selected: ${pattern.name}`,
      description: pattern.description
    });
  };

  // Calculate progress percentage for the current phase
  const getProgressPercentage = () => {
    let total;
    switch (currentPhase) {
      case "inhale":
        total = currentPattern.inhale;
        break;
      case "hold":
        total = currentPattern.hold;
        break;
      case "exhale":
        total = currentPattern.exhale;
        break;
      case "rest":
        total = currentPattern.rest;
        break;
      default:
        total = 1;
    }
    return ((total - timeLeft) / total) * 100;
  };

  const getPhaseInstructions = () => {
    switch (currentPhase) {
      case "inhale":
        return "Breathe in slowly through your nose";
      case "hold":
        return "Hold your breath";
      case "exhale":
        return "Breathe out slowly through your mouth";
      case "rest":
        return "Pause before the next breath";
      default:
        return "Get ready to begin";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative mb-8">
            <div
              className={cn(
                "rounded-full border-4 border-primary p-1 transition-all duration-1000",
                expandCircle ? "w-64 h-64" : "w-36 h-36"
              )}
            >
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <h3 className="text-2xl font-bold">
                  {isActive ? timeLeft : "Ready"}
                </h3>
                <p className="text-muted-foreground capitalize mt-1">
                  {isActive ? currentPhase : "Press Start"}
                </p>
                {isActive && totalCycles > 0 && (
                  <p className="text-xs mt-3 text-muted-foreground">
                    Cycles: {totalCycles}
                  </p>
                )}
              </div>
            </div>
          </div>

          {isActive && (
            <div className="w-full max-w-md mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize">{currentPhase}</span>
                <span>{getProgressPercentage().toFixed(0)}%</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
              <p className="text-center mt-3 text-muted-foreground">
                {getPhaseInstructions()}
              </p>
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              onClick={handleStartStop}
              size="lg"
              className="w-32"
            >
              {isActive ? (
                <>
                  <Pause className="mr-2 h-4 w-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" /> Start
                </>
              )}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              disabled={!isActive && totalCycles === 0}
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Breathing Patterns</h3>
        <div className="space-y-3">
          {breathingPatterns.map((pattern) => (
            <Card
              key={pattern.name}
              className={cn(
                "cursor-pointer hover:border-primary transition-colors",
                currentPattern.name === pattern.name
                  ? "border-2 border-primary"
                  : ""
              )}
              onClick={() => changePattern(pattern)}
            >
              <CardContent className="p-4">
                <h4 className="font-medium">{pattern.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {pattern.description}
                </p>
                <div className="mt-2 flex items-center justify-center space-x-3 text-sm">
                  <div className="text-center">
                    <span className="block font-medium">{pattern.inhale}</span>
                    <span className="text-xs text-muted-foreground">
                      Inhale
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="block font-medium">{pattern.hold}</span>
                    <span className="text-xs text-muted-foreground">Hold</span>
                  </div>
                  <div className="text-center">
                    <span className="block font-medium">{pattern.exhale}</span>
                    <span className="text-xs text-muted-foreground">
                      Exhale
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="block font-medium">{pattern.rest}</span>
                    <span className="text-xs text-muted-foreground">Rest</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 bg-secondary/30 rounded-lg p-4">
          <h4 className="font-medium">Benefits of Breathing Exercises</h4>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• Reduces stress and anxiety</li>
            <li>• Lowers blood pressure</li>
            <li>• Improves focus and concentration</li>
            <li>• Helps with sleep quality</li>
            <li>• Increases emotional regulation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
