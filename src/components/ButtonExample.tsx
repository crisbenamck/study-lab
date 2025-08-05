import React from 'react';
import Button from './common/Button';

const ButtonExample: React.FC = () => {
  const PlusIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  );

  const TrashIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  const DownloadIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
    </svg>
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Button Component Examples</h1>

      {/* Variantes */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Variantes</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="info">Info</Button>
        </div>
      </section>

      {/* Tipos de botón */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Tipos de Botón</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Solid</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" buttonType="solid">Primary Solid</Button>
              <Button variant="secondary" buttonType="solid">Secondary Solid</Button>
              <Button variant="danger" buttonType="solid">Danger Solid</Button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Outline</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" buttonType="outline">Primary Outline</Button>
              <Button variant="secondary" buttonType="outline">Secondary Outline</Button>
              <Button variant="danger" buttonType="outline">Danger Outline</Button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Ghost</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" buttonType="ghost">Primary Ghost</Button>
              <Button variant="secondary" buttonType="ghost">Secondary Ghost</Button>
              <Button variant="danger" buttonType="ghost">Danger Ghost</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tamaños */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Tamaños</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
        </div>
      </section>

      {/* Con íconos */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Con Íconos</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Con Emojis</h3>
            <div className="flex flex-wrap gap-4">
              <Button icon="💾" iconPosition="left">Guardar</Button>
              <Button icon="🗑️" variant="danger" iconPosition="left">Eliminar</Button>
              <Button icon="📥" variant="info" iconPosition="left">Descargar</Button>
              <Button icon="➡️" iconPosition="right">Siguiente</Button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Con SVG Icons</h3>
            <div className="flex flex-wrap gap-4">
              <Button icon={<PlusIcon />} iconPosition="left">Agregar</Button>
              <Button icon={<TrashIcon />} variant="danger" iconPosition="left">Eliminar</Button>
              <Button icon={<DownloadIcon />} variant="success" iconPosition="left">Descargar</Button>
              <Button icon={<PlusIcon />} iconPosition="right" buttonType="outline">Agregar Nuevo</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Estados */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Estados</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
          <Button isLoading>Loading</Button>
          <Button isLoading variant="secondary">Loading Secondary</Button>
        </div>
      </section>

      {/* Ancho completo */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Ancho Completo</h2>
        <div className="space-y-4">
          <Button fullWidth>Botón de ancho completo</Button>
          <Button fullWidth buttonType="outline" icon="📋">Botón outline ancho completo</Button>
        </div>
      </section>

      {/* Border radius */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Border Radius</h2>
        <div className="flex flex-wrap gap-4">
          <Button rounded="sm">Small Radius</Button>
          <Button rounded="md">Medium Radius</Button>
          <Button rounded="lg">Large Radius</Button>
          <Button rounded="xl">Extra Large Radius</Button>
          <Button rounded="full">Full Radius</Button>
        </div>
      </section>

      {/* Ejemplos de uso real */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Ejemplos de Uso Real</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Formulario</h3>
            <div className="flex gap-2">
              <Button type="submit" icon="💾">Guardar Pregunta</Button>
              <Button variant="secondary" type="button">Cancelar</Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Modal de Confirmación</h3>
            <div className="flex gap-2">
              <Button variant="danger" icon="🗑️">Eliminar</Button>
              <Button variant="secondary">Cancelar</Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Navegación</h3>
            <div className="flex gap-2">
              <Button variant="primary" icon={<PlusIcon />}>Crear Preguntas</Button>
              <Button variant="info" buttonType="outline" icon="📥">Importar PDF</Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Estudios</h3>
            <div className="flex gap-2">
              <Button variant="success" size="lg" icon="🎯">Iniciar Test</Button>
              <Button variant="info" size="lg" buttonType="outline" icon="📚">Flash Cards</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ButtonExample;
