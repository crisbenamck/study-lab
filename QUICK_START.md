# 🚀 Quick Start - Importación PDF

## Configuración Rápida (2 minutos)

### 1. Obtener API Key
```bash
# Ve a: https://makersuite.google.com/app/apikey
# Crea tu API key gratuita de Google Gemini
```

### 2. Configurar .env
```bash
echo 'VITE_GEMINI_API_KEY=tu_api_key_aqui' > .env
```

### 3. Iniciar aplicación
```bash
npm run dev
```

## Prueba Inmediata

### Paso 1: Ir a "Importar desde PDF"
![Pestaña Import](./docs/tab-import.png)

### Paso 2: Subir PDF de prueba
- Arrastra cualquier PDF con preguntas
- Máximo recomendado: 5MB, 10 páginas

### Paso 3: Ver resultados
- El procesamiento es automático
- Revisa página por página
- Selecciona preguntas válidas

### Paso 4: Importar
- Clic en "Importar Seleccionadas"
- Las preguntas aparecen en tu lista principal

## Ejemplo de Salida

```json
{
  "question_number": 1,
  "question_text": "¿Cuál es la principal ventaja de React?",
  "options": [
    {"option_letter": "A", "option_text": "Virtual DOM", "is_correct": true},
    {"option_letter": "B", "option_text": "Fácil sintaxis", "is_correct": false},
    {"option_letter": "C", "option_text": "Pequeño tamaño", "is_correct": false}
  ],
  "requires_multiple_answers": false,
  "explanation": "El Virtual DOM permite updates eficientes...",
  "link": "https://react.dev/learn/preserving-and-resetting-state"
}
```

## ¿Algo no funciona?

### Error común: API key
```bash
# Verifica que la API key esté en .env
cat .env | grep GEMINI
```

### Error común: archivo muy grande
```bash
# Reduce el tamaño del PDF o cambia límite en .env
echo 'VITE_MAX_PDF_SIZE_MB=10' >> .env
```

### Error común: OCR no detecta
- Usa PDFs con texto seleccionable cuando sea posible
- Para escaneados, asegúrate que sea buena resolución

¡Listo para usar! 🎉
