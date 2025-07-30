#!/bin/bash

# Script para copiar el worker de PDF.js al directorio público
echo "Copiando PDF.js worker..."

# Crear directorio público si no existe
mkdir -p public

# Copiar worker
cp node_modules/pdfjs-dist/build/pdf.worker.mjs public/

echo "✅ PDF.js worker copiado exitosamente"
