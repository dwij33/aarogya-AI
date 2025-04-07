import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const links = [
    {
      title: "Company",
      items: [
        { name: "About Us", href: "/about" },
        { name: "Our Team", href: "/team" },
        { name: "Careers", href: "/careers" },
        { name: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Services",
      items: [
        { name: "AI Doctor", href: "/symptom-checker" },
        { name: "Report Analyzer", href: "/report-analyzer" },
        { name: "Mental Health", href: "/mental-health" },
        { name: "Teleconsultation", href: "/teleconsultation" },
        { name: "Health Resources", href: "/resources" },
      ],
    },
    {
      title: "Legal",
      items: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "HIPAA Compliance", href: "/hipaa" },
        { name: "Accessibility", href: "/accessibility" },
      ],
    },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "Email", icon: Mail, href: "mailto:contact@arogyaai.com" },
  ];

  return (
    <footer className="bg-background border-t border-border">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-health-blue to-health-green flex items-center justify-center">
                <span className="text-white font-bold text-sm">A+</span>
              </div>
              <span className="font-bold text-lg">ArogyaAI+</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              ArogyaAI+ is a comprehensive AI-powered telemedicine platform connecting patients in underserved and rural regions with healthcare professionals.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={link.name}
                >
                  <link.icon size={20} />
                </a>
              ))}
            </div>
          </div>
          {links.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="font-medium">{group.title}</h3>
              <ul className="space-y-2">
                {group.items.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} ArogyaAI+. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-xs text-muted-foreground">
              Built with 💙 for healthcare accessibility
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
