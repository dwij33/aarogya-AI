
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    
    // Simulating an API call
    setTimeout(() => {
      setIsLoading(false);
      setEmail("");
      
      toast({
        title: "Thanks for subscribing!",
        description: "We'll keep you updated on the latest health news and features.",
      });
    }, 1000);
  };

  return (
    <section className="py-12 md:py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-health-blue-light/20 to-health-green-light/20" />
      </div>
      
      <div className="container px-4 md:px-6">
        <div className="max-w-[900px] mx-auto text-center space-y-8 animate-in">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            Join the Health Revolution
          </h2>
          <p className="text-muted-foreground md:text-lg max-w-[600px] mx-auto">
            Sign up for our newsletter to receive health tips, feature updates, and important health alerts for your region.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-full h-12"
              aria-label="Email address"
            />
            <Button 
              type="submit" 
              className="rounded-full h-12" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Subscribing</span>
                </div>
              ) : (
                <span className="flex items-center">
                  Subscribe <ArrowRight size={16} className="ml-2" />
                </span>
              )}
            </Button>
          </form>
          
          <div className="pt-4">
            <p className="text-xs text-muted-foreground">
              By subscribing, you agree to our privacy policy and terms of service.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
