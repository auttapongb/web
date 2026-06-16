#!/usr/bin/env python3
"""Build-time stock image fetcher for Verity Tech.

Downloads curated, licensed images from Unsplash and/or Pexels into
assets/media/stock/ so the live site serves local files (static-first, no
runtime API keys exposed). Falls back gracefully when keys are missing.

Usage:
    python3 scripts/fetch-images.py

Reads keys from environment or a local .env file:
    UNSPLASH_ACCESS_KEY=...
    PEXELS_API_KEY=...
"""
from __future__ import annotations

import json
import os
import sys
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STOCK_DIR = ROOT / "assets" / "media" / "stock"

# Slots: filename -> search query. Burgundy/gold corporate tech tone.
SLOTS = {
    "hero-team": "modern technology team office collaboration",
    "digital-signage": "digital signage display screen modern",
    "smart-office": "smart office meeting room technology",
    "data-analytics": "data analytics dashboard visualization",
    "software-dev": "software developer coding workspace",
    "smart-home": "smart home automation interior",
}


def load_env() -> None:
    env_file = ROOT / ".env"
    if not env_file.exists():
        return
    for line in env_file.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        os.environ.setdefault(key.strip(), val.strip())


def http_json(url: str, headers: dict) -> dict | None:
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.loads(r.read().decode())
    except Exception as e:  # noqa: BLE001
        print(f"  ! request failed: {e}")
        return None


def download(url: str, dest: Path) -> bool:
    try:
        with urllib.request.urlopen(url, timeout=30) as r:
            dest.write_bytes(r.read())
        return True
    except Exception as e:  # noqa: BLE001
        print(f"  ! download failed: {e}")
        return False


def fetch_unsplash(query: str, key: str) -> str | None:
    q = urllib.parse.quote(query)
    url = f"https://api.unsplash.com/search/photos?query={q}&per_page=1&orientation=landscape"
    data = http_json(url, {"Authorization": f"Client-ID {key}"})
    if not data or not data.get("results"):
        return None
    return data["results"][0]["urls"]["regular"]


def fetch_pexels(query: str, key: str) -> str | None:
    q = urllib.parse.quote(query)
    url = f"https://api.pexels.com/v1/search?query={q}&per_page=1&orientation=landscape"
    data = http_json(url, {"Authorization": key})
    if not data or not data.get("photos"):
        return None
    return data["photos"][0]["src"]["large2x"]


def main() -> int:
    load_env()
    unsplash = os.environ.get("UNSPLASH_ACCESS_KEY", "").strip()
    pexels = os.environ.get("PEXELS_API_KEY", "").strip()

    if not unsplash and not pexels:
        print("No UNSPLASH_ACCESS_KEY or PEXELS_API_KEY set.")
        print("Add a free key to .env, then re-run. See .env.example.")
        return 1

    STOCK_DIR.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, str] = {}

    for name, query in SLOTS.items():
        print(f"- {name}: \"{query}\"")
        img_url = None
        if unsplash:
            img_url = fetch_unsplash(query, unsplash)
        if not img_url and pexels:
            img_url = fetch_pexels(query, pexels)
        if not img_url:
            print("  ! no result")
            continue
        dest = STOCK_DIR / f"{name}.jpg"
        if download(img_url, dest):
            rel = f"../../assets/media/stock/{name}.jpg"
            manifest[name] = rel
            print(f"  ok -> {dest.relative_to(ROOT)}")

    if manifest:
        (STOCK_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2))
        print(f"\nWrote manifest with {len(manifest)} image(s).")
        print("Reference them in shared/media.js via the stock paths.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
