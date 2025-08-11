
# Copilot Custom Instructions for Study Lab

## 1. Lenguaje y comunicación
- Todas las respuestas y explicaciones deben ser en español.
- Todo el código, nombres de variables, funciones, componentes y comentarios deben estar en inglés, siguiendo las convenciones de TypeScript y React.

## 2. Estructura y estilo de código
- Usa TypeScript en todos los archivos de lógica y componentes.
- Utiliza componentes funcionales y hooks de React.
- Importa tipos usando `import type`.
- Usa Tailwind CSS exclusivamente para el estilizado, sin frameworks de UI externos.
- Los componentes deben estar en PascalCase y ubicados en `src/components`.
- Los hooks personalizados deben estar en `src/hooks` y usar camelCase.
- Los tipos deben estar en `src/types`.
- Las utilidades deben estar en `src/utils` y usar camelCase.
- Mantén la estructura de carpetas y archivos según la convención del proyecto.

## 3. Gestión de estado y persistencia
- Usa el hook `useLocalStorage` para toda la persistencia en localStorage.
- Los datos de preguntas deben guardarse automáticamente al modificarse.
- Los números de preguntas deben ser secuenciales y con formato 0001, 0002, etc.

## 4. Formularios y validaciones
- Usa React Hook Form para todos los formularios.
- Valida todos los campos requeridos, especialmente el campo de referencia.
- Permite arrays dinámicos de opciones en las preguntas.
- Resetea el formulario tras un envío exitoso.

## 5. UI y experiencia de usuario
- La interfaz debe ser minimalista y moderna, usando solo Tailwind CSS.
- No uses componentes de UI externos salvo justificación clara.
- Aplica clases de Tailwind directamente en los componentes.

## 6. Exportación e importación
- Implementa la exportación de preguntas a JSON.
- Si se solicita importación, valida el formato antes de guardar.

## 7. Refactorización y mantenimiento
- Si encuentras código, comentarios o nombres en español, refactóralos a inglés cuando hagas cambios.
- Prefiere nombres claros y descriptivos en inglés para todo lo nuevo.

## 8. Terminal y automatización
- Si una acción requiere terminal (por ejemplo, borrar archivos), ejecútala realmente, no solo la describas.

## 9. Documentación y ayuda
- Si el usuario pide ejemplos, genera código listo para usar y bien comentado.
- Si el usuario pide explicación de una función, da una breve descripción en español y referencia el archivo o componente.


## 10. General
- Si el usuario no especifica archivos, infiere y sugiere los archivos correctos según la estructura del proyecto.
- Si tienes dudas, busca primero en el workspace antes de preguntar detalles al usuario.
- Sigue las mejores prácticas de React, TypeScript y Tailwind CSS en todo momento.

## 11. Reglas adicionales para interacción avanzada

- Si el usuario solicita una funcionalidad sin especificar detalles, sugiere primero la estructura de archivos y componentes recomendada antes de implementar.
- Si detectas patrones repetidos o código duplicado, sugiere refactorización automática usando hooks, utilidades o componentes reutilizables.
- Si el usuario solicita una nueva funcionalidad, sugiere o genera pruebas unitarias básicas siguiendo la convención del proyecto.
- Si detectas errores o warnings en el código, sugiere la corrección siguiendo las mejores prácticas de TypeScript y React.
- Sugiere siempre agregar atributos de accesibilidad (aria-label, roles, etc.) en componentes interactivos.
- Si creas un nuevo componente visual, sugiere una estructura semántica y accesible.
- Si detectas código que puede optimizarse (por ejemplo, renderizados innecesarios o uso ineficiente de hooks), sugiere mejoras automáticas.
- Al crear un nuevo hook, utilidad o componente, agrega un comentario breve en inglés explicando su propósito y uso.

---

### Tecnologías principales del proyecto
- React (SPA)
- TypeScript
- Tailwind CSS
- React Hook Form
- Vite
- localStorage (persistencia)
- Vanilla CSS (mínimo)
- Estructura modular (componentes, hooks, utils, types)
