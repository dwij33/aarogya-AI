
import { useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  ChevronLeft, 
  ChevronRight, 
  Star 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  image: string;
  quote: string;
  rating: number;
}

export function TestimonialSection() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Rajesh Kumar",
      location: "Rajasthan, India",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      quote: "ArogyaAI+ has been a lifesaver for my family. Living in a remote village with limited healthcare access, the AI symptom checker helped identify my father's condition early, and we got connected to a specialist right away.",
      rating: 5
    },
    {
      id: 2,
      name: "Meera Singh",
      location: "Bihar, India",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      quote: "The mental health chatbot provided me comfort and guidance during a difficult time. I could speak openly about my anxiety in my native language, which made all the difference in my healing journey.",
      rating: 5
    },
    {
      id: 3,
      name: "Arjun Patel",
      location: "Gujarat, India",
      image: "https://randomuser.me/api/portraits/men/62.jpg",
      quote: "Managing my diabetes has become much easier with the medication reminders and personalized diet suggestions. The app even adjusts my meal plans based on local seasonal foods available in my area.",
      rating: 4
    },
    {
      id: 4,
      name: "Lakshmi Devi",
      location: "Tamil Nadu, India",
      image: "https://randomuser.me/api/portraits/women/26.jpg",
      quote: "The disease outbreak alerts helped our community prepare before a dengue outbreak reached our village. The preventive measures suggested by ArogyaAI+ protected many families from infection.",
      rating: 5
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const nextTestimonial = () => {
    setDirection("right");
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
      setDirection(null);
    }, 300);
  };

  const prevTestimonial = () => {
    setDirection("left");
    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setDirection(null);
    }, 300);
  };

  return (
    <section className="py-12 md:py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-[800px] mx-auto mb-12 md:mb-16 animate-in">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Trusted by Communities Across the Country
          </h2>
          <p className="text-muted-foreground md:text-lg">
            Hear from people whose lives have been improved by ArogyaAI+'s accessible healthcare solutions.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <Card className="border-none shadow-xl bg-card">
            <CardContent className="p-8 md:p-10">
              <div 
                className={cn(
                  "flex flex-col items-center text-center transition-opacity duration-300",
                  direction === "left" ? "animate-slide-out-left" : direction === "right" ? "animate-slide-out-right" : ""
                )}
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-health-blue-light">
                    <img 
                      src={testimonials[activeIndex].image} 
                      alt={testimonials[activeIndex].name}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-health-green text-white px-2 py-0.5 rounded-md text-xs">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          className={i < testimonials[activeIndex].rating ? "fill-current" : ""} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <blockquote className="mb-4">
                  <p className="text-lg md:text-xl italic">"{testimonials[activeIndex].quote}"</p>
                </blockquote>

                <div>
                  <p className="font-medium">{testimonials[activeIndex].name}</p>
                  <p className="text-sm text-muted-foreground">{testimonials[activeIndex].location}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 flex justify-between px-4">
            <Button 
              variant="outline"
              size="icon"
              className="rounded-full shadow-md bg-background dark:bg-card h-10 w-10 -translate-x-1/2"
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </Button>
            <Button 
              variant="outline"
              size="icon"
              className="rounded-full shadow-md bg-background dark:bg-card h-10 w-10 translate-x-1/2"
              onClick={nextTestimonial}
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </Button>
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  activeIndex === index ? "w-8 bg-health-blue" : "w-2 bg-health-blue/30"
                }`}
                onClick={() => {
                  setDirection(index > activeIndex ? "right" : "left");
                  setTimeout(() => {
                    setActiveIndex(index);
                    setDirection(null);
                  }, 300);
                }}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialSection;
