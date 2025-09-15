# 🌙 Plan Detallado para Implementación de Modo Oscuro en Study Lab

## 📊 Análisis del Estado Actual

### 🔍 Situación Detectada

**✅ Elementos ya preparados:**
- Hook `useTheme` existente en `src/hooks/useTheme.ts` (parcialmente implementado)
- Componente `ThemeToggle` en `src/components/Header/ThemeToggle.tsx` (sin funcionalidad real)
- Configuración básica de Tailwind con paleta de colores personalizada
- Estructura de componentes modular bien organizada
- Algunos componentes ya usan variables CSS parcialmente (StudyResultsPage, EmptyQuestionsState)

**❌ Problemáticas identificadas:**
1. **Colores hardcodeados:** Más de 100+ instancias de colores directos (bg-white, text-gray-900, etc.)
2. **Sin sistema de variables CSS:** No hay custom properties para temas
3. **ThemeToggle desconectado:** El toggle no afecta realmente los estilos
4. **Iconos SVG sin preparar:** Muchos iconos tienen colores fijos
5. **Sin contraste verificado:** No hay validación de accesibilidad WCAG AAA
6. **Estilos inline críticos:** Components como Button.tsx y Modal.tsx usan estilos JS inline
7. **Gradientes hardcodeados:** bg-gradient-to-r sin variables para modo oscuro
8. **Backdrop blur sin adaptación:** backdrop-blur-md necesita adaptación para temas
9. **Transiciones incompletas:** Faltan transiciones suaves entre temas

### 📁 Archivos que necesitan migración (estimado):

- **11 páginas** en `src/pages/*.tsx`
- **108 componentes** en `src/components/**/*.tsx` 
- **60+ iconos** en `src/icons/*.tsx`
- **1 archivo** de configuración principal: `tailwind.config.js`
- **1 archivo** de estilos base: `src/styles/index.css`
- **1 archivo** principal: `src/App.tsx` (para integrar el sistema de temas)

---

## ⚠️ ELEMENTOS CRÍTICOS DETECTADOS QUE REQUIEREN ATENCIÓN ESPECIAL

### 🚨 1. Componentes con Estilos Inline Complejos
- **`src/components/common/Button.tsx`** - 300+ líneas con estilos JS inline
- **`src/components/Modal.tsx`** - Estilos dinámicos inline para efectos hover
- **`src/pages/StudyResultsPage.tsx`** - Mezcla estilos inline y variables CSS

### 🚨 2. Gradientes y Efectos Visuales
- **IconPreviewPage:** `bg-gradient-to-r from-blue-50 to-purple-50`
- **StudyResultsPage:** Múltiples gradientes para estados de resultados
- **EmptyQuestionsState:** `bg-gradient-to-br from-yellow-100 to-yellow-200`

### 🚨 3. Efectos de Backdrop y Blur
- **Header/index.tsx:** `bg-white/80 backdrop-blur-md`
- **Header.tsx:** `bg-gray-50/90 backdrop-blur-md`  
- **Tooltip.tsx:** `backdrop-blur-sm`

### 🚨 4. Opacidades y Transiciones
- **ThemeToggle:** Múltiples estados con opacity-0/100
- **QuestionManagerDropdown:** `opacity-0 invisible group-hover:opacity-100`
- **Iconos:** opacity-25, opacity-75 para estados de loading

---

## 🤖 VIABILIDAD DE IMPLEMENTACIÓN CON GITHUB COPILOT

### ✅ **TAREAS VIABLES CON COPILOT (Una sola sesión)**

#### 🟢 **ALTAMENTE VIABLES** (80-100% automático)
1. **Configuración inicial** - tailwind.config.js, src/styles/index.css
2. **Hook useTheme mejorado** - Lógica de persistencia y sistema
3. **Componentes simples** - Layout, Header básico, páginas con pocos colores
4. **Iconos SVG** - Conversión masiva a currentColor
5. **Variables CSS** - Creación del sistema de tokens de color

#### 🟡 **MODERADAMENTE VIABLES** (50-80% automático)
1. **Componentes comunes** - QuestionForm, ProgressBar, Tooltip
2. **Páginas principales** - HomePage, StudyPage (requieren revisión manual)
3. **Testing básico** - Pruebas de contraste y funcionalidad

#### 🔴 **LIMITADAMENTE VIABLES** (20-50% automático) 
1. **Button.tsx** - 300+ líneas de estilos inline complejos
2. **Modal.tsx** - Lógica de estilos dinámicos inline 
3. **StudyResultsPage.tsx** - Mezcla de estilos inline y variables CSS
4. **Componentes con gradientes** - Requieren diseño manual de colores

### ⚠️ **LIMITACIONES DE GITHUB COPILOT IDENTIFICADAS**

#### 🚨 **Limitaciones de Contexto**
- **Límite de tokens:** ~20-30 archivos simultáneos máximo
- **Pérdida de contexto:** Entre sesiones largas (>2 horas)
- **Archivos grandes:** Button.tsx (400+ líneas) requerirá sesiones múltiples

