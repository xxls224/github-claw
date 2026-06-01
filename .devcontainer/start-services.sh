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
  local log_file="$STATE_DIR/${name}.log"
  shift

  if [[ -f "$pid_file" ]]; then
    local pid
    pid="$(cat "$pid_file")"
    if kill -0 "$pid" 2>/dev/null; then
      return 0
    fi
    rm -f "$pid_file"
  fi

  (
    cd "$ROOT"
    nohup bash -c 'exec -a "$1" "${@:2}"' _ "$name" "$@" >"$log_file" 2>&1 &
    echo $! >"$pid_file"
  )
}

start_frontend() {
  if [[ -f package.json ]] && grep -q '"dev"[[:space:]]*:' package.json; then
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
    start_service backend-root-main python3 app.py
    return 0
  fi

  if [[ -f main.py ]]; then
    start_service backend-root-main python3 main.py
    return 0
  fi

  echo "No Python backend entrypoint found; backend startup skipped."
}

start_frontend
start_python_backend
