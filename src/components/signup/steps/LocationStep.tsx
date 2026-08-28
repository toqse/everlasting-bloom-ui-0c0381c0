import { useState, useEffect, useCallback, useRef } from "react";
import { getCountries, getStates, getDistricts, getCities } from "@/lib/masterApi";
import type { Country, State, District, City } from "@/lib/masterApi";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { labelClass } from "../SignupFormFields";
import { HoroscopeBirthFields } from "../HoroscopeBirthFields";

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
  const countriesRef = useRef<Country[]>([]);
  const statesRef = useRef<State[]>([]);
  const districtsRef = useRef<District[]>([]);
  const citiesRef = useRef<City[]>([]);
  countriesRef.current = countries;
  statesRef.current = states;
  districtsRef.current = districts;
  citiesRef.current = cities;
  const countriesAbortRef = useRef<AbortController | null>(null);
  const statesAbortRef = useRef<AbortController | null>(null);
  const districtsAbortRef = useRef<AbortController | null>(null);
  const citiesAbortRef = useRef<AbortController | null>(null);

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
        setStates([]);
        setDistricts([]);
        setCities([]);
        return;
      }

      if (name === "state_id") {
        const selected = states.find((s) => String(s.id) === value);
        onChange({ target: { name: "state", value: selected?.name ?? "" } } as React.ChangeEvent<HTMLSelectElement>);
        onChange({ target: { name: "district", value: "" } } as React.ChangeEvent<HTMLSelectElement>);
        onChange({ target: { name: "city", value: "" } } as React.ChangeEvent<HTMLSelectElement>);
        setDistricts([]);
        setCities([]);
        return;
      }

      if (name === "district_id") {
        const selected = districts.find((d) => String(d.id) === value);
        onChange({ target: { name: "district", value: selected?.name ?? "" } } as React.ChangeEvent<HTMLSelectElement>);
        onChange({ target: { name: "city", value: "" } } as React.ChangeEvent<HTMLSelectElement>);
        setCities([]);
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
    countriesAbortRef.current?.abort();
    const ac = new AbortController();
    countriesAbortRef.current = ac;
    if (countriesRef.current.length === 0) setLoadingCountries(true);
    try {
      const list = await getCountries(search || undefined, ac.signal);
      if (ac.signal.aborted) return;
      setCountries(list);
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      if (!ac.signal.aborted) setCountries([]);
    } finally {
      if (!ac.signal.aborted) setLoadingCountries(false);
    }
  }, []);

  const loadStates = useCallback(
    async (search: string) => {
      if (!countryId) return;
      statesAbortRef.current?.abort();
      const ac = new AbortController();
      statesAbortRef.current = ac;
      if (statesRef.current.length === 0) setLoadingStates(true);
      try {
        const list = await getStates(countryId, search || undefined, ac.signal);
        if (ac.signal.aborted) return;
        setStates(list);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        if (!ac.signal.aborted) setStates([]);
      } finally {
        if (!ac.signal.aborted) setLoadingStates(false);
      }
    },
    [countryId]
  );

  const loadDistricts = useCallback(
    async (search: string) => {
      if (!stateId) return;
      districtsAbortRef.current?.abort();
      const ac = new AbortController();
      districtsAbortRef.current = ac;
      if (districtsRef.current.length === 0) setLoadingDistricts(true);
      try {
        const list = await getDistricts(stateId, search || undefined, ac.signal);
        if (ac.signal.aborted) return;
        setDistricts(list);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        if (!ac.signal.aborted) setDistricts([]);
      } finally {
        if (!ac.signal.aborted) setLoadingDistricts(false);
      }
    },
    [stateId]
  );

  const loadCities = useCallback(
    async (search: string) => {
      if (!districtId) return;
      citiesAbortRef.current?.abort();
      const ac = new AbortController();
      citiesAbortRef.current = ac;
      if (citiesRef.current.length === 0) setLoadingCities(true);
      try {
        const list = await getCities(districtId, search || undefined, ac.signal);
        if (ac.signal.aborted) return;
        setCities(list);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        if (!ac.signal.aborted) setCities([]);
      } finally {
        if (!ac.signal.aborted) setLoadingCities(false);
      }
    },
    [districtId]
  );

  useEffect(() => {
    loadCountries("");
    return () => countriesAbortRef.current?.abort();
  }, [loadCountries]);

  useEffect(() => {
    if (!countryId) {
      statesAbortRef.current?.abort();
      setStates([]);
      setLoadingStates(false);
      return;
    }
    setStates([]);
    setLoadingStates(true);
    loadStates("");
    return () => statesAbortRef.current?.abort();
  }, [countryId, loadStates]);

  useEffect(() => {
    if (!stateId) {
      districtsAbortRef.current?.abort();
      setDistricts([]);
      setLoadingDistricts(false);
      return;
    }
    setDistricts([]);
    setLoadingDistricts(true);
    loadDistricts("");
    return () => districtsAbortRef.current?.abort();
  }, [stateId, loadDistricts]);

  useEffect(() => {
    if (!districtId) {
      citiesAbortRef.current?.abort();
      setCities([]);
      setLoadingCities(false);
      return;
    }
    setCities([]);
    setLoadingCities(true);
    loadCities("");
    return () => citiesAbortRef.current?.abort();
  }, [districtId, loadCities]);

  const handleToggleHoroscope = useCallback(
    (checked: boolean) => {
      emit("has_horoscope", checked ? "true" : "");
      if (!checked) {
        emit("birth_time", "");
        emit("birth_place", "");
        emit("birth_latitude", "");
        emit("birth_longitude", "");
        emit("birth_timezone", "");
      } else if (!formData.birth_timezone) {
        emit("birth_timezone", "5.5");
      }
    },
    [emit, formData.birth_timezone]
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
            key={`state-${countryId}`}
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
            key={`district-${stateId}`}
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
            key={`city-${districtId}`}
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
            <div className="mt-4">
              <HoroscopeBirthFields
                birthTime={formData.birth_time || ""}
                birthPlace={formData.birth_place || ""}
                birthLatitude={formData.birth_latitude || ""}
                birthLongitude={formData.birth_longitude || ""}
                birthTimezone={formData.birth_timezone || ""}
                onChange={(updates) => {
                  for (const [name, value] of Object.entries(updates)) {
                    if (value === undefined) continue;
                    emit(name, value);
                  }
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default LocationStep;
