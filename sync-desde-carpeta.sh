#!/bin/bash
# Sincroniza la carpeta de trabajo "Alcaldia Guarenas - Web 2" con este repo
# y sube los cambios a GitHub.
#
# Uso:
#   ./sync-desde-carpeta.sh                        # commit auto + push
#   ./sync-desde-carpeta.sh "mensaje del commit"   # commit con mensaje custom + push

set -e

SRC="/Users/brayanperdomo/Desktop/Alcaldia Guarenas - Web 2"
DST="/Users/brayanperdomo/Desktop/web/web-oficial-alcaldia-guarenas"

if [ ! -d "$SRC" ]; then
  echo "ERROR: No existe la carpeta fuente: $SRC"
  exit 1
fi

cd "$DST"

echo "==> Copiando archivos desde carpeta de trabajo..."

# HTML raíz
cp "$SRC"/*.html "$DST"/ 2>/dev/null || true
# LEEME.md
[ -f "$SRC/LEEME.md" ] && cp "$SRC/LEEME.md" "$DST/"
# .gitignore
[ -f "$SRC/.gitignore" ] && cp "$SRC/.gitignore" "$DST/"
# scripts (fusiona, no borra)
[ -d "$SRC/scripts" ] && cp -R "$SRC/scripts/." "$DST/scripts/"
# assets (fusiona, no borra)
[ -d "$SRC/assets" ] && cp -R "$SRC/assets/." "$DST/assets/"
# documentos-fuente (fusiona)
[ -d "$SRC/documentos-fuente" ] && cp -R "$SRC/documentos-fuente/." "$DST/documentos-fuente/" 2>/dev/null || \
  { [ -d "$SRC/documentos-fuente" ] && cp -R "$SRC/documentos-fuente" "$DST/"; }

echo "==> Cambios detectados por git:"
git status --short

if [ -z "$(git status --porcelain)" ]; then
  echo "==> Nada que sincronizar. Repo ya está al día."
  exit 0
fi

MSG="${1:-Actualizar archivos desde carpeta de trabajo}"

git add -A
git commit -m "$MSG"

echo "==> Subiendo a GitHub..."
git push origin main

echo "==> Listo. Repo actualizado en:"
echo "    https://github.com/antoniotorrealba2907-creator/web-oficial-alcaldia-guarenas"
