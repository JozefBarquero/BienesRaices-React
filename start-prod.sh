#!/bin/bash
set -euo pipefail

CYAN=$'\033[0;36m'
GREEN=$'\033[0;32m'
RESET=$'\033[0m'
PROJ="/home/server/Documentos/BienesRaices-React"

BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
    echo -e "\nDeteniendo servicios..."
    [[ -n "$BACKEND_PID"  ]] && kill -TERM "$BACKEND_PID"  2>/dev/null || true
    [[ -n "$FRONTEND_PID" ]] && kill -TERM "$FRONTEND_PID" 2>/dev/null || true
    wait 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo -e "Backend - Frontend (build + preview)\n"

(cd "$PROJ/Frontend" && npm run build)

(
    cd "$PROJ/Backend"
    exec node server.js
) > >(sed -u "s/^/${CYAN}[BACKEND]${RESET} /") 2>&1 &
BACKEND_PID=$!

(
    cd "$PROJ/Frontend"
    exec npx vite preview --host 127.0.0.1 --port 4173
) > >(sed -u "s/^/${GREEN}[FRONTEND]${RESET} /") 2>&1 &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID  |  Frontend PID: $FRONTEND_PID"
echo "Ctrl+C para detener ambos."

wait