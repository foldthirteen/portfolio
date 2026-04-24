#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <input-html-or-url> <output-pdf>" >&2
  exit 1
fi

chrome_bin="${CHROME_BIN:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
input="$1"
output="$2"

if [ ! -x "$chrome_bin" ]; then
  echo "Chrome binary not found at: $chrome_bin" >&2
  exit 1
fi

if [[ "$input" == http://* || "$input" == https://* || "$input" == file://* ]]; then
  input_url="$input"
else
  input_url="$(python3 - "$input" <<'PY'
from pathlib import Path
import sys

print(Path(sys.argv[1]).resolve().as_uri())
PY
)"
fi

mkdir -p "$(dirname "$output")"

"$chrome_bin" \
  --headless \
  --disable-gpu \
  --run-all-compositor-stages-before-draw \
  --virtual-time-budget=2000 \
  --print-to-pdf="$output" \
  --no-pdf-header-footer \
  "$input_url"
