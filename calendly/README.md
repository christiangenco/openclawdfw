# Calendly Integration

Ruby CLI for managing Calendly event types (booking links) + docs for embedding in Next.js.

## Setup

1. Get a personal access token: [calendly.com/integrations/api_webhooks](https://calendly.com/integrations/api_webhooks)
2. Add it to `../.env`:
   ```
   CALENDLY_ACCESS_TOKEN=your_token_here
   ```

## CLI Usage

```bash
ruby calendly_api.rb <command> [args] [options]
```

### Commands

| Command | Description |
|---------|-------------|
| `list [--active] [-v]` | List event types |
| `get <uuid> [-v]` | Get a single event type |
| `create <name> [options]` | Create a new event type |
| `update <uuid> [options]` | Update an event type |
| `activate <uuid>` | Activate an event type |
| `deactivate <uuid>` | Deactivate (soft-delete) |
| `link <uuid>` | Generate a single-use scheduling link |
| `me` | Show current user info |
| `availability` | Show availability schedules |

### Options (for create/update)

| Option | Description |
|--------|-------------|
| `--name <name>` | Event type name |
| `--duration <min>` | Duration in minutes (default: 30) |
| `--slug <slug>` | URL slug *(create only, auto-generated from name)* |
| `--description <text>` | Plain-text description |
| `--color <hex>` | Color hex (e.g. `"#0099ff"`) |
| `--location <kind>` | `zoom_conference`, `google_conference`, `phone`, etc. |
| `--active / --inactive` | Set active status |
| `--secret / --no-secret` | Set secret (unlisted) status |
| `-v, --verbose` | Show full details |

### Examples

```bash
# Create a new booking link
ruby calendly_api.rb create "OpenClaw DFW Consultation" \
  --duration 45 \
  --description "Book a consultation for OpenClaw deployment in DFW" \
  --location zoom_conference --color "#0099ff" --active

# Update description
ruby calendly_api.rb update <uuid> --description "New description text"

# Generate a single-use link to share
ruby calendly_api.rb link <uuid>

# Deactivate (no hard delete in Calendly API)
ruby calendly_api.rb deactivate <uuid>
```

### API Limitations

- **slug**: Auto-generated from the event type name on create. Cannot be changed via API.
- **delete**: No DELETE endpoint exists. Use `deactivate` to soft-delete.
- **availability**: Event types inherit your default availability schedule.

---

## Embedding in Next.js

Use the [`react-calendly`](https://github.com/tcampb/react-calendly) package (v4.4.0+, MIT license, TypeScript support).

### Install

```bash
npm install react-calendly
```

### Option 1: Inline Widget (recommended for booking pages)

Embeds the full scheduling flow directly in the page.

```tsx
// app/book/page.tsx  (or pages/book.tsx)
"use client";

import { InlineWidget } from "react-calendly";

export default function BookPage() {
  return (
    <div style={{ minHeight: "700px" }}>
      <InlineWidget
        url="https://calendly.com/cgenco/openclaw-dfw-consultation"
        styles={{ height: "700px" }}
        pageSettings={{
          backgroundColor: "ffffff",
          hideEventTypeDetails: false,
          hideLandingPageDetails: false,
          primaryColor: "0099ff",
          textColor: "4d5055",
        }}
        // Pre-fill known visitor info
        prefill={{
          email: "",
          firstName: "",
          lastName: "",
          // customAnswers: { a1: "answer to Q1", a2: "answer to Q2" },
        }}
        // UTM tracking
        utm={{
          utmSource: "website",
          utmMedium: "inline_embed",
          utmCampaign: "openclaw_dfw",
        }}
      />
    </div>
  );
}
```

### Option 2: Popup Button (for CTAs)

Opens scheduling in a modal when the user clicks a button.

```tsx
// components/BookCallButton.tsx
"use client";

import { PopupButton } from "react-calendly";

export default function BookCallButton() {
  return (
    <PopupButton
      url="https://calendly.com/cgenco/openclaw-dfw-consultation"
      rootElement={document.getElementById("__next")!}
      text="Book a Free Consultation"
      pageSettings={{
        primaryColor: "0099ff",
        hideEventTypeDetails: false,
      }}
      utm={{
        utmSource: "website",
        utmMedium: "popup",
        utmCampaign: "openclaw_dfw",
      }}
    />
  );
}
```

> **Next.js note:** `rootElement` should be `document.getElementById("__next")` for Pages Router or `document.body` for App Router. Since this accesses `document`, the component must be a Client Component (`"use client"`).

### Option 3: Popup Widget (floating badge)

Shows a persistent badge in the corner of the page that opens a modal.

```tsx
"use client";

import { PopupWidget } from "react-calendly";

export default function CalendlyWidget() {
  return (
    <PopupWidget
      url="https://calendly.com/cgenco/openclaw-dfw-consultation"
      rootElement={document.getElementById("__next")!}
      text="Schedule a Call"
      textColor="#ffffff"
      color="#0099ff"
    />
  );
}
```

### Option 4: Custom Button with PopupModal

Full control over the trigger element.

```tsx
"use client";

import { useState } from "react";
import { PopupModal } from "react-calendly";

export default function CustomBookButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Book Your OpenClaw Setup
      </button>

      <PopupModal
        url="https://calendly.com/cgenco/openclaw-dfw-consultation"
        rootElement={document.getElementById("__next")!}
        onModalClose={() => setIsOpen(false)}
        open={isOpen}
        pageSettings={{ primaryColor: "0099ff" }}
        utm={{
          utmSource: "website",
          utmMedium: "custom_button",
          utmCampaign: "openclaw_dfw",
        }}
      />
    </>
  );
}
```

### Listening for Events

Use the `useCalendlyEventListener` hook to respond to booking events (e.g. tracking conversions, showing a thank-you message):

```tsx
"use client";

import { useCalendlyEventListener, InlineWidget } from "react-calendly";

export default function BookPageWithTracking() {
  useCalendlyEventListener({
    onProfilePageViewed: () => console.log("Profile page viewed"),
    onEventTypeViewed: () => console.log("Event type viewed"),
    onDateAndTimeSelected: () => console.log("Date and time selected"),
    onEventScheduled: (e) => {
      console.log("Event scheduled!", e.data.payload);
      // e.data.payload contains:
      //   event.uri  - "https://calendly.com/api/v2/scheduled_events/..."
      //   invitee.uri - "https://calendly.com/api/v2/scheduled_events/.../invitees/..."
      // Use these URIs with the Calendly API to fetch full event details
    },
    onPageHeightResize: (e) => {
      // Useful for dynamically resizing the container
      console.log("New height:", e.data.payload.height);
    },
  });

  return (
    <InlineWidget
      url="https://calendly.com/cgenco/openclaw-dfw-consultation"
      styles={{ height: "700px" }}
    />
  );
}
```

### Tips

- **`"use client"` is required** — all react-calendly components use browser APIs (`window`, `document`).
- **`pageSettings` colors require Pro plan** — on free plan they'll be ignored.
- **`?hide_event_type_details=1`** can be appended to the URL to hide the event description/avatar if your page already shows that info.
- **`?hide_landing_page_details=1`** hides the landing page details (name, avatar) when embedding a profile page.
- **Pre-fill custom answers** with `a1` through `a10` (matching the order of your custom questions).
- **UTM parameters** in the parent page URL are automatically captured. You can also set them explicitly via the `utm` prop.

### Current OpenClaw DFW Event Type

| Field | Value |
|-------|-------|
| Name | OpenClaw DFW Consultation |
| URL | https://calendly.com/cgenco/openclaw-dfw-consultation |
| UUID | `14837bc3-dae1-466a-a096-cb8fcb691e60` |
| Duration | 45 min |
| Location | Zoom |
| Availability | Tue–Thu, 10am–4:30pm CST |
