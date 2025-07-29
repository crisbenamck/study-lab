# Generador de Preguntas - React SPA

Una aplicación web moderna para crear y gestionar preguntas de examen con múltiples opciones. Construida con React, TypeScript y CSS vanilla.

## 🚀 Características

- **Formulario intuitivo** para crear preguntas con múltiples opciones
- **Soporte para respuestas múltiples** en una sola pregunta
- **Persistencia local** - las preguntas se guardan automáticamente en el navegador
- **Exportación a JSON** - descarga todas las preguntas en formato JSON
- **Interfaz moderna y minimalista** con Tailwind CSS
- **Numeración automática** de preguntas (0001, 0002, etc.)
- **Referencias externas** - agrega links de fuentes para cada pregunta

## 🛠️ Tecnologías Utilizadas

- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Vite** - Herramienta de construcción rápida
- **Tailwind CSS** - Framework de CSS utilitario
- **React Hook Form** - Gestión de formularios optimizada
- **Lucide React** - Iconos SVG
- **File Saver** - Descarga de archivos del lado del cliente

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd question-generator-app
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

## 🏗️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la construcción de producción
- `npm run lint` - Ejecuta ESLint para verificar el código

## 📋 Uso

1. **Agregar una pregunta:**
   - Completa el texto de la pregunta
   - Agrega las opciones de respuesta (mínimo 2, máximo ilimitado)
   - Marca las opciones correctas
   - Selecciona si permite múltiples respuestas
   - Agrega un link de referencia
   - Proporciona una explicación detallada
   - Haz clic en "Guardar Pregunta"

2. **Gestionar preguntas:**
   - Las preguntas se muestran en una lista debajo del formulario
   - Puedes eliminar preguntas individuales
   - Usa "Limpiar Todo" para eliminar todas las preguntas

3. **Exportar preguntas:**
   - Haz clic en "Descargar JSON" para obtener todas las preguntas
   - El archivo se descargará con el formato: `questions-YYYY-MM-DD.json`

## 📄 Formato de JSON

Las preguntas se exportan en el siguiente formato:

```json
{
  "question_number": "0001",
  "question_text": "Texto de la pregunta...",
  "options": [
    {
      "option_letter": "A",
      "option_text": "Primera opción",
      "is_correct": false
    },
    {
      "option_letter": "B",
      "option_text": "Segunda opción",
      "is_correct": true
    }
  ],
  "requires_multiple_answers": false,
  "explanation": "Explicación detallada...",
  "link": "https://fuente-referencia.com"
}
```

## 🎨 Personalización

La aplicación usa Tailwind CSS con una paleta de colores personalizada. Puedes modificar los colores en `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        50: '#f0f9ff',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      }
    }
  },
}
```

## 💾 Almacenamiento

- Las preguntas se guardan automáticamente en `localStorage`
- Los datos persisten al cerrar y reabrir el navegador
- La aplicación maneja automáticamente la carga y guardado de datos

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
