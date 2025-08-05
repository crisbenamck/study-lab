# Caso de Uso: Sistema de Estudio de Preguntas - Implementación Optimizada

## Descripción General

Se requiere implementar un módulo completo de estudio de preguntas que se integre perfectamente con la arquitectura existente de la SPA, utilizando las preguntas almacenadas en localStorage y siguiendo los patrones de diseño ya establecidos.

## 1. Integración con Navegación Existente

### 1.1 Modificación del Header Actual
- **Nuevo item en el dropdown "Gestor de Preguntas"**: Agregar "Estudiar Preguntas" como cuarta opción
- **Badge de progreso**: Mostrar indicador visual del progreso de estudio (ej: "5/20 estudiadas hoy")
- **Reutilización del sistema de badges**: Aprovechar el badge existente que muestra `questions.length`

### 1.2 Nueva Ruta de Navegación
```typescript
// En App.tsx agregar nueva ruta
<Route path="/study" element={<StudyPage />} />
<Route path="/study/test" element={<TestPage />} />
<Route path="/study/results" element={<StudyResultsPage />} />
<Route path="/study/analytics" element={<StudyAnalyticsPage />} />
```

## 2. Arquitectura de Datos Optimizada

### 2.1 Extensión de Tipos Existentes
```typescript
// Nuevo archivo: src/types/StudySession.ts
export interface StudySessionConfig {
  mode: 'flashcards' | 'test';
  scope: 'all' | 'range' | 'random';
  rangeStart?: number;
  rangeEnd?: number;
  randomCount?: number;
  showAnswersMode: 'immediate' | 'end';
  timeLimit?: number; // en minutos
}

export interface StudySessionQuestion {
  questionId: number; // question_number de la pregunta original
  answered: boolean;
  selectedOptions: string[]; // option_letters seleccionadas
  isCorrect?: boolean;
  timeSpent: number; // en segundos
  markedForReview: boolean;
  skipped: boolean;
}

export interface StudySession {
  id: string; // UUID
  startTime: Date;
  endTime?: Date;
  config: StudySessionConfig;
  questions: StudySessionQuestion[];
  totalQuestions: number;
  correctAnswers: number;
  status: 'in-progress' | 'completed' | 'abandoned';
}

// Nuevo archivo: src/types/StudyAnalytics.ts
export interface QuestionStats {
  questionId: number;
  timesStudied: number;
  timesCorrect: number;
  averageTimeSpent: number;
  lastStudied: Date;
  difficultyScore: number; // 0-1, basado en % de aciertos
}

export interface StudyAnalytics {
  totalSessions: number;
  totalTimeStudied: number; // en minutos
  averageScore: number;
  questionsStats: Record<number, QuestionStats>;
  dailyProgress: Record<string, number>; // fecha -> sesiones completadas
  weakestQuestions: number[]; // question_numbers ordenados por dificultad
  strongestQuestions: number[];
}
```

### 2.2 Hook de Gestión de Estudios
```typescript
// src/hooks/useStudyStorage.ts - Nuevo hook especializado
export const useStudyStorage = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [analytics, setAnalytics] = useState<StudyAnalytics | null>(null);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  
  // Métodos para gestionar sesiones y analytics
  // Integración con localStorage usando claves separadas
  const STUDY_SESSIONS_KEY = 'study-lab-sessions';
  const STUDY_ANALYTICS_KEY = 'study-lab-analytics';
}
```

## 3. Páginas y Componentes Específicos

### 3.1 StudyPage.tsx - Página Principal
**Ubicación**: `src/pages/StudyPage.tsx`
**Funcionalidad**:
- Selector de modalidad (Flash Cards vs Test)
- Configuración de alcance usando componentes de formulario existentes
- Reutilización del estilo de cards y botones actuales
- Integración con el hook `useLocalStorage` para obtener questions

### 3.2 Componentes Reutilizables Optimizados
```typescript
// src/components/study/StudyModeSelector.tsx
// Reutiliza el estilo de los cards existentes en la aplicación

// src/components/study/QuestionCard.tsx  
// Extiende el diseño de las cards de preguntas existentes

// src/components/study/StudyProgressBar.tsx
// Consistente con el diseño de progress indicators
```

### 3.3 Integración con Sistema de Modales
- **Reutilizar AlertModal**: Para confirmaciones de finalización de sesión
- **Reutilizar ConfirmModal**: Para abandonar sesiones en progreso
- **Nuevo StudyResultsModal**: Siguiendo el patrón de Modal.tsx existente

