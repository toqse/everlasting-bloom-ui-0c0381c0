import { useState, useEffect, useCallback } from "react";
import { getCountries, getStates, getDistricts, getCities } from "@/lib/masterApi";
import type { Country, State, District, City } from "@/lib/masterApi";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { labelClass } from "../SignupFormFields";

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

  const countryId = formData.country_id ? Number(formData.country_id) : 0;
  const stateId = formData.state_id ? Number(formData.state_id) : 0;
  const districtId = formData.district_id ? Number(formData.district_id) : 0;

  const handleSelect = useCallback(
    (name: string, value: string) => {
      onChange({ target: { name, value } } as React.ChangeEvent<HTMLSelectElement>);
    },
    [onChange]
  );

  const loadCountries = useCallback(async (search: string) => {
    setLoadingCountries(true);
    try {
      const list = await getCountries(search || undefined);
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
        const list = await getStates(countryId, search || undefined);
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
        const list = await getDistricts(stateId, search || undefined);
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
        const list = await getCities(districtId, search || undefined);
        setCities(list);
      } catch {
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    },
    [districtId]
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
      </div>
    </>
  );
};

export default LocationStep;
