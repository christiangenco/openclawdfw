# Google Ads Scripts

## Setup

The Google Ads API requires four credentials:

| Credential | Env Var | How to get it |
|-----------|---------|---------------|
| Developer token | `GOOGLE_ADS_TOKEN` | ✅ Already in `.env` |
| OAuth2 Client ID | `GOOGLE_ADS_CLIENT_ID` | Google Cloud Console → APIs & Services → Credentials → Create OAuth Client ID (Desktop app) |
| OAuth2 Client Secret | `GOOGLE_ADS_CLIENT_SECRET` | Same as above |
| Refresh Token | `GOOGLE_ADS_REFRESH_TOKEN` | Run `ruby google_ads/01_oauth_setup.rb` |
| Customer ID | `GOOGLE_ADS_CUSTOMER_ID` | Your Google Ads account number (no dashes), e.g. `1234567890` |

### Step-by-step

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create an OAuth 2.0 Client ID (type: **Desktop app**)
3. Add `GOOGLE_ADS_CLIENT_ID` and `GOOGLE_ADS_CLIENT_SECRET` to `.env`
4. Run `ruby google_ads/01_oauth_setup.rb` — it will open a browser, you authorize, and it saves the refresh token
5. Add your Google Ads customer ID to `.env` as `GOOGLE_ADS_CUSTOMER_ID`
6. Run `ruby google_ads/02_test_connection.rb` to verify everything works
7. Use `ruby google_ads/03_create_campaign.rb` once you have Basic Access

## Access Levels

- **Explorer Access** (current): scripts 01 and 02 will work (read-only)
- **Basic Access** (apply for it): script 03 will work (create/modify campaigns)
