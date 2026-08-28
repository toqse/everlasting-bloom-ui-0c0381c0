import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

/** National number (display). */
export const ASTROLOGER_PHONE = "8921726855";
/** E.164 for tel: links (India). */
export const ASTROLOGER_PHONE_TEL = "+918921726855";
export const ASTROLOGER_PHONE_DISPLAY = "+91 89217 26855";

export function getAstrologerTelHref(): string {
  return `tel:${ASTROLOGER_PHONE_TEL}`;
}

/** Open the device dialer for astrologer consultation. */
export function triggerAstrologerCall(): void {
  if (typeof window === "undefined") return;
  window.location.href = getAstrologerTelHref();
}

type AstrologerServicesCallLinkProps = {
  className?: string;
  label?: string;
  showPhone?: boolean;
  showIcon?: boolean;
};

export function AstrologerServicesCallLink({
  className,
  label = "Astrologer services are available",
  showPhone = true,
  showIcon = true,
}: AstrologerServicesCallLinkProps) {
  return (
    <a
      href={getAstrologerTelHref()}
      onClick={(e) => {
        e.preventDefault();
        triggerAstrologerCall();
      }}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary bg-primary/5 px-4 py-3 text-center text-sm font-medium text-primary hover:bg-primary/10 transition-colors",
        className,
      )}
    >
      {showIcon ? <Phone className="w-4 h-4 shrink-0" /> : null}
      <span className="text-center font-serif leading-snug">
        {label}
        {showPhone ? (
          <>
            <br />
            <span className="text-xs font-sans font-normal">
              Contact: {ASTROLOGER_PHONE_DISPLAY}
            </span>
          </>
        ) : null}
      </span>
    </a>
  );
}
