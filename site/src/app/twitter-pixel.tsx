"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Fires a Twitter/X conversion event once on mount.
 *
 * Usage:
 *   <TwitterEvent
 *     eventId="tw-r4pmu-r4q4g"
 *     value={2400}
 *     currency="USD"
 *     conversionId="order-123"
 *     email="user@example.com"
 *     phone="+12125551234"
 *   />
 */
export function TwitterEvent({
  eventId,
  value,
  currency,
  conversionId,
  email,
  phone,
  contents,
}: {
  eventId: string;
  value?: number;
  currency?: string;
  conversionId?: string;
  email?: string;
  phone?: string;
  contents?: Array<{
    content_type?: string;
    content_id?: string;
    content_name?: string;
    content_price?: number;
    num_items?: number;
    content_group_id?: string;
  }>;
}) {
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    if (typeof window === "undefined" || !(window as any).twq) return;
    hasFired.current = true;

    const params: Record<string, any> = {};
    if (value != null) params.value = value;
    if (currency) params.currency = currency;
    if (conversionId) params.conversion_id = conversionId;
    if (email) params.email_address = email;
    if (phone) params.phone_number = phone;
    if (contents) params.contents = contents;

    (window as any).twq("event", eventId, params);
  }, [eventId, value, currency, conversionId, email, phone, contents]);

  return null;
}

/**
 * Tracks Twitter/X pageviews on SPA navigations.
 * Drop into layout.tsx inside <body>, similar to FathomAnalytics.
 */
function TrackTwitterPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined" || !(window as any).twq) return;
    (window as any).twq("track", "PageView");
  }, [pathname, searchParams]);

  return null;
}

export function TwitterPixelPageView() {
  return (
    <Suspense fallback={null}>
      <TrackTwitterPageView />
    </Suspense>
  );
}
