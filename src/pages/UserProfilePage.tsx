import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuthStore } from "@/stores/authStore";
import { Edit, Sun, UsersRound, User, BookOpen, GraduationCap, Image, MapPin, UserCircle, FileText, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

// Profile form data (can be extended / persisted via store or API later)
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
  onEdit,
}: {
  title: string;
  icon?: LucideIcon;
  onEdit: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="flex gap-3 min-w-0">
        {Icon && (
          <div className="w-10 h-10 rounded-full bg-accent-gold/20 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-secondary" />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-serif text-lg font-bold text-foreground">{title}</h3>
        </div>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onEdit();
        }}
        className="inline-flex items-center justify-center gap-1.5 h-9 rounded-md px-3 text-sm font-medium border-2 border-accent-rose/50 text-primary bg-accent-rose/10 hover:bg-accent-rose/20 shrink-0 self-start sm:self-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative z-10"
      >
        <Edit className="w-4 h-4" />
        Edit
      </button>
    </div>
  );
}

function EditSectionForm({
  section,
  data,
  onChange,
}: {
  section: SectionKey;
  data: ProfileFormData;
  onChange: (data: ProfileFormData) => void;
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
              value={data.partnerReligionPreference}
              onChange={(e) => update("partnerReligionPreference", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select preference</option>
              {PARTNER_RELIGION_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
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
    case "Photos":
      return (
        <div className="grid gap-4 py-2">
          <p className="text-sm text-muted-foreground">
            Upload and manage your profile photos. Verification photos can be added for a verified badge.
          </p>
          <div className="border-2 border-dashed border-primary/20 rounded-xl p-8 text-center">
            <p className="text-sm text-muted-foreground">Drag & drop photos here or click to upload</p>
            <Button type="button" variant="outline" size="sm" className="mt-3">
              Choose files
            </Button>
          </div>
        </div>
      );
    case "Location":
      return (
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={data.country}
              onChange={(e) => update("country", e.target.value)}
              placeholder="e.g. India"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={data.state}
              onChange={(e) => update("state", e.target.value)}
              placeholder="e.g. Kerala"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="district">District</Label>
            <Input
              id="district"
              value={data.district}
              onChange={(e) => update("district", e.target.value)}
              placeholder="e.g. Ernakulam"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={data.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="e.g. Kochi"
            />
          </div>
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

const UserProfilePage = () => {
  const { user, isHindu } = useAuthStore();
  const profileSections = allProfileSections.filter((s) => s.title !== "Horoscope" || isHindu());
  const [editingSection, setEditingSection] = useState<SectionKey | null>(null);
  const [profileData, setProfileData] = useState<ProfileFormData>(() =>
    defaultProfileData(user)
  );

  const handleEditSection = (title: SectionKey) => {
    setEditingSection(title);
  };

  const handleSaveSection = () => {
    // Persist to store or API here if needed
    if (user && editingSection === "Basic Info") {
      useAuthStore.setState({
        user: {
          ...user,
          name: profileData.name || user.name,
          phone: profileData.phone || user.phone,
          email: profileData.email || user.email,
          location:
            [profileData.city, profileData.state].filter(Boolean).join(", ") ||
            user.location,
        },
      });
    }
    setEditingSection(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary">
          My Profile
        </h1>

        <div className="grid sm:grid-cols-2 gap-4">
          {profileSections.map((section) => (
            <ProfileSectionCard
              key={section.title}
              title={section.title}
              icon={section.icon}
              onEdit={() => handleEditSection(section.title)}
            />
          ))}
        </div>

        {editingSection && (
          <div className="mt-4 bg-white rounded-3xl shadow-card p-6 border border-primary/10">
            <h2 className="font-serif text-xl font-bold text-secondary mb-4">
              Edit {editingSection}
            </h2>
            <EditSectionForm
              section={editingSection}
              data={profileData}
              onChange={setProfileData}
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setEditingSection(null)}
              >
                Cancel
              </Button>
              <Button variant="hero" type="button" onClick={handleSaveSection}>
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserProfilePage;
