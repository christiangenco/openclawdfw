"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "fathom-client";

const FATHOM_BOOK_CALL_EVENT_ID = "LKEZPYCA";

export function TrackBookCall() {
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;
    trackEvent(FATHOM_BOOK_CALL_EVENT_ID);
  }, []);

  return null;
}
