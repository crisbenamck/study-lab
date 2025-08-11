// Utilidad para obtener el texto de alcance de la sesión (scope)
export function getScopeText(config: { scope: string; rangeStart?: number; rangeEnd?: number; randomCount?: number }) {
  switch (config.scope) {
    case 'all':
      return 'Todas las preguntas';
    case 'range':
      return `Preguntas ${config.rangeStart} - ${config.rangeEnd}`;
    case 'random':
      return `${config.randomCount} preguntas aleatorias`;
    default:
      return '';
  }
}
