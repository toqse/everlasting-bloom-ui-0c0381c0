import { useState, useEffect, useCallback, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuthStore } from "@/stores/authStore";
import { Edit, Eye, Sun, UsersRound, User, BookOpen, GraduationCap, Image, MapPin, UserCircle, FileText, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getProfile,
  patchBasic,
  patchLocation,
  patchReligion,
  patchPersonal,
  patchEducation,
  patchAbout,
  patchFamily,
  postPhotos,
  type ProfileData,
  type LocationBody,
  type ReligionBody,
  type PersonalBody,
  type EducationBody,
  type FamilyBody,
} from "@/lib/profileApi";
import { getCountries, getStates, getDistricts, getCities } from "@/lib/masterApi";
import type { Country, State, District, City } from "@/lib/masterApi";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { BASE_URL } from "@/lib/config";

const FAMILY_TYPES = ["Nuclear", "Joint", "Extended", "Other"];
const FAMILY_STATUS_OPTIONS = ["Middle Class", "Upper Middle Class", "Rich", "Affluent", "Other"];
const EMPLOYMENT_STATUS_OPTIONS = ["Employed", "Self Employed", "Business", "Not Working", "Student", "Other"];
const PARTNER_RELIGION_OPTIONS = ["Same Religion Only", "Open to All Religions", "No Preference", "Other"];
const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

type SectionKey =
  | "Basic Info"
  | "Religion"
  | "Education"
  | "Photos"
  | "Location"
  | "Personal"
  | "Family"
  | "About Me"
  | "Horoscope";

const allProfileSections: {
  title: SectionKey;
  description: string;
  icon?: LucideIcon;
}[] = [
  { title: "Basic Info", description: "Name, Gender, DOB, Phone, Email", icon: User },
  { title: "Religion", description: "Religion, Caste, Mother Tongue, Partner Preference", icon: BookOpen },
  { title: "Education", description: "Qualification, Subject, Employment, Job, Income", icon: GraduationCap },
  { title: "Photos", description: "Profile photos and verification", icon: Image },
  { title: "Location", description: "Country, State, District, City, Address", icon: MapPin },
  { title: "Personal", description: "Marital Status, Children, Height, Weight, Colour, Blood Group", icon: UserCircle },
  { title: "Family", description: "Family type, parents, siblings", icon: UsersRound },
  { title: "About Me", description: "Bio and interests", icon: FileText },
  { title: "Horoscope", description: "Jathagam details (Hindu only)", icon: Sun },
];

// Profile form data (display + ids for PATCH bodies)
interface ProfileFormData {
  name: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  religion: string;
  caste: string;
  motherTongue: string;
  partnerReligionPreference: string;
  partner_preference_type?: "own_religion_only" | "open_to_all" | "specific_religions";
  partner_religion_ids?: number[];
  qualification: string;
  educationSubject: string;
  employmentStatus: string;
  job: string;
  income: string;
  country: string;
  state: string;
  city: string;
  district: string;
  address: string;
  country_id?: number;
  state_id?: number;
  district_id?: number;
  city_id?: number;
  religion_id?: number;
  caste_id?: number | null;
  mother_tongue_id?: number;
  height: string;
  weight: string;
  maritalStatus: string;
  numberOfChildren: string;
  color: string;
  bloodGroup: string;
  familyType: string;
  fathersName: string;
  fathersOccupation: string;
  mothersName: string;
  mothersOccupation: string;
  familyStatus: string;
  numberOfBrothers: string;
  numberOfMarriedBrothers: string;
  numberOfSisters: string;
  numberOfMarriedSisters: string;
  aboutMyFamily: string;
  bio: string;
  interests: string;
  rashi: string;
  nakshatra: string;
  manglikStatus: string;
}

