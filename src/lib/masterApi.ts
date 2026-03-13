import { BASE_URL } from "./config";

export interface Country {
  id: number;
  name: string;
  code: string;
}

export interface State {
  id: number;
  name: string;
  code: string;
  country: number;
}

export interface District {
  id: number;
  name: string;
  state: number;
}

export interface City {
  id: number;
  name: string;
  district: number;
}

export interface Religion {
  id: number;
  name: string;
  is_active: boolean;
}

export interface Caste {
  id: number;
  name: string;
  is_active: boolean;
  religion: number;
}

export interface MotherTongue {
  id: number;
  name: string;
  is_active: boolean;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

async function getPaginated<T>(path: string, search?: string): Promise<T[]> {
  const base = path.startsWith("http") ? path : `${BASE_URL}${path.replace(/^\//, "")}`;
  const sep = base.includes("?") ? "&" : "?";
  const fullUrl =
    search != null && search.trim() !== ""
      ? `${base}${sep}search=${encodeURIComponent(search.trim())}`
      : base;
  const res = await fetch(fullUrl);
  const data = (await res.json().catch(() => ({}))) as PaginatedResponse<T>;
  if (!res.ok) throw new Error((data as { detail?: string })?.detail ?? "Request failed");
  return data.results ?? [];
}

/** GET v1/master/countries?search= */
export async function getCountries(search?: string): Promise<Country[]> {
  const path = "v1/master/countries";
  const results = await getPaginated<Country>(path, search);
  console.log("[masterApi] getCountries response:", { search, results });
  return results;
}

/** GET v1/master/states/?country_id=<id>&search= */
export async function getStates(countryId: number, search?: string): Promise<State[]> {
  const path = `v1/master/states/?country_id=${countryId}`;
  const results = await getPaginated<State>(path, search);
  console.log("[masterApi] getStates response:", { countryId, search, results });
  return results;
}

/** GET v1/master/districts/?state_id=<id>&search= */
export async function getDistricts(stateId: number, search?: string): Promise<District[]> {
  const path = `v1/master/districts/?state_id=${stateId}`;
  const results = await getPaginated<District>(path, search);
  console.log("[masterApi] getDistricts response:", { stateId, search, results });
  return results;
}

/** GET v1/master/cities/?district_id=<id>&search= */
export async function getCities(districtId: number, search?: string): Promise<City[]> {
  const path = `v1/master/cities/?district_id=${districtId}`;
  const results = await getPaginated<City>(path, search);
  console.log("[masterApi] getCities response:", { districtId, search, results });
  return results;
}

/** GET v1/master/religions?search= */
export async function getReligions(search?: string): Promise<Religion[]> {
  const path = "v1/master/religions";
  const results = await getPaginated<Religion>(path, search);
  console.log("[masterApi] getReligions response:", { search, results });
  return results;
}

/** GET v1/master/castes/?religion_id=<id>&search= */
export async function getCastes(religionId: number, search?: string): Promise<Caste[]> {
  const path = `v1/master/castes/?religion_id=${religionId}`;
  const results = await getPaginated<Caste>(path, search);
  console.log("[masterApi] getCastes response:", { religionId, search, results });
  return results;
}

/** GET v1/master/mother-tongues/?search= */
export async function getMotherTongues(search?: string): Promise<MotherTongue[]> {
  const path = "v1/master/mother-tongues/";
  const results = await getPaginated<MotherTongue>(path, search);
  console.log("[masterApi] getMotherTongues response:", { search, results });
  return results;
}
