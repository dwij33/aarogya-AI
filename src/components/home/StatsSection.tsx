
import { Card, CardContent } from "@/components/ui/card";

export function StatsSection() {
  const stats = [
    { label: "Registered Users", value: "100,000+", description: "Growing daily" },
    { label: "Rural Areas Served", value: "1,000+", description: "Across the country" },
    { label: "Healthcare Professionals", value: "500+", description: "Specialized doctors" },
    { label: "AI Diagnosis Accuracy", value: "95%", description: "And improving" },
  ];

  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-in">
          {stats.map((stat, index) => (
            <Card key={index} className="border-none shadow-lg bg-gradient-to-br from-white to-health-blue-light/20 dark:from-card dark:to-health-blue-dark/10">
              <CardContent className="p-6">
                <div className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-2">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
