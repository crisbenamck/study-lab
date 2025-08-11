# Copilot Custom Rule: UI Language

- All visible texts (labels, messages, errors, placeholders, UI strings) in the SPA must be in Spanish.
- Only use English for code comments, variable names, function names, and internal logic.
- If you detect any visible text in English in the UI, automatically translate it to Spanish when making changes.
- Never introduce new UI text in English.
- If you find English UI text in a file you are editing, refactor it to Spanish as part of your change.
- This rule applies to all React components, pages, and any user-facing string.
