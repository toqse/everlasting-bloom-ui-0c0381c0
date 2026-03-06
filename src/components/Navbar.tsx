import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLoading } from "@/contexts/LoadingContext";
import { useAuthStore } from "@/stores/authStore";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();
  const { isLoggedIn, user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Success Stories", href: "/success-stories" },
    { name: "Membership", href: "/membership" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleNavLinkClick = (href: string) => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-lg shadow-soft py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between min-h-[72px] lg:min-h-[80px]">
        {/* Logo */}
        <Link to="/" onClick={() => handleNavLinkClick("/")} className="flex items-center shrink-0 group">
          <img
            src="/images/WhatsApp_Image_2026-03-04_at_10.28.26_AM-removebg-preview.png"
            alt="Aiswarya Matrimony"
            className="h-16 w-auto object-contain lg:h-20"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 min-h-[44px]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => handleNavLinkClick(link.href)}
              className={`relative font-medium transition-colors duration-300 group ${
                isActive(link.href) ? "text-primary" : "text-foreground/80 hover:text-primary"
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-secondary transition-all duration-300 ${
                isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
              }`} />
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {isLoggedIn ? (
            <>
              <Button variant="outline" className="gap-2" onClick={() => { navigate("/dashboard"); setIsMobileMenuOpen(false); }}>
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
              <Button variant="hero" className="gap-2" onClick={() => { logout(); navigate("/"); }}>
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </>
          ) : (
            <Button variant="hero" className="gap-2 min-w-[160px] px-8" onClick={() => navigate("/auth")}>
              <User className="w-4 h-4" />
              Login
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-primary hover:scale-110 transition-transform">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-elevated transition-all duration-300 overflow-hidden ${
        isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              to={link.href}
              className={`font-medium py-2 border-b border-accent-rose/30 transition-all duration-300 animate-slide-up ${
                isActive(link.href) ? "text-primary" : "text-foreground/80"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => { handleNavLinkClick(link.href); setIsMobileMenuOpen(false); }}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            {isLoggedIn ? (
              <>
                <Button variant="outline" className="flex-1 gap-2" onClick={() => { navigate("/dashboard"); setIsMobileMenuOpen(false); }}>
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Button>
                <Button variant="hero" className="flex-1 gap-2" onClick={() => { logout(); navigate("/"); setIsMobileMenuOpen(false); }}>
                  <LogOut className="w-4 h-4" /> Logout
                </Button>
              </>
            ) : (
              <Button variant="hero" className="flex-1 min-w-[160px]" onClick={() => { navigate("/auth"); setIsMobileMenuOpen(false); }}>Login</Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
