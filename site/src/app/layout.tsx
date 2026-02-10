import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SetupClaw DFW — AI Executive Assistant for Dallas/Fort Worth",
  description:
    "White-glove deployment of OpenClaw, the open-source AI executive assistant that manages your email, calendar, and workflows. Serving DFW founders and exec teams.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
