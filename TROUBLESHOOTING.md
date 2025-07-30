# 🔧 Solución de Problemas - PDF Processor

## ✅ **Problema Resuelto: PDF.js Worker**

### **Síntoma:**
```
Error procesando PDF: Setting up fake worker failed: "Failed to fetch dynamically imported module"
```

### **Causa:**
El worker de PDF.js no se puede cargar desde CDN o desde el módulo importado dinámicamente.

### **Solución Implementada:**

1. **Worker copiado localmente**: El worker se copia al directorio `public/`
2. **Script automatizado**: `scripts/setup-pdfjs.sh` maneja la copia
3. **Post-install hook**: Se ejecuta automáticamente después de `npm install`

### **Verificación:**

```bash
# Verificar que el worker existe
ls -la public/pdf.worker.mjs

# Re-ejecutar setup si es necesario
npm run postinstall
```

### **Configuración Actual:**

```typescript
// src/utils/pdfProcessor.ts
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
```

## 🚀 **Prueba la Funcionalidad**

1. **Abrir** http://localhost:5173/
2. **Ir** a la pestaña "Importar desde PDF"
3. **Configurar** API key de Gemini
4. **Subir** un PDF de prueba
5. **Verificar** que procesa correctamente

## 📋 **Checklist de Verificación**

- ✅ Servidor de desarrollo funcionando
- ✅ Worker de PDF.js copiado
- ✅ API key de Gemini configurada
- ✅ Dependencias instaladas
- ✅ Sin errores de compilación

## 🆘 **Si Sigues Teniendo Problemas**

### **Worker no encontrado:**
```bash
npm run postinstall
```

### **Error de permisos:**
```bash
chmod +x scripts/setup-pdfjs.sh
npm run postinstall
```

### **Limpiar y reinstalar:**
```bash
rm -rf node_modules package-lock.json
npm install
```
