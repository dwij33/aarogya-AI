import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  MessageSquare,
  Send,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function Contact() {
  const { toast } = useToast();
  
  useEffect(() => {
    document.title = "Contact Us | ArogyaAI+";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
    // Reset form
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-muted-foreground">
          Get in touch with the ArogyaAI+ team
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Visit Us</span>
              </CardTitle>
              <CardDescription>Our headquarters location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">ArogyaAI+ Global Headquarters</p>
              <p className="text-muted-foreground">
                1234 Innovation Drive<br />
                Pune, Maharashtra 411001<br />
                India
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <span>Email Us</span>
              </CardTitle>
              <CardDescription>Our support email addresses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="font-medium">General Inquiries</p>
                <p className="text-primary">contact@arogyaai.io</p>
              </div>
              <div>
                <p className="font-medium">Technical Support</p>
                <p className="text-primary">support@arogyaai.io</p>
              </div>
              <div>
                <p className="font-medium">Partnerships</p>
                <p className="text-primary">partners@arogyaai.io</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <span>Call Us</span>
              </CardTitle>
              <CardDescription>Our contact numbers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="font-medium">Main Office</p>
                <p className="text-primary">+91 (800) 555-0123</p>
              </div>
              <div>
                <p className="font-medium">Customer Support</p>
                <p className="text-primary">+91 (800) 555-0124</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Opening Hours</span>
              </CardTitle>
              <CardDescription>When you can reach us</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <p className="font-medium">Monday - Friday</p>
                <p>9:00 AM - 6:00 PM IST</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium">Saturday</p>
                <p>10:00 AM - 4:00 PM IST</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium">Sunday</p>
                <p>Closed</p>
              </div>
              <p className="text-sm text-muted-foreground pt-2">
                * Online support is available 24/7 through our chatbot.
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span>Send a Message</span>
              </CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input id="name" placeholder="Your name" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="Your email" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input id="subject" placeholder="How can we help you?" required />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder="Please describe your query in detail..." 
                    className="min-h-[150px]" 
                    required 
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  By submitting this form, you agree to our privacy policy and terms of service.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 