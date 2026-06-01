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
  local cmd_file="$STATE_DIR/${name}.cmd"
  local log_file="$STATE_DIR/${name}.log"
  shift

  local expected_cmd
  expected_cmd="$(printf '%q ' "$@")"
  expected_cmd="${expected_cmd% }"

  if [[ -f "$pid_file" && -f "$cmd_file" ]]; then
    local pid current_cmd
    pid="$(cat "$pid_file")"
    current_cmd="$(ps -p "$pid" -o args= 2>/dev/null | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//; s/[[:space:]]+/ /g')"
    if [[ -n "$current_cmd" && "$current_cmd" == "$(<"$cmd_file")" ]]; then
      return 0
    fi
    rm -f "$pid_file" "$cmd_file"
  fi

  (
    cd "$ROOT"
    nohup "$@" >"$log_file" 2>&1 &
    echo $! >"$pid_file"
    printf '%s\n' "$expected_cmd" >"$cmd_file"
  )
}

start_frontend() {
  if [[ -f package.json ]] && node -e "const pkg = require('./package.json'); process.exit(pkg.scripts && pkg.scripts.dev ? 0 : 1)"; then
    start_service frontend npm run dev -- --host 0.0.0.0 --port "$FRONTEND_PORT"
  else
    echo "No npm dev script found; frontend startup skipped."
  fi
}

start_python_backend() {
  if [[ -f backend/main.py ]]; then
    start_service backend python3 backend/main.py
    return 0
  fi

  if [[ -f backend/app.py ]]; then
    start_service backend python3 backend/app.py
    return 0
  fi

  if [[ -f app.py ]]; then
    start_service backend python3 app.py
    return 0
  fi

  if [[ -f main.py ]]; then
    start_service backend python3 main.py
    return 0
  fi

  echo "No Python backend entrypoint found; backend startup skipped."
}

start_frontend
start_python_backend
