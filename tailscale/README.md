# Tailscale Remote Management for SetupClaw

Hub-and-spoke remote access to client devices (Raspberry Pi / Mac Mini) using Tailscale with ACL isolation. Each client device can only talk to your admin machines — never to each other.

## Directory Contents

- `README.md` — this file
- `ONE-TIME-SETUP.md` — account, ACLs, and admin machine setup (do once)
- `CLIENT-SETUP.md` — provisioning steps for each new client device
- `acl-policy.json` — Tailscale ACL policy to enforce client isolation
- `provision-client.sh` — script to run on a fresh client device
