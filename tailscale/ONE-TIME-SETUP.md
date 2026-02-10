# One-Time Setup

Do this once to set up Tailscale for managing all client devices.

---

## 1. Create a Tailscale Account

1. Go to https://login.tailscale.com/start
2. Sign up with your `christian@setupclaw.com` (or whatever identity you want as the admin).
3. This creates your **tailnet** — the private WireGuard network all devices join.

---

## 2. Install Tailscale on Your Admin Machine(s)

### macOS

```bash
# Install via Homebrew
brew install tailscale

# Or download the App Store version:
# https://apps.apple.com/app/tailscale/id1475387142
```

### Linux

```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

### Connect and tag as admin

```bash
sudo tailscale up --advertise-tags=tag:admin --hostname=christian-admin
```

You'll get a URL to authorize the device in the Tailscale admin console.

---

## 3. Apply the ACL Policy

This is the critical step that isolates clients from each other.

1. Go to https://login.tailscale.com/admin/acls/file
2. Replace the default policy with the contents of `acl-policy.json` in this directory.
3. Click **Save**.

What the policy does:
- **`tag:admin`** machines (yours) can SSH into any **`tag:client`** device.
- **`tag:client`** devices **cannot reach each other** at all.
- **`tag:client`** devices **cannot reach your admin machines** (one-way access).
- Only you can assign these tags (via `tagOwners`).

---

## 4. Enable Tailscale SSH (Optional but Recommended)

Tailscale SSH lets you connect without managing SSH keys — Tailscale handles auth via your identity.

1. Go to https://login.tailscale.com/admin/acls/file
2. The `"ssh"` section in `acl-policy.json` already allows admin → client SSH.
3. On client devices, `provision-client.sh` enables this with `--ssh`.

With this enabled, you just:
```bash
ssh root@<client-hostname>
```
No SSH keys to distribute. Tailscale verifies your identity.

---

## 5. Generate Auth Keys

For each client device, generate a **pre-auth key** so you can provision without manual browser login.

### Via the admin console

1. Go to https://login.tailscale.com/admin/settings/keys
2. Click **Generate auth key...**
3. Settings:
   - **Reusable**: No (one key per device is more secure)
   - **Ephemeral**: No (you want the device to persist)
   - **Pre-approved**: Yes
   - **Tags**: `tag:client`
   - **Expiration**: 1 hour (just long enough to provision)
4. Copy the key — you'll pass it to `provision-client.sh`.

### Via the API (for scripting)

```bash
# Generate a one-time auth key tagged as client
curl -s -X POST "https://api.tailscale.com/api/v2/tailnet/-/keys" \
  -u "tskey-api-XXXXX:" \
  -H "Content-Type: application/json" \
  -d '{
    "capabilities": {
      "devices": {
        "create": {
          "reusable": false,
          "ephemeral": false,
          "preauthorized": true,
          "tags": ["tag:client"]
        }
      }
    },
    "expirySeconds": 3600
  }' | jq -r '.key'
```

To create an API key, go to https://login.tailscale.com/admin/settings/keys and generate an **API access token**.

---

## 6. Verify

After provisioning your first client device (see `CLIENT-SETUP.md`):

```bash
# From your admin machine, check all devices on the tailnet
tailscale status

# You should see something like:
# 100.x.x.x   christian-admin   tag:admin   linux   -
# 100.x.x.x   acme-pi           tag:client  linux   -

# Test SSH
ssh root@acme-pi

# Or by Tailscale IP
ssh root@100.x.x.x
```