#### 🚨 **Limitaciones de Diseño**
- **Paleta de colores:** Copilot no puede validar contraste WCAG AAA automáticamente
- **Coherencia visual:** Requiere decisiones de diseño humanas
- **Testing visual:** No puede probar apariencia real

#### 🚨 **Limitaciones Técnicas**  
- **Estilos inline complejos:** Requiere refactorización manual
- **Estados dinámicos:** hover, focus states necesitan validación humana
- **Cross-browser testing:** Copilot no puede probar compatibilidad

---

## 📋 GUÍA PARA MÚLTIPLES SESIONES DE CHAT

### 🎯 **ESTRATEGIA DE SESIONES**

#### **SESIÓN 1: Fundación (2-3 horas)**
**Objetivo:** Establecer infraestructura base
**Archivos a procesar:** 5-8 archivos base
```
1. tailwind.config.js
2. src/styles/index.css  
3. src/hooks/useTheme.ts
4. src/components/Header/ThemeToggle.tsx
5. src/components/Layout.tsx
6. src/components/Header/index.tsx
7. src/App.tsx (integración del sistema)
```

#### **SESIÓN 2: Componentes Core (2-3 horas)**
**Objetivo:** Migrar componentes críticos
**Archivos a procesar:** 8-10 archivos críticos
```
1. src/components/common/Button.tsx (CRÍTICO - requiere atención especial)
2. src/components/Modal.tsx (CRÍTICO - estilos inline)
3. src/components/common/Tooltip.tsx
4. src/components/common/ProgressBar.tsx
5. src/components/common/AlertModal.tsx
6. src/components/common/ConfirmModal.tsx
7. src/components/Pagination.tsx
8. src/components/QuestionList.tsx
```

#### **SESIÓN 3: Páginas Principales (2-3 horas)**
**Objetivo:** Migrar páginas con más tráfico
**Archivos a procesar:** 5-6 páginas principales
```
1. src/pages/HomePage.tsx (CRÍTICO - página principal)
2. src/pages/StudyPage.tsx
3. src/pages/StudyFlashCardsPage.tsx
4. src/pages/StudyExamPage.tsx
5. src/pages/ViewQuestionsPage.tsx
```

#### **SESIÓN 4: Componentes Específicos (2-3 horas)**
**Objetivo:** Migrar componentes de funcionalidades específicas
**Archivos a procesar:** 10-15 archivos por carpeta
```
1. src/components/study/* (8 archivos)
2. src/components/flashcards/* (3 archivos)  
3. src/components/exam/* (3 archivos)
4. src/pages/StudyResultsPage.tsx (ESPECIAL - estilos inline complejos)
```

#### **SESIÓN 5: Iconos y Finalización (1-2 horas)**
**Objetivo:** Migrar iconos y testing final
**Archivos a procesar:** 20-30 iconos SVG
```
1. Iconos críticos: CheckMarkIcon, SunIcon, MoonIcon
2. Iconos principales: ArrowLeft, ArrowRight, CheckIcon, etc.
3. Testing completo de contraste
4. Validación visual en navegador
```

### 🔄 **PROTOCOLO DE CONTINUIDAD ENTRE SESIONES**

#### **Al INICIAR cada nueva sesión:**

1. **Verificar estado actual:**
```bash
# Comando para verificar archivos ya migrados
git status
git log --oneline -10
```

2. **Revisar lista de archivos pendientes:**
   - Consultar este documento: sección correspondiente a la sesión
   - Verificar archivos ya completados vs pendientes

3. **Establecer contexto rápido:**
```
"Continuando implementación modo oscuro para Study Lab. 
Estoy en la SESIÓN X (especificar). 
Los archivos ya migrados son: [listar archivos completados]
Necesito continuar con: [listar archivos de la sesión actual]"
```

#### **Al FINALIZAR cada sesión:**

1. **Documentar progreso:**
```
Crear commit descriptivo:
git add .
git commit -m "feat(dark-mode): complete session X - [descripción específica]

- Migrated: [lista de archivos completados]
- Updated: [cambios principales]  
- Remaining: [archivos pendientes para próxima sesión]"
```

2. **Actualizar este documento:**
   - Marcar archivos completados con ✅
   - Anotar problemas encontrados 
   - Agregar notas para la siguiente sesión

#### **CHECKPOINTS DE VALIDACIÓN:**

**Después de cada sesión, verificar:**
- [ ] Toggle de tema funciona sin errores de consola
- [ ] No hay colores hardcodeados en archivos migrados
- [ ] Los estilos se ven consistentes en modo claro
- [ ] Los componentes migrados responden al cambio de tema

---

### 🛠️ **INSTRUCCIONES ESPECÍFICAS PARA COPILOT**

