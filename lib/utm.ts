/**
 * UTM parameter capture for Facebook Ads attribution.
 *
 * Reads UTM params from the URL on landing, stores them in sessionStorage,
 * and provides them for form submissions so each lead is tagged with its source ad.
 */

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
] as const;

export type UtmData = Partial<Record<(typeof UTM_KEYS)[number], string>>;

const STORAGE_KEY = "wzt_utm";

/** Capture UTM params from the current URL and persist to sessionStorage. */
export function captureUtmParams(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const utm: UtmData = {};
  let hasAny = false;

  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) {
      utm[key] = value;
      hasAny = true;
    }
  }

  // Only overwrite if we have fresh UTM params (preserve earlier capture otherwise)
  if (hasAny) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
  }
}

/** Retrieve stored UTM params (empty object if none). */
export function getUtmParams(): UtmData {
  if (typeof window === "undefined") return {};

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
