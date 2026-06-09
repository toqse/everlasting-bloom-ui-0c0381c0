/**
 * Geocoding via the public OpenStreetMap Nominatim endpoint.
 * Data © OpenStreetMap contributors (https://www.openstreetmap.org/copyright).
 *
 * Used to resolve a birth place into latitude/longitude for horoscope data.
 * No API key is required; usage must respect the Nominatim usage policy
 * (https://operations.osmfoundation.org/policies/nominatim/): keep request
 * volume low (we debounce in the UI) and provide an identifying referer/UA,
 * which the browser supplies automatically.
 */

const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";

export interface GeocodeResult {
  /** OSM place id (stable enough for use as a React list key). */
  id: number;
  /** Full human-readable place name returned by Nominatim. */
  label: string;
  latitude: number;
  longitude: number;
}

interface NominatimPlace {
  place_id?: number;
  display_name?: string;
  lat?: string;
  lon?: string;
}

/**
 * Search OpenStreetMap for places matching `query`.
 * Returns up to `limit` results; empty array on error or blank query.
 */
export async function searchPlaces(
  query: string,
  options: { limit?: number; signal?: AbortSignal } = {},
): Promise<GeocodeResult[]> {
  const q = query.trim();
  if (!q) return [];

  const { limit = 6, signal } = options;
  const params = new URLSearchParams({
    q,
    format: "jsonv2",
    addressdetails: "0",
    "accept-language": "en",
    limit: String(limit),
  });

  try {
    const res = await fetch(`${NOMINATIM_SEARCH_URL}?${params.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal,
    });
    if (!res.ok) return [];

    const data = (await res.json()) as NominatimPlace[];
    if (!Array.isArray(data)) return [];

    return data
      .map((p, index) => {
        const latitude = Number(p.lat);
        const longitude = Number(p.lon);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude))
          return null;
        return {
          id: p.place_id ?? index,
          label: (p.display_name ?? "").trim(),
          latitude,
          longitude,
        } satisfies GeocodeResult;
      })
      .filter((r): r is GeocodeResult => r !== null && r.label !== "");
  } catch {
    return [];
  }
}