#### **Para Button.tsx (ARCHIVO CRÍTICO):**
```
"El archivo Button.tsx tiene 300+ líneas con estilos inline complejos. 
Necesito migrar gradualmente:
1. Primero, extraer todos los colores hardcodeados a variables CSS
2. Segundo, mantener la lógica de estilos dinámicos pero usando variables
3. Tercero, asegurar que todos los estados (hover, focus, disabled) funcionen en ambos temas"
```

#### **Para Modal.tsx (ARCHIVO CRÍTICO):**
```
"Modal.tsx usa estilos inline dinámicos para efectos hover.
Necesito:
1. Convertir todos los colores inline a variables CSS
2. Mantener los efectos hover pero adaptados para modo oscuro
3. Asegurar que el overlay y backdrop funcionen en ambos temas"
```

#### **Para páginas con gradientes:**
```
"Esta página usa gradientes hardcodeados (bg-gradient-to-r).
Necesito:
1. Crear variables CSS para gradientes que funcionen en ambos temas
2. Adaptar todos los bg-gradient-* existentes
3. Asegurar que los colores de gradiente tengan contraste AAA"
```

#### **Para testing de contraste:**
```
"Después de migrar, necesito validar que todos los colores cumplan WCAG AAA.
Por favor, liste todos los pares texto/fondo para que yo pueda verificar manualmente con herramientas de contraste."
```

---

## 🔧 ELEMENTOS ADICIONALES IDENTIFICADOS QUE FALTAN EN EL PLAN ORIGINAL

### 🚨 **COMPONENTES CRÍTICOS NO CONSIDERADOS INICIALMENTE**

#### **1. Context Providers y Hooks Adicionales**
- **`src/App.tsx`** - Necesita integrar el useTheme en el contexto principal
- **Hooks de estado** - useAppState, useAlert, useConfirm pueden necesitar adaptaciones
- **Context de temas** - Posible necesidad de crear ThemeContext para mejor gestión

#### **2. Efectos Visuales Complejos**  
- **Animaciones CSS** - FlashCard 3D (rotate-y-180, backface-hidden)
- **Transform effects** - hover:-translate-y-0.5, scale-105
- **Backdrop filters** - backdrop-blur-md, backdrop-blur-sm  
- **Box shadows dinámicos** - Sombras que cambian según tema

#### **3. Estados de Loading y Progreso**
- **LoadingIcon.tsx** - opacity-25, opacity-75 para animaciones
- **ProgressBar** - Barras de progreso con colores dinámicos
- **RetryProgressIndicator** - Indicadores de progreso con estilos inline
- **Estados de carga** - Spinners y skeletons necesitan adaptación

#### **4. Elementos de Formulario No Considerados**
- **Focus states** - Estados de foco necesitan adaptación para modo oscuro
- **Form validation** - Estados de error/éxito en formularios
- **Placeholder text** - Color de placeholders necesita adaptación
- **Select/dropdown states** - Estados activos y hover de dropdowns

#### **5. Efectos de Overlay y Modal**
- **Overlay backgrounds** - bg-black bg-opacity-50 necesita variables
- **Modal backdrops** - Diferentes opacidades para diferentes modales  
- **Toast notifications** - Si existen, necesitan adaptación
- **Dropdown menus** - QuestionManagerDropdown con efectos complejos

### 🛠️ **HERRAMIENTAS Y UTILIDADES FALTANTES**

#### **1. Herramientas de Desarrollo**
- **Storybook setup** - Para testing visual de componentes (opcional)
- **CSS custom properties fallbacks** - Para navegadores older
- **Theme preview tool** - Herramienta para previsualizar cambios
- **Contrast checker integration** - Script para validar contraste automáticamente

#### **2. Scripts de Migración**
- **Color scanner script** - Script para encontrar colores hardcodeados automáticamente
- **CSS variable generator** - Generar variables CSS desde colores existentes
- **Theme switcher testing** - Script para probar todos los componentes automáticamente

#### **3. Documentación Adicional**
- **Theme design system** - Documentar el sistema de colores  
- **Component migration guide** - Guía para futuros componentes
- **Accessibility checklist** - Lista específica para cada componente
- **Browser compatibility matrix** - Qué navegadores soportan qué features

### 📱 **RESPONSIVE Y MOBILE CONSIDERATIONS**

#### **1. Media Queries y Responsive**
- **Mobile-first dark mode** - Diferentes comportamientos en móvil
- **Touch states** - Estados táctiles para dispositivos móviles
- **System theme detection** - Mejor integración con preferencias del sistema
- **Reduced motion** - Respeto por prefers-reduced-motion

#### **2. Performance Considerations**
- **CSS-in-JS optimization** - Optimizar estilos inline para performance
- **Variable CSS inheritance** - Optimizar herencia de variables CSS
- **Theme switching performance** - Minimizar reflow/repaint en cambio de tema
- **Bundle size impact** - Impacto en el tamaño del bundle

---

