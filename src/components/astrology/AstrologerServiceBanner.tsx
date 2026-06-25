import { ArrowRight, Check, MessageCircle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { ASTROLOGER_PHONE } from "@/components/astrology/AstrologerServicesCallLink";

const FEATURES = [
  "Highly Accurate",
  "Confidential",
  "Trusted",
  "Personalized",
] as const;

type AstrologerServiceBannerProps = {
  className?: string;
};

export function AstrologerServiceBanner({
  className,
}: AstrologerServiceBannerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-accent-gold/40",
        "bg-gradient-to-br from-accent-gold/15 via-white to-accent-gold/10",
        "p-5 shadow-card sm:p-6",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent-gold/20 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl"
      />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-secondary-light shadow-gold">
              <Shield className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-foreground sm:text-lg">
                Professional Astrologer Services Available
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Expert guidance tailored to your matrimony journey
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {FEATURES.map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center gap-1.5 rounded-full border border-accent-gold/30 bg-white/80 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm"
              >
                <Check className="h-3 w-3 text-secondary" strokeWidth={3} />
                {feature}
              </span>
            ))}
          </div>
        </div>

        <a
          href={`tel:${ASTROLOGER_PHONE}`}
          className={cn(
            "group relative inline-flex w-full shrink-0 items-center justify-center gap-3 overflow-hidden",
            "rounded-xl bg-gradient-to-r from-[#8A1D5D] to-[#C83B85] px-6 py-3.5",
            "text-sm font-semibold text-white shadow-elevated",
            "transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
            "lg:w-auto lg:min-w-[220px]",
          )}
        >
          <span
            aria-hidden
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
          />
          <MessageCircle className="relative h-4 w-4 shrink-0" />
          <span className="relative font-serif">Book Consultation</span>
          <ArrowRight className="relative h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}
