import { useState, useEffect, useCallback, useRef } from "react";
import { Loader2, MapPin } from "lucide-react";
import { withMinDuration } from "@/lib/withMinDuration";
import { getCountries, getStates, getDistricts, getCities } from "@/lib/masterApi";
import type { Country, State, District, City } from "@/lib/masterApi";
import { searchPlaces, type GeocodeResult } from "@/lib/geocode";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { inputClass, labelClass } from "../SignupFormFields";
import { BirthTimePicker } from "../BirthTimePicker";

const PLACE_DEBOUNCE_MS = 450;

interface Props {
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const LocationStep = ({ formData, onChange }: Props) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const [placeQuery, setPlaceQuery] = useState(formData.birth_place || "");
  const [placeResults, setPlaceResults] = useState<GeocodeResult[]>([]);
  const [placeLoading, setPlaceLoading] = useState(false);
  const [placeOpen, setPlaceOpen] = useState(false);
  const placeWrapRef = useRef<HTMLDivElement>(null);
  const placeAbortRef = useRef<AbortController | null>(null);
  const skipNextSearchRef = useRef(false);

  const countryId = formData.country_id ? Number(formData.country_id) : 0;
  const stateId = formData.state_id ? Number(formData.state_id) : 0;
  const districtId = formData.district_id ? Number(formData.district_id) : 0;

  const hasHoroscope = formData.has_horoscope === "true";

  const emit = useCallback(
    (name: string, value: string) => {
      onChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
    },
    [onChange]
  );

  const handleSelect = useCallback(
    (name: string, value: string) => {
      onChange({ target: { name, value } } as React.ChangeEvent<HTMLSelectElement>);

      if (name === "country_id") {
        const selected = countries.find((c) => String(c.id) === value);
        onChange({ target: { name: "country", value: selected?.name ?? "" } } as React.ChangeEvent<HTMLSelectElement>);
        onChange({ target: { name: "state", value: "" } } as React.ChangeEvent<HTMLSelectElement>);
        onChange({ target: { name: "district", value: "" } } as React.ChangeEvent<HTMLSelectElement>);
        onChange({ target: { name: "city", value: "" } } as React.ChangeEvent<HTMLSelectElement>);
        return;
      }

      if (name === "state_id") {
        const selected = states.find((s) => String(s.id) === value);
        onChange({ target: { name: "state", value: selected?.name ?? "" } } as React.ChangeEvent<HTMLSelectElement>);
        onChange({ target: { name: "district", value: "" } } as React.ChangeEvent<HTMLSelectElement>);
        onChange({ target: { name: "city", value: "" } } as React.ChangeEvent<HTMLSelectElement>);
        return;
      }

      if (name === "district_id") {
        const selected = districts.find((d) => String(d.id) === value);
        onChange({ target: { name: "district", value: selected?.name ?? "" } } as React.ChangeEvent<HTMLSelectElement>);
        onChange({ target: { name: "city", value: "" } } as React.ChangeEvent<HTMLSelectElement>);
        return;
      }

      if (name === "city_id") {
        const selected = cities.find((c) => String(c.id) === value);
        onChange({ target: { name: "city", value: selected?.name ?? "" } } as React.ChangeEvent<HTMLSelectElement>);
      }
    },
    [cities, countries, districts, onChange, states]
  );

  const loadCountries = useCallback(async (search: string) => {
    setLoadingCountries(true);
    try {
      const list = await withMinDuration(180, getCountries(search || undefined));
      setCountries(list);
    } catch {
      setCountries([]);
    } finally {
      setLoadingCountries(false);
    }
  }, []);

