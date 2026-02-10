"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "fathom-client";

// ─── Customize these props to change the Calendly embed ─────────────────────

interface CalendlyEmbedProps {
  /** Full Calendly event type URL */
  url?: string;

  /** Hide the event name, duration, and description panel */
  hideEventTypeDetails?: boolean;

  /** Hide the GDPR cookie consent banner */
  hideGdprBanner?: boolean;

  /** Background color of the embed (hex without #) */
  backgroundColor?: string;

  /** Text color for labels and body copy (hex without #) */
  textColor?: string;

  /** Accent color for buttons, selected dates, etc. (hex without #) */
  primaryColor?: string;

  /** Minimum width of the embed container */
  minWidth?: string;

  /** Height of the embed container */
  height?: string;
}

// ─── Defaults ───────────────────────────────────────────────────────────────

const DEFAULTS: Required<CalendlyEmbedProps> = {
  url: "https://calendly.com/cgenco/openclaw-dfw-consultation",
  hideEventTypeDetails: true,
  hideGdprBanner: true,
  backgroundColor: "0a0f1a",
  textColor: "f0f4ff",
  primaryColor: "ff4d4d", // red to match the site theme
  minWidth: "320px",
  height: "700px",
};

// ─── Fathom event ID for call bookings ──────────────────────────────────────
// Create this event in Fathom dashboard → Events → Create event → "Book Call"
// Then replace this with the actual event ID from Fathom.
const FATHOM_BOOK_CALL_EVENT_ID = "LKEZPYCA";

// ─── Component ──────────────────────────────────────────────────────────────

export default function CalendlyEmbed(props: CalendlyEmbedProps) {
  const router = useRouter();

  const {
    url,
    hideEventTypeDetails,
    hideGdprBanner,
    backgroundColor,
    textColor,
    primaryColor,
    minWidth,
    height,
  } = { ...DEFAULTS, ...props };

  // Build the data-url with query params
  const params = new URLSearchParams();
  if (hideEventTypeDetails) params.set("hide_event_type_details", "1");
  if (hideGdprBanner) params.set("hide_gdpr_banner", "1");
  if (backgroundColor) params.set("background_color", backgroundColor);
  if (textColor) params.set("text_color", textColor);
  if (primaryColor) params.set("primary_color", primaryColor);

  const dataUrl = `${url}?${params.toString()}`;

  // Load the Calendly widget script once
  useEffect(() => {
    const existing = document.querySelector(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]'
    );
    if (existing) return;

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Listen for Calendly postMessage events to detect booking completion
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      // Calendly sends postMessage events with this structure:
      // { event: "calendly.event_scheduled", payload: { ... } }
      if (
        event.origin === "https://calendly.com" &&
        event.data?.event === "calendly.event_scheduled"
      ) {
        // Fire Fathom conversion event immediately (belt)
        trackEvent(FATHOM_BOOK_CALL_EVENT_ID);

        // Redirect to thank-you page (suspenders — also triggers pageview conversion)
        router.push("/book/thank-you");
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  return (
    <div
      className="calendly-inline-widget"
      data-url={dataUrl}
      style={{ minWidth, height }}
    />
  );
}
