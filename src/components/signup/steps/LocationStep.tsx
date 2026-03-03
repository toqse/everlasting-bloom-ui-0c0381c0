import { SelectField, labelClass, inputClass } from "../SignupFormFields";
import { INDIAN_STATES_AND_UTS } from "@/data/indianStates";
import { COUNTRY_STATES } from "@/data/countryStates";

const ADDRESS_TYPES = ["Home", "Office", "Current", "Permanent", "Other"];
const OTHER_COUNTRIES = ["USA", "UK", "Canada", "Australia", "UAE", "Saudi Arabia", "Singapore", "Malaysia", "Other"];

const INDIAN_DISTRICTS = [
  "Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Thanjavur", "Erode",
  "Tirunelveli", "Vellore", "Bengaluru Urban", "Mumbai", "Hyderabad", "Other",
];
const INDIAN_CITIES = [
  "Chennai", "Coimbatore", "Madurai", "Salem", "Trichy", "Thanjavur", "Erode",
  "Tirunelveli", "Bengaluru", "Mumbai", "Hyderabad", "Other",
];

interface Props {
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const LocationStep = ({ formData, onChange }: Props) => {
  const isIndia = formData.country === "India";
  const stateOptionsForCountry = formData.country ? (COUNTRY_STATES[formData.country] ?? []) : [];
  const hasStateOptions = isIndia || stateOptionsForCountry.length > 0;
  const stateOptions = isIndia ? INDIAN_STATES_AND_UTS : stateOptionsForCountry;

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Location Details</h1>
        <p className="text-muted-foreground text-sm">Country, State, District, City, Address</p>
      </div>
      <div className="space-y-4">
        <SelectField
          label="Country"
          name="country"
          options={["India", ...OTHER_COUNTRIES]}
          value={formData.country}
          onChange={onChange}
        />

        {hasStateOptions ? (
          <SelectField
            label="State"
            name="state"
            options={stateOptions}
            value={formData.state}
            onChange={onChange}
          />
        ) : formData.country ? (
          <div>
            <label className={labelClass}>State / Province / Region</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={onChange}
              placeholder="Enter state or region"
              className={inputClass}
            />
          </div>
        ) : null}

        {isIndia ? (
          <SelectField
            label="District"
            name="district"
            options={INDIAN_DISTRICTS}
            value={formData.district}
            onChange={onChange}
          />
        ) : formData.country ? (
          <div>
            <label className={labelClass}>District / Area</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={onChange}
              placeholder="Enter district or area"
              className={inputClass}
            />
          </div>
        ) : null}

        {isIndia ? (
          <SelectField
            label="City"
            name="city"
            options={INDIAN_CITIES}
            value={formData.city}
            onChange={onChange}
          />
        ) : formData.country ? (
          <div>
            <label className={labelClass}>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={onChange}
              placeholder="Enter city"
              className={inputClass}
            />
          </div>
        ) : null}

        <SelectField
          label="Address type"
          name="addressType"
          options={ADDRESS_TYPES}
          value={formData.addressType || ""}
          onChange={onChange}
        />
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
