# 🧪 Prueba de Concepto - Importador de PDF con IA

## 📊 **Análisis de Implementación**

### 🎯 **Funcionalidades Implementadas**

✅ **Procesamiento de PDF página por página**
- Detecta contenido de texto vs imágenes
- Renderizado de páginas para análisis visual
- Procesamiento asíncrono con progreso en tiempo real

✅ **OCR Inteligente**
- Tesseract.js para extracción de texto de imágenes
- Detección automática de imágenes significativas
- Configuración en español

✅ **Integración con Gemini AI**
- Extracción estructurada de preguntas
- Generación automática de explicaciones
- Búsqueda y sugerencia de links de referencia
- Mejora de texto OCR con IA

✅ **Preview y Edición**
- Vista por páginas y por preguntas
- Selección individual de preguntas
- Indicadores de confianza y calidad
- Edición antes de importar

✅ **Gestión de Memoria**
- Validación de tamaño de archivo
- Estimación de uso de memoria
- Advertencias automáticas
- Optimización para LocalStorage

---

## 🚀 **Guía de Configuración**

### **1. Obtener API Key de Gemini (GRATIS)**

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Create API Key"
4. Copia la API key generada

### **2. Configurar Variables de Entorno**

Edita el archivo `.env` en la raíz del proyecto:

```env
# Pega tu API key aquí
VITE_GEMINI_API_KEY=tu_api_key_aquí

# Configuración opcional (usar valores por defecto)
VITE_MAX_PDF_SIZE_MB=5
VITE_MAX_PAGES_PER_PDF=20
```

### **3. Iniciar la Aplicación**

```bash
npm run dev
```

La nueva pestaña "Importar desde PDF" estará disponible.

---

## 📊 **Límites y Capacidades**

### **💾 LocalStorage - Límites de Memoria**

| Navegador | Límite Total | PDFs Recomendados |
|-----------|--------------|-------------------|
| Chrome/Edge | ~10MB | 3-4 PDFs medianos |
| Firefox | ~10MB | 3-4 PDFs medianos |
| Safari | ~5MB | 2-3 PDFs pequeños |

**Recomendaciones:**
- **Tamaño máximo por PDF**: 5MB
- **Páginas recomendadas**: 10-20 páginas
- **Contenido óptimo**: PDFs con texto claro o imágenes de alta calidad

### **🤖 Gemini AI - Cuotas Gratuitas**

| Límite | Cuota Gratuita |
|--------|----------------|
| Requests/minuto | 60 |
| Requests/día | 1,500 |
| Tokens/mes | 1,000,000 |

**Para 100 preguntas típicas:**
- ~300-500 requests (extracción + explicaciones + links)
- ~50,000-100,000 tokens
- **Conclusión**: Completamente dentro de la cuota gratuita

---

## 🔧 **Flujo de Procesamiento**

### **Paso 1: Análisis del PDF**
```
PDF → Carga → Análisis por páginas → Detección de contenido
```

### **Paso 2: Extracción de Contenido**
```
Texto nativo → Gemini AI → Preguntas estructuradas
     ↓
Imágenes → OCR (Tesseract) → Gemini AI → Preguntas mejoradas
```

### **Paso 3: Enriquecimiento**
```
Preguntas → Gemini AI → Explicaciones + Links de referencia
```

### **Paso 4: Preview y Selección**
```
Usuario revisa → Selecciona preguntas → Importa al sistema
```

---

## 🎯 **Casos de Uso Ideales**

### ✅ **Funciona Excelente**
- PDFs con preguntas de examen en texto claro
- Exámenes tipo test con opciones A, B, C, D
- Documentos con estructura consistente
- PDFs generados digitalmente (no escaneados)

### ⚠️ **Funciona con Revisión**
- PDFs escaneados de buena calidad
- Imágenes con texto claro y contrastado
- Preguntas con formatos no estándar
- Documentos con múltiples idiomas

### ❌ **No Recomendado**
- PDFs muy grandes (>10MB)
- Imágenes de muy baja calidad
- Documentos con formatos complejos
- PDFs protegidos o encriptados

---

## 🧠 **Calidad de Resultados Esperada**

### **Confianza Alta (80-100%)**
- ✅ Texto nativo del PDF
- ✅ Estructura clara de preguntas
- ✅ Opciones bien definidas

### **Confianza Media (60-80%)**
- ⚠️ OCR de imágenes claras
- ⚠️ Formatos ligeramente inconsistentes
- ⚠️ Requiere revisión manual

### **Confianza Baja (<60%)**
- ❌ OCR de imágenes pobres
- ❌ Estructura muy irregular
- ❌ Necesita edición significativa

---

## 🔍 **Validación y Testing**

### **Datos de Prueba Recomendados**

1. **PDF de Texto Simple** (ideal para testing inicial)
2. **PDF con Imágenes Claras** (testing OCR)
3. **PDF Mixto** (texto + imágenes)
4. **PDF Grande** (testing límites de memoria)

### **Métricas a Observar**

- **Tiempo de procesamiento** por página
- **Precisión de extracción** de preguntas
- **Calidad de explicaciones** generadas
- **Relevancia de links** sugeridos
- **Uso de memoria** del navegador

---

## 🚀 **Próximos Pasos Sugeridos**

### **Mejoras Inmediatas**
1. **Editor in-line** para preguntas extraídas
2. **Plantillas** para diferentes tipos de examen
3. **Exportación** de configuraciones exitosas

### **Optimizaciones**
1. **Caché inteligente** para acelerar re-procesamiento
2. **Procesamiento en chunks** para PDFs grandes
3. **Backup automático** antes de importaciones

### **Funcionalidades Avanzadas**
1. **Detección de temas** automática
2. **Agrupación** de preguntas por materia
3. **Validación cruzada** entre preguntas

---

## ⚡ **Comandos Útiles**

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Linting
npm run lint

# Preview de build
npm run preview
```

---

## 🆘 **Troubleshooting**

### **Error: "API key not configured"**
- Verificar que `.env` tiene `VITE_GEMINI_API_KEY`
- Reiniciar el servidor de desarrollo

### **Error: "PDF too large"**
- Verificar tamaño del archivo (<5MB)
- Ajustar `VITE_MAX_PDF_SIZE_MB` si es necesario

### **Error: "OCR failed"**
- Verificar calidad de imagen
- Probar con PDF de mayor resolución

### **Error: "LocalStorage quota exceeded"**
- Limpiar datos del navegador
- Procesar PDFs más pequeños
- Usar modo incógnito para testing

---

¡La prueba de concepto está lista para testing! 🎉
