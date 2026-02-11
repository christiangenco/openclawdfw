"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "fathom-client";

export function TrackBookCall() {
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;
    trackEvent("Book Call");
  }, []);

  return null;
}
