import { debugLog } from "./debugLog";
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

export interface EducationMaster {
  id: number;
  name: string;
  is_active?: boolean;
}

export interface EducationSubjectMaster {
  id: number;
  name: string;
  education?: number;
  education_id?: number;
  is_active?: boolean;
}

export interface OccupationMaster {
  id: number;
  name: string;
  is_active?: boolean;
}

export interface EmploymentStatusMaster {
  id: number;
  name: string;
  is_active?: boolean;
}

export interface IncomeRangeMaster {
  id: number;
  name: string;
  is_active?: boolean;
}

export interface MaritalStatusMaster {
  id: number;
  name: string;
  is_active?: boolean;
}

export interface ComplexionMaster {
  id: number;
  name: string;
  is_active?: boolean;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

async function getPaginated<T>(path: string, search?: string): Promise<T[]> {
  const base = path.startsWith("http") ? path : `${BASE_URL}${path.replace(/^\//, "")}`;
  const perPageLimit = 50;
  const maxPages = 40;
  let page = 1;
  const allResults: T[] = [];

  // Uses explicit page+limit params as requested:
  // /api/v1/master/.../?page=1&limit=50
  // and continues page-by-page until server indicates no next page.
  while (page <= maxPages) {
    const url = new URL(base);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(perPageLimit));
    if (search != null && search.trim() !== "") {
      url.searchParams.set("search", search.trim());
    }
    const res = await fetch(url.toString());
    const data = (await res.json().catch(() => ({}))) as PaginatedResponse<T>;
    if (!res.ok)
      throw new Error((data as { detail?: string })?.detail ?? "Request failed");
    if (Array.isArray(data.results)) allResults.push(...data.results);
    if (!data.next) break;
    page += 1;
  }

  return allResults;
}

/** Single-page master list fetch (no while-next drain). For fast filter bootstrap. */
export async function fetchMasterPage<T>(
  path: string,
  opts?: {
    limit?: number;
    search?: string;
    query?: Record<string, string | number | undefined>;
    signal?: AbortSignal;
  },
): Promise<T[]> {
  const base = path.startsWith("http") ? path : `${BASE_URL}${path.replace(/^\//, "")}`;
  const url = new URL(base);
  url.searchParams.set("page", "1");
  url.searchParams.set("limit", String(opts?.limit ?? 200));
  if (opts?.search != null && opts.search.trim() !== "") {
    url.searchParams.set("search", opts.search.trim());
  }
  if (opts?.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
    }
  }
  const res = await fetch(url.toString(), { signal: opts?.signal });
  const data = (await res.json().catch(() => ({}))) as PaginatedResponse<T>;
  if (!res.ok)
    throw new Error((data as { detail?: string })?.detail ?? "Request failed");
  return Array.isArray(data.results) ? data.results : [];
}

/** One-shot helpers for Matches filter fallback (limit=200, no page walk). */
export async function getReligionsPage(signal?: AbortSignal): Promise<Religion[]> {
  return fetchMasterPage<Religion>("v1/master/religions", { limit: 200, signal });
}

export async function getEducationsPage(signal?: AbortSignal): Promise<EducationMaster[]> {
  return fetchMasterPage<EducationMaster>("v1/master/educations/", { limit: 200, signal });
}

export async function getOccupationsPage(opts?: {
  signal?: AbortSignal;
  search?: string;
}): Promise<OccupationMaster[]> {
  return fetchMasterPage<OccupationMaster>("v1/master/occupations/", {
    limit: 200,
    signal: opts?.signal,
    search: opts?.search,
  });
}

export async function getMaritalStatusesPage(
  signal?: AbortSignal,
): Promise<MaritalStatusMaster[]> {
  return fetchMasterPage<MaritalStatusMaster>("v1/master/marital-statuses/", {
    limit: 200,
    signal,
  });
}

export async function getCountriesPage(signal?: AbortSignal): Promise<Country[]> {
  return fetchMasterPage<Country>("v1/master/countries", { limit: 200, signal });
}

/** GET v1/master/countries?search= */
export async function getCountries(
  search?: string,
  signal?: AbortSignal,
): Promise<Country[]> {
  const results = await fetchMasterPage<Country>("v1/master/countries", {
    limit: 200,
    search,
    signal,
  });
  debugLog("[masterApi] getCountries response:", { search, results });
  return results;
}

/** GET v1/master/states/?country_id=<id>&search= */
export async function getStates(
  countryId: number,
  search?: string,
  signal?: AbortSignal,
): Promise<State[]> {
  const results = await fetchMasterPage<State>("v1/master/states/", {
    limit: 200,
    search,
    signal,
    query: { country_id: countryId },
  });
  debugLog("[masterApi] getStates response:", { countryId, search, results });
  return results;
}

/** GET v1/master/districts/?state_id=<id>&search= */
export async function getDistricts(
  stateId: number,
  search?: string,
  signal?: AbortSignal,
): Promise<District[]> {
  const results = await fetchMasterPage<District>("v1/master/districts/", {
    limit: 200,
    search,
    signal,
    query: { state_id: stateId },
  });
  debugLog("[masterApi] getDistricts response:", { stateId, search, results });
  return results;
}

