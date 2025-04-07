import { Clock, ExternalLink, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  source: string;
  date: string;
  imageUrl: string;
  url: string;
  category: string;
}

export function HealthNewsSection() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call to a news service
    // For this demo, we'll use mock data
    setTimeout(() => {
      setNews(mockNewsData);
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <section className="container py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Health News</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Stay updated with the latest health news, medical breakthroughs, and wellness trends.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div 
              key={index} 
              className="bg-card border rounded-lg shadow-sm h-[380px] animate-pulse"
            >
              <div className="h-40 bg-muted rounded-t-lg"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-24 bg-muted rounded mt-4"></div>
                <div className="h-4 bg-muted rounded w-1/4 mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </section>
  );
}

interface NewsCardProps {
  article: NewsArticle;
  className?: string;
}

const NewsCard = ({ article, className }: NewsCardProps) => {
  return (
    <div className={cn("flex flex-col overflow-hidden bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow", className)}>
      <div className="relative h-40 overflow-hidden">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
          {article.category}
        </div>
      </div>
      <div className="flex-1 p-4 flex flex-col">
        <h3 className="text-lg font-semibold line-clamp-2 mb-2">{article.title}</h3>
        <p className="text-sm text-muted-foreground flex-1 line-clamp-3">{article.summary}</p>
        <div className="flex items-center justify-between mt-4 pt-2 border-t text-xs text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{article.date}</span>
          </div>
          <div>{article.source}</div>
        </div>
        <Button asChild variant="outline" size="sm" className="mt-3 w-full">
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
            Read More <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </div>
    </div>
  );
};

// Mock data for demonstration
const mockNewsData: NewsArticle[] = [
  {
    id: 1,
    title: "New Study Shows Benefits of Mediterranean Diet for Heart Health",
    summary: "A recent large-scale study confirms that following a Mediterranean diet rich in olive oil, nuts, and fresh produce can significantly reduce the risk of cardiovascular disease and stroke.",
    source: "Health Today",
    date: "2 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop",
    url: "#",
    category: "Nutrition"
  },
  {
    id: 2,
    title: "COVID-19 Variant Update: What You Need to Know About New Strains",
    summary: "Health officials are monitoring several new COVID-19 variants. Here's what researchers have learned about transmission rates, symptom severity, and vaccine effectiveness.",
    source: "Medical News",
    date: "5 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1584931423298-c576fda54bd2?q=80&w=2070&auto=format&fit=crop",
    url: "#",
    category: "Infectious Disease"
  },
  {
    id: 3,
    title: "Breakthrough in Alzheimer's Research Offers Hope for Early Detection",
    summary: "Scientists have identified a new biomarker in blood tests that may detect Alzheimer's disease years before symptoms appear, potentially allowing for earlier intervention and treatment.",
    source: "Science Daily",
    date: "Yesterday",
    imageUrl: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=1974&auto=format&fit=crop",
    url: "#",
    category: "Research"
  }
]; 