/** Map GET v1/profile/ data to form state (including ids for PATCH). */
function mapProfileDataToForm(
  data: ProfileData,
  user: { name?: string; phone?: string; email?: string; location?: string } | null
): ProfileFormData {
  const basic = data.basic_details ?? {};
  const religion = data.religion_details ?? {};
  const personal = data.personal_details ?? {};
  const location = data.location_details ?? {};
  const family = data.family_details ?? {};
  const education = data.education_details ?? {};
  const raw = (v: unknown) => (v != null ? String(v) : "");
  const num = (v: unknown): number => (typeof v === "number" ? v : 0);
  const children = personal.children_count ?? 0;
  const heightStr = personal.height_cm ?? "";
  const heightNum = parseInt(heightStr.replace(/\D/g, ""), 10) || 0;
  const weightNum = parseFloat(String(personal.weight_kg ?? "").replace(/[^\d.]/g, "")) || null;
  return {
    name: raw(basic.name) || (user?.name ?? ""),
    phone: raw(basic.phone) || (user?.phone ?? ""),
    email: raw(basic.email) || (user?.email ?? ""),
    dob: raw(basic.dob),
    gender: raw(basic.gender),
    religion: raw(religion.religion),
    caste: raw(religion.caste),
    motherTongue: raw(religion.mother_tongue),
    partnerReligionPreference: raw(religion.partner_preference_type).replace(/_/g, " ") || "",
    partner_preference_type: (religion.partner_preference_type as ProfileFormData["partner_preference_type"]) || "open_to_all",
    partner_religion_ids: religion.partner_religion_ids ?? [],
    qualification: raw(education.highest_education),
    educationSubject: raw(education.education_subject),
    employmentStatus: raw(education.employment_status),
    job: raw(education.occupation),
    income: raw(education.annual_income),
    country: raw(location.country),
    state: raw(location.state),
    city: raw(location.city),
    district: raw(location.district),
    address: raw(location.address),
    country_id: location.country_id,
    state_id: location.state_id,
    district_id: location.district_id,
    city_id: location.city_id,
    religion_id: religion.religion_id,
    caste_id: religion.caste_id ?? null,
    mother_tongue_id: religion.mother_tongue_id,
    height: heightStr || (heightNum ? `${heightNum} cm` : ""),
    weight: personal.weight_kg ? String(weightNum ?? personal.weight_kg) : "",
    maritalStatus: raw(personal.marital_status),
    numberOfChildren: String(children),
    color: raw(personal.colour),
    bloodGroup: raw(personal.blood_group),
    familyType: "",
    fathersName: raw(family.father_name),
    fathersOccupation: raw(family.father_occupation),
    mothersName: raw(family.mother_name),
    mothersOccupation: raw(family.mother_occupation),
    familyStatus: "",
    numberOfBrothers: family.brothers != null ? String(family.brothers) : "",
    numberOfMarriedBrothers: family.married_brothers != null ? String(family.married_brothers) : "",
    numberOfSisters: family.sisters != null ? String(family.sisters) : "",
    numberOfMarriedSisters: family.married_sisters != null ? String(family.married_sisters) : "",
    aboutMyFamily: raw(family.about_family),
    bio: raw(data.about_me),
    interests: "",
    rashi: "",
    nakshatra: "",
    manglikStatus: "",
  };
}

const defaultProfileData = (user: { name?: string; phone?: string; email?: string; location?: string } | null): ProfileFormData => ({
  name: user?.name ?? "",
  phone: user?.phone ?? "",
  email: user?.email ?? "",
  dob: "",
  gender: "",
  religion: "",
  caste: "",
  motherTongue: "",
  partnerReligionPreference: "",
  qualification: "",
  educationSubject: "",
  employmentStatus: "",
  job: "",
  income: "",
  country: "India",
  state: "",
  city: user?.location?.split(",")[0]?.trim() ?? "",
  district: "",
  address: "",
  height: "",
  weight: "",
  maritalStatus: "",
  numberOfChildren: "",
  color: "",
  bloodGroup: "",
  familyType: "",
  fathersName: "",
  fathersOccupation: "",
  mothersName: "",
  mothersOccupation: "",
  familyStatus: "",
  numberOfBrothers: "",
  numberOfMarriedBrothers: "",
  numberOfSisters: "",
  numberOfMarriedSisters: "",
  aboutMyFamily: "",
  bio: "",
  interests: "",
  rashi: "",
  nakshatra: "",
  manglikStatus: "",
});

function ProfileSectionCard({
  title,
  icon: Icon,
  summary,
  onView,
  onEdit,
}: {
  title: string;
  icon?: LucideIcon;
  summary?: string;
  onView: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="flex gap-3 min-w-0 flex-1">
        {Icon && (
          <div className="w-10 h-10 rounded-full bg-accent-gold/20 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-secondary" />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-serif text-lg font-bold text-foreground">{title}</h3>
          {summary && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{summary}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onView();
          }}
          className="inline-flex items-center justify-center gap-1.5 h-9 rounded-md px-3 text-sm font-medium border-2 border-primary/50 text-primary bg-primary/10 hover:bg-primary/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative z-10"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit();
          }}
          className="inline-flex items-center justify-center gap-1.5 h-9 rounded-md px-3 text-sm font-medium border-2 border-accent-rose/50 text-primary bg-accent-rose/10 hover:bg-accent-rose/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative z-10"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
      </div>
    </div>
  );
}

const PHOTO_KEYS = [
  "profile_photo",
  "full_photo",
  "selfie_photo",
  "family_photo",
  "aadhaar_front",
  "aadhaar_back",
] as const;

