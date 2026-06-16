#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-8500}"
BASE="http://localhost:${PORT}"

URLS=(
  "/"
  "/variants/combined/"
  "/variants/v1-nebula/"
  "/variants/v2-kinetic/"
  "/variants/v3-glass/"
  "/variants/v4-grid/"
  "/variants/v5-swiftlet/"
)

PASS=0
FAIL=0

for path in "${URLS[@]}"; do
  url="${BASE}${path}"
  if resp=$(curl -sfL "$url"); then
    if echo "$resp" | grep -q "Verity Tech"; then
      echo "✓ ${path} — OK"
      PASS=$((PASS + 1))
    else
      echo "✗ ${path} — missing content"
      FAIL=$((FAIL + 1))
    fi
  else
    echo "✗ ${path} — failed"
    FAIL=$((FAIL + 1))
  fi
done

echo "--- Passed: ${PASS}/${#URLS[@]}"
[ "$FAIL" -eq 0 ] || exit 1
