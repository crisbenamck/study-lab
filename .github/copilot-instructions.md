

# Copilot Custom Instructions for Study Lab

## Prioridad de reglas

Si surge un conflicto entre reglas, sigue este orden de prioridad:
1. Seguridad y accesibilidad
2. Idioma de la UI (español)
3. Convenciones de código (inglés, estructura, etc.)



## 1. Lenguaje y comunicación
- Todas las respuestas y explicaciones deben ser en español.
- Todo el código, nombres de variables, funciones, componentes y comentarios deben estar en inglés, siguiendo las convenciones de TypeScript y React.

### Ejemplos

**Correcto:**
```tsx
// src/components/QuestionCard.tsx
const questionText = "¿Cuál es la capital de Francia?"; // Texto visible en español
const [questionList, setQuestionList] = useState<Question[]>([]); // Nombres en inglés
```

**Incorrecto:**
```tsx
const textoPregunta = "What is the capital of France?"; // Texto visible en inglés y variable en español
```


## 2. Estructura y estilo de código
- Usa TypeScript en todos los archivos de lógica y componentes.
- Utiliza componentes funcionales y hooks de React.
- Importa tipos usando `import type`.
- Usa Tailwind CSS exclusivamente para el estilizado, sin frameworks de UI externos.
- Los componentes deben estar en PascalCase y ubicados en `src/components`.
- Los hooks personalizados deben estar en `src/hooks` y usar camelCase.
- Los tipos deben estar en `src/types`.
- Las utilidades deben estar en `src/utils` y usar camelCase.
- Mantén la estructura de carpetas y archivos según la convención del proyecto (todos los paths relativos a `src/`).


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
- Usa utilidades o linters personalizados para detectar textos en inglés en la UI antes de hacer un commit.


## 6. Exportación e importación
- Implementa la exportación de preguntas a JSON.
- Si se solicita importación, valida el formato antes de guardar.


## 7. Refactorización y mantenimiento
- Si encuentras código, comentarios o nombres en español, refactóralos a inglés cuando hagas cambios.
- Prefiere nombres claros y descriptivos en inglés para todo lo nuevo.
- Si detectas código duplicado, sugiere refactorización automática usando hooks, utilidades o componentes reutilizables.


## 8. Terminal y automatización
- Si una acción requiere terminal (por ejemplo, borrar archivos), ejecútala realmente, no solo la describas.


## 9. Documentación y ayuda
- Si el usuario pide ejemplos, genera código listo para usar y bien comentado.
- Si el usuario pide explicación de una función, da una breve descripción en español y referencia el archivo o componente.



## 10. General
- Si el usuario no especifica archivos, infiere y sugiere los archivos correctos según la estructura del proyecto.
- Si tienes dudas, busca primero en el workspace antes de preguntar detalles al usuario.
- Sigue las mejores prácticas de React, TypeScript y Tailwind CSS en todo momento.
- Mantén actualizadas las dependencias principales (React, Tailwind, etc.) y sugiere actualización si detectas versiones obsoletas.


## 11. Reglas adicionales para interacción avanzada

- Si el usuario solicita una funcionalidad sin especificar detalles, sugiere primero la estructura de archivos y componentes recomendada antes de implementar.
- Si detectas patrones repetidos o código duplicado, sugiere refactorización automática usando hooks, utilidades o componentes reutilizables.
- Si el usuario solicita una nueva funcionalidad, sugiere o genera pruebas unitarias básicas siguiendo la convención del proyecto. Esto es obligatorio para hooks y utilidades.
- Si detectas errores o warnings en el código, sugiere la corrección siguiendo las mejores prácticas de TypeScript y React.
- Sugiere siempre agregar atributos de accesibilidad (`aria-label`, `role`, etc.) en componentes interactivos. Ejemplo:
	```tsx
	<button aria-label="Siguiente pregunta" className="...">Siguiente</button>
	```
- Si creas un nuevo componente visual, sugiere una estructura semántica y accesible.
- Si detectas código que puede optimizarse (por ejemplo, renderizados innecesarios o uso ineficiente de hooks), sugiere mejoras automáticas.
- Al crear un nuevo hook, utilidad o componente, agrega un comentario breve en inglés explicando su propósito y uso.

### Lista de atributos de accesibilidad recomendados
- `aria-label`
- `role`
- `aria-checked`, `aria-selected`, `aria-disabled`, etc.

### Ejemplo de commit correcto
```
feat(question): add QuestionCard component with Spanish UI text

- Add QuestionCard to src/components
- UI labels in Spanish, code in English
```

### Ejemplo de commit incorrecto
```
add componente tarjetaPregunta

- Código y texto en español
```

# Reglas para commits
- Todos los commits deben estar en inglés, ser claros y estructurados.
- Usa saltos de línea reales (no \n) para separar secciones.
- Prefiere mensajes concisos pero informativos: incluye tipo de cambio, resumen, breaking change si aplica y archivos afectados si es relevante.
- Ejemplo recomendado:
	refactor(flashcards): rename StudyFlashCardsHeader to FlashCardsHeader
  
	- Rename component, props, imports, and exports for clarity
	- No logic changes, only naming updates
  
	BREAKING CHANGE: Use FlashCardsHeader instead of StudyFlashCardsHeader

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


# Copilot Custom Rule: UI Language

- All visible texts (labels, messages, errors, placeholders, UI strings) in the SPA must be in Spanish.
- Only use English for code comments, variable names, function names, and internal logic.
- If you detect any visible text in English in the UI, automatically translate it to Spanish when making changes.
- Never introduce new UI text in English.
- If you find English UI text in a file you are editing, refactor it to Spanish as part of your change.
- This rule applies to all React components, pages, and any user-facing string.

---

## Validación automática de textos de UI

Se recomienda usar linters personalizados o scripts para detectar textos en inglés en la UI antes de hacer commit.
