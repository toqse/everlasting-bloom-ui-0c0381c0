import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Loader2, X } from "lucide-react";
import { getCities, type City } from "@/lib/masterApi";
import {
  isExactCityMatch,
  rankCitySuggestions,
  sanitizeCityName,
} from "@/lib/cityMatch";
import { labelClass } from "@/components/signup/SignupFormFields";

const DEBOUNCE_MS = 300;

export type CitySelection =
  | { source: "master"; cityId: number; cityName: string }
  | { source: "user"; cityId: null; cityName: string }
  | { source: null; cityId: null; cityName: string };

interface Props {
  districtId: number;
  cityId: string;
  cityName: string;
  disabled?: boolean;
  onChange: (next: CitySelection) => void;
}

export function CityCombobox({
  districtId,
  cityId,
  cityName,
  disabled,
  onChange,
}: Props) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(cityName || "");
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [districtEmpty, setDistrictEmpty] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const committedRef = useRef(Boolean(cityId || cityName));

  useEffect(() => {
    setInput(cityName || "");
    committedRef.current = Boolean(cityId || cityName);
  }, [cityId, cityName, districtId]);

  const updatePosition = useCallback(() => {
    const el = containerRef.current?.querySelector("input");
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPosition({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  const fetchCities = useCallback(
    async (search: string) => {
      if (!districtId) return;
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
      setLoading(true);
      setLoadError(false);
      try {
        const list = await getCities(districtId, search || undefined, ac.signal);
        if (ac.signal.aborted) return;
        setCities(list);
        if (!search.trim()) setDistrictEmpty(list.length === 0);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        if (!ac.signal.aborted) {
          setCities([]);
          setLoadError(true);
        }
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    },
    [districtId],
  );

  useEffect(() => {
    if (!districtId) {
      setCities([]);
      setDistrictEmpty(false);
      setLoadError(false);
      return;
    }
    fetchCities("");
    return () => abortRef.current?.abort();
  }, [districtId, fetchCities]);

  const scheduleSearch = useCallback(
    (term: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchCities(term), DEBOUNCE_MS);
    },
    [fetchCities],
  );

  const ranked = rankCitySuggestions(input, cities);
  const exact = ranked.exact;
  const fuzzy = ranked.fuzzy;
  const contains = ranked.rest;
  const query = sanitizeCityName(input);
  const hasExact = exact.length > 0;
  const showManual =
    !!query &&
    !hasExact &&
    !loading &&
    (!!loadError || (fuzzy.length === 0 && contains.length === 0) || districtEmpty);

  type Row =
    | { kind: "exact"; city: City }
    | { kind: "fuzzy"; city: City }
    | { kind: "match"; city: City }
    | { kind: "manual"; name: string };

  const rows: Row[] = [
    ...exact.map((city) => ({ kind: "exact" as const, city })),
    ...fuzzy.map((city) => ({ kind: "fuzzy" as const, city })),
    ...contains.map((city) => ({ kind: "match" as const, city })),
  ];
  if (showManual && query) {
    rows.push({ kind: "manual", name: query });
  }

  useEffect(() => {
    setHighlight(0);
  }, [input, cities, loadError]);

  const commitMaster = (city: City) => {
    committedRef.current = true;
    onChange({ source: "master", cityId: city.id, cityName: city.name });
    setInput(city.name);
    setOpen(false);
  };

  const commitManual = (name: string) => {
    const cleaned = sanitizeCityName(name);
    if (!cleaned) return;
    committedRef.current = true;
    onChange({ source: "user", cityId: null, cityName: cleaned });
    setInput(cleaned);
    setOpen(false);
  };

  const clear = () => {
    committedRef.current = false;
    onChange({ source: null, cityId: null, cityName: "" });
    setInput("");
    setOpen(false);
  };

  const handleBlurCommit = () => {
    // If user typed something and left without selecting, allow manual if no exact master.
    const cleaned = sanitizeCityName(input);
    if (!cleaned) {
      if (cityId || cityName) clear();
      return;
    }
    const exactHit = cities.find((c) => isExactCityMatch(cleaned, c.name));
    if (exactHit) {
      commitMaster(exactHit);
      return;
    }
    if (!cityId && cityName === cleaned) return;
    if (!committedRef.current || cityName !== cleaned || cityId) {
      // Prefer explicit "Use as city" — but if they tab away with unknown text, keep as manual.
      commitManual(cleaned);
    }
  };

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (containerRef.current?.contains(t) || overlayRef.current?.contains(t)) return;
      if (open) {
        setOpen(false);
        handleBlurCommit();
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, input, cities, cityId, cityName]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      e.preventDefault();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, Math.max(rows.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const row = rows[highlight];
      if (!row) return;
      if (row.kind === "manual") commitManual(row.name);
      else commitMaster(row.city);
    }
  };

  const isMasterSelected = Boolean(cityId);
  const isManualSelected = Boolean(!cityId && cityName);

  const dropdown =
    open && position.width > 0 ? (
      <div
        ref={overlayRef}
        id={listId}
        role="listbox"
        className="fixed z-[100] rounded-2xl border-2 border-primary/10 bg-white shadow-xl overflow-hidden"
        style={{
          top: position.top,
          left: position.left,
          width: Math.max(position.width, 220),
        }}
      >
        <div className="max-h-64 overflow-y-auto p-1">
          {loading && cities.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-primary/55" />
              Loading cities…
            </div>
          ) : null}

          {loadError && !loading ? (
            <div className="px-3 py-3 text-sm text-muted-foreground">
              Unable to load city suggestions.
              <br />
              You can enter your city manually.
            </div>
          ) : null}

          {!loadError && districtEmpty && !query && !loading ? (
            <div className="px-3 py-3 text-sm text-muted-foreground">
              No cities are currently listed for this district.
              <br />
              You can enter your city manually.
            </div>
          ) : null}

          {exact.length > 0 ? (
            <div className="px-2 pt-2 pb-1 text-xs font-medium text-muted-foreground">
              Exact match
            </div>
          ) : null}
          {exact.map((city, i) => {
            const idx = i;
            return (
              <button
                key={`e-${city.id}`}
                type="button"
                role="option"
                aria-selected={highlight === idx}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-sm ${
                  highlight === idx ? "bg-primary/10 text-foreground" : "hover:bg-muted/60"
                }`}
                onMouseEnter={() => setHighlight(idx)}
                onClick={() => commitMaster(city)}
              >
                <Check className="h-4 w-4 text-primary shrink-0" />
                {city.name}
              </button>
            );
          })}

          {fuzzy.length > 0 ? (
            <div className="px-2 pt-2 pb-1 text-xs font-medium text-muted-foreground">
              Did you mean?
            </div>
          ) : null}
          {fuzzy.map((city, i) => {
            const idx = exact.length + i;
            return (
              <button
                key={`f-${city.id}`}
                type="button"
                role="option"
                aria-selected={highlight === idx}
                className={`w-full px-3 py-2 rounded-xl text-left text-sm ${
                  highlight === idx ? "bg-primary/10 text-foreground" : "hover:bg-muted/60"
                }`}
                onMouseEnter={() => setHighlight(idx)}
                onClick={() => commitMaster(city)}
              >
                {city.name}
              </button>
            );
          })}

          {contains.map((city, i) => {
            const idx = exact.length + fuzzy.length + i;
            return (
              <button
                key={`c-${city.id}`}
                type="button"
                role="option"
                aria-selected={highlight === idx}
                className={`w-full px-3 py-2 rounded-xl text-left text-sm ${
                  highlight === idx ? "bg-primary/10 text-foreground" : "hover:bg-muted/60"
                }`}
                onMouseEnter={() => setHighlight(idx)}
                onClick={() => commitMaster(city)}
              >
                {city.name}
              </button>
            );
          })}

          {showManual && query ? (
            <>
              {!loadError && !districtEmpty ? (
                <div className="px-3 pt-2 text-xs text-muted-foreground">
                  No matching city found.
                </div>
              ) : null}
              <button
                type="button"
                role="option"
                aria-selected={highlight === rows.length - 1}
                className={`w-full px-3 py-2.5 mt-1 rounded-xl text-left text-sm font-medium text-primary ${
                  highlight === rows.length - 1 ? "bg-primary/10" : "hover:bg-muted/60"
                }`}
                onMouseEnter={() => setHighlight(rows.length - 1)}
                onClick={() => commitManual(query)}
              >
                + Use &quot;{query}&quot; as city
              </button>
              <p className="px-3 pb-2 pt-1 text-xs text-muted-foreground">
                Please check the spelling before continuing.
              </p>
            </>
          ) : null}
        </div>
      </div>
    ) : null;

  return (
    <div ref={containerRef} className="relative">
      <label className={labelClass}>City</label>
      <div className="relative">
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          disabled={disabled || !districtId}
          value={input}
          placeholder={districtId ? "Search or enter city" : "Select district first"}
          className="w-full px-4 py-3 pr-10 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors bg-white disabled:opacity-60"
          onFocus={() => {
            if (!districtId) return;
            setOpen(true);
            updatePosition();
          }}
          onChange={(e) => {
            const v = e.target.value;
            committedRef.current = false;
            setInput(v);
            onChange({ source: null, cityId: null, cityName: "" });
            setOpen(true);
            scheduleSearch(v);
          }}
          onKeyDown={onKeyDown}
        />
        {(cityId || cityName || input) && !disabled ? (
          <button
            type="button"
            aria-label="Clear city"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={clear}
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      {isMasterSelected ? (
        <p className="mt-1.5 text-xs text-muted-foreground flex items-center gap-1">
          <Check className="h-3.5 w-3.5 text-primary" /> {cityName}
        </p>
      ) : null}
      {isManualSelected ? (
        <p className="mt-1.5 text-xs text-amber-700/90">
          City not found in our list. Please check the spelling before continuing.
        </p>
      ) : null}
      {typeof document !== "undefined" && dropdown ? createPortal(dropdown, document.body) : null}
    </div>
  );
}
