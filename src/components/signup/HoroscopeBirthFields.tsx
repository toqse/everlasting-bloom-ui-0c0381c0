import { useState, useEffect, useCallback, useRef } from "react";
import { Loader2, MapPin } from "lucide-react";
import { searchPlaces, type GeocodeResult } from "@/lib/geocode";
import { inputClass, labelClass } from "./SignupFormFields";
import { BirthTimePicker } from "./BirthTimePicker";

const PLACE_DEBOUNCE_MS = 450;
const DEFAULT_TIMEZONE = "5.5";

export type HoroscopeBirthFieldKey =
  | "birth_time"
  | "birth_place"
  | "birth_latitude"
  | "birth_longitude"
  | "birth_timezone";

export interface HoroscopeBirthFieldsProps {
  birthTime: string;
  birthPlace: string;
  birthLatitude: string;
  birthLongitude: string;
  birthTimezone?: string;
  onChange: (name: HoroscopeBirthFieldKey, value: string) => void;
}

/**
 * Birth time + geocoded birth place used at signup and on My Profile add/update.
 */
export function HoroscopeBirthFields({
  birthTime,
  birthPlace,
  birthLatitude,
  birthLongitude,
  birthTimezone,
  onChange,
}: HoroscopeBirthFieldsProps) {
  const [placeQuery, setPlaceQuery] = useState(birthPlace || "");
  const [placeResults, setPlaceResults] = useState<GeocodeResult[]>([]);
  const [placeLoading, setPlaceLoading] = useState(false);
  const [placeOpen, setPlaceOpen] = useState(false);
  const placeWrapRef = useRef<HTMLDivElement>(null);
  const placeAbortRef = useRef<AbortController | null>(null);
  const skipNextSearchRef = useRef(false);

  useEffect(() => {
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }
    const q = placeQuery.trim();
    if (q.length < 3) {
      setPlaceResults([]);
      setPlaceLoading(false);
      return;
    }
    setPlaceLoading(true);
    const handle = setTimeout(async () => {
      placeAbortRef.current?.abort();
      const controller = new AbortController();
      placeAbortRef.current = controller;
      const results = await searchPlaces(q, { signal: controller.signal });
      if (controller.signal.aborted) return;
      setPlaceResults(results);
      setPlaceLoading(false);
      setPlaceOpen(true);
    }, PLACE_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [placeQuery]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!placeWrapRef.current?.contains(e.target as Node)) setPlaceOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (birthPlace && birthPlace !== placeQuery) {
      skipNextSearchRef.current = true;
      setPlaceQuery(birthPlace);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [birthPlace]);

  const handleSelectPlace = useCallback(
    (place: GeocodeResult) => {
      skipNextSearchRef.current = true;
      setPlaceQuery(place.label);
      onChange("birth_place", place.label);
      onChange("birth_latitude", String(place.latitude));
      onChange("birth_longitude", String(place.longitude));
      if (!birthTimezone) onChange("birth_timezone", DEFAULT_TIMEZONE);
      setPlaceOpen(false);
      setPlaceResults([]);
    },
    [onChange, birthTimezone],
  );

  const handlePlaceInput = useCallback(
    (value: string) => {
      setPlaceQuery(value);
      onChange("birth_place", value);
      onChange("birth_latitude", "");
      onChange("birth_longitude", "");
    },
    [onChange],
  );

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Birth Time</label>
        <BirthTimePicker
          value={birthTime || ""}
          onChange={(v) => onChange("birth_time", v)}
        />
      </div>

      <div ref={placeWrapRef} className="relative">
        <label className={labelClass}>Birth Place</label>
        <div className="relative">
          <input
            type="text"
            value={placeQuery}
            onChange={(e) => handlePlaceInput(e.target.value)}
            onFocus={() => {
              if (placeResults.length) setPlaceOpen(true);
            }}
            placeholder="Search city or town…"
            autoComplete="off"
            className={`${inputClass} pr-10`}
          />
          {placeLoading ? (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-primary/55" />
          ) : (
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          )}

          {placeOpen && placeResults.length > 0 ? (
            <div className="absolute z-50 mt-1 w-full rounded-2xl border-2 border-primary/10 bg-white shadow-xl overflow-hidden">
              <div className="max-h-56 overflow-y-auto p-1">
                {placeResults.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPlace(p)}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors hover:bg-primary/10"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        {birthLatitude && birthLongitude ? (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Coordinates: {Number(birthLatitude).toFixed(4)},{" "}
            {Number(birthLongitude).toFixed(4)}
          </p>
        ) : null}
      </div>
    </div>
  );
}
