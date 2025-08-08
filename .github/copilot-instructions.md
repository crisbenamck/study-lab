## Additional Copilot Instructions

- All answers and explanations provided to the user must be in Spanish.
- Any action that requires using the terminal (such as deleting files) must be actually executed, not just described.

## Copilot Custom Rules

- All code, components, variable names, and comments must be written in English.
- Do not use Spanish or any other language for code, comments, or documentation.
- If you find any existing code in Spanish, prefer to refactor it to English when making changes.
- Use clear, descriptive English names for all new files, functions, and variables.
- This applies to all future code, documentation, and communication in this project.
# Question Generator - React SPA

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Single Page Application (SPA) built with React, TypeScript, and vanilla CSS to create and manage exam questions with multiple options.

## Key Features
- Form to create questions with multiple options
- Support for multiple answers
- Automatic persistence in localStorage
- Export to JSON format
- Sequential numbering of questions (0001, 0002, etc.)
- Required reference link field
- Clean and minimalist interface with vanilla CSS
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
- Use meaningful variable and function names in English for user-facing content

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
