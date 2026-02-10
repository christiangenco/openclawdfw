"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface EmailCaptureProps {
  /** Which lead magnet this form is for (tracked in DB) */
  leadMagnet?: string;
  /** Optional heading override */
  heading?: string;
  /** Optional description override */
  description?: string;
  /** Optional button text override */
  buttonText?: string;
  /** Compact mode (inline form, no heading) for embedding in blog posts */
  compact?: boolean;
}

export function EmailCapture({
  leadMagnet = "checklist",
  heading = "Get the Free OpenClaw Deployment Checklist",
  description = "27 steps to a secure, production-ready AI executive assistant — from hardware selection to ongoing maintenance.",
  buttonText = "Send Me the Checklist",
  compact = false,
}: EmailCaptureProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), lead_magnet: leadMagnet }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
        return;
      }

      if (data.already_subscribed) {
        setStatus("success");
        setMessage("You're already subscribed! Check your inbox for the checklist.");
        setEmail("");
      } else {
        router.push("/thank-you");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div
        className={
          compact
            ? "rounded-lg border border-green-800 bg-green-900/20 p-4 text-center"
            : "rounded-xl border border-green-800 bg-green-900/20 p-8 text-center"
        }
      >
        <p className="text-green-300 font-medium">{message}</p>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="you@company.com"
          required
          className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          {status === "loading" ? "..." : buttonText}
        </button>
        {status === "error" && (
          <p className="mt-1 text-xs text-red-400">{message}</p>
        )}
      </form>
    );
  }

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900/50 p-8">
      <h3 className="text-center text-xl font-bold text-gray-100 sm:text-2xl">
        {heading}
      </h3>
      <p className="mt-3 text-center text-sm text-gray-400">{description}</p>
      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-center"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="you@company.com"
          required
          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-gray-100 placeholder-gray-500 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 sm:max-w-xs"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          {status === "loading" ? "Sending..." : buttonText}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-3 text-center text-sm text-red-400">{message}</p>
      )}
      <p className="mt-4 text-center text-xs text-gray-500">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
