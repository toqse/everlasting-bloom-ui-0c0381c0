import { labelClass } from "../SignupFormFields";

interface Props {
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const AboutMeStep = ({ formData, onChange }: Props) => (
  <>
    <div className="text-center mb-6">
      <h1 className="font-serif text-2xl font-bold text-foreground mb-1">About Me</h1>
      <p className="text-muted-foreground text-sm">Tell us about yourself</p>
    </div>
    <div>
      <label className={labelClass}>About Me</label>
      <textarea
        name="aboutMe"
        value={formData.aboutMe}
        onChange={onChange}
        placeholder="Write about yourself, your interests, hobbies, values, and what you are looking for..."
        rows={8}
        className="w-full px-4 py-3 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors bg-white resize-none"
      />
      <p className="text-xs text-muted-foreground mt-2">
        {formData.aboutMe.length}/500 characters
      </p>
    </div>
  </>
);

export default AboutMeStep;
