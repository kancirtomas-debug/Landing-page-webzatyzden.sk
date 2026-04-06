/**
 * Facebook Pixel helper — type-safe event firing.
 *
 * The base pixel script is loaded in layout.tsx and fires PageView automatically.
 * Use these helpers for conversion events (Lead, ViewContent, etc.).
 */

type FbqStandardEvent =
  | "AddPaymentInfo"
  | "AddToCart"
  | "AddToWishlist"
  | "CompleteRegistration"
  | "Contact"
  | "CustomizeProduct"
  | "Donate"
  | "FindLocation"
  | "InitiateCheckout"
  | "Lead"
  | "Purchase"
  | "Schedule"
  | "Search"
  | "StartTrial"
  | "SubmitApplication"
  | "Subscribe"
  | "ViewContent";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fbq = (...args: any[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

/** Fire a standard Meta Pixel event. Safe to call server-side (no-ops). */
export function trackEvent(
  event: FbqStandardEvent,
  params?: Record<string, string | number | boolean>,
) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", event, params);
  }
}

/** Fire a custom Meta Pixel event. */
export function trackCustomEvent(
  event: string,
  params?: Record<string, string | number | boolean>,
) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", event, params);
  }
}