## ⚡ PLAN DE IMPLEMENTACIÓN REVISADO Y MEJORADO

### 🎯 **FASE 0: Pre-implementación (NUEVA - 1 hora)**
**Objetivo:** Preparar herramientas y validar requisitos antes de empezar

#### **Tareas críticas:**
1. **Crear script de color scanner:**
```bash
# Script para encontrar todos los colores hardcodeados
grep -r "bg-\|text-\|border-" src/ --include="*.tsx" --include="*.ts" > colors-audit.txt
```

2. **Backup y testing:**
```bash
# Crear backup del estado actual
git checkout -b backup-before-dark-mode
git checkout feature/dark-mode-implementation
```

3. **Instalar herramientas de contraste:**
   - Extensión axe DevTools
   - Color Contrast Checker web tool
   - Lighthouse accessibility testing

4. **Validar que el servidor funciona correctamente:**
   - Probar que la aplicación carga sin errores
   - Verificar que no hay warnings críticos en consola

### 🎯 **FASE 1 MEJORADA: Fundación (2-3 horas)**
**CAMBIOS:** + Integración en App.tsx, + Scripts de validación

#### **Archivos a procesar:**
1. `tailwind.config.js` - Configuración completa con darkMode
2. `src/styles/index.css` - Sistema completo de variables CSS  
3. `src/hooks/useTheme.ts` - Hook mejorado con listeners del sistema
4. `src/components/Header/ThemeToggle.tsx` - Conectar con useTheme real
5. `src/components/Layout.tsx` - Integrar sistema de temas
6. `src/components/Header/index.tsx` - Adaptar efectos backdrop
7. **`src/App.tsx`** - **NUEVO:** Integrar ThemeProvider/contexto

#### **Validación adicional:**
- [ ] Script de color scanner no debe encontrar colores hardcodeados en archivos migrados
- [ ] Toggle funciona con transiciones suaves (< 300ms)
- [ ] Persistencia en localStorage funciona correctamente  
- [ ] Detección de preferencia del sistema funciona

### 🎯 **FASE 2 MEJORADA: Componentes Core (3-4 horas)**
**CAMBIOS:** + Separar Button.tsx en sesión específica por complejidad

#### **Archivos a procesar (sin Button.tsx):**
1. `src/components/Modal.tsx` - CRÍTICO: estilos inline dinámicos
2. `src/components/common/Tooltip.tsx` - backdrop-blur effects
3. `src/components/common/ProgressBar.tsx` - colores dinámicos
4. `src/components/common/AlertModal.tsx` - estados semánticos
5. `src/components/common/ConfirmModal.tsx` - estados semánticos
6. `src/components/Pagination.tsx` - estados activos
7. `src/components/QuestionList.tsx` - elementos de lista

#### **SESIÓN ESPECIAL: Button.tsx (1-2 horas dedicadas)**
**Objetivo:** Migrar el componente más complejo por separado
- Requiere atención individual por sus 300+ líneas
- Estilos inline complejos con múltiples variantes
- Estados dinámicos (hover, focus, disabled, loading)
- Múltiples tipos (solid, outline, ghost)

### 🎯 **FASE 3 EXPANDIDA: Páginas y Estados (3-4 horas)**
**CAMBIOS:** + Incluir páginas con efectos especiales

#### **Páginas principales:**
1. `src/pages/HomePage.tsx` - CRÍTICO: gradientes y efectos
2. `src/pages/StudyPage.tsx` - componentes de estudio
3. `src/pages/StudyFlashCardsPage.tsx` - animaciones 3D
4. `src/pages/StudyExamPage.tsx` - estados de examen
5. `src/pages/ViewQuestionsPage.tsx` - listas y filtros
6. **`src/pages/StudyResultsPage.tsx`** - **ESPECIAL:** estilos inline complejos

#### **Estados y efectos especiales:**
- Gradientes dinámicos para diferentes estados
- Animaciones de transición entre páginas
- Estados de loading y progreso
- Efectos de hover y focus

### 🎯 **FASE 4 AMPLIADA: Componentes Específicos + Iconos (3-4 horas)**
**CAMBIOS:** + Incluir componentes de formulario y efectos

#### **Componentes por funcionalidad:**
1. `src/components/study/*` - (8 archivos) componentes de estudio
2. `src/components/flashcards/*` - (3 archivos) + animaciones CSS  
3. `src/components/exam/*` - (3 archivos) componentes de examen
4. `src/components/importPDF/*` - componentes de importación
5. `src/components/geminiTestAPI/*` - componentes de API
6. `src/components/viewQuestions/*` - componentes de visualización

#### **Iconos SVG (30+ archivos):**
- **Críticos:** CheckMarkIcon (colores fijos), SunIcon, MoonIcon
- **Principales:** Arrow*, Check*, Close*, Edit*, etc.
- **Secundarios:** Resto de iconos con currentColor

### 🎯 **FASE 5 NUEVA: Testing y Optimización (2-3 horas)**
**Objetivo:** Validación completa y optimizaciones finales

