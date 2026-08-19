import { HIGHEST_EDUCATION_OPTIONS } from "@/constants/highestEducationOptions";
import {
  getEducations,
  getEducationSubjects,
  getEmploymentStatuses,
  getIncomeRanges,
  getOccupations,
  type EducationMaster,
} from "@/lib/masterApi";

/** Ignore dots, spaces, and case so "bcom" matches "B.Com." */
export function normalizeMasterSearch(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function matchesMasterSearch(option: string, query: string): boolean {
  const q = normalizeMasterSearch(query.trim());
  if (!q) return true;
  return normalizeMasterSearch(option).includes(q);
}

export function getFallbackEducations(): EducationMaster[] {
  return HIGHEST_EDUCATION_OPTIONS.map((name, index) => ({
    id: -(index + 1),
    name,
  }));
}

type SignupEducationMasterCache = {
  educations: EducationMaster[];
  occupations: string[];
  employmentStatuses: string[];
  incomeRanges: string[];
};

let cache: SignupEducationMasterCache | null = null;
let inflight: Promise<SignupEducationMasterCache> | null = null;

async function fetchSignupEducationMaster(): Promise<SignupEducationMasterCache> {
  const [eduRes, occRes, empRes, incRes] = await Promise.all([
    getEducations(),
    getOccupations(),
    getEmploymentStatuses(),
    getIncomeRanges(),
  ]);
  return {
    educations: eduRes.length > 0 ? eduRes : getFallbackEducations(),
    occupations: occRes.map((o) => o.name),
    employmentStatuses: empRes.map((e) => e.name),
    incomeRanges: incRes.map((i) => i.name),
  };
}

export async function loadSignupEducationMaster(): Promise<
  SignupEducationMasterCache & { usedFallbackOnly: boolean }
> {
  if (cache) {
    return { ...cache, usedFallbackOnly: false };
  }

  if (!inflight) {
    inflight = fetchSignupEducationMaster()
      .then((data) => {
        cache = data;
        return data;
      })
      .finally(() => {
        inflight = null;
      });
  }

  try {
    const data = await inflight;
    return { ...data, usedFallbackOnly: false };
  } catch {
    const fallback: SignupEducationMasterCache = {
      educations: getFallbackEducations(),
      occupations: [],
      employmentStatuses: [],
      incomeRanges: [],
    };
    return { ...fallback, usedFallbackOnly: true };
  }
}

export function prefetchSignupEducationMaster(): void {
  void loadSignupEducationMaster();
}

export async function loadEducationSubjectsForName(
  educations: EducationMaster[],
  educationName: string,
): Promise<string[]> {
  const selected = educations.find((e) => e.name === educationName);
  if (!selected || selected.id <= 0) return [];
  const subjectRes = await getEducationSubjects(selected.id);
  return subjectRes.map((s) => s.name);
}
