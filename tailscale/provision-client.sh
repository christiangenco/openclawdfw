#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# provision-client.sh — Set up a client device for Tailscale remote management
#
# Usage:
#   sudo ./provision-client.sh <hostname> <tailscale-auth-key>
#
# Example:
#   sudo ./provision-client.sh acme-pi tskey-auth-kBEMeN3EXAMPLE
#
# What it does:
#   1. Installs Tailscale
#   2. Joins the SetupClaw tailnet with tag:client
#   3. Enables Tailscale SSH
#   4. Locks down SSH to Tailscale interface only (Linux)
#   5. Enables unattended security updates (Linux)
#   6. Ensures Tailscale starts on boot
# =============================================================================

CLIENT_HOSTNAME="${1:-}"
AUTH_KEY="${2:-}"

if [ -z "$CLIENT_HOSTNAME" ] || [ -z "$AUTH_KEY" ]; then
  echo "Usage: sudo $0 <hostname> <tailscale-auth-key>"
  echo "Example: sudo $0 acme-pi tskey-auth-kBEMeN3EXAMPLE"
  exit 1
fi

if [ "$EUID" -ne 0 ]; then
  echo "Error: must run as root (use sudo)"
  exit 1
fi

OS="$(uname -s)"

echo "=== Provisioning $CLIENT_HOSTNAME ==="
echo "OS: $OS"

# ---------------------------------------------------------------------------
# 1. Install Tailscale
# ---------------------------------------------------------------------------
if command -v tailscale &>/dev/null; then
  echo "[1/5] Tailscale already installed: $(tailscale version)"
else
  echo "[1/5] Installing Tailscale..."
  if [ "$OS" = "Linux" ]; then
    curl -fsSL https://tailscale.com/install.sh | sh
  elif [ "$OS" = "Darwin" ]; then
    if command -v brew &>/dev/null; then
      brew install tailscale
    else
      echo "Error: Homebrew not found. Install Tailscale manually:"
      echo "  https://tailscale.com/download/mac"
      exit 1
    fi
  else
    echo "Error: unsupported OS: $OS"
    exit 1
  fi
fi

# ---------------------------------------------------------------------------
# 2. Ensure tailscaled is running
# ---------------------------------------------------------------------------
echo "[2/5] Starting tailscaled..."
if [ "$OS" = "Linux" ]; then
  systemctl enable tailscaled
  systemctl start tailscaled
elif [ "$OS" = "Darwin" ]; then
  # brew services or manual start
  if command -v brew &>/dev/null; then
    brew services start tailscale 2>/dev/null || tailscaled &
  else
    tailscaled &
  fi
  sleep 2
fi

# ---------------------------------------------------------------------------
# 3. Join the tailnet
# ---------------------------------------------------------------------------
echo "[3/5] Joining tailnet as $CLIENT_HOSTNAME with tag:client..."
tailscale up \
  --authkey="$AUTH_KEY" \
  --advertise-tags=tag:client \
  --hostname="$CLIENT_HOSTNAME" \
  --ssh

echo "    Tailscale IP: $(tailscale ip -4)"

# ---------------------------------------------------------------------------
# 4. Lock down SSH to Tailscale interface only (Linux)
# ---------------------------------------------------------------------------
if [ "$OS" = "Linux" ]; then
  echo "[4/5] Configuring firewall (ufw)..."
  if command -v ufw &>/dev/null; then
    ufw default deny incoming
    ufw allow in on tailscale0 to any port 22
    ufw --force enable
    echo "    SSH restricted to Tailscale interface only."
  else
    echo "    ufw not found — skipping firewall config."
    echo "    Consider restricting SSH manually (iptables or /etc/ssh/sshd_config)."
  fi
else
  echo "[4/5] Skipping firewall config (macOS — configure manually in System Settings)."
  echo "    Recommendation: set ListenAddress to $(tailscale ip -4) in /etc/ssh/sshd_config"
fi

# ---------------------------------------------------------------------------
# 5. Enable unattended security updates (Linux)
# ---------------------------------------------------------------------------
if [ "$OS" = "Linux" ]; then
  echo "[5/5] Enabling unattended security upgrades..."
  if command -v apt-get &>/dev/null; then
    apt-get install -y unattended-upgrades
    echo 'Unattended-Upgrade::Automatic-Reboot "false";' > /etc/apt/apt.conf.d/51setupclaw
    echo "    Unattended upgrades enabled (no auto-reboot)."
  else
    echo "    apt-get not found — skipping (not Debian/Ubuntu?)."
  fi
else
  echo "[5/5] Skipping unattended upgrades (macOS — enable Automatic Updates in System Settings)."
fi

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
echo ""
echo "=== ✅ $CLIENT_HOSTNAME provisioned ==="
echo ""
echo "Tailscale IP:  $(tailscale ip -4)"
echo "Hostname:      $CLIENT_HOSTNAME"
echo ""
echo "From your admin machine, connect with:"
echo "  ssh root@$CLIENT_HOSTNAME"
echo ""
echo "Verify in the admin console:"
echo "  https://login.tailscale.com/admin/machines"
