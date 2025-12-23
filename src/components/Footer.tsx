import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Linkedin, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    toast.success("Thanks for subscribing! 💕", {
      description: "You'll receive our latest updates and tips.",
    });
    setEmail("");
  };

  const footerLinks = {
    company: [
      { name: "About Us", href: "/" },
      { name: "Success Stories", href: "/success-stories" },
      { name: "Careers", href: "/" },
      { name: "Press", href: "/" },
    ],
    help: [
      { name: "Help Center", href: "/" },
      { name: "Safety Tips", href: "/" },
      { name: "Report Abuse", href: "/" },
      { name: "FAQs", href: "/membership" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/" },
      { name: "Terms of Service", href: "/" },
      { name: "Cookie Policy", href: "/" },
      { name: "Refund Policy", href: "/" },
    ],
    services: [
      { name: "Matrimony Services", href: "/search" },
      { name: "Wedding Services", href: "/" },
      { name: "Astrology Match", href: "/" },
      { name: "Premium Matchmaking", href: "/membership" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "Youtube" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-gradient-to-b from-accent-rose to-accent-pink relative overflow-hidden">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary" />

      {/* Floating Sparkles */}
      {[...Array(4)].map((_, i) => (
        <Sparkles
          key={i}
          className="absolute text-secondary/20 animate-sparkle"
          style={{
            left: `${20 + i * 20}%`,
            top: `${20 + (i % 2) * 30}%`,
            width: `${16 + i * 4}px`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}

      {/* Newsletter Section */}
      <div className="bg-primary py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NCAwLTE4IDguMDYtMTggMTggMCAxMC45NCA4LjA2IDE4IDE4IDE4IDkuOTQgMCAxOC04LjA2IDE4LTE4IDAtOS45NC04LjA2LTE4LTE4LTE4eiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-30" />
        
        {/* Floating Hearts */}
        {[...Array(3)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-white/10 fill-white/10 animate-float"
            style={{
              left: `${15 + i * 30}%`,
              top: `${20 + (i % 2) * 40}%`,
              width: `${24 + i * 8}px`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                Get Marriage Tips & Updates
              </h3>
              <p className="text-primary-foreground/80">
                Subscribe to receive relationship advice and exclusive offers
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full sm:w-72 pl-12 pr-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-secondary"
                />
              </div>
              <Button type="submit" variant="gold" size="lg" className="gap-2 group">
                Subscribe
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="relative">
                <Heart className="w-8 h-8 text-primary fill-primary group-hover:animate-heart-beat" />
                <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-secondary animate-sparkle" />
              </div>
              <span className="font-serif text-2xl font-bold text-primary">
                Eternal<span className="text-secondary">Bond</span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              India's most trusted matrimony service helping millions find their perfect life partner. 
              Begin your beautiful journey towards forever love.
            </p>
            <div className="space-y-3">
              <a href="tel:+911234567890" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                +91 123 456 7890
              </a>
              <a href="mailto:support@eternalbond.com" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                support@eternalbond.com
              </a>
              <div className="flex items-start gap-3 text-foreground">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                Mumbai, Maharashtra, India
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-serif text-lg font-bold text-foreground mb-5">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold text-foreground mb-5">Help & Support</h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold text-foreground mb-5">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold text-foreground mb-5">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* App Download & Social */}
        <div className="border-t border-primary/10 mt-12 pt-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Download Apps */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span className="text-foreground font-medium">Download Our App:</span>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors hover-lift">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M17.9 17.39c-.26.67-.59 1.31-.97 1.91-.5.78-.9 1.32-1.2 1.62-.48.49-1 .75-1.55.78-.4 0-.88-.11-1.44-.35-.56-.23-1.07-.34-1.53-.34-.48 0-1 .11-1.56.34-.56.24-1.01.36-1.35.37-.53.02-1.05-.25-1.55-.76-.33-.33-.75-.89-1.25-1.67-.54-.85-.99-1.83-1.34-2.95-.38-1.21-.57-2.38-.57-3.51 0-1.3.28-2.42.84-3.36.44-.75 1.03-1.34 1.76-1.77.74-.43 1.53-.65 2.39-.66.43 0 1 .13 1.7.38.7.26 1.15.39 1.35.39.15 0 .65-.15 1.5-.45.8-.28 1.48-.4 2.03-.36 1.5.12 2.63.71 3.38 1.78-1.34.81-2 1.95-1.98 3.42.02 1.15.43 2.1 1.22 2.87.36.35.77.62 1.22.82-.1.28-.2.55-.32.83zM14.2 3.46c0 .9-.33 1.74-.98 2.52-.79.92-1.75 1.45-2.78 1.37-.01-.11-.02-.22-.02-.34 0-.87.38-1.79 1.05-2.55.34-.38.77-.7 1.29-.95.52-.25 1.01-.38 1.48-.41.01.12.02.24.02.36z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Download on</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors hover-lift">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35l9.64 9.85-9.64 9.85c-.5-.24-.84-.76-.84-1.35zm13.81-4.61L5.3 22.18l8.56-8.56 2.95 2.27zm1.94-11.78c.34.18.58.51.58.89v14c0 .38-.24.71-.58.89l-7.49-7.5 7.49-7.5zM5.3 1.82L16.81 8.1l-2.95 2.27L5.3 1.82z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-foreground font-medium">Follow Us:</span>
              <div className="flex gap-3">
                {socialLinks.map((social, i) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary/10 mt-10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-1">
              © 2024 EternalBond. All rights reserved. Made with 
              <Heart className="w-4 h-4 text-primary fill-primary animate-heart-beat mx-1" /> 
              in India
            </p>
            <div className="flex items-center gap-6">
              <Link to="/" className="hover:text-primary transition-colors">Sitemap</Link>
              <Link to="/" className="hover:text-primary transition-colors">Accessibility</Link>
              <Link to="/" className="hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
