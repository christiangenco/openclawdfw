# Fathom Analytics + CAC Tracking

Track Customer Acquisition Cost for paid ad campaigns on dfwopenclaw.com.

## Quick Reference

### When Creating an Ad

Tag your destination URL with UTM parameters:

```
https://dfwopenclaw.com?utm_source=SOURCE&utm_campaign=CAMPAIGN_NAME&utm_medium=MEDIUM
```

| Parameter | Example Values |
|-----------|----------------|
| `utm_source` | `google`, `facebook`, `instagram`, `linkedin` |
| `utm_campaign` | `feb_search`, `retargeting_q1`, `brand_awareness` |
| `utm_medium` | `cpc`, `cpm`, `social`, `email` |

**Example:**
```
https://dfwopenclaw.com?utm_source=google&utm_campaign=feb_search&utm_medium=cpc
```

### When Recording Ad Spend

After paying for ads, record the spend:

```bash
ruby fathom/spend.rb add \
  --campaign feb_search \
  --source google \
  --amount 150 \
  --date 2026-02-10
```

The `--campaign` value must match your `utm_campaign` for CAC calculations to work.

### When Getting a CAC Report

```bash
# Calculate CAC for all campaigns (last 30 days)
ruby fathom/cac.rb --event-id YOUR_EVENT_ID

# Specific date range
ruby fathom/cac.rb --event-id YOUR_EVENT_ID --from 2026-02-01 --to 2026-02-28
```

## Setup Checklist

1. **Fathom tracking** - Already installed on dfwopenclaw.com (site ID: `IMENCEFZ`)

2. **Create conversion events** in Fathom dashboard:
   - Go to https://app.usefathom.com
   - Click "Events" → "Create event"
   - Examples: `signup`, `book_call`, `contact_form`
   - Note the event ID from the URL for use with `--event-id`

3. **API token permissions** - Your token has Reports access. Add "Events - Read" permission at https://app.usefathom.com/api if you want to skip `--event-id`.

## All Scripts

| Script | Purpose |
|--------|---------|
| `pageviews.rb` | View traffic by campaign, source, page, etc. |
| `conversions.rb` | View conversion events by campaign |
| `spend.rb` | Record and view ad spend |
| `cac.rb` | Calculate CAC (conversions + spend) |
| `sites.rb` | List Fathom sites (requires Sites permission) |
| `events.rb` | List conversion events (requires Events permission) |

## Examples

### View traffic by source
```bash
ruby fathom/pageviews.rb --by utm_source
```

### View traffic by campaign for a specific month
```bash
ruby fathom/pageviews.rb --by utm_campaign --from 2026-02-01 --to 2026-02-28
```

### View all recorded spend
```bash
ruby fathom/spend.rb list
ruby fathom/spend.rb list --from 2026-02-01  # filter by date
```

### View conversions by campaign
```bash
ruby fathom/conversions.rb --event-id EVENTID
ruby fathom/conversions.rb --event-id EVENTID --source google  # filter by source
```

## Notes

- Spend data is stored locally in `fathom/spend.yml` (gitignored)
- Fathom is privacy-focused: no individual user tracking, just aggregates
- UTM parameters are case-sensitive: `Google` ≠ `google`
