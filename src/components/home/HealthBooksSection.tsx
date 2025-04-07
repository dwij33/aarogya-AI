import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Star, ExternalLink } from "lucide-react";

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  rating: number;
  category: string;
  link: string;
}

export function HealthBooksSection() {
  const categories = [
    { id: "all", label: "All Books" },
    { id: "nutrition", label: "Nutrition" },
    { id: "mental-health", label: "Mental Health" },
    { id: "wellness", label: "Wellness" },
    { id: "medical", label: "Medical Reference" },
  ];

  const books: Book[] = [
    {
      id: 1,
      title: "How Not to Die",
      author: "Michael Greger, MD",
      description: "Discover the foods scientifically proven to prevent and reverse disease, with practical advice for daily diet.",
      coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1374&auto=format&fit=crop",
      rating: 4.8,
      category: "nutrition",
      link: "#"
    },
    {
      id: 2,
      title: "Why We Sleep",
      author: "Matthew Walker",
      description: "Explores the critical importance of sleep for learning, memory, immune function and overall health.",
      coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1374&auto=format&fit=crop",
      rating: 4.7,
      category: "wellness",
      link: "#"
    },
    {
      id: 3,
      title: "The Body Keeps the Score",
      author: "Bessel van der Kolk",
      description: "Explores how trauma affects the brain and body, and innovative treatments for recovery.",
      coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1374&auto=format&fit=crop",
      rating: 4.9,
      category: "mental-health",
      link: "#"
    },
    {
      id: 4,
      title: "Gut",
      author: "Giulia Enders",
      description: "A comprehensive guide to one of the most underrated yet critical systems in our body.",
      coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1374&auto=format&fit=crop",
      rating: 4.6,
      category: "medical",
      link: "#"
    },
    {
      id: 5,
      title: "Atomic Habits",
      author: "James Clear",
      description: "Practical strategies for forming good habits, breaking bad ones, and mastering tiny behaviors that lead to remarkable results.",
      coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1374&auto=format&fit=crop",
      rating: 4.8,
      category: "wellness",
      link: "#"
    },
    {
      id: 6,
      title: "The Blue Zones",
      author: "Dan Buettner",
      description: "Lessons for living longer from people who've lived the longest, exploring the world's healthiest communities.",
      coverUrl: "https://images.unsplash.com/photo-1569511166584-3a247b69dd7a?q=80&w=1374&auto=format&fit=crop",
      rating: 4.7,
      category: "nutrition",
      link: "#"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Health Book Recommendations</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover curated book recommendations to deepen your understanding of health topics and enhance your wellness journey.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-5">
              {categories.map(category => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="all" className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </TabsContent>

          {categories.slice(1).map(category => (
            <TabsContent key={category.id} value={category.id} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {books
                  .filter(book => book.category === category.id)
                  .map(book => (
                    <BookCard key={book.id} book={book} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

interface BookCardProps {
  book: Book;
}

function BookCard({ book }: BookCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-[3/4] relative overflow-hidden">
        <img 
          src={book.coverUrl} 
          alt={book.title} 
          className="object-cover w-full h-full transition-transform hover:scale-105" 
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{book.title}</CardTitle>
        <CardDescription>by {book.author}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{book.description}</p>
        <div className="flex items-center gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < Math.floor(book.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
            />
          ))}
          <span className="text-sm ml-1">{book.rating.toFixed(1)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <a href={book.link} target="_blank" rel="noopener noreferrer">
            Learn More <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
} 