#### **Testing exhaustivo:**
1. **Contraste WCAG AAA:** Validar todos los pares texto/fondo
2. **Funcionalidad:** Probar todas las páginas y componentes
3. **Performance:** Medir impacto en tiempo de carga
4. **Cross-browser:** Probar en Chrome, Firefox, Safari
5. **Mobile testing:** Probar responsive en diferentes dispositivos

#### **Optimizaciones:**
1. **CSS optimization:** Eliminar variables CSS no utilizadas
2. **Bundle analysis:** Verificar impacto en tamaño del bundle
3. **Animation performance:** Optimizar transiciones para 60fps
4. **Accessibility final:** Validar con screen readers

#### **Documentación:**
1. **Design system documentation:** Documentar el sistema de colores
2. **Component migration guide:** Guía para futuros desarrolladores
3. **Troubleshooting guide:** Soluciones a problemas comunes

---

## 🎨 Fase 1: Diseño del Sistema de Colores

### 1.1 Paleta de Colores con Contraste AAA

#### 🌞 Modo Claro (Light Theme)
```css
:root {
  /* === BACKGROUNDS === */
  --bg-primary: #ffffff;          /* Fondo principal */
  --bg-secondary: #f8fafc;        /* Fondo secundario */
  --bg-tertiary: #f1f5f9;         /* Fondo terciario */
  --bg-elevated: #ffffff;         /* Superficies elevadas */
  --bg-input: #ffffff;            /* Campos de entrada */
  --bg-disabled: #f3f4f6;         /* Elementos deshabilitados */
  
  /* === TEXT COLORS === */
  --text-primary: #0f172a;        /* Texto principal (AAA) */
  --text-secondary: #334155;      /* Texto secundario (AAA) */
  --text-tertiary: #64748b;       /* Texto terciario (AA large) */
  --text-disabled: #94a3b8;       /* Texto deshabilitado */
  --text-inverse: #ffffff;        /* Texto sobre fondos oscuros */
  
  /* === BORDERS === */
  --border-primary: #e2e8f0;      /* Bordes principales */
  --border-secondary: #cbd5e1;    /* Bordes secundarios */
  --border-focus: #3b82f6;        /* Bordes de foco */
  --border-error: #ef4444;        /* Bordes de error */
  
  /* === SEMANTIC COLORS === */
  --color-primary: #3b82f6;       /* Color primario */
  --color-primary-hover: #2563eb; /* Primary hover */
  --color-success: #059669;       /* Verde éxito (AAA) */
  --color-success-bg: #d1fae5;    /* Fondo de éxito */
  --color-warning: #d97706;       /* Amarillo advertencia (AAA) */
  --color-warning-bg: #fef3c7;    /* Fondo de advertencia */
  --color-error: #dc2626;         /* Rojo error (AAA) */
  --color-error-bg: #fee2e2;      /* Fondo de error */
  --color-info: #0284c7;          /* Azul información (AAA) */
  --color-info-bg: #e0f2fe;       /* Fondo de información */
  
  /* === SHADOWS === */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  
  /* === OVERLAY === */
  --overlay: rgba(0, 0, 0, 0.5);   /* Para modales */
}
```

#### 🌙 Modo Oscuro (Dark Theme)
```css
[data-theme="dark"] {
  /* === BACKGROUNDS === */
  --bg-primary: #0f172a;          /* Fondo principal */
  --bg-secondary: #1e293b;        /* Fondo secundario */  
  --bg-tertiary: #334155;         /* Fondo terciario */
  --bg-elevated: #1e293b;         /* Superficies elevadas */
  --bg-input: #334155;            /* Campos de entrada */
  --bg-disabled: #475569;         /* Elementos deshabilitados */
  
  /* === TEXT COLORS === */
  --text-primary: #f8fafc;        /* Texto principal (AAA) */
  --text-secondary: #cbd5e1;      /* Texto secundario (AAA) */
  --text-tertiary: #94a3b8;       /* Texto terciario (AA large) */
  --text-disabled: #64748b;       /* Texto deshabilitado */
  --text-inverse: #0f172a;        /* Texto sobre fondos claros */
  
  /* === BORDERS === */
  --border-primary: #475569;      /* Bordes principales */
  --border-secondary: #64748b;    /* Bordes secundarios */
  --border-focus: #60a5fa;        /* Bordes de foco */
  --border-error: #f87171;        /* Bordes de error */
  
  /* === SEMANTIC COLORS === */
  --color-primary: #60a5fa;       /* Color primario */
  --color-primary-hover: #3b82f6; /* Primary hover */
  --color-success: #10b981;       /* Verde éxito (AAA) */
  --color-success-bg: #064e3b;    /* Fondo de éxito */
  --color-warning: #f59e0b;       /* Amarillo advertencia (AAA) */
  --color-warning-bg: #451a03;    /* Fondo de advertencia */
  --color-error: #f87171;         /* Rojo error (AAA) */
  --color-error-bg: #7f1d1d;      /* Fondo de error */
  --color-info: #38bdf8;          /* Azul información (AAA) */
  --color-info-bg: #0c4a6e;       /* Fondo de información */
  
  /* === SHADOWS === */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
  
  /* === OVERLAY === */
  --overlay: rgba(0, 0, 0, 0.8);   /* Para modales */
  
  /* === SCROLLBAR === */
  color-scheme: dark;
}
```

