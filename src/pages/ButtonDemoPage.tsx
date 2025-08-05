import React from 'react';
import Layout from '../components/Layout';
import ButtonExample from '../components/ButtonExample';

const ButtonDemoPage: React.FC = () => {
  return (
    <Layout>
      <div className="py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Componente Button Unificado
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Este es el nuevo componente Button que unifica todos los estilos de botones de la aplicación. 
              Reemplaza los botones personalizados que antes tenían estilos inline complejos.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Características principales:</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>6 variantes de color:</strong> primary, secondary, danger, success, warning, info</li>
              <li><strong>3 tipos de estilo:</strong> solid, outline, ghost</li>
              <li><strong>4 tamaños:</strong> sm, md, lg, xl</li>
              <li><strong>Soporte para íconos:</strong> emojis y componentes SVG</li>
              <li><strong>Estados automáticos:</strong> hover, focus, disabled, loading</li>
              <li><strong>Personalizable:</strong> ancho completo, border radius, posición del ícono</li>
              <li><strong>Accesible:</strong> soporte para navegación por teclado y lectores de pantalla</li>
            </ul>
          </div>
          
          <ButtonExample />
          
          <div className="bg-gray-50 rounded-xl p-8 mt-8">
            <h2 className="text-2xl font-semibold mb-4">Cómo usar:</h2>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`import Button from './components/Button';

// Botón básico
<Button>Texto del botón</Button>

// Botón con variante y tamaño
<Button variant="danger" size="lg">Eliminar</Button>

// Botón con ícono
<Button variant="primary" icon="💾" iconPosition="left">
  Guardar
</Button>

// Botón de solo ícono
<Button variant="danger" icon="🗑️" title="Eliminar" />

// Botón de carga
<Button isLoading variant="primary">Procesando...</Button>

// Botón outline ancho completo
<Button buttonType="outline" fullWidth>
  Botón ancho completo
</Button>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ButtonDemoPage;