## 4. Flujo de Usuario Optimizado

### 4.1 Configuración de Sesión de Estudio
1. **Validación de preguntas disponibles**: Usar `questions.length` del hook existente
2. **Selector de modalidad**: Flash Cards o Test con radio buttons estilizados
3. **Configuración de alcance**: 
   - Todo: `questions.length` preguntas
   - Rango: Input con validación contra números disponibles
   - Aleatorio: Máximo 60 o `questions.length` si es menor

### 4.2 Sesión de Flash Cards
- **Navegación**: Botones Previous/Next reutilizando estilos de navegación
- **Flip animation**: CSS transitions suaves
- **Progreso**: Barra de progreso integrada con el diseño actual

### 4.3 Sesión de Test
- **Una pregunta por vista**: Layout limpio y enfocado
- **Opciones**: Checkboxes/radio buttons según `requires_multiple_answers`
- **Navegación**: Previous/Next con validación de respuestas
- **Indicadores**: Estado visual de pregunta (respondida/marcada/omitida)

## 5. Sistema de Persistencia Integrado

### 5.1 Extensión del localStorage Actual
```typescript
// Nuevas claves para mantener separación de datos
const STUDY_SESSIONS_KEY = 'study-lab-sessions';
const STUDY_ANALYTICS_KEY = 'study-lab-analytics';
const STUDY_PROGRESS_KEY = 'study-lab-daily-progress';

// Mantener compatibilidad con:
const STORAGE_KEY = 'question-generator-questions'; // Existente
const INITIAL_NUMBER_KEY = 'question-generator-initial-number'; // Existente
```

### 5.2 Sincronización de Datos
- **Auto-save**: Guardar progreso cada 30 segundos durante sesiones activas
- **Recovery**: Recuperar sesiones interrumpidas al recargar página
- **Analytics update**: Actualizar estadísticas al completar cada sesión

## 6. Dashboard de Análisis Simplificado

### 6.1 Visualizaciones con Librerías Ligeras
- **Chart.js o Recharts**: Para gráficos simples y responsivos
- **Métricas clave**:
  - Preguntas más falladas (top 10)
  - Progreso semanal/mensual
  - Tiempo promedio por pregunta
  - Racha de días estudiando

### 6.2 Integración con Diseño Existente
- **Cards de estadísticas**: Misma estructura que HomePage
- **Botones de acción**: Estilo consistente con botones existentes
- **Paleta de colores**: Mantener theme actual (azul nocturno)

## 7. Implementación por Fases

### 7.1 Fase 1 (MVP) - 2-3 días
**Prioridad Alta**:
- [ ] Crear tipos básicos (StudySession, StudySessionConfig)
- [ ] Implementar StudyPage con selector de modalidad
- [ ] Flash Cards básicas sin animaciones
- [ ] Test simple con navegación básica
- [ ] Hook useStudyStorage básico
- [ ] Integración con Header existente

### 7.2 Fase 2 (Core Features) - 3-4 días
**Prioridad Media**:
- [ ] Página de resultados con métricas básicas
- [ ] Sistema de persistencia completo
- [ ] Animaciones y transiciones
- [ ] Validaciones y manejo de errores
- [ ] Responsive design completo

### 7.3 Fase 3 (Analytics) - 2-3 días
**Prioridad Baja**:
- [ ] Dashboard de análisis básico
- [ ] Gráficos simples
- [ ] Filtros básicos
- [ ] Exportación de datos

### 7.4 Fase 4 (Enhancements) - Futuro
**Opcional**:
- [ ] Gamificación básica
- [ ] Modo cronometrado
- [ ] Temas personalizables
- [ ] PWA capabilities

## 8. Consideraciones Técnicas Específicas

### 8.1 Reutilización de Código Existente
```typescript
// Hooks existentes a reutilizar:
import { useLocalStorage } from '../hooks/useLocalStorage'; // Para questions
import { useAlert } from '../hooks/useAlert'; // Para notificaciones
import { useConfirm } from '../hooks/useConfirm'; // Para confirmaciones
import { useAppState } from '../hooks/useAppState'; // Para estado global

// Componentes existentes a reutilizar:
import AlertModal from '../components/AlertModal';
import ConfirmModal from '../components/ConfirmModal';
import Header from '../components/Header';
```

