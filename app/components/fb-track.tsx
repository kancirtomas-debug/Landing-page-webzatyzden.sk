"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/fbq";
import { captureUtmParams } from "@/lib/utm";

/**
 * Drop-in client component that fires a Meta Pixel event on mount.
 * Use on server-rendered pages where you can't call fbq directly.
 *
 * Also captures UTM params from the URL on first render.
 */
export default function FbTrack({
  event,
  params,
}: {
  event: Parameters<typeof trackEvent>[0];
  params?: Record<string, string | number | boolean>;
}) {
  useEffect(() => {
    captureUtmParams();
    trackEvent(event, params);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
