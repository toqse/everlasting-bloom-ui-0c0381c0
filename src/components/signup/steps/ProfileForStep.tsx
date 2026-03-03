import { CircleUserRound, Users, Handshake } from "lucide-react";
import { labelClass } from "../SignupFormFields";

const PROFILE_FOR_OPTIONS = [
  { value: "myself", label: "Myself", icon: CircleUserRound },
  { value: "son", label: "Son", icon: CircleUserRound },
  { value: "daughter", label: "Daughter", icon: CircleUserRound },
  { value: "brother", label: "Brother", icon: Users },
  { value: "sister", label: "Sister", icon: Users },
  { value: "friend", label: "Friend", icon: Handshake },
  { value: "relative", label: "Relative", icon: Users },
] as const;

interface Props {
  profileFor: string;
  onChange: (value: string) => void;
}

const ProfileForStep = ({ profileFor, onChange }: Props) => (
  <>
    <div className="text-center mb-6">
      <h1 className="font-serif text-2xl font-bold text-foreground mb-1">
        Who are you registering for?
      </h1>
      <p className="text-muted-foreground text-sm">
        Select who you’re registering the profile for
      </p>
    </div>
    <div className="space-y-2">
      <label className={labelClass}>Select</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {PROFILE_FOR_OPTIONS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 text-center transition-all capitalize ${
              profileFor === value
                ? "border-primary bg-primary/10 text-primary font-semibold shadow-soft"
                : "border-primary/10 hover:border-primary/30 text-foreground"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center ${
                profileFor === value
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <Icon className="w-7 h-7" />
            </div>
            <span className="text-sm md:text-base">{label}</span>
          </button>
        ))}
      </div>
    </div>
  </>
);

export default ProfileForStep;
