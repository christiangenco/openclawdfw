import Link from "next/link";
import CalendlyEmbed from "./calendly-embed";

export const metadata = {
  title: "Book a Call — OpenClaw DFW",
  description:
    "Schedule a free 30-minute strategy call to see how OpenClaw can manage your email, calendar, and workflows. Serving Dallas/Fort Worth.",
};

export default function BookPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Open<span className="text-emerald-600">Claw</span>{" "}
          <span className="font-semibold text-gray-400">DFW</span>
        </Link>
      </nav>

      {/* Booking section */}
      <section className="flex flex-1 flex-col items-center px-6 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Book Your Free Strategy Call
        </h1>
        <p className="mt-4 max-w-lg text-center text-gray-600">
          Pick a time that works for you. We&apos;ll spend 30 minutes walking
          through your workflow and showing you how OpenClaw can help.
        </p>

        {/* Calendly embed */}
        <div className="mt-10 w-full max-w-3xl">
          <CalendlyEmbed />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-6 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} OpenClaw DFW.{" "}
        <Link href="/" className="underline hover:text-gray-700">
          ← Back to home
        </Link>
      </footer>
    </div>
  );
}
