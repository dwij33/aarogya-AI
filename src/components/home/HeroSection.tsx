import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

// Add the CSS for animation as a style tag
const waveAnimationStyle = `
  @keyframes wave {
    0% { transform: rotate(0deg); }
    25% { transform: rotate(20deg); }
    50% { transform: rotate(0deg); }
    75% { transform: rotate(20deg); }
    100% { transform: rotate(0deg); }
  }
  
  .wave-animation .wave-hand {
    transform-origin: 75px 45px;
    animation: wave 1s ease-in-out;
  }
`;

export function HeroSection() {
  const animationRef = useRef<HTMLDivElement>(null);

  // Add animation effect when component mounts
  useEffect(() => {
    // Add the style to the document head
    const styleElement = document.createElement('style');
    styleElement.innerHTML = waveAnimationStyle;
    document.head.appendChild(styleElement);

    if (animationRef.current) {
      // Simple animation for waving
      const interval = setInterval(() => {
        if (animationRef.current) {
          animationRef.current.classList.add('wave-animation');
          setTimeout(() => {
            if (animationRef.current) {
              animationRef.current.classList.remove('wave-animation');
            }
          }, 1000);
        }
      }, 3000);

      return () => {
        clearInterval(interval);
        // Clean up the style when component unmounts
        document.head.removeChild(styleElement);
      };
    }
  }, []);

  return (
    <section className="relative py-12 md:py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-health-blue-light/30 to-transparent rounded-bl-[200px] transform translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-r from-health-green-light/30 to-transparent rounded-tr-[100px]" />
      </div>

      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4 animate-in">
            <div className="inline-block px-4 py-1.5 mb-4 text-xs md:text-sm font-medium rounded-full bg-health-green-light text-health-green-dark">
              AI-Powered Healthcare Access For Everyone
            </div>
            <div className="flex items-center">
              {/* Male Doctor Animation */}
              <div 
                ref={animationRef}
                className="male-doctor-animation mr-4 hidden sm:block"
                style={{
                  width: "120px",
                  height: "120px",
                  position: "relative"
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                  width="100%"
                  height="100%"
                >
                  {/* Doctor's head */}
                  <circle cx="50" cy="30" r="20" fill="#f5d0a9" />
                  {/* Doctor's hair */}
                  <path d="M30 30 A20 20 0 0 1 70 30 C70 20 65 15 50 15 C35 15 30 20 30 30" fill="#2b2b2b" />
                  {/* Doctor's face */}
                  <circle cx="42" cy="28" r="2" fill="#333" /> {/* Left eye */}
                  <circle cx="58" cy="28" r="2" fill="#333" /> {/* Right eye */}
                  <path d="M45 38 C48 40 52 40 55 38" fill="none" stroke="#333" strokeWidth="1" /> {/* Smile */}
                  {/* Doctor's body/coat */}
                  <path d="M35 50 L32 90 H68 L65 50 Z" fill="#ffffff" />
                  {/* Doctor's stethoscope */}
                  <path d="M45 55 C40 60 40 65 45 70" fill="none" stroke="#333" strokeWidth="2" />
                  <circle cx="45" cy="70" r="3" fill="#444" />
                  {/* Doctor's arm (waving hand) */}
                  <g className="wave-hand">
                    <path d="M65 50 L80 40" fill="none" stroke="#f5d0a9" strokeWidth="6" strokeLinecap="round" />
                    <path d="M80 40 L85 45" fill="none" stroke="#f5d0a9" strokeWidth="6" strokeLinecap="round" />
                  </g>
                  {/* Doctor's neck */}
                  <rect x="45" y="50" width="10" height="5" fill="#f5d0a9" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Your Health Companion, <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-health-blue to-health-green">
                  Powered by AI
                </span>
              </h1>
            </div>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              ArogyaAI+ bridges the healthcare gap for rural communities with AI health assessments, 
              teleconsultations, and personalized care plans—anytime, anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/register">
                  Get Started <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/symptom-checker">
                  Try AI Doctor
                </Link>
              </Button>
            </div>
            <div className="flex items-center space-x-4 mt-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-8 h-8 rounded-full bg-health-blue-${i * 100} border-2 border-background`}></div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-bold">4.9/5</span> from over{" "}
                <span className="font-bold">2,000+</span> happy users
              </div>
            </div>
          </div>
          <div className="mx-auto lg:mx-0 relative">
            <div className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-xl animate-in">
              <div className="absolute inset-0 bg-gradient-to-tr from-health-blue-dark/20 to-health-green/10" />
              <img
                src="https://images.unsplash.com/photo-1651043738423-d3d3b6104098?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000"
                alt="Doctor using digital tablet with patient"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-card rounded-lg overflow-hidden shadow-lg animate-in" style={{ width: "200px" }}>
              <div className="relative">
                {/* Background image filling the entire box */}
                <img 
                  src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=400" 
                  alt="Medical stethoscope" 
                  className="w-full h-full object-cover"
                  style={{ height: "120px" }}
                />
                
                {/* Dark overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
                
                {/* Content overlay positioned at the bottom */}
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-health-green-light flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-health-green-dark">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" />
                        <path d="m18 15-2-2" />
                        <path d="m15 18-2-2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Daily Health Tips</p>
                      <p className="text-xs text-white/80">Personalized for you</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -left-6 bg-white dark:bg-card rounded-lg p-4 shadow-lg animate-in">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-health-blue-light flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-health-blue-dark">
                    <path d="M16 12h6" />
                    <path d="M21 7v10" />
                    <path d="M12 3v18" />
                    <path d="M8 17a5 5 0 1 0 0-10" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">AI Diagnosis</p>
                  <p className="text-xs text-muted-foreground">Instant health checks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
