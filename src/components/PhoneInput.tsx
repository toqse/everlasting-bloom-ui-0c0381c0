import { digitsOnlyMobile } from "@/lib/phone";

type PhoneInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
};

export default function PhoneInput({
  value,
  onChange,
  placeholder = "Phone Number",
  className = "",
  inputClassName = "",
  disabled,
  id,
  name,
}: PhoneInputProps) {
  return (
    <div className={`flex items-center rounded-2xl border-2 border-primary/10 bg-white focus-within:border-primary transition-colors ${className}`}>
      <span className={`pl-4 pr-1 text-foreground shrink-0 ${inputClassName}`}>+91</span>
      <input
        id={id}
        name={name}
        type="tel"
        inputMode="numeric"
        maxLength={10}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(digitsOnlyMobile(e.target.value))}
        className={`flex-1 px-2 py-3.5 rounded-r-2xl focus:ring-0 border-0 bg-transparent ${inputClassName}`}
      />
    </div>
  );
}
