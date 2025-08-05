# Componente Button Unificado

Este componente Button unifica todos los estilos de botones que se usaban anteriormente en la aplicación, eliminando la necesidad de estilos inline complejos y proporcionando una API consistente.

## Instalación

El componente está ubicado en `src/components/Button.tsx` y puede ser importado así:

```tsx
import Button from './components/Button';
```

## Props

| Prop | Tipo | Valor por defecto | Descripción |
|------|------|-------------------|-------------|
| `children` | `React.ReactNode` | - | Contenido del botón (opcional para botones de solo ícono) |
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'success' \| 'warning' \| 'info'` | `'primary'` | Variante de color del botón |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Tamaño del botón |
| `buttonType` | `'solid' \| 'outline' \| 'ghost'` | `'solid'` | Tipo de estilo del botón |
| `icon` | `React.ReactNode \| string` | - | Ícono a mostrar (emoji o componente SVG) |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Posición del ícono |
| `isLoading` | `boolean` | `false` | Muestra estado de carga con spinner |
| `fullWidth` | `boolean` | `false` | Hace que el botón ocupe todo el ancho disponible |
| `rounded` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'lg'` | Border radius del botón |
| `className` | `string` | `''` | Clases CSS adicionales |

Además, acepta todas las props estándar de un elemento `<button>` de HTML como `onClick`, `disabled`, `type`, etc.

## Variantes de Color

### Primary (Azul)
- **Uso:** Acciones principales, guardar, confirmar
- **Solid:** Fondo azul (#2563eb)
- **Outline:** Borde azul, texto azul
- **Ghost:** Solo texto azul, fondo transparente

### Secondary (Gris)
- **Uso:** Acciones secundarias, cancelar
- **Solid:** Fondo gris (#6b7280)
- **Outline:** Borde gris, texto gris
- **Ghost:** Solo texto gris, fondo transparente

### Danger (Rojo)
- **Uso:** Acciones destructivas, eliminar
- **Solid:** Fondo rojo (#ef4444)
- **Outline:** Borde rojo, texto rojo
- **Ghost:** Solo texto rojo, fondo transparente

### Success (Verde)
- **Uso:** Acciones exitosas, completar
- **Solid:** Fondo verde (#10b981)
- **Outline:** Borde verde, texto verde
- **Ghost:** Solo texto verde, fondo transparente

### Warning (Amarillo)
- **Uso:** Advertencias, precaución
- **Solid:** Fondo amarillo (#f59e0b)
- **Outline:** Borde amarillo, texto amarillo
- **Ghost:** Solo texto amarillo, fondo transparente

### Info (Azul claro)
- **Uso:** Información, descargar
- **Solid:** Fondo azul claro (#3b82f6)
- **Outline:** Borde azul claro, texto azul claro
- **Ghost:** Solo texto azul claro, fondo transparente

## Tamaños

- **sm:** Padding pequeño (px-3 py-1.5), texto pequeño
- **md:** Padding mediano (px-4 py-2), texto normal
- **lg:** Padding grande (px-6 py-3), texto normal
- **xl:** Padding extra grande (px-8 py-4), texto grande

## Ejemplos de Uso

### Botón básico
```tsx
<Button>Texto del botón</Button>
```

### Botón con variante y tamaño
```tsx
<Button variant="danger" size="lg">
  Eliminar
</Button>
```

### Botón con ícono emoji
```tsx
<Button variant="primary" icon="💾" iconPosition="left">
  Guardar Pregunta
</Button>
```

### Botón con ícono SVG
```tsx
const PlusIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

<Button icon={<PlusIcon />} iconPosition="left">
  Agregar
</Button>
```

### Botón de solo ícono
```tsx
<Button variant="danger" icon="🗑️" title="Eliminar pregunta" />
```

### Botón en estado de carga
```tsx
<Button isLoading variant="primary">
  Procesando...
</Button>
```

### Botón outline ancho completo
```tsx
<Button buttonType="outline" fullWidth>
  Botón ancho completo
</Button>
```

### Botón de formulario
```tsx
<Button type="submit" variant="primary" icon="💾">
  Guardar Cambios
</Button>
```

## Migración de Botones Existentes

### Antes (código antiguo):
```tsx
<button
  type="submit"
  className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 text-sm"
  style={{
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: '1px solid #2563eb',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  }}
  onMouseEnter={...}
  onMouseLeave={...}
>
  💾 Guardar Pregunta
</button>
```

### Después (con el nuevo componente):
```tsx
<Button
  type="submit"
  variant="primary"
  size="md"
  icon="💾"
  iconPosition="left"
>
  Guardar Pregunta
</Button>
```

## Componentes Actualizados

Los siguientes componentes han sido actualizados para usar el nuevo Button:

- ✅ `QuestionForm.tsx` - Botones de guardar y cancelar
- ✅ `QuestionList.tsx` - Botón de eliminar pregunta
- ✅ `AlertModal.tsx` - Botón de confirmación
- ✅ `ConfirmModal.tsx` - Botones de confirmar y cancelar

## Próximos Pasos

Para completar la migración, actualiza estos componentes:

- [ ] `StudyPageImproved.tsx` - Botones de navegación y configuración
- [ ] `StudyFlashCardsPage.tsx` - Botones de navegación
- [ ] `StudyTestPage.tsx` - Botones de envío y navegación
- [ ] `HeaderImproved.tsx` - Botones de navegación si aplica
- [ ] `PDFImport.tsx` - Botones de importación
- [ ] Otros componentes con botones personalizados

## Beneficios

1. **Consistencia:** Todos los botones tienen el mismo estilo y comportamiento
2. **Mantenibilidad:** Un solo lugar para actualizar estilos de botones
3. **Reutilización:** Fácil reutilización en nuevos componentes
4. **Accesibilidad:** Estados de focus y navegación por teclado incluidos
5. **Productividad:** Menos código repetitivo al crear nuevos botones
