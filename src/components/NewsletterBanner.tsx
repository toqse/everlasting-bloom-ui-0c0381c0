"use client";

import { useState } from "react";
import { ArrowRight, Heart, Loader2, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { subscribeNewsletter } from "@/lib/newsletterApi";
import { getDisplayErrorMessage } from "@/lib/apiErrors";

type BannerState = "idle" | "loading" | "success";

export default function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<BannerState>("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Please enter your email");
      return;
    }
    setState("loading");
    try {
      const message = await subscribeNewsletter(trimmed);
      setState("success");
      setEmail("");
      toast.success(message);
    } catch (err) {
      setState("idle");
      toast.error(getDisplayErrorMessage(err));
    }
  };

  return (
    <div className="bg-primary py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NCAwLTE4IDguMDYtMTggMTggMCAxMC45NCA4LjA2IDE4IDE4IDE4IDkuOTQgMCAxOC04LjA2IDE4LTE4IDAtOS45NC04LjA2LTE4LTE4LTE4eiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-30" />

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

          {state === "success" ? (
            <div className="w-full md:w-auto min-w-[280px] rounded-xl border-2 border-primary-foreground/30 bg-primary-foreground/10 px-6 py-4 text-center">
              <Sparkles className="w-6 h-6 text-secondary mx-auto mb-2" />
              <p className="font-serif text-lg font-semibold text-primary-foreground">
                Thanks for subscribing!
              </p>
              <p className="text-sm text-primary-foreground/80 mt-1">
                You&apos;ll receive marriage tips and updates.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
            >
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={state === "loading"}
                  className="w-full sm:w-72 pl-12 pr-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-secondary disabled:opacity-70"
                />
              </div>
              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="gap-2 group"
                disabled={state === "loading"}
              >
                {state === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Subscribing…
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
