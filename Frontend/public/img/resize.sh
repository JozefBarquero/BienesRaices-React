#!/usr/bin/env bash
set -euo pipefail

SRC="$HOME/Descargas/Temp"
DST="$SRC/fhd"

mkdir -p "$DST"

for img in "$SRC"/*.webp; do
    [ -e "$img" ] || continue

    magick "$img" -resize '1920x1080>' -quality 80 "$DST/$(basename "$img")"
    echo "Procesada: $(basename "$img")"
done

echo "Listo. Imágenes en: $DST"
