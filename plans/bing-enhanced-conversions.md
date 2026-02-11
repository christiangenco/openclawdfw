# Bing Enhanced Conversions — Deferred

## What It Is

Microsoft's enhanced conversions lets you send hashed email/phone from your thank-you page so they can match ad clicks to conversions when cookies fail (Safari, cross-device, etc.).

## Why We're Skipping It For Now

1. **Don't have the data at the right moment.** Calendly handles the form, so the user's email isn't available in page context on `/book/thank-you` unless Calendly passes it via URL params.
2. **Volume is too low to matter.** Enhanced conversions help at hundreds of conversions/month. At Basic tier (6–91/mo), it won't move the needle.
3. **Easy to add later.** No architectural changes needed.

## When to Revisit

- If there's a noticeable gap between Calendly bookings and Microsoft-reported conversions
- If we scale ad spend significantly
- If we confirm Calendly appends `?email=` or `?invitee_email=` to the redirect URL

## Implementation (When Ready)

1. Check if Calendly passes email in URL params on redirect to `/book/thank-you`
2. Parse the email from `searchParams` in the thank-you page
3. Normalize per Microsoft's rules (lowercase, strip `+` aliases, strip dots before `@`)
4. Fire the script on the thank-you page:

```tsx
// In /book/thank-you — client component
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const email = params.get('invitee_email') || params.get('email');
  if (!email || !window.uetq) return;

  // Normalize
  let normalized = email.trim().toLowerCase();
  normalized = normalized.replace(/\+[^@]*@/, '@');
  const [local, domain] = normalized.split('@');
  normalized = local.replace(/\./g, '').replace(/\.$/, '') + '@' + domain;

  window.uetq.push('set', { pid: { em: normalized } });
}, []);
```

5. Microsoft will auto-hash if not pre-hashed, so SHA-256 is optional.

## Microsoft's Snippet (Reference)

```html
<script>
   window.uetq = window.uetq || [];
   window.uetq.push('set', { 'pid': {
      'em': 'contoso@example.com',
      'ph': '+14250000000',
   } });
</script>
```
