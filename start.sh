#!/bin/bash

CYAN='\033[0;36m'
GREEN='\033[0;32m'
RESET='\033[0m'

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cleanup() {
    echo -e "\nDeteniendo servicios..."
    kill 0
    exit 0
}

trap cleanup SIGINT SIGTERM

echo -e "Backend - Frontend\n"

(cd "$DIR/Backend" && npm start 2>&1 | sed -u "s/^/$(echo -e "${CYAN}[BACKEND]${RESET} ")/") &

(cd "$DIR/BienesRaices-React" && npm run dev 2>&1 | sed -u "s/^/$(echo -e "${GREEN}[FRONTEND]${RESET} ")/") &

wait