import { useEffect } from "react";
import ReportAnalyzer from "./ReportAnalyzer";

export default function ReportsPage() {
  useEffect(() => {
    // Set page title
    document.title = "Report Analyzer | ArogyaAI+";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-[800px] mx-auto mb-8 md:mb-12 animate-in">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Medical Report Analyzer
              </h1>
              <p className="text-muted-foreground md:text-lg">
                Analyze medical reports with high accuracy using advanced medical science knowledge integrated with datastore1.csv
              </p>
            </div>
            <div className="max-w-5xl mx-auto">
              <ReportAnalyzer />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 