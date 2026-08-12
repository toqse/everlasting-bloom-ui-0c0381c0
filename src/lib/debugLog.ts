/**
 * Console logging for API traffic.
 * - Always on in non-production builds.
 * - In production, set NEXT_PUBLIC_API_DEBUG=true at build time to enable.
 */
export function isApiDebugEnabled(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  return process.env.NEXT_PUBLIC_API_DEBUG === "true";
}

export function debugLog(...args: unknown[]): void {
  if (!isApiDebugEnabled()) return;
  // eslint-disable-next-line no-console
  console.log(...args);
}
