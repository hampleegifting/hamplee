#!/usr/bin/env bash
# Regenerate downscaled JPEGs used by the site (macOS sips).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BANNER="$ROOT/asset/banner/AdobeStock_1327940096.jpeg"
MOOD="$ROOT/asset/moodboard/AdobeStock_1476270645 (1).jpeg"

if [[ -f "$BANNER" ]]; then
  sips -Z 1920 "$BANNER" --out "$ROOT/asset/banner/AdobeStock_1327940096-1920.jpeg"
  sips -Z 960 "$BANNER" --out "$ROOT/asset/banner/AdobeStock_1327940096-960.jpeg"
  echo "Updated hero derivatives."
fi

if [[ -f "$MOOD" ]]; then
  sips -Z 1920 "$MOOD" --out "$ROOT/asset/moodboard/AdobeStock_1476270645-1920.jpeg"
  echo "Updated mood-board / selection-mode background derivative."
fi
