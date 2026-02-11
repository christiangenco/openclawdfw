import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-800 px-6 py-8 text-center text-sm text-gray-500">
      <p>
        © {new Date().getFullYear()} OpenClaw DFW. Powered by{" "}
        <a
          href="https://openclaw.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-300"
        >
          OpenClaw
        </a>
        .
      </p>
      <p className="mt-2">
        <Link href="/privacy" className="underline hover:text-gray-300">
          Privacy Policy
        </Link>
        {" · "}
        <Link href="/terms" className="underline hover:text-gray-300">
          Terms of Service
        </Link>
      </p>
    </footer>
  );
}