/** GET v1/master/cities/?district_id=<id>&search= */
export async function getCities(
  districtId: number,
  search?: string,
  signal?: AbortSignal,
): Promise<City[]> {
  const results = await fetchMasterPage<City>("v1/master/cities/", {
    limit: 200,
    search,
    signal,
    query: { district_id: districtId },
  });
  debugLog("[masterApi] getCities response:", { districtId, search, results });
  return results;
}

/** GET v1/master/cities/?district_id=1&district_id=2 — cities for multiple districts */
export async function getCitiesForDistricts(
  districtIds: number[],
  search?: string,
  signal?: AbortSignal,
): Promise<City[]> {
  if (districtIds.length === 0) return [];
  const qs = districtIds.map((id) => `district_id=${id}`).join("&");
  const results = await fetchMasterPage<City>(`v1/master/cities/?${qs}`, {
    limit: 200,
    search,
    signal,
  });
  debugLog("[masterApi] getCitiesForDistricts response:", { districtIds, search, results });
  return results;
}

/** GET v1/master/religions?search= */
export async function getReligions(search?: string): Promise<Religion[]> {
  const path = "v1/master/religions";
  const results = await getPaginated<Religion>(path, search);
  debugLog("[masterApi] getReligions response:", { search, results });
  return results;
}

/** GET v1/master/castes/?religion_id=<id>&search= */
export async function getCastes(religionId: number, search?: string): Promise<Caste[]> {
  const path = `v1/master/castes/?religion_id=${religionId}`;
  const base = `${BASE_URL}${path.replace(/^\//, "")}`;
  const requestUrl = new URL(base);
  requestUrl.searchParams.set("page", "1");
  requestUrl.searchParams.set("limit", "50");
  if (search != null && search.trim() !== "") {
    requestUrl.searchParams.set("search", search.trim());
  }
  debugLog("[masterApi] getCastes url:", requestUrl.toString());
  const results = await getPaginated<Caste>(path, search);
  debugLog("[masterApi] getCastes response:", { religionId, search, results });
  return results;
}

/** GET v1/master/mother-tongues/?search= */
export async function getMotherTongues(search?: string): Promise<MotherTongue[]> {
  const path = "v1/master/mother-tongues/";
  const results = await getPaginated<MotherTongue>(path, search);
  debugLog("[masterApi] getMotherTongues response:", { search, results });
  return results;
}

/** GET v1/master/educations/ */
export async function getEducations(search?: string): Promise<EducationMaster[]> {
  const path = "v1/master/educations/";
  const results = await getPaginated<EducationMaster>(path, search);
  debugLog("[masterApi] getEducations response:", { search, results });
  return results;
}

/** GET v1/master/education-subjects/?education_id=<id> */
export async function getEducationSubjects(
  educationId: number,
  search?: string,
): Promise<EducationSubjectMaster[]> {
  const path = `v1/master/education-subjects/?education_id=${educationId}`;
  const results = await getPaginated<EducationSubjectMaster>(path, search);
  debugLog("[masterApi] getEducationSubjects response:", {
    educationId,
    search,
    results,
  });
  return results;
}

/** GET v1/master/occupations/ */
export async function getOccupations(
  search?: string,
): Promise<OccupationMaster[]> {
  const path = "v1/master/occupations/";
  const results = await getPaginated<OccupationMaster>(path, search);
  debugLog("[masterApi] getOccupations response:", { search, results });
  return results;
}

/** GET v1/master/employment-statuses/ */
export async function getEmploymentStatuses(
  search?: string,
): Promise<EmploymentStatusMaster[]> {
  const path = "v1/master/employment-statuses/";
  const results = await getPaginated<EmploymentStatusMaster>(path, search);
  debugLog("[masterApi] getEmploymentStatuses response:", { search, results });
  return results;
}

/** GET v1/master/income-ranges/ */
export async function getIncomeRanges(
  search?: string,
): Promise<IncomeRangeMaster[]> {
  const path = "v1/master/income-ranges/";
  const results = await getPaginated<IncomeRangeMaster>(path, search);
  debugLog("[masterApi] getIncomeRanges response:", { search, results });
  return results;
}

/** GET v1/master/marital-status/ */
export async function getMaritalStatuses(
  search?: string,
): Promise<MaritalStatusMaster[]> {
  const path = "v1/master/marital-status/";
  const results = await getPaginated<MaritalStatusMaster>(path, search);
  debugLog("[masterApi] getMaritalStatuses response:", { search, results });
  return results;
}

/** GET v1/master/complexions/ */
export async function getComplexions(
  search?: string,
): Promise<ComplexionMaster[]> {
  const path = "v1/master/complexions/";
  const results = await getPaginated<ComplexionMaster>(path, search);
  debugLog("[masterApi] getComplexions response:", { search, results });
  return results;
}
