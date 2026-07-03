#!/usr/bin/env bash
# One-click build for the Quick Tab Launcher Chrome extension.
#
# - Cleans the previous dist/ output
# - Runs vite build (output goes to <repo>/dist/)
# - Verifies manifest.json is present in dist/
# - Packages dist/ into dist/quick-tab-launcher-v<version>.zip for upload
# - Supports beta output as dist/quick-tab-launcher-beta-v<version>.zip
#
# Usage:
#   bash scripts/build.sh         # build + zip
#   bash scripts/build.sh --no-zip  # build only, skip zipping
#   bash scripts/build.sh --beta  # build + beta zip
#
# Also exposed as an npm script:  npm run package

set -euo pipefail

# Resolve repo root regardless of where the script is invoked from.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

DIST_DIR="$REPO_ROOT/dist"
MANIFEST="$DIST_DIR/manifest.json"
SRC_MANIFEST="$REPO_ROOT/public/manifest.json"

ZIP_FLAG=1
RELEASE_CHANNEL="stable"
for arg in "$@"; do
  case "$arg" in
    --no-zip) ZIP_FLAG=0 ;;
    --beta) RELEASE_CHANNEL="beta" ;;
    -h|--help)
      sed -n '2,17p' "$0"
      exit 0
      ;;
    *) echo "Unknown argument: $arg" >&2; exit 2 ;;
  esac
done

echo "==> Building Quick Tab Launcher extension"
echo "    repo root: $REPO_ROOT"

# 1. Clean previous output.
if [ -d "$DIST_DIR" ]; then
  echo "==> Cleaning existing dist/"
  rm -rf "$DIST_DIR"
fi

# 2. Run vite build (outputs to dist/ per vite.config.ts defaults).
echo "==> Running vite build"
npm run build

# 3. Verify the build produced a loadable extension.
if [ ! -f "$MANIFEST" ]; then
  echo "ERROR: $MANIFEST not found after build." >&2
  echo "       Ensure public/manifest.json is being copied to dist/ by vite." >&2
  exit 1
fi

# Read version out of manifest.json (works on macOS via python3, no jq required).
VERSION="$(python3 -c 'import json,sys;print(json.load(open(sys.argv[1]))["version"])' "$MANIFEST")"
echo "==> Built extension version: $VERSION"
echo "    output dir: $DIST_DIR"
ls -1 "$DIST_DIR"

# 4. Optional: zip for Chrome Web Store upload.
if [ "$ZIP_FLAG" -eq 1 ]; then
  if [ "$RELEASE_CHANNEL" = "beta" ]; then
    ZIP_PATH="$DIST_DIR/quick-tab-launcher-beta-v${VERSION}.zip"
  else
    ZIP_PATH="$DIST_DIR/quick-tab-launcher-v${VERSION}.zip"
  fi
  echo "==> Packaging into $ZIP_PATH"
  # Zip from inside dist/ so paths in the archive are relative.
  ( cd "$DIST_DIR" && zip -rq "$(basename "$ZIP_PATH")" . -x "$(basename "$ZIP_PATH")" )
  echo "    zip size: $(du -h "$ZIP_PATH" | cut -f1)"
fi

echo "==> Done."
if [ "$ZIP_FLAG" -eq 1 ]; then
  echo "    Load unpacked:  $DIST_DIR"
  echo "    Release channel: $RELEASE_CHANNEL"
  echo "    Upload package: $ZIP_PATH"
else
  echo "    Load unpacked:  $DIST_DIR"
fi