### 1.2 Clases Utilitarias Tailwind

```css
/* Clase personalizada para facilitar migración */
@layer utilities {
  /* Backgrounds */
  .bg-primary { background-color: var(--bg-primary); }
  .bg-secondary { background-color: var(--bg-secondary); }
  .bg-tertiary { background-color: var(--bg-tertiary); }
  .bg-elevated { background-color: var(--bg-elevated); }
  .bg-input { background-color: var(--bg-input); }
  
  /* Text Colors */
  .text-primary { color: var(--text-primary); }
  .text-secondary { color: var(--text-secondary); }
  .text-tertiary { color: var(--text-tertiary); }
  .text-disabled { color: var(--text-disabled); }
  .text-inverse { color: var(--text-inverse); }
  
  /* Borders */
  .border-primary { border-color: var(--border-primary); }
  .border-secondary { border-color: var(--border-secondary); }
  .border-focus { border-color: var(--border-focus); }
  
  /* Semantic Colors */
  .text-theme-success { color: var(--color-success); }
  .text-theme-warning { color: var(--color-warning); }
  .text-theme-error { color: var(--color-error); }
  .text-theme-info { color: var(--color-info); }
  
  .bg-theme-success { background-color: var(--color-success-bg); }
  .bg-theme-warning { background-color: var(--color-warning-bg); }
  .bg-theme-error { background-color: var(--color-error-bg); }
  .bg-theme-info { background-color: var(--color-info-bg); }
}
```

---

## 🔧 Fase 2: Configuración de Infraestructura

### 2.1 Actualizar `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'], // Soporte para data-theme
  theme: {
    extend: {
      colors: {
        // Mantener colores existentes para compatibilidad
        primary: { /* ... colores actuales ... */ },
        
        // Nuevos colores usando CSS variables
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'bg-elevated': 'var(--bg-elevated)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        // ... resto de variables
      },
      boxShadow: {
        'theme-sm': 'var(--shadow-sm)',
        'theme-md': 'var(--shadow-md)', 
        'theme-lg': 'var(--shadow-lg)',
        'theme-xl': 'var(--shadow-xl)',
      }
    },
  },
  plugins: [],
}
```

### 2.2 Actualizar `src/hooks/useTheme.ts`

```typescript
import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('study-lab-theme') as Theme;
    if (savedTheme) return savedTheme;
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  useEffect(() => {
    // Aplicar tema al document
    document.documentElement.setAttribute('data-theme', theme);
    
    // Actualizar color-scheme para scrollbar nativo
    document.body.style.colorScheme = theme;
    
    // Guardar en localStorage
    localStorage.setItem('study-lab-theme', theme);
    
    // Escuchar cambios del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('study-lab-theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return {
    theme,
    toggleTheme,
    setLightTheme: () => setTheme('light'),
    setDarkTheme: () => setTheme('dark'),
    isDark: theme === 'dark'
  };
};
```

---

## 📝 Fase 3: Migración de Componentes

### 3.1 Prioridad de Migración

#### 🔴 **CRÍTICOS** (Migrar primero)
1. `src/components/Layout.tsx` - Contenedor principal
2. `src/components/Header/index.tsx` - Header principal
3. `src/components/Header/ThemeToggle.tsx` - Toggle del tema
4. `src/components/common/Button.tsx` - Componente de botones
5. `src/components/Modal.tsx` - Modales

#### 🟡 **IMPORTANTES** (Migrar segundo)
6. `src/pages/HomePage.tsx` - Página principal
7. `src/components/common/` - Resto de componentes comunes
8. `src/components/study/` - Componentes de estudio  
9. `src/components/flashcards/` - Componentes de flashcards
10. `src/components/exam/` - Componentes de examen

#### 🟢 **OPCIONALES** (Migrar tercero)  
11. `src/pages/` - Resto de páginas
12. `src/components/viewQuestions/` - Visualización de preguntas
13. `src/components/importPDF/` - Importación PDF
14. `src/components/geminiTestAPI/` - Test de API

### 3.2 Patrón de Migración por Componente

**❌ Antes:**
```tsx
<div className="bg-white text-gray-900 border-gray-200">
  <h1 className="text-gray-800">Título</h1>
  <p className="text-gray-600">Descripción</p>
</div>
```

**✅ Después:**
```tsx
<div className="bg-primary text-primary border-primary">
  <h1 className="text-primary">Título</h1>
  <p className="text-secondary">Descripción</p>
