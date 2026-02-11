"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "fathom-client";

export function TrackChecklistSignup() {
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;
    trackEvent("Checklist Signup");
  }, []);

  return null;
}
