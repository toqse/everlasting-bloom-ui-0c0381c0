import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuthStore } from "@/stores/authStore";
import { Edit, Sun, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SectionKey =
  | "Basic Info"
  | "Religion"
  | "Education"
  | "Photos"
  | "Location"
  | "Personal"
  | "About Me"
  | "Horoscope";

const allProfileSections: {
  title: SectionKey;
  description: string;
  icon?: LucideIcon;
}[] = [
  { title: "Basic Info", description: "Name, Phone, DOB, Gender" },
  { title: "Religion", description: "Religion, Caste, Mother Tongue" },
  { title: "Education", description: "Qualification, Job, Income" },
  { title: "Photos", description: "Profile photos and verification" },
  { title: "Location", description: "State, City, District" },
  { title: "Personal", description: "Height, Marital Status, Color" },
  { title: "About Me", description: "Bio and interests" },
  { title: "Horoscope", description: "Jathagam details (Hindu only)", icon: Sun },
];

// Profile form data (can be extended / persisted via store or API later)
interface ProfileFormData {
  name: string;
  phone: string;
  dob: string;
  gender: string;
  religion: string;
  caste: string;
  motherTongue: string;
  qualification: string;
  job: string;
  income: string;
  state: string;
  city: string;
  district: string;
  height: string;
  maritalStatus: string;
  color: string;
  bio: string;
  interests: string;
  rashi: string;
  nakshatra: string;
  manglikStatus: string;
}

const defaultProfileData = (user: { name?: string; phone?: string; location?: string } | null): ProfileFormData => ({
  name: user?.name ?? "",
  phone: user?.phone ?? "",
  dob: "",
  gender: "",
  religion: "",
  caste: "",
  motherTongue: "",
  qualification: "",
  job: "",
  income: "",
  state: "",
  city: user?.location?.split(",")[0]?.trim() ?? "",
  district: "",
  height: "",
  maritalStatus: "",
  color: "",
  bio: "",
  interests: "",
  rashi: "",
  nakshatra: "",
  manglikStatus: "",
});

function ProfileSectionCard({
  title,
  description,
  icon: Icon,
  onEdit,
}: {
  title: string;
  description: string;
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
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
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
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="Phone number"
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
            <Label htmlFor="gender">Gender</Label>
            <Input
              id="gender"
              value={data.gender}
              onChange={(e) => update("gender", e.target.value)}
              placeholder="e.g. Male, Female"
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
              placeholder="Religion"
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
              placeholder="Mother tongue"
            />
          </div>
        </div>
      );
    case "Education":
      return (
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="qualification">Qualification</Label>
            <Input
              id="qualification"
              value={data.qualification}
              onChange={(e) => update("qualification", e.target.value)}
              placeholder="e.g. B.Tech, MBA"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="job">Job / Occupation</Label>
            <Input
              id="job"
              value={data.job}
              onChange={(e) => update("job", e.target.value)}
              placeholder="Current job"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="income">Income</Label>
            <Input
              id="income"
              value={data.income}
              onChange={(e) => update("income", e.target.value)}
              placeholder="Annual income range"
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
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={data.state}
              onChange={(e) => update("state", e.target.value)}
              placeholder="State"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={data.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="City"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="district">District</Label>
            <Input
              id="district"
              value={data.district}
              onChange={(e) => update("district", e.target.value)}
              placeholder="District"
            />
          </div>
        </div>
      );
    case "Personal":
      return (
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="height">Height</Label>
            <Input
              id="height"
              value={data.height}
              onChange={(e) => update("height", e.target.value)}
              placeholder={`e.g. 5'6" or 168 cm`}
            />
          </div>
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
            <Label htmlFor="color">Complexion / Color</Label>
            <Input
              id="color"
              value={data.color}
              onChange={(e) => update("color", e.target.value)}
              placeholder="e.g. Fair, Wheatish"
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
              description={section.description}
              icon={section.icon}
              onEdit={() => handleEditSection(section.title)}
            />
          ))}
        </div>

        {editingSection && (
          <div className="mt-4 bg-white rounded-3xl shadow-card p-6 border border-primary/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-bold text-secondary">
                Edit {editingSection}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingSection(null)}
              >
                Close
              </Button>
            </div>
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
