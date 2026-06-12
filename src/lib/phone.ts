export function digitsOnlyMobile(value: string): string {
  const digits = (value || "").replace(/\D/g, "").replace(/^91/, "").replace(/^0/, "");
  if (digits.length <= 10) return digits.slice(0, 10);
  return digits.slice(-10);
}

export function formatPhoneForApi(value: string): string {
  const d = digitsOnlyMobile(value);
  if (d.length !== 10) return d;
  return `+91${d}`;
}

export function formatPhoneDisplay(value: string | null | undefined): string {
  if (!value) return "—";
  const d = digitsOnlyMobile(String(value));
  if (d.length === 10) return `+91 ${d}`;
  return String(value);
}

export function isValidIndianMobile(value: string): boolean {
  const d = digitsOnlyMobile(value);
  return /^[6-9]\d{9}$/.test(d);
}
