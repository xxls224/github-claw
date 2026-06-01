#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STATE_DIR="${CODESPACES_SERVICE_STATE_DIR:-$HOME/.cache/codespaces-services}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"
BACKEND_PORT="${BACKEND_PORT:-8000}"
mkdir -p "$STATE_DIR"

start_service() {
  local name="$1"
  local pid_file="$STATE_DIR/${name}.pid"
  local hash_file="$STATE_DIR/${name}.hash"
  local log_file="$STATE_DIR/${name}.log"
  shift

  local expected_hash current_hash
  expected_hash="$(printf '%s\0' "$@" | sha256sum | awk '{print $1}')"

  if [[ -f "$pid_file" && -f "$hash_file" ]]; then
    local pid current_cmd
    pid="$(cat "$pid_file")"
    current_hash="$(sha256sum <"/proc/$pid/cmdline" 2>/dev/null | awk '{print $1}')"
    if [[ -n "$current_hash" && "$current_hash" == "$(<"$hash_file")" ]]; then
      return 0
    fi
    rm -f "$pid_file" "$hash_file"
  fi

  (
    cd "$ROOT"
    nohup "$@" >"$log_file" 2>&1 &
    echo $! >"$pid_file"
    printf '%s\n' "$expected_hash" >"$hash_file"
  )
}

start_frontend() {
  if [[ -f package.json ]] && python3 - <<'PY'
import json
from pathlib import Path

pkg = json.loads(Path("package.json").read_text(encoding="utf-8"))
raise SystemExit(0 if pkg.get("scripts", {}).get("dev") else 1)
PY
  then
    start_service frontend-vite npm run dev -- --host 0.0.0.0 --port "$FRONTEND_PORT"
  else
    echo "No npm dev script found; frontend startup skipped."
  fi
}

start_python_backend() {
  if [[ -f backend/main.py ]]; then
    start_service backend-main python3 backend/main.py
    return 0
  fi

  if [[ -f backend/app.py ]]; then
    start_service backend-app python3 backend/app.py
    return 0
  fi

  if [[ -f app.py ]]; then
    start_service backend-root python3 app.py
    return 0
  fi

  if [[ -f main.py ]]; then
    start_service backend-main python3 main.py
    return 0
  fi

  echo "No Python backend entrypoint found; backend startup skipped."
}

start_frontend
start_python_backend