### 8.2 Estructura de Archivos Final
```
src/
├── pages/
│   ├── StudyPage.tsx              # Página principal de estudio
│   ├── StudyTestPage.tsx          # Página de test en progreso  
│   ├── StudyResultsPage.tsx       # Resultados de sesión
│   └── StudyAnalyticsPage.tsx     # Dashboard de análisis
├── components/study/
│   ├── StudyModeSelector.tsx      # Selector Flash Cards vs Test
│   ├── StudyConfigForm.tsx        # Configuración de sesión
│   ├── FlashCard.tsx              # Componente de tarjeta
│   ├── TestQuestion.tsx           # Pregunta en modo test
│   ├── StudyProgress.tsx          # Barra de progreso
│   ├── StudyNavigation.tsx        # Navegación entre preguntas
│   ├── StudyResults.tsx           # Resumen de resultados
│   └── StudyStats.tsx             # Estadísticas básicas
├── hooks/
│   ├── useStudyStorage.ts         # Gestión de sesiones y analytics
│   ├── useStudySession.ts         # Manejo de sesión activa
│   └── useStudyAnalytics.ts       # Cálculos de estadísticas
└── types/
    ├── StudySession.ts            # Tipos para sesiones
    ├── StudyAnalytics.ts          # Tipos para análisis
    └── StudyConfig.ts             # Tipos para configuración
```

### 8.3 Integración con Sistema de Routing
```typescript
// En App.tsx, agregar después de las rutas existentes:
<Route path="/study" element={<StudyPage />} />
<Route path="/study/test" element={<StudyTestPage />} />
<Route path="/study/results/:sessionId" element={<StudyResultsPage />} />
<Route path="/study/analytics" element={<StudyAnalyticsPage />} />
```

## 9. Criterios de Aceptación

### 9.1 Funcionalidad Básica
- [ ] Usuario puede acceder a "Estudiar" desde el menú Gestor de Preguntas
- [ ] Selección entre Flash Cards y Test funciona correctamente
- [ ] Flash Cards muestran pregunta/respuestas y permiten navegación
- [ ] Test permite responder preguntas y navegar con Previous/Next
- [ ] Resultados muestran % de aciertos y resumen de preguntas
- [ ] Datos se persisten correctamente en localStorage

### 9.2 Integración con Sistema Existente
- [ ] Mantiene estilo visual consistente con la aplicación
- [ ] Reutiliza componentes existentes donde es apropiado
- [ ] No afecta funcionalidad existente de gestión de preguntas
- [ ] Header se actualiza correctamente con nueva opción
- [ ] Responsive en móvil, tablet y desktop

### 9.3 Rendimiento y UX
- [ ] Carga rápida sin afectar rendimiento general
- [ ] Transiciones suaves entre estados
- [ ] Manejo apropiado de errores y casos edge
- [ ] Funciona correctamente con diferentes cantidades de preguntas (1-1000+)
- [ ] Interfaz intuitiva sin necesidad de tutoriales

## 10. Análisis de Impacto y Recomendaciones

### 10.1 Ventajas de Esta Implementación
- **Mínimo impacto**: Reutiliza al máximo la arquitectura existente
- **Mantenibilidad**: Sigue patrones ya establecidos en la aplicación
- **Escalabilidad**: Diseño modular que permite agregar funcionalidades gradualmente
- **Consistencia**: Mantiene la experiencia de usuario actual
- **Performance**: No introduce dependencias pesadas innecesarias

### 10.2 Consideraciones de Desarrollo
- **Testing**: Aprovechar la estructura de testing existente si la hay
- **TypeScript**: Mantener tipado fuerte siguiendo los patrones actuales
- **CSS**: Reutilizar las clases Tailwind ya definidas para consistencia
- **Accessibility**: Seguir los estándares ya implementados en la aplicación

### 10.3 Mejoras Específicas al Caso de Uso Original
- **Simplificación de la navegación**: Una sola entrada desde el menú existente
- **Reutilización inteligente**: Aprovecha badges, modales y hooks ya creados
- **Fases de implementación realistas**: Basadas en la complejidad actual del proyecto
- **Tipos optimizados**: Extienden los tipos existentes sin duplicar funcionalidad
- **LocalStorage integration**: Usa el mismo patrón que el sistema de preguntas actual

Este caso de uso optimizado está diseñado específicamente para integrarse perfectamente con la arquitectura existente de tu SPA, reutilizando componentes, hooks y patrones ya establecidos, mientras minimiza la complejidad y maximiza la reutilización de código.
