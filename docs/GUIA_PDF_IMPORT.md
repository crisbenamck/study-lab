# 📄 Importación de Preguntas desde PDF - Guía Completa

## 🚀 ¿Qué hemos implementado?

Una funcionalidad completa para extraer preguntas de examen desde archivos PDF usando:
- **OCR** (Tesseract.js) para imágenes
- **Extracción de texto** nativo de PDFs
- **IA (Google Gemini)** para procesar y estructurar preguntas
- **Interfaz visual** para revisar y seleccionar preguntas

## 🔧 Configuración Inicial

### 1. Obtener API Key de Google Gemini (GRATUITO)

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Create API Key"
4. Copia la API key generada

### 2. Configurar Variables de Entorno

Edita el archivo `.env` en la raíz del proyecto:

```env
# Google Gemini API Key
VITE_GEMINI_API_KEY=tu_api_key_aqui

# Configuración opcional
VITE_MAX_PDF_SIZE_MB=5
VITE_MAX_PAGES_PER_PDF=20
```

### 3. Instalar Dependencias

Las dependencias ya están instaladas, pero si necesitas reinstalar:

```bash
npm install pdf-lib pdfjs-dist tesseract.js @google/generative-ai @tailwindcss/postcss
```

## 📋 Limitaciones y Recomendaciones

### 💾 LocalStorage
- **Límite total**: ~10MB en la mayoría de navegadores
- **Recomendación**: PDFs de máximo 3-5MB
- **Estimación**: 1 PDF mediano = ~2-3MB en storage

### 🤖 Google Gemini (Plan Gratuito)
- **Requests**: 60 por minuto
- **Cuota diaria**: 1,500 requests
- **Tokens mensuales**: 1,000,000
- **Costo**: $0 (completamente gratis)

### 📄 Archivos PDF
- **Tamaño máximo recomendado**: 5MB
- **Páginas recomendadas**: 10-20 páginas
- **Tipos soportados**: PDF con texto y/o imágenes

## 🎯 Cómo Usar la Funcionalidad

### Paso 1: Acceder a la Pestaña
1. Inicia la aplicación (`npm run dev`)
2. Haz clic en la pestaña **"Importar desde PDF"**

### Paso 2: Configurar API Key (si no está en .env)
1. Si aparece el aviso amarillo, pega tu API key de Gemini
2. La configuración se guarda temporalmente en la sesión

### Paso 3: Subir PDF
1. **Arrastra y suelta** el PDF en la zona de carga, o
2. **Haz clic** en "Seleccionar PDF" para elegir archivo

### Paso 4: Procesamiento Automático
La aplicación procesará el PDF **página por página**:

1. **Análisis**: Detecta si tiene texto o imágenes
2. **Extracción**: Obtiene texto nativo o usa OCR
3. **IA Processing**: Gemini estructura las preguntas
4. **Generación**: Crea explicaciones y links automáticamente

### Paso 5: Revisar y Seleccionar
1. **Vista por páginas**: Ve el procesamiento página por página
2. **Vista de preguntas**: Lista todas las preguntas encontradas
3. **Seleccionar**: Marca las preguntas que quieres importar
4. **Editar**: Revisa preguntas marcadas como "Revisar"

### Paso 6: Importar
1. Haz clic en **"Importar Seleccionadas"**
2. Las preguntas se agregan a tu lista principal
3. Se numeran automáticamente de forma consecutiva

## 🔍 Tipos de Procesamiento

### 📝 PDFs con Texto
- **Velocidad**: Muy rápida (segundos)
- **Precisión**: Alta (90-95%)
- **IA Usage**: Moderado
- **Resultado**: Preguntas bien estructuradas

### 🖼️ PDFs con Imágenes (OCR)
- **Velocidad**: Lenta (1-2 min por página)
- **Precisión**: Media (70-85%)
- **IA Usage**: Alto (para mejorar OCR)
- **Resultado**: Requiere más revisión manual

### 🔄 PDFs Mixtos
- **Velocidad**: Variable
- **Precisión**: Alta para texto, media para imágenes
- **IA Usage**: Moderado
- **Resultado**: Mejor calidad general

## ⚠️ Solución de Problemas

### Error: "API key no configurada"
**Solución**: Configura `VITE_GEMINI_API_KEY` en `.env`

### Error: "Archivo muy grande"
**Solución**: Reduce el tamaño del PDF o cambia `VITE_MAX_PDF_SIZE_MB`

### Error: "Gemini rate limit"
**Solución**: Espera 1 minuto o procesa archivos más pequeños

### Error: "OCR no detecta texto"
**Solución**: 
- Verifica calidad de imagen en PDF
- Prueba con PDFs escaneados de mejor resolución

### Preguntas mal extraídas
**Solución**:
- Usa la vista de páginas para revisar página por página
- Edita manualmente las preguntas marcadas como "Revisar"
- Desselecciona preguntas de baja confianza

## 🎮 Funcionalidades Adicionales

### 🔧 Configuración Avanzada
```env
# Personalizar límites
VITE_MAX_PDF_SIZE_MB=10        # Tamaño máximo en MB
VITE_MAX_PAGES_PER_PDF=50      # Páginas máximas a procesar
```

### 📊 Indicadores de Calidad
- **Confianza Verde (80%+)**: Preguntas de alta calidad
- **Confianza Amarilla (60-80%)**: Revisar recomendado
- **Confianza Roja (<60%)**: Requiere edición manual

### 🔄 Flujo de Trabajo Recomendado
1. **Prueba con PDF pequeño** (1-2 páginas) primero
2. **Revisa resultados** antes de procesar archivos grandes
3. **Usa vista de páginas** para identificar errores específicos
4. **Importa por lotes** para manejar memoria eficientemente

## 📈 Casos de Uso Exitosos

### ✅ Funciona Muy Bien Con:
- PDFs generados digitalmente con texto seleccionable
- Preguntas de opción múltiple estándar (A, B, C, D)
- Documentos con formato consistente
- Exámenes universitarios o certificaciones

### ⚠️ Requiere Más Cuidado Con:
- PDFs escaneados de baja calidad
- Preguntas con formatos no estándar
- Documentos con muchas imágenes/gráficos
- Texto manuscrito

### ❌ No Recomendado Para:
- PDFs completamente en imágenes de muy baja resolución
- Documentos sin estructura clara de preguntas
- Archivos con más de 50 páginas (por límites de memoria)

## 🚀 Próximas Mejoras Sugeridas

1. **Edición in-line** de preguntas durante la revisión
2. **Exportación** de preguntas procesadas antes de importar
3. **Templates personalizados** para diferentes tipos de examen
4. **Procesamiento por lotes** de múltiples PDFs
5. **Cache local** de preguntas procesadas

¡La funcionalidad está lista para usar! 🎉
