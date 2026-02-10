#!/usr/bin/env bash
# Push newsletter env vars from .env.local to Vercel production.
# Usage: bash scripts/push-env.sh
#
# Prerequisites:
#   1. npx vercel login (if not already logged in)
#   2. npx vercel link (to connect this dir to your Vercel project)
#   3. Fill in MAILGUN_API_KEY in .env.local first
#
# This only pushes the newsletter-related vars (not database vars,
# which are already set via the Neon integration).

set -euo pipefail
cd "$(dirname "$0")/.."

# The vars we need to push (skip DATABASE_URL* — already in Vercel via Neon)
VARS=(
  MAILGUN_API_KEY
  MAILGUN_DOMAIN
  MAILGUN_FROM
  UNSUBSCRIBE_SECRET
  BASE_URL
)

echo "Reading from .env.local..."
echo ""

for var in "${VARS[@]}"; do
  # Extract value from .env.local (handles values with spaces/special chars)
  value=$(grep "^${var}=" .env.local | head -1 | sed "s/^${var}=//")

  if [ -z "$value" ] || [ "$value" = "key-REPLACE_ME" ]; then
    echo "⚠️  Skipping $var (not set or placeholder)"
    continue
  fi

  echo "→ Pushing $var to production..."
  echo "$value" | npx vercel env add "$var" production --force 2>&1 | grep -v "^>" || true
done

echo ""
echo "Done! Verify with: npx vercel env list production"
