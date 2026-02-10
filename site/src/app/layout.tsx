import type { Metadata } from "next";
import "./globals.css";
import { FathomAnalytics } from "./fathom";

const siteName = "OpenClaw DFW";
const title =
  "OpenClaw DFW — AI Employee Placement & Management for Dallas/Fort Worth";
const description =
  "White-glove deployment of OpenClaw, the open-source AI executive assistant. I place it, secure it, and manage it — like a staffing agency for AI. In-person in DFW, remote nationwide.";
const url = "https://openclawdfw.com";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "OpenClaw setup",
    "OpenClaw deployment",
    "AI assistant Dallas",
    "AI assistant Fort Worth",
    "AI executive assistant DFW",
    "AI employee",
    "managed AI service",
    "OpenClaw security hardening",
    "Dallas Fort Worth",
    "DFW AI",
    "AI staffing",
    "AI automation DFW",
  ],
  metadataBase: new URL(url),
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description,
    url,
    siteName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${siteName} — AI employee placement & management in Dallas/Fort Worth`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@cgenco",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${siteName} — AI employee placement & management in Dallas/Fort Worth`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "theme-color": "#ff4d4d",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["Service", "LocalBusiness"],
              name: siteName,
              url,
              description:
                "White-glove AI employee placement and management for founders and business owners in Dallas/Fort Worth. In-person or remote.",
              provider: {
                "@type": "Person",
                name: "Christian Genco",
                url: "https://christian.gen.co",
                sameAs: ["https://x.com/cgenco"],
              },
              areaServed: [
                { "@type": "City", name: "Dallas" },
                { "@type": "City", name: "Fort Worth" },
                {
                  "@type": "Place",
                  name: "Dallas–Fort Worth metroplex",
                },
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                url: `${url}/book`,
              },
              priceRange: "$$$",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is OpenClaw?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "An open-source AI assistant that can triage email, schedule meetings, draft replies, and automate workflows across your tools — running on your own hardware like a new employee.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What's included in a Placement?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "In-person installation and security hardening, email and calendar integration, custom workflow buildout, integration with your business software, training, and a 1-week follow-up. For DFW clients, we come to your office.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How long does setup take?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Most placements are completed in a single day. You go live the same day, and we follow up within a week to fine-tune everything.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do you offer ongoing support?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Agent Management is our ongoing retainer where I serve as the manager of your AI employee — handling monitoring, security updates, performance reviews, and training to make sure it keeps getting better.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is it secure?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Security is our top priority. OpenClaw runs on hardware you control — not a SaaS black box. We onboard it like a new employee: read-only access first, approval flows for sensitive actions, its own credentials. You can literally unplug it.",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="text-gray-100 antialiased">
        <FathomAnalytics />
        {children}
      </body>
    </html>
  );
}
