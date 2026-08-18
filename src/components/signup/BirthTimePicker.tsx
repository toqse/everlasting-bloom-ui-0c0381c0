import type { ReactNode } from "react";
import { ChevronDown, Clock } from "lucide-react";

type Period = "AM" | "PM";

/** Parses a 24h "HH:mm" (seconds optional) into 12-hour parts. */
function parse24(value: string): { hour: string; minute: string; period: Period } {
  const m = /^(\d{1,2}):(\d{2})/.exec(value || "");
  if (!m) return { hour: "", minute: "", period: "AM" };
  let h = Number(m[1]);
  const minute = m[2];
  const period: Period = h >= 12 ? "PM" : "AM";
  h %= 12;
  if (h === 0) h = 12;
  return { hour: String(h), minute, period };
}

/** Builds a 24h "HH:mm" string from 12-hour parts. */
function to24(hour: number, minute: string, period: Period): string {
  let h = hour % 12;
  if (period === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${minute}`;
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

const compactSelectClass =
  "w-full px-3 py-3.5 pr-8 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors bg-white appearance-none text-foreground";

export interface BirthTimePickerProps {
  /** 24-hour "HH:mm" value (kept for backend compatibility). */
  value: string;
  /** Emits the 24-hour "HH:mm" value, or "" when incomplete. */
  onChange: (value: string) => void;
}

function CompactSelect({
  value,
  onChange,
  ariaLabel,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className={compactSelectClass}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}

/**
 * 12-hour time picker (Hour / Minute / AM-PM) that stores the value as a
 * 24-hour "HH:mm" string so the registration API payload stays unchanged.
 */
export function BirthTimePicker({ value, onChange }: BirthTimePickerProps) {
  const { hour, minute, period } = parse24(value);

  const emit = (h: string, m: string, p: Period) => {
    if (!h || !m) {
      onChange("");
      return;
    }
    onChange(to24(Number(h), m, p));
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="w-[88px]">
        <CompactSelect
          value={hour}
          ariaLabel="Hour"
          onChange={(h) => emit(h, minute || "00", period)}
        >
          <option value="">HH</option>
          {HOURS.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </CompactSelect>
      </div>
      <span className="text-muted-foreground text-sm">:</span>
      <div className="w-[88px]">
        <CompactSelect
          value={minute}
          ariaLabel="Minute"
          onChange={(m) => emit(hour || "12", m, period)}
        >
          <option value="">MM</option>
          {MINUTES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </CompactSelect>
      </div>
      <div className="w-[96px]">
        <CompactSelect
          value={period}
          ariaLabel="AM or PM"
          onChange={(p) => emit(hour || "12", minute || "00", p as Period)}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </CompactSelect>
      </div>
      <Clock className="w-5 h-5 shrink-0 text-muted-foreground" />
    </div>
  );
}
