# Client Device Setup

Steps to provision a new Raspberry Pi or Mac Mini at a client's office.

---

## Prerequisites

- [ ] A fresh auth key from the Tailscale admin console (see `ONE-TIME-SETUP.md` §5)
- [ ] A hostname for this client (e.g., `acme-pi`, `smith-mini`, `bigco-ceo`)
- [ ] SSH or physical access to the device

---

## Option A: Automated (Recommended)

Copy `provision-client.sh` to the device and run it:

```bash
# From your admin machine, SCP the script over (while you still have local access)
scp provision-client.sh pi@<device-local-ip>:~/

# SSH in locally
ssh pi@<device-local-ip>

# Run it
chmod +x provision-client.sh
sudo ./provision-client.sh <client-hostname> <tailscale-auth-key>

# Example:
sudo ./provision-client.sh acme-pi tskey-auth-abc123...
```

That's it. The device will appear in your Tailscale admin console and be reachable from your admin machine.

---

## Option B: Manual

### Raspberry Pi (Debian/Ubuntu)

```bash
# 1. Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# 2. Join the tailnet with client tag
sudo tailscale up \
  --authkey=tskey-auth-abc123... \
  --advertise-tags=tag:client \
  --hostname=acme-pi \
  --ssh

# 3. Enable Tailscale to start on boot (should be automatic, but verify)
sudo systemctl enable tailscaled

# 4. Lock down SSH to Tailscale interface only
sudo ufw default deny incoming
sudo ufw allow in on tailscale0 to any port 22
sudo ufw --force enable

# 5. Enable unattended upgrades for security patches
sudo apt-get install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### Mac Mini (macOS)

```bash
# 1. Install Tailscale
brew install tailscale

# 2. Start the daemon
sudo tailscaled &

# 3. Join the tailnet
sudo tailscale up \
  --authkey=tskey-auth-abc123... \
  --advertise-tags=tag:client \
  --hostname=smith-mini \
  --ssh

# 4. Set Tailscale to start on boot
# If using the App Store version, it handles this automatically.
# If using brew, create a launch daemon:
sudo cat > /Library/LaunchDaemons/com.tailscale.tailscaled.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.tailscale.tailscaled</string>
  <key>ProgramArguments</key>
  <array>
    <string>/opt/homebrew/bin/tailscaled</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
</dict>
</plist>
EOF

sudo launchctl load /Library/LaunchDaemons/com.tailscale.tailscaled.plist

# 5. Restrict SSH to Tailscale only (macOS firewall)
# System Settings → Network → Firewall → Turn On
# Then in /etc/ssh/sshd_config, add:
#   ListenAddress 100.x.x.x    (the Tailscale IP)
# Run: sudo launchctl stop com.openssh.sshd && sudo launchctl start com.openssh.sshd
```

---

## Post-Setup Verification

From your admin machine:

```bash
# Check the device is online
tailscale status

# SSH in via Tailscale
ssh root@<client-hostname>

# Verify it can't reach other clients (from the client device)
# This should timeout/fail:
tailscale ping <other-client-hostname>   # Should fail per ACLs
```

---

## Ongoing Management

### SSH in anytime

```bash
ssh root@acme-pi
```

### Push an update to all clients

```bash
for host in $(tailscale status --json | jq -r '.Peer[] | select(.Tags // [] | index("tag:client")) | .HostName'); do
  echo "=== Updating $host ==="
  ssh "root@$host" "apt-get update && apt-get upgrade -y" &
done
wait
```

### Check which clients are online

```bash
tailscale status --json | jq -r '.Peer[] | select(.Tags // [] | index("tag:client")) | "\(.HostName)\t\(.Online)\t\(.TailscaleIPs[0])"'
```

---

## Decommissioning a Client

1. Remove the device from the admin console: https://login.tailscale.com/admin/machines
2. Or from CLI: `tailscale logout` on the device, then delete it from the console.
3. On the device: `sudo apt-get remove tailscale tailscaled` (or `brew uninstall tailscale`)
