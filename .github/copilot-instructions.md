# Generador de Preguntas - React SPA

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
Este es un proyecto de una Single Page Application (SPA) construida con React, TypeScript y CSS vanilla para crear y gestionar preguntas de examen con múltiples opciones.

## Key Features
- Formulario para crear preguntas con múltiples opciones
- Soporte para respuestas múltiples
- Persistencia automática en localStorage
- Exportación a formato JSON
- Numeración secuencial de preguntas (0001, 0002, etc.)
- Campo obligatorio de link de referencia
- Interfaz limpia y minimalista con CSS vanilla
- Local storage persistence
- JSON export functionality
- Modern, minimalist UI with Tailwind CSS
- TypeScript for type safety
- React Hook Form for form management

## Code Style Guidelines
- Use TypeScript for all components and utilities
- Use functional components with hooks
- Import types with `import type` syntax
- Use Tailwind CSS for all styling
- Follow React best practices for state management
- Use meaningful variable and function names in Spanish when appropriate for user-facing content

## File Structure
- `/src/types/` - TypeScript type definitions
- `/src/components/` - React components
- `/src/hooks/` - Custom React hooks
- `/src/utils/` - Utility functions
- Use PascalCase for component files
- Use camelCase for utility files and hooks

## State Management
- Use localStorage for data persistence
- Custom hook `useLocalStorage` handles all storage operations
- Questions are automatically saved when modified
- Question numbers start from 1 and are formatted as 0001, 0002, etc.

## Form Handling
- Use React Hook Form for all forms
- Validate required fields
- Handle dynamic option arrays
- Reset form after successful submission
