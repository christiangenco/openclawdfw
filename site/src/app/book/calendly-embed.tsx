"use client";

import { useEffect } from "react";

const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  "https://calendly.com/YOUR_USERNAME/30min";

export default function CalendlyEmbed() {
  useEffect(() => {
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
      data-url={CALENDLY_URL}
      style={{ minWidth: "320px", height: "700px" }}
    />
  );
}
