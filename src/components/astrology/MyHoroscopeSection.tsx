import Link from "next/link";
import { FileText, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { AstrologerServiceBanner } from "@/components/astrology/AstrologerServiceBanner";
import { HoroscopeCtaCard } from "@/components/astrology/HoroscopeCtaCard";
import { cn } from "@/lib/utils";

const CONTACT_ADMIN_PATTERN =
  /not been generated|contact the administrator/i;

function isHoroscopeContactAdminMessage(message: string): boolean {
  return CONTACT_ADMIN_PATTERN.test(message);
}

type MyHoroscopeSectionProps = {
  onViewHoroscope: () => void;
  onDownloadThalakuri: () => void;
  horoscopeLoading?: boolean;
  loadingThalakuri?: boolean;
  horoscopeError?: string | null;
  /** When true, horoscopeError is informational (waiting for EXE generation). */
  horoscopePending?: boolean;
  /** When false, Thalakuri purchase/download is blocked until EXE generates the horoscope. */
  thalakuriEnabled?: boolean;
  className?: string;
};

export function MyHoroscopeSection({
  onViewHoroscope,
  onDownloadThalakuri,
  horoscopeLoading = false,
  loadingThalakuri = false,
  horoscopeError = null,
  horoscopePending = false,
  thalakuriEnabled = true,
  className,
}: MyHoroscopeSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={cn(
        "rounded-[24px] border border-primary/10 bg-white p-6 shadow-card sm:p-7",
        className,
      )}
    >
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-gold/20">
          <Sparkles className="h-5 w-5 text-secondary" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-secondary sm:text-2xl">
            My Horoscope
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            View your horoscope details or download Thalakuri PDF
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <HoroscopeCtaCard
          variant="gradient"
          icon={Sparkles}
          title="View My Horoscope"
          subtitle="Get your horoscope details"
          onClick={onViewHoroscope}
          loading={horoscopeLoading}
          loadingLabel="Loading…"
        />
        <HoroscopeCtaCard
          variant="outline"
          icon={FileText}
          title="Download Thalakuri PDF"
          subtitle={
            thalakuriEnabled
              ? "Complete astrological report"
              : "Available after your horoscope is generated"
          }
          onClick={onDownloadThalakuri}
          disabled={!thalakuriEnabled}
          loading={loadingThalakuri}
          loadingLabel="Processing…"
        />
      </div>

      {horoscopeError &&
        (horoscopePending ? (
          <p className="mt-4 text-sm text-muted-foreground">{horoscopeError}</p>
        ) : isHoroscopeContactAdminMessage(horoscopeError) ? (
          <Link
            href="/contact"
            className="mt-4 block text-sm text-destructive underline underline-offset-2 hover:text-destructive/80"
          >
            {horoscopeError}
          </Link>
        ) : (
          <p className="mt-4 text-sm text-destructive">{horoscopeError}</p>
        ))}

      <div className="mt-6">
        <AstrologerServiceBanner />
      </div>
    </motion.div>
  );
}
