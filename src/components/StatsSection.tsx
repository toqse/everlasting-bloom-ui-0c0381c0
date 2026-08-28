import { Users, Heart, Shield, Crown } from "lucide-react";

const stats = [
  { value: "2M+", label: "Happy Members", icon: Users },
  { value: "1M+", label: "Successful Matches", icon: Heart },
  { value: "38+", label: "Years of Trust", icon: Shield },
  { value: "100%", label: "Privacy Secured", icon: Crown },
];

const Wave = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 1440 120"
    fill="none"
    preserveAspectRatio="none"
    className={className}
    aria-hidden
  >
    <path
      d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
      fill="white"
    />
  </svg>
);

const StatsSection = () => {
  return (
    <section className="relative -mt-12 overflow-hidden bg-gradient-romantic sm:-mt-14 md:-mt-16">
      {/* Top wave — keeps even space above the cards */}
      <div className="pointer-events-none absolute inset-x-0 top-0 rotate-180 leading-[0]">
        <Wave className="h-12 w-full sm:h-14 md:h-16" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto grid max-w-4xl grid-cols-2 items-stretch gap-3 py-[4.5rem] sm:gap-4 sm:py-20 md:grid-cols-4 md:gap-5">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-primary/10 bg-white/80 px-3 py-4 text-center shadow-card backdrop-blur-sm hover-lift sm:px-4 sm:py-5"
            >
              <stat.icon className="mb-1.5 h-6 w-6 text-secondary group-hover:animate-bounce-soft sm:mb-2 sm:h-7 sm:w-7" />
              <div className="mb-0.5 font-serif text-2xl font-bold text-gradient-primary sm:text-3xl">
                {stat.value}
              </div>
              <div className="text-xs leading-tight text-muted-foreground sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave — same height as the top so spacing stays balanced */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 leading-[0]">
        <Wave className="h-12 w-full sm:h-14 md:h-16" />
      </div>
    </section>
  );
};

export default StatsSection;
