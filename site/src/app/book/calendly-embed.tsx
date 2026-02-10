"use client";

import { useEffect } from "react";

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

// ─── Component ──────────────────────────────────────────────────────────────

export default function CalendlyEmbed(props: CalendlyEmbedProps) {
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

  return (
    <div
      className="calendly-inline-widget"
      data-url={dataUrl}
      style={{ minWidth, height }}
    />
  );
}