function EditSectionForm({
  section,
  data,
  onChange,
  locationOptions,
  locationLoading,
  locationLoaders,
  onLocationChange,
  photoFiles,
  existingPhotos,
  onPhotoChange,
}: {
  section: SectionKey;
  data: ProfileFormData;
  onChange: (data: ProfileFormData) => void;
  locationOptions?: { countries: Country[]; states: State[]; districts: District[]; cities: City[] };
  locationLoading?: { countries: boolean; states: boolean; districts: boolean; cities: boolean };
  locationLoaders?: {
    loadCountries: (search: string) => void;
    loadStates: (search: string) => void;
    loadDistricts: (search: string) => void;
    loadCities: (search: string) => void;
  };
  onLocationChange?: (updates: Partial<ProfileFormData>) => void;
  photoFiles?: Record<string, File | null>;
  existingPhotos?: Record<string, string | null>;
  onPhotoChange?: (key: string, file: File | null) => void;
}) {
  const update = (key: keyof ProfileFormData, value: string) =>
    onChange({ ...data, [key]: value });

  switch (section) {
    case "Basic Info":
      return (
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Full name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gender">Gender</Label>
            <Input
              id="gender"
              value={data.gender}
              onChange={(e) => update("gender", e.target.value)}
              placeholder="e.g. Male, Female"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={data.dob}
              onChange={(e) => update("dob", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="e.g. +91 9876543210"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="e.g. name@example.com"
            />
          </div>
        </div>
      );
    case "Religion":
      return (
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="religion">Religion</Label>
            <Input
              id="religion"
              value={data.religion}
              onChange={(e) => update("religion", e.target.value)}
              placeholder="e.g. Hindu, Christian"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="caste">Caste</Label>
            <Input
              id="caste"
              value={data.caste}
              onChange={(e) => update("caste", e.target.value)}
              placeholder="Caste"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="motherTongue">Mother Tongue</Label>
            <Input
              id="motherTongue"
              value={data.motherTongue}
              onChange={(e) => update("motherTongue", e.target.value)}
              placeholder="e.g. Malayalam, Hindi"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="partnerReligionPreference">Partner Religion Preference</Label>
            <select
              id="partnerReligionPreference"
              value={(data.partner_preference_type ?? data.partnerReligionPreference) || ""}
              onChange={(e) => {
                const v = e.target.value as "own_religion_only" | "open_to_all" | "specific_religions" | "";
                onChange({
                  ...data,
                  partner_preference_type: v || "open_to_all",
                  partnerReligionPreference: v ? v.replace(/_/g, " ") : "",
                });
              }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select preference</option>
              <option value="own_religion_only">Same Religion Only</option>
              <option value="open_to_all">Open to All Religions</option>
              <option value="specific_religions">Specific Religions</option>
            </select>
          </div>
        </div>
      );
    case "Education":
      return (
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="qualification">Highest Education</Label>
            <Input
              id="qualification"
              value={data.qualification}
              onChange={(e) => update("qualification", e.target.value)}
              placeholder="e.g. B.Tech, MBA"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="educationSubject">Education Subject</Label>
            <Input
              id="educationSubject"
              value={data.educationSubject}
              onChange={(e) => update("educationSubject", e.target.value)}
              placeholder="e.g. Computer Science / IT"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="employmentStatus">Employment Status</Label>
            <select
              id="employmentStatus"
              value={data.employmentStatus}
              onChange={(e) => update("employmentStatus", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select status</option>
              {EMPLOYMENT_STATUS_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="job">Occupation / Job</Label>
            <Input
              id="job"
              value={data.job}
              onChange={(e) => update("job", e.target.value)}
              placeholder="e.g. Software Developer"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="income">Annual Income</Label>
            <Input
              id="income"
              value={data.income}
              onChange={(e) => update("income", e.target.value)}
              placeholder="e.g. 10 Lakh"
            />
          </div>
        </div>
      );
    case "Photos": {
      const files = photoFiles ?? {};
      const existing = existingPhotos ?? {};
      return (
        <div className="grid gap-6 py-2">
          <p className="text-sm text-muted-foreground">
            Upload and manage your profile photos. Verification photos can be added for a verified badge.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PHOTO_KEYS.map((key) => {
              const file = files[key];
              const existingPath = existing[key];
              const previewUrl = file
                ? URL.createObjectURL(file)
                : existingPath
                  ? getMediaUrl(existingPath)
                  : "";
              const label = PHOTO_LABELS[key] ?? key.replace(/_/g, " ");
              return (
                <div key={key} className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">{label}</Label>
                  <div className="flex flex-col sm:flex-row gap-3 items-start">
                    <label className="cursor-pointer inline-flex items-center justify-center gap-2 h-10 rounded-md px-4 text-sm font-medium border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary border-dashed shrink-0">
                      <Image className="w-4 h-4" />
                      {file ? "Change" : "Choose file"}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const f = e.target.files?.[0] ?? null;
                          onPhotoChange?.(key, f);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    {file && (
                      <button
                        type="button"
                        onClick={() => onPhotoChange?.(key, null)}
                        className="text-sm text-muted-foreground hover:text-destructive underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {previewUrl ? (
                    <div className="rounded-xl overflow-hidden border border-border bg-muted/30 w-full max-w-[200px] aspect-[3/4]">
                      <img
                        src={previewUrl}
                        alt={label}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    case "Location": {
      const countries = locationOptions?.countries ?? [];
      const states = locationOptions?.states ?? [];
      const districts = locationOptions?.districts ?? [];
      const cities = locationOptions?.cities ?? [];
      const loading = locationLoading ?? { countries: false, states: false, districts: false, cities: false };
      const countryId = data.country_id ?? 0;
      const stateId = data.state_id ?? 0;
      const districtId = data.district_id ?? 0;

      const handleLocationSelect = (name: string, value: string) => {
        if (!onLocationChange) return;
        const id = Number(value);
        if (name === "country_id") {
          const nameStr = countries.find((c) => c.id === id)?.name ?? "";
          onLocationChange({
            country_id: id,
            country: nameStr,
            state_id: undefined,
            state: "",
            district_id: undefined,
            district: "",
            city_id: undefined,
            city: "",
          });
        } else if (name === "state_id") {
          const nameStr = states.find((s) => s.id === id)?.name ?? "";
          onLocationChange({
            state_id: id,
            state: nameStr,
            district_id: undefined,
            district: "",
            city_id: undefined,
            city: "",
          });
        } else if (name === "district_id") {
          const nameStr = districts.find((d) => d.id === id)?.name ?? "";
          onLocationChange({
            district_id: id,
            district: nameStr,
            city_id: undefined,
            city: "",
          });
        } else if (name === "city_id") {
          const nameStr = cities.find((c) => c.id === id)?.name ?? "";
          onLocationChange({ city_id: id, city: nameStr });
        }
      };

      const loaders = locationLoaders ?? {
        loadCountries: () => {},
        loadStates: () => {},
        loadDistricts: () => {},
        loadCities: () => {},
      };

      return (
        <div className="grid gap-4 py-2">
          <SearchableSelect
            name="country_id"
            value={data.country_id != null ? String(data.country_id) : ""}
            options={countries}
            loading={loading.countries}
            label="Country"
            placeholder="Select Country"
            initialDisplayLabel={data.country || undefined}
            onSearch={loaders.loadCountries}
            onSelect={handleLocationSelect}
          />
          {countryId > 0 ? (
            <SearchableSelect
              name="state_id"
              value={data.state_id != null ? String(data.state_id) : ""}
              options={states}
              loading={loading.states}
              label="State"
              placeholder="Select State"
              initialDisplayLabel={data.state || undefined}
              onSearch={loaders.loadStates}
              onSelect={handleLocationSelect}
            />
          ) : null}
          {stateId > 0 ? (
            <SearchableSelect
              name="district_id"
              value={data.district_id != null ? String(data.district_id) : ""}
              options={districts}
              loading={loading.districts}
              label="District"
              placeholder="Select District"
              initialDisplayLabel={data.district || undefined}
              onSearch={loaders.loadDistricts}
              onSelect={handleLocationSelect}
            />
          ) : null}
          {districtId > 0 ? (
            <SearchableSelect
              name="city_id"
              value={data.city_id != null ? String(data.city_id) : ""}
              options={cities}
              loading={loading.cities}
              label="City"
              placeholder="Select City"
              initialDisplayLabel={data.city || undefined}
              onSearch={loaders.loadCities}
              onSelect={handleLocationSelect}
            />
          ) : null}
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <textarea
              id="address"
              value={data.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="e.g. House name, street"
              rows={2}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            />
          </div>
        </div>
      );
    }
    case "Personal":
      return (
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="maritalStatus">Marital Status</Label>
            <Input
              id="maritalStatus"
              value={data.maritalStatus}
              onChange={(e) => update("maritalStatus", e.target.value)}
              placeholder="e.g. Never Married, Divorced"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="numberOfChildren">No. of Children</Label>
            <Input
              id="numberOfChildren"
              type="number"
              min={0}
              value={data.numberOfChildren}
              onChange={(e) => update("numberOfChildren", e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="height">Height</Label>
            <Input
              id="height"
              value={data.height}
              onChange={(e) => update("height", e.target.value)}
              placeholder="e.g. 168 cm or 5'6&quot;"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="weight">Weight</Label>
            <Input
              id="weight"
              value={data.weight}
              onChange={(e) => update("weight", e.target.value)}
              placeholder="e.g. 65 Kg"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="color">Colour / Complexion</Label>
            <Input
              id="color"
              value={data.color}
              onChange={(e) => update("color", e.target.value)}
              placeholder="e.g. Fair, Wheatish"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bloodGroup">Blood Group</Label>
            <select
              id="bloodGroup"
              value={data.bloodGroup}
              onChange={(e) => update("bloodGroup", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select blood group</option>
              {BLOOD_GROUP_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>
      );
    case "Family":
      return (
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="familyType">Family Type</Label>
            <select
              id="familyType"
              value={data.familyType}
              onChange={(e) => update("familyType", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select Family Type</option>
              {FAMILY_TYPES.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fathersName">Father&apos;s Name</Label>
            <Input
              id="fathersName"
              value={data.fathersName}
              onChange={(e) => update("fathersName", e.target.value)}
              placeholder="e.g. Rajesh Kumar"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fathersOccupation">Father&apos;s Occupation</Label>
            <Input
              id="fathersOccupation"
              value={data.fathersOccupation}
              onChange={(e) => update("fathersOccupation", e.target.value)}
              placeholder="e.g. Government Employee"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mothersName">Mother&apos;s Name</Label>
            <Input
              id="mothersName"
              value={data.mothersName}
              onChange={(e) => update("mothersName", e.target.value)}
              placeholder="e.g. Lakshmi"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mothersOccupation">Mother&apos;s Occupation</Label>
            <Input
              id="mothersOccupation"
              value={data.mothersOccupation}
              onChange={(e) => update("mothersOccupation", e.target.value)}
              placeholder="e.g. Homemaker"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="familyStatus">Family Status</Label>
            <select
              id="familyStatus"
              value={data.familyStatus}
              onChange={(e) => update("familyStatus", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select Family Status</option>
              {FAMILY_STATUS_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="numberOfBrothers">No. of Brothers</Label>
              <Input
                id="numberOfBrothers"
                type="number"
                min={0}
                value={data.numberOfBrothers}
                onChange={(e) => update("numberOfBrothers", e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="numberOfMarriedBrothers">No. of Married Brothers</Label>
              <Input
                id="numberOfMarriedBrothers"
                type="number"
                min={0}
                value={data.numberOfMarriedBrothers}
                onChange={(e) => update("numberOfMarriedBrothers", e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="numberOfSisters">No. of Sisters</Label>
              <Input
                id="numberOfSisters"
                type="number"
                min={0}
                value={data.numberOfSisters}
                onChange={(e) => update("numberOfSisters", e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="numberOfMarriedSisters">No. of Married Sisters</Label>
              <Input
                id="numberOfMarriedSisters"
                type="number"
                min={0}
                value={data.numberOfMarriedSisters}
                onChange={(e) => update("numberOfMarriedSisters", e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="aboutMyFamily">About My Family (Optional)</Label>
            <textarea
              id="aboutMyFamily"
              value={data.aboutMyFamily}
              onChange={(e) => update("aboutMyFamily", e.target.value)}
              placeholder="e.g. We are a close-knit family with traditional values."
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            />
          </div>
        </div>
      );
    case "About Me":
      return (
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              value={data.bio}
              onChange={(e) => update("bio", e.target.value)}
              placeholder="Tell others about yourself"
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="interests">Interests</Label>
            <Input
              id="interests"
              value={data.interests}
              onChange={(e) => update("interests", e.target.value)}
              placeholder="Hobbies, interests (comma separated)"
            />
          </div>
        </div>
      );
    case "Horoscope":
      return (
        <div className="grid gap-4 py-2">
          <p className="text-sm text-muted-foreground">
            Jathagam details are used for Porutham matching (Hindu users).
          </p>
          <div className="grid gap-2">
            <Label htmlFor="rashi">Rashi</Label>
            <Input
              id="rashi"
              value={data.rashi}
              onChange={(e) => update("rashi", e.target.value)}
              placeholder="e.g. Meena (Pisces)"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nakshatra">Nakshatra</Label>
            <Input
              id="nakshatra"
              value={data.nakshatra}
              onChange={(e) => update("nakshatra", e.target.value)}
              placeholder="e.g. Revati"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="manglikStatus">Manglik Status</Label>
            <Input
              id="manglikStatus"
              value={data.manglikStatus}
              onChange={(e) => update("manglikStatus", e.target.value)}
              placeholder="e.g. Non-Manglik"
            />
          </div>
        </div>
      );
    default:
      return null;
  }
}

function getSectionSummary(section: SectionKey, data: ProfileFormData): string {
  switch (section) {
    case "Basic Info":
      return [data.name, data.gender, data.dob, data.email].filter(Boolean).join(" · ") || "—";
    case "Religion":
      return [data.religion, data.caste, data.motherTongue].filter(Boolean).join(" · ") || "—";
    case "Education":
      return [data.qualification, data.educationSubject, data.job, data.income].filter(Boolean).join(" · ") || "—";
    case "Photos":
      return "Profile and verification photos";
    case "Location":
      return [data.city, data.state, data.district, data.country].filter(Boolean).join(", ") || data.address || "—";
    case "Personal":
      return [data.maritalStatus, data.height, data.weight, data.color].filter(Boolean).join(" · ") || "—";
    case "Family":
      return [data.fathersName, data.mothersName, data.aboutMyFamily].filter(Boolean).slice(0, 2).join(" · ") || "—";
    case "About Me":
      return data.bio ? `${data.bio.slice(0, 80)}${data.bio.length > 80 ? "…" : ""}` : "—";
    case "Horoscope":
      return [data.rashi, data.nakshatra, data.manglikStatus].filter(Boolean).join(" · ") || "—";
    default:
      return "";
  }
}

const PHOTO_LABELS: Record<string, string> = {
  profile_photo: "Profile Photo",
  full_photo: "Full Photo",
  selfie_photo: "Selfie Photo",
  family_photo: "Family Photo",
  aadhaar_front: "Aadhaar (Front)",
  aadhaar_back: "Aadhaar (Back)",
};

function getMediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  const base = BASE_URL.replace(/\/api\/?$/, "");
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

function ViewSectionContent({
  section,
  data,
  photos,
}: {
  section: SectionKey;
  data: ProfileFormData;
  photos?: Record<string, string | null>;
}) {
  const row = (label: string, value: string) =>
    (value != null && String(value).trim() !== "" ? (
      <div key={label} className="flex flex-wrap gap-x-2 py-1.5 border-b border-border/50 last:border-0">
        <span className="font-medium text-muted-foreground min-w-[140px]">{label}</span>
        <span className="text-foreground">{String(value).trim()}</span>
      </div>
    ) : null);

  switch (section) {
    case "Basic Info":
      return (
        <div className="space-y-0 divide-y-0">
          {row("Name", data.name)}
          {row("Gender", data.gender)}
          {row("Date of Birth", data.dob)}
          {row("Phone", data.phone)}
          {row("Email", data.email)}
        </div>
      );
    case "Religion":
      return (
        <div className="space-y-0">
          {row("Religion", data.religion)}
          {row("Caste", data.caste)}
          {row("Mother Tongue", data.motherTongue)}
          {row("Partner Religion Preference", data.partnerReligionPreference || (data.partner_preference_type ?? "").replace(/_/g, " "))}
        </div>
      );
    case "Education":
      return (
        <div className="space-y-0">
          {row("Highest Education", data.qualification)}
          {row("Education Subject", data.educationSubject)}
          {row("Employment Status", data.employmentStatus)}
          {row("Occupation", data.job)}
          {row("Annual Income", data.income)}
        </div>
      );
    case "Photos": {
      const entries = photos
        ? Object.entries(photos).filter(
            ([, path]) => path != null && String(path).trim() !== ""
          )
        : [];
      if (entries.length === 0) {
        return (
          <p className="text-sm text-muted-foreground">
            No photos uploaded yet. Use Edit to upload profile and verification photos.
          </p>
        );
      }
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map(([key, path]) => (
            <div key={key} className="flex flex-col gap-2">
              <span className="font-medium text-muted-foreground text-sm">
                {PHOTO_LABELS[key] ?? key.replace(/_/g, " ")}
              </span>
              <a
                href={getMediaUrl(path)}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl overflow-hidden border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <img
                  src={getMediaUrl(path)}
                  alt={PHOTO_LABELS[key] ?? key}
                  className="w-full h-48 object-cover object-center"
                />
              </a>
            </div>
          ))}
        </div>
      );
    }
    case "Location":
      return (
        <div className="space-y-0">
          {row("Country", data.country)}
          {row("State", data.state)}
          {row("District", data.district)}
          {row("City", data.city)}
          {row("Address", data.address)}
        </div>
      );
    case "Personal":
      return (
        <div className="space-y-0">
          {row("Marital Status", data.maritalStatus)}
          {row("Number of Children", data.numberOfChildren)}
          {row("Height", data.height)}
          {row("Weight", data.weight)}
          {row("Colour / Complexion", data.color)}
          {row("Blood Group", data.bloodGroup)}
        </div>
      );
    case "Family":
      return (
        <div className="space-y-0">
          {row("Father's Name", data.fathersName)}
          {row("Father's Occupation", data.fathersOccupation)}
          {row("Mother's Name", data.mothersName)}
          {row("Mother's Occupation", data.mothersOccupation)}
          {row("Brothers", data.numberOfBrothers)}
          {row("Married Brothers", data.numberOfMarriedBrothers)}
          {row("Sisters", data.numberOfSisters)}
          {row("Married Sisters", data.numberOfMarriedSisters)}
          {row("About Family", data.aboutMyFamily)}
        </div>
      );
    case "About Me":
      return (
        <div className="space-y-0">
          {row("Bio", data.bio)}
          {data.interests ? row("Interests", data.interests) : null}
        </div>
      );
    case "Horoscope":
      return (
        <div className="space-y-0">
          {row("Rashi", data.rashi)}
          {row("Nakshatra", data.nakshatra)}
          {row("Manglik Status", data.manglikStatus)}
        </div>
      );
    default:
      return null;
  }
}

const UserProfilePage = () => {
  const { user, isHindu } = useAuthStore();
  const profileSections = allProfileSections.filter((s) => s.title !== "Horoscope" || isHindu());
  const [editingSection, setEditingSection] = useState<SectionKey | null>(null);
  const [profileData, setProfileData] = useState<ProfileFormData>(() =>
    defaultProfileData(user)
  );
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [viewingSection, setViewingSection] = useState<SectionKey | null>(null);
  const [profileApiData, setProfileApiData] = useState<ProfileData | null>(null);
  const [photoFiles, setPhotoFiles] = useState<Record<string, File | null>>({});
  const editPanelRef = useRef<HTMLDivElement>(null);

  const [locationCountries, setLocationCountries] = useState<Country[]>([]);
  const [locationStates, setLocationStates] = useState<State[]>([]);
  const [locationDistricts, setLocationDistricts] = useState<District[]>([]);
  const [locationCities, setLocationCities] = useState<City[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const loadLocationCountries = useCallback(async (search: string) => {
    setLoadingCountries(true);
    try {
      const list = await getCountries(search || undefined);
      setLocationCountries(list);
    } catch {
      setLocationCountries([]);
    } finally {
      setLoadingCountries(false);
    }
  }, []);

  const loadLocationStates = useCallback(
    async (search: string) => {
      const cid = profileData.country_id ?? 0;
      if (!cid) return;
      setLoadingStates(true);
      try {
        const list = await getStates(cid, search || undefined);
        setLocationStates(list);
      } catch {
        setLocationStates([]);
      } finally {
        setLoadingStates(false);
      }
    },
    [profileData.country_id]
  );

  const loadLocationDistricts = useCallback(
    async (search: string) => {
      const sid = profileData.state_id ?? 0;
      if (!sid) return;
      setLoadingDistricts(true);
      try {
        const list = await getDistricts(sid, search || undefined);
        setLocationDistricts(list);
      } catch {
        setLocationDistricts([]);
      } finally {
        setLoadingDistricts(false);
      }
    },
    [profileData.state_id]
  );

  const loadLocationCities = useCallback(
    async (search: string) => {
      const did = profileData.district_id ?? 0;
      if (!did) return;
      setLoadingCities(true);
      try {
        const list = await getCities(did, search || undefined);
        setLocationCities(list);
      } catch {
        setLocationCities([]);
      } finally {
        setLoadingCities(false);
      }
    },
    [profileData.district_id]
  );

  const updateAvatarFromProfile = useCallback(
    (data: ProfileData) => {
      const profilePhoto = data.photos?.profile_photo ?? null;
      if (!profilePhoto) return;
      const url = getMediaUrl(profilePhoto);
      if (!url) return;
      useAuthStore.setState((state) =>
        state.user
          ? {
              user: {
                ...state.user,
                avatar: url,
              },
            }
          : state
      );
    },
    []
  );

  useEffect(() => {
    if (editingSection !== "Location") return;
    loadLocationCountries("");
  }, [editingSection, loadLocationCountries]);

  useEffect(() => {
    if (editingSection !== "Location") return;
    const cid = profileData.country_id ?? 0;
    if (cid) loadLocationStates("");
  }, [editingSection, profileData.country_id, loadLocationStates]);

  useEffect(() => {
    if (editingSection !== "Location") return;
    const sid = profileData.state_id ?? 0;
    if (sid) loadLocationDistricts("");
  }, [editingSection, profileData.state_id, loadLocationDistricts]);

  useEffect(() => {
    if (editingSection !== "Location") return;
    const did = profileData.district_id ?? 0;
    if (did) loadLocationCities("");
  }, [editingSection, profileData.district_id, loadLocationCities]);

  useEffect(() => {
    let cancelled = false;
    setProfileError(null);
    getProfile()
      .then((res) => {
        if (cancelled || !res.success || !res.data) return;
        setProfileApiData(res.data);
        setProfileData(mapProfileDataToForm(res.data, user));
        updateAvatarFromProfile(res.data);
      })
      .catch((e) => {
        if (!cancelled) setProfileError(e instanceof Error ? e.message : "Failed to load profile");
      })
      .finally(() => {
        if (!cancelled) setProfileLoading(false);
      });
    return () => { cancelled = true; };
  }, [user?.name, user?.phone, user?.email, user?.location]);

  const handleViewSection = (title: SectionKey) => {
    setViewingSection(title);
  };

  const handleEditSection = (title: SectionKey) => {
    setSaveError(null);
    setViewingSection(null);
    if (title !== "Photos") setPhotoFiles({});
    setEditingSection(title);
  };

  const handlePhotoChange = useCallback((key: string, file: File | null) => {
    setPhotoFiles((prev) => ({ ...prev, [key]: file }));
  }, []);

  useEffect(() => {
    if (editingSection !== "Photos") return;
    editPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [editingSection, photoFiles]);

  const buildLocationBody = (): LocationBody => ({
    country_id: profileData.country_id ?? 0,
    state_id: profileData.state_id ?? 0,
    district_id: profileData.district_id ?? 0,
    city_id: profileData.city_id ?? 0,
    address: profileData.address ?? "",
  });

  const buildReligionBody = (): ReligionBody => ({
    religion_id: profileData.religion_id ?? 0,
    caste_id: profileData.caste_id ?? null,
    mother_tongue_id: profileData.mother_tongue_id ?? 0,
    partner_preference_type: profileData.partner_preference_type ?? "open_to_all",
    partner_religion_ids: profileData.partner_religion_ids ?? [],
  });

  const buildPersonalBody = (): PersonalBody => ({
    marital_status: profileData.maritalStatus || "",
    has_children: parseInt(profileData.numberOfChildren, 10) > 0,
    number_of_children: parseInt(profileData.numberOfChildren, 10) || null,
    height: parseInt(profileData.height.replace(/\D/g, ""), 10) || 0,
    weight: parseFloat(profileData.weight.replace(/[^\d.]/g, "")) || null,
    complexion: profileData.color || "",
  });

  const buildEducationBody = (): EducationBody => ({
    highest_education: profileData.qualification || "",
    education_subject: profileData.educationSubject || "",
    employment: profileData.employmentStatus || "",
    occupation: profileData.job || "",
    annual_income: profileData.income || "",
  });

  const buildFamilyBody = (): FamilyBody => ({
    father_name: profileData.fathersName || "",
    father_occupation: profileData.fathersOccupation || "",
    mother_name: profileData.mothersName || "",
    mother_occupation: profileData.mothersOccupation || "",
    brothers: parseInt(profileData.numberOfBrothers, 10) || 0,
    married_brothers: parseInt(profileData.numberOfMarriedBrothers, 10) || 0,
    sisters: parseInt(profileData.numberOfSisters, 10) || 0,
    married_sisters: parseInt(profileData.numberOfMarriedSisters, 10) || 0,
    about_family: profileData.aboutMyFamily || "",
  });

  const handleSaveSection = async () => {
    const section = editingSection;
    if (!section) return;
    setSaveError(null);
    try {
      switch (section) {
        case "Basic Info":
          await patchBasic({
            name: profileData.name,
            gender: profileData.gender,
            dob: profileData.dob,
            email: profileData.email,
          });
          if (user) {
            useAuthStore.setState({
              user: {
                ...user,
                name: profileData.name || user.name,
                email: profileData.email || user.email,
              },
            });
          }
          break;
        case "Location":
          await patchLocation(buildLocationBody());
          break;
        case "Religion":
          await patchReligion(buildReligionBody());
          break;
        case "Personal":
          await patchPersonal(buildPersonalBody());
          break;
        case "Education":
          await patchEducation(buildEducationBody());
          break;
        case "About Me":
          await patchAbout({ about_me: profileData.bio || "" });
          break;
        case "Family":
          await patchFamily(buildFamilyBody());
          break;
        case "Photos": {
          const body: { profile_photo?: File; full_photo?: File; selfie_photo?: File; family_photo?: File; aadhaar_front?: File; aadhaar_back?: File } = {};
          PHOTO_KEYS.forEach((k) => {
            const f = photoFiles[k];
            if (f) body[k] = f;
          });
          if (Object.keys(body).length > 0) {
            await postPhotos(body);
            const res = await getProfile();
            if (res.success && res.data) {
              setProfileApiData(res.data);
              setProfileData(mapProfileDataToForm(res.data, user));
            }
          }
          setPhotoFiles({});
          setEditingSection(null);
          return;
        }
        case "Horoscope":
          setEditingSection(null);
          return;
        default:
          setEditingSection(null);
          return;
      }
      const res = await getProfile();
      if (res.success && res.data) {
        setProfileApiData(res.data);
        setProfileData(mapProfileDataToForm(res.data, user));
        updateAvatarFromProfile(res.data);
      }
      setEditingSection(null);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Save failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary">
          My Profile
        </h1>

        {profileError && (
          <div className="rounded-lg bg-destructive/10 text-destructive px-4 py-3 text-sm">
            {profileError}
          </div>
        )}

        {profileLoading ? (
          <p className="text-muted-foreground">Loading profile…</p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              {profileSections.map((section) => (
                <ProfileSectionCard
                  key={section.title}
                  title={section.title}
                  icon={section.icon}
                  summary={getSectionSummary(section.title, profileData)}
                  onView={() => handleViewSection(section.title)}
                  onEdit={() => handleEditSection(section.title)}
                />
              ))}
            </div>

            {viewingSection && (
              <div className="mt-4 bg-white rounded-3xl shadow-card p-6 border border-primary/10">
                <h2 className="font-serif text-xl font-bold text-secondary mb-4">
                  {viewingSection}
                </h2>
                <ViewSectionContent
                  section={viewingSection}
                  data={profileData}
                  photos={profileApiData?.photos}
                />
                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setViewingSection(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}

            {editingSection && (
              <div
                ref={editPanelRef}
                className="mt-4 bg-white rounded-3xl shadow-card p-6 border border-primary/10"
              >
                <h2 className="font-serif text-xl font-bold text-secondary mb-4">
                  Edit {editingSection}
                </h2>
                {saveError && (
                  <p className="text-sm text-destructive mb-4">{saveError}</p>
                )}
                <EditSectionForm
                  section={editingSection}
                  data={profileData}
                  onChange={setProfileData}
                  locationOptions={
                    editingSection === "Location"
                      ? {
                          countries: locationCountries,
                          states: locationStates,
                          districts: locationDistricts,
                          cities: locationCities,
                        }
                      : undefined
                  }
                  locationLoading={
                    editingSection === "Location"
                      ? {
                          countries: loadingCountries,
                          states: loadingStates,
                          districts: loadingDistricts,
                          cities: loadingCities,
                        }
                      : undefined
                  }
                  locationLoaders={
                    editingSection === "Location"
                      ? {
                          loadCountries: loadLocationCountries,
                          loadStates: loadLocationStates,
                          loadDistricts: loadLocationDistricts,
                          loadCities: loadLocationCities,
                        }
                      : undefined
                  }
                  onLocationChange={
                    editingSection === "Location"
                      ? (updates) => setProfileData((prev) => ({ ...prev, ...updates }))
                      : undefined
                  }
                  photoFiles={editingSection === "Photos" ? photoFiles : undefined}
                  existingPhotos={editingSection === "Photos" ? profileApiData?.photos : undefined}
                  onPhotoChange={editingSection === "Photos" ? handlePhotoChange : undefined}
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      if (editingSection === "Photos") setPhotoFiles({});
                      setEditingSection(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button variant="hero" type="button" onClick={handleSaveSection}>
                    Save
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserProfilePage;
