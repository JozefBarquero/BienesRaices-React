#!/usr/bin/env bash

ORIGEN="$HOME/Documentos/BienesRaices-React"
DESTINO="$HOME/Documentos/Sincronizados/BienesRaices-React"

if [ ! -d "$ORIGEN" ]; then
  echo "Error: El directorio de origen no existe en $ORIGEN"
  exit 1
fi

mkdir -p "$DESTINO"

rsync -av --delete \
  --include='.env.example' \
  --include='.env.sample' \
  --exclude='.env*' \
  --exclude='node_modules/' \
  --exclude='dist/' \
  --exclude='build/' \
  --exclude='coverage/' \
  --exclude='.git/' \
  --exclude='.github/' \
  --exclude='.vscode/' \
  --exclude='.idea/' \
  --exclude='.DS_Store' \
  --exclude='Thumbs.db' \
  --exclude='desktop.ini' \
  --exclude='*.log' \
  --exclude='npm-debug.log*' \
  --exclude='yarn-debug.log*' \
  --exclude='yarn-error.log*' \
  --exclude='pnpm-debug.log*' \
  --exclude='.cache/' \
  --exclude='.parcel-cache/' \
  --exclude='.turbo/' \
  --exclude='.next/' \
  --exclude='.nuxt/' \
  --exclude='.svelte-kit/' \
  --exclude='.vite/' \
  --exclude='.eslintcache' \
  --exclude='.stylelintcache' \
  --exclude='*.tsbuildinfo' \
  "$ORIGEN/" "$DESTINO/"

echo "----------------------------------------"
echo "Copia completada con éxito en: $DESTINO"