  const loadStates = useCallback(
    async (search: string) => {
      if (!countryId) return;
      setLoadingStates(true);
      try {
        const list = await withMinDuration(
          180,
          getStates(countryId, search || undefined),
        );
        setStates(list);
      } catch {
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    },
    [countryId]
  );

  const loadDistricts = useCallback(
    async (search: string) => {
      if (!stateId) return;
      setLoadingDistricts(true);
      try {
        const list = await withMinDuration(
          180,
          getDistricts(stateId, search || undefined),
        );
        setDistricts(list);
      } catch {
        setDistricts([]);
      } finally {
        setLoadingDistricts(false);
      }
    },
    [stateId]
  );

  const loadCities = useCallback(
    async (search: string) => {
      if (!districtId) return;
      setLoadingCities(true);
      try {
        const list = await withMinDuration(
          180,
          getCities(districtId, search || undefined),
        );
        setCities(list);
      } catch {
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    },
    [districtId]
  );

  useEffect(() => {
    if (!hasHoroscope) return;
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
  }, [placeQuery, hasHoroscope]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!placeWrapRef.current?.contains(e.target as Node)) setPlaceOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (formData.birth_place && !placeQuery) {
      skipNextSearchRef.current = true;
      setPlaceQuery(formData.birth_place);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.birth_place]);

  const handleToggleHoroscope = useCallback(
    (checked: boolean) => {
      emit("has_horoscope", checked ? "true" : "");
      if (!checked) {
        emit("birth_time", "");
        emit("birth_place", "");
        emit("birth_latitude", "");
        emit("birth_longitude", "");
        emit("birth_timezone", "");
        setPlaceQuery("");
        setPlaceResults([]);
        setPlaceOpen(false);
      } else if (!formData.birth_timezone) {
        emit("birth_timezone", "5.5");
      }
    },
    [emit, formData.birth_timezone]
  );

  const handleSelectPlace = useCallback(
    (place: GeocodeResult) => {
      skipNextSearchRef.current = true;
      setPlaceQuery(place.label);
      emit("birth_place", place.label);
      emit("birth_latitude", String(place.latitude));
      emit("birth_longitude", String(place.longitude));
      if (!formData.birth_timezone) emit("birth_timezone", "5.5");
      setPlaceOpen(false);
      setPlaceResults([]);
    },
    [emit, formData.birth_timezone]
  );

  const handlePlaceInput = useCallback(
    (value: string) => {
      setPlaceQuery(value);
      emit("birth_place", value);
      emit("birth_latitude", "");
      emit("birth_longitude", "");
    },
    [emit]
  );

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Location Details</h1>
        <p className="text-muted-foreground text-sm">Country, State, District, City, Address</p>
      </div>
      <div className="space-y-4">
        <SearchableSelect
          name="country_id"
          value={formData.country_id || ""}
          options={countries}
          loading={loadingCountries}
          label="Country"
          placeholder="Select Country"
          initialDisplayLabel={formData.country || undefined}
          onSearch={loadCountries}
          onSelect={handleSelect}
        />

        {countryId ? (
          <SearchableSelect
            name="state_id"
            value={formData.state_id || ""}
            options={states}
            loading={loadingStates}
            label="State"
            placeholder="Select State"
            initialDisplayLabel={formData.state || undefined}
            onSearch={loadStates}
            onSelect={handleSelect}
          />
        ) : null}

        {stateId ? (
          <SearchableSelect
            name="district_id"
            value={formData.district_id || ""}
            options={districts}
            loading={loadingDistricts}
            label="District"
            placeholder="Select District"
            initialDisplayLabel={formData.district || undefined}
            onSearch={loadDistricts}
            onSelect={handleSelect}
          />
        ) : null}

        {districtId ? (
          <SearchableSelect
            name="city_id"
            value={formData.city_id || ""}
            options={cities}
            loading={loadingCities}
            label="City"
            placeholder="Select City"
            initialDisplayLabel={formData.city || undefined}
            onSearch={loadCities}
            onSelect={handleSelect}
          />
        ) : null}

        <div>
          <label className={labelClass}>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={onChange}
            placeholder="Enter your address"
            rows={3}
            className="w-full px-4 py-3 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors bg-white resize-none"
          />
        </div>

        <div className="rounded-2xl border-2 border-primary/10 bg-primary/[0.03] p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasHoroscope}
              onChange={(e) => handleToggleHoroscope(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 rounded border-2 border-primary/30 text-primary accent-primary focus:ring-primary/30"
            />
            <span>
              <span className="block text-sm font-medium text-foreground">
                Add horoscope details
                <span className="text-muted-foreground font-normal"> (Optional)</span>
              </span>
              <span className="block text-xs text-muted-foreground mt-0.5">
                Provide your birth time and place to enable horoscope matching.
              </span>
            </span>
          </label>

          {hasHoroscope ? (
            <div className="space-y-4 mt-4">
              <div>
                <label className={labelClass}>Birth Time</label>
                <BirthTimePicker
                  value={formData.birth_time || ""}
                  onChange={(v) => emit("birth_time", v)}
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
                {formData.birth_latitude && formData.birth_longitude ? (
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Coordinates: {Number(formData.birth_latitude).toFixed(4)},{" "}
                    {Number(formData.birth_longitude).toFixed(4)}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default LocationStep;