</div>
```

### 3.3 Lista Detallada de Archivos a Migrar

#### 🏠 **Layout y Header (5 archivos)**
- [ ] `src/components/Layout.tsx`
- [ ] `src/components/Header/index.tsx` 
- [ ] `src/components/Header/Navigation.tsx`
- [ ] `src/components/Header/Logo.tsx`
- [ ] `src/components/Header/ThemeToggle.tsx`

#### 🧩 **Componentes Comunes (12 archivos)**
- [ ] `src/components/common/Button.tsx` ⚡ (CRÍTICO - tiene colores hardcodeados)
- [ ] `src/components/Modal.tsx` ⚡ (CRÍTICO - muchos estilos inline)
- [ ] `src/components/common/AlertModal.tsx`
- [ ] `src/components/common/ConfirmModal.tsx`
- [ ] `src/components/common/Tooltip.tsx`
- [ ] `src/components/common/QuestionForm.tsx`
- [ ] `src/components/common/ProgressBar.tsx`
- [ ] `src/components/common/PageHeader.tsx`
- [ ] `src/components/common/ActivityHeader.tsx`
- [ ] `src/components/common/ApiKeyConfig.tsx`
- [ ] `src/components/Pagination.tsx`
- [ ] `src/components/QuestionList.tsx`

#### 📖 **Páginas Principales (11 archivos)**
- [ ] `src/pages/HomePage.tsx` ⚡ (CRÍTICO - página principal)
- [ ] `src/pages/StudyPage.tsx`
- [ ] `src/pages/StudyFlashCardsPage.tsx`
- [ ] `src/pages/StudyExamPage.tsx`  
- [ ] `src/pages/StudyResultsPage.tsx`
- [ ] `src/pages/ViewQuestionsPage.tsx`
- [ ] `src/pages/CreateQuestionPage.tsx`
- [ ] `src/pages/ImportPDFPage.tsx`
- [ ] `src/pages/GeminiTestAPIPage.tsx`
- [ ] `src/pages/ButtonDemoPage.tsx`
- [ ] `src/pages/IconPreviewPage.tsx`

#### 🎓 **Componentes de Estudio (8 archivos)**
- [ ] `src/components/study/StudyModeSelector.tsx`
- [ ] `src/components/study/StudyModeCard.tsx`
- [ ] `src/components/study/TestConfiguration.tsx`
- [ ] `src/components/study/ExamConfiguration.tsx`
- [ ] `src/components/study/QuestionScopeSelector.tsx`
- [ ] `src/components/study/StartStudyButton.tsx`
- [ ] `src/components/study/EmptyQuestionsState.tsx`

#### 🃏 **Componentes FlashCards (3 archivos)**
- [ ] `src/components/flashcards/FlashCard.tsx`
- [ ] `src/components/flashcards/FlashCardsHeader.tsx`
- [ ] `src/components/flashcards/LoadingState.tsx`

#### ✅ **Componentes de Examen (3 archivos)**
- [ ] `src/components/exam/ExamHeader.tsx`
- [ ] `src/components/exam/ExamQuestion.tsx`
- [ ] `src/components/exam/ExamControls.tsx`

---

## 🎨 Fase 4: Migración de Iconos SVG

### 4.1 Iconos que necesitan actualización (60+ archivos)

#### 🔴 **CRÍTICOS** (Iconos con colores fijos)
- [ ] `src/icons/CheckMarkIcon.tsx` - tiene `fill="#22c55e"` hardcodeado
- [ ] `src/icons/SunIcon.tsx` - colores de tema
- [ ] `src/icons/MoonIcon.tsx` - colores de tema

#### 🟡 **IMPORTANTES** (Iconos principales)
- [ ] `src/icons/ArrowLeftIcon.tsx`
- [ ] `src/icons/ArrowRightIcon.tsx`  
- [ ] `src/icons/BookIcon.tsx`
- [ ] `src/icons/ChartIcon.tsx`
- [ ] `src/icons/CheckIcon.tsx`
- [ ] `src/icons/CloseIcon.tsx`
- [ ] `src/icons/DownloadIcon.tsx`
- [ ] `src/icons/EditIcon.tsx`
- [ ] `src/icons/ErrorIcon.tsx`
- [ ] `src/icons/InfoIcon.tsx`
- [ ] `src/icons/PlusIcon.tsx`
- [ ] `src/icons/SearchIcon.tsx`
- [ ] `src/icons/SettingsIcon.tsx`
- [ ] `src/icons/TrashIcon.tsx`
- [ ] `src/icons/WarningIcon.tsx`

### 4.2 Patrón de Migración de Iconos

**❌ Antes:**
```tsx
const CheckMarkIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill="#22c55e" />
    <path fill="white" d="M9 12l2 2 4-4" stroke="white" />
  </svg>
);
```

**✅ Después:**
```tsx
const CheckMarkIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" className="fill-theme-success" />
    <path d="M9 12l2 2 4-4" className="stroke-white" strokeWidth="2" />
  </svg>
);
```

---

## 🧪 Fase 5: Testing y Validación

### 5.1 Checklist de Validación por Componente

#### ✅ **Contraste WCAG AAA**
- [ ] Texto principal vs fondo: ratio ≥ 7:1
- [ ] Texto secundario vs fondo: ratio ≥ 4.5:1  
- [ ] Elementos interactivos: ratio ≥ 7:1
- [ ] Estados de foco claramente visibles

#### ✅ **Funcionalidad**
- [ ] Cambio de tema funciona instantáneamente
- [ ] Persistencia en localStorage
- [ ] Respeta preferencia del sistema
- [ ] Todos los elementos se actualizan
- [ ] No hay parpadeos o transiciones bruscas

#### ✅ **Visual**
- [ ] Colores coherentes en ambos temas
- [ ] Sombras apropiadas para cada tema
- [ ] Bordes visibles en ambos modos
- [ ] Iconos legibles y apropiados
- [ ] Estados hover/focus funcionan

### 5.2 Herramientas de Testing

#### 🔍 **Contraste**
- WebAIM Color Contrast Checker
- DevTools Lighthouse Accessibility
- axe DevTools extension

#### 🎨 **Visual**  
- Screenshot testing en ambos temas
- Revisión manual de todas las páginas
- Testing en diferentes dispositivos

---

## 📋 Fase 6: Plan de Implementación Paso a Paso

### 🗓️ **Semana 1: Fundación**
**Día 1-2: Configuración base**
- [ ] Crear paleta de colores y variables CSS
- [ ] Actualizar `tailwind.config.js`
- [ ] Actualizar `src/styles/index.css`
- [ ] Mejorar `useTheme` hook

**Día 3-4: Componentes críticos**
- [ ] Migrar `Layout.tsx`
- [ ] Migrar `Header/` (todos los archivos)
- [ ] Conectar `ThemeToggle` real
- [ ] Migrar `Button.tsx`

**Día 5-7: Testing básico**
- [ ] Validar funcionamiento del toggle
- [ ] Verificar persistencia
- [ ] Testing de contraste básico

### 🗓️ **Semana 2: Componentes Core**
**Día 1-3: Componentes comunes**
- [ ] Migrar todos los componentes en `common/`
- [ ] Migrar `Modal.tsx`
- [ ] Migrar `Pagination.tsx`

**Día 4-7: Páginas principales**  
- [ ] Migrar `HomePage.tsx`
- [ ] Migrar páginas de estudio (`Study*.tsx`)
- [ ] Migrar `ViewQuestionsPage.tsx`

### 🗓️ **Semana 3: Componentes Específicos**
**Día 1-4: Componentes de funcionalidad**
- [ ] Migrar `study/` (todos los archivos)
- [ ] Migrar `flashcards/` (todos los archivos) 
- [ ] Migrar `exam/` (todos los archivos)

**Día 5-7: Páginas restantes**
- [ ] Migrar páginas restantes
- [ ] Migrar `importPDF/` y `geminiTestAPI/`

### 🗓️ **Semana 4: Iconos y Finalización**
**Día 1-3: Iconos**
- [ ] Migrar iconos críticos (CheckMark, Sun, Moon)
- [ ] Migrar iconos principales 
- [ ] Migrar iconos restantes

**Día 4-7: Testing final**
- [ ] Testing completo de contraste WCAG AAA
- [ ] Testing funcional en todos los componentes
- [ ] Testing visual en diferentes dispositivos
- [ ] Optimizaciones finales

---

## 📚 Recursos y Referencias

### 🎨 **Paletas de Color Recomendadas**
- [Tailwind Color Palette](https://tailwindcss.com/docs/customizing-colors)
- [Adobe Color](https://color.adobe.com/create/color-contrast-analyzer)
- [Coolors.co](https://coolors.co/contrast-checker)

### ♿ **Herramientas de Accesibilidad**  
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

### 📖 **Documentación Técnica**
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## ⚠️ Consideraciones Importantes

### 🔒 **Compatibilidad**
- Mantener colores actuales para transición gradual
- Backwards compatibility con componentes no migrados
- Testing en navegadores principales (Chrome, Firefox, Safari, Edge)

### ⚡ **Performance** 
- CSS variables tienen mejor rendimiento que clases condicionales
- Evitar re-renders innecesarios en cambio de tema
- Lazy loading de estilos si es necesario

### 🎯 **UX/UI**
- Transiciones suaves entre temas (300ms duration)
- Iconos apropiados para cada tema
- Estados de carga durante cambio de tema
- Feedback visual claro del tema activo

---

Este plan detallado te permitirá implementar el modo oscuro de manera sistemática y asegurar que todos los componentes funcionen correctamente con ambos temas, manteniendo la accesibilidad WCAG AAA en todo momento.