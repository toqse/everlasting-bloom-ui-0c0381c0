"use client";

import { useState } from "react";
import { Menu, X, User, LogOut, LayoutDashboard, UserPen } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { withoutTrailingSlash } from "@/lib/utils";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, logout, isProfileComplete } = useAuthStore();
  const showCompleteProfile = isLoggedIn && !isProfileComplete();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Success Stories", href: "/success-stories" },
    { name: "Membership", href: "/membership" },
    { name: "Contact", href: "/contact" },
  ];

  /** `trailingSlash: true` makes pathname e.g. `/success-stories/`; hrefs omit `/`, so compare normalized. */
  const isActive = (href: string) =>
    withoutTrailingSlash(pathname ?? "") === withoutTrailingSlash(href);

  return (
    <nav className="fixed top-[var(--testing-banner-height,0px)] left-0 right-0 z-50 bg-white shadow-soft py-2">
      <div className="container mx-auto px-3 sm:px-4 flex items-center justify-between h-12 sm:h-14">
        <Link
          href="/"
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex flex-col items-start justify-center shrink-0 min-w-0 h-full"
        >
          <img
            src="/images/WhatsApp_Image_2026-03-04_at_10.28.26_AM-removebg-preview.png"
            alt="Aiswarya Matrimony"
            className="block h-7 sm:h-8 lg:h-9 w-auto object-contain object-left"
          />
          <span className="text-[10px] sm:text-xs text-muted-foreground font-medium tracking-wider leading-none ml-3 sm:ml-4 mt-0.5">
            Since 1989
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`relative font-medium transition-colors duration-300 group ${
                isActive(link.href)
                  ? "text-primary"
                  : "text-foreground/80 hover:text-primary"
              }`}
            >
              {link.name}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-secondary transition-all duration-300 ${
                  isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {isLoggedIn ? (
            <>
              {showCompleteProfile ? (
                <Button variant="outline" className="gap-2" asChild>
                  <Link
                    href="/auth"
                    prefetch
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserPen className="w-4 h-4" />
                    Complete Profile
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" className="gap-2" asChild>
                  <Link
                    href="/dashboard"
                    prefetch
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                </Button>
              )}
              <Button
                variant="hero"
                className="gap-2"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </>
          ) : (
            <Button variant="hero" className="gap-2 min-w-[160px] px-8" asChild>
              <Link href="/auth" prefetch={true}>
                <User className="w-4 h-4" />
                Login
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2.5 -mr-1 text-primary hover:scale-110 active:scale-95 transition-transform touch-manipulation"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu — pointer-events-none when closed so a zero-height panel never steals taps (e.g. Login / hero CTAs). */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-white shadow-elevated transition-all duration-300 overflow-hidden max-h-[85vh] overflow-y-auto ${
          isMobileMenuOpen
            ? "max-h-[85vh] opacity-100 pointer-events-auto"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col gap-4 pb-6">
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              href={link.href}
              className={`font-medium py-2 border-b border-accent-rose/30 transition-all duration-300 animate-slide-up ${
                isActive(link.href) ? "text-primary" : "text-foreground/80"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            {isLoggedIn ? (
              <>
                {showCompleteProfile ? (
                  <Button variant="outline" className="flex-1 gap-2" asChild>
                    <Link
                      href="/auth"
                      prefetch
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserPen className="w-4 h-4" /> Complete Profile
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" className="flex-1 gap-2" asChild>
                    <Link
                      href="/dashboard"
                      prefetch
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                  </Button>
                )}
                <Button
                  variant="hero"
                  className="flex-1 gap-2"
                  onClick={() => {
                    logout();
                    router.push("/");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4" /> Logout
                </Button>
              </>
            ) : (
              <Button variant="hero" className="flex-1 min-w-[160px]" asChild>
                <Link
                  href="/auth"
                  prefetch={true}
                  className="inline-flex w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
