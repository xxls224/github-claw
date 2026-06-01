#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ -f package-lock.json ]]; then
  npm ci
elif [[ -f package.json ]]; then
  npm install
fi

if [[ -f scripts/requirements.txt ]]; then
  python3 -m pip install --user -r scripts/requirements.txt
fi

if [[ -f backend/requirements.txt ]]; then
  python3 -m pip install --user -r backend/requirements.txt
fi
