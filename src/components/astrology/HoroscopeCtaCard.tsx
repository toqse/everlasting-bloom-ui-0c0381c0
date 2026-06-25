import { ArrowRight, Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type HoroscopeCtaCardProps = {
  variant: "gradient" | "outline";
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
};

export function HoroscopeCtaCard({
  variant,
  icon: Icon,
  title,
  subtitle,
  onClick,
  disabled = false,
  loading = false,
  loadingLabel = "Loading…",
}: HoroscopeCtaCardProps) {
  const isGradient = variant === "gradient";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl p-5 text-left",
        "transition-all duration-300 ease-out",
        "hover:scale-[1.02] hover:shadow-elevated",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-none",
        isGradient
          ? "bg-gradient-to-br from-[#8A1D5D] to-[#C83B85] text-white shadow-card"
          : "border-2 border-primary/25 bg-white text-foreground shadow-card hover:border-primary/40",
      )}
    >
      {isGradient && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      )}

      <div
        className={cn(
          "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
          isGradient
            ? "bg-white/20 ring-1 ring-white/30"
            : "bg-primary/10 ring-1 ring-primary/20",
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5",
            isGradient ? "text-white" : "text-primary",
          )}
        />
      </div>

      <div className="relative min-w-0 flex-1">
        <p
          className={cn(
            "font-serif text-base font-bold leading-tight sm:text-lg",
            isGradient ? "text-white" : "text-foreground",
          )}
        >
          {loading ? loadingLabel : title}
        </p>
        <p
          className={cn(
            "mt-1 text-sm",
            isGradient ? "text-white/80" : "text-muted-foreground",
          )}
        >
          {subtitle}
        </p>
      </div>

      <div
        className={cn(
          "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300",
          "group-hover:scale-110",
          isGradient
            ? "bg-white/20 ring-1 ring-white/30 group-hover:bg-white/30"
            : "bg-primary/10 ring-1 ring-primary/20 group-hover:bg-primary group-hover:ring-primary",
        )}
      >
        {loading ? (
          <Loader2
            className={cn(
              "h-4 w-4 animate-spin",
              isGradient ? "text-white" : "text-primary group-hover:text-white",
            )}
          />
        ) : (
          <ArrowRight
            className={cn(
              "h-4 w-4 transition-colors duration-300",
              isGradient
                ? "text-white"
                : "text-primary group-hover:text-white",
            )}
          />
        )}
      </div>
    </button>
  );
}
