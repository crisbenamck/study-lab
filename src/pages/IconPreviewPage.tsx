import React from 'react';

const IconPreviewPage = () => {
  const icons = [
    { 
      id: 'original', 
      name: 'Azul Original', 
      description: 'Confianza, profesionalismo y estabilidad académica', 
      file: '/icons/study-lab-original.svg',
      psychology: 'Versión corporativa oficial'
    },
    { 
      id: 'verde', 
      name: 'Verde Academia', 
      description: 'Crecimiento, éxito académico y tranquilidad', 
      file: '/icons/study-lab-verde.svg',
      psychology: 'Progreso y desarrollo educativo'
    },
    { 
      id: 'naranja', 
      name: 'Naranja Energético', 
      description: 'Creatividad, entusiasmo e innovación', 
      file: '/icons/study-lab-naranja.svg',
      psychology: 'Motivar creatividad y pensamiento lateral'
    },
    { 
      id: 'morado', 
      name: 'Morado Académico', 
      description: 'Sabiduría, conocimiento profundo y prestigio', 
      file: '/icons/study-lab-morado.svg',
      psychology: 'Excelencia académica y pensamiento crítico'
    },
    { 
      id: 'azul-nocturno', 
      name: 'Azul Nocturno', 
      description: 'Concentración, focus profundo y productividad', 
      file: '/icons/study-lab-azul-nocturno.svg',
      psychology: 'Sesiones de estudio intensivo'
    },
    { 
      id: 'azul-nocturno-optimized', 
      name: 'Azul Nocturno Optimizado', 
      description: 'Versión mejorada con menos saturación visual', 
      file: '/icons/study-lab-azul-nocturno-optimized.svg',
      psychology: 'Diseño simplificado para mejor legibilidad'
    },
    { 
      id: 'azul-nocturno-simple', 
      name: 'Azul Nocturno Simple', 
      description: 'Versión ultra-simple para favicons pequeños', 
      file: '/icons/study-lab-azul-nocturno-simple.svg',
      psychology: 'Óptimo para tamaños 16px y 24px'
    },
    { 
      id: 'rojo-energia', 
      name: 'Rojo Energía', 
      description: 'Motivación, acción y determinación', 
      file: '/icons/study-lab-rojo-energia.svg',
      psychology: 'Impulsar acción y superar procrastinación'
    },
  ];

  return (
    <div className="container space-y-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Selección de Icono para Study Lab
        </h1>
        <p className="text-gray-600 text-lg">
          Elige el icono que mejor represente la identidad de la aplicación
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {icons.map((variant) => (
          <div key={variant.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {variant.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                {variant.description}
              </p>
              <p className="text-blue-600 text-xs font-medium italic">
                {variant.psychology}
              </p>
            </div>

            {/* Vista previa en diferentes tamaños */}
            <div className="space-y-4">
              {/* Vista de detalle 200px */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-xs font-semibold text-gray-700 mb-3 text-center">Vista de Detalle:</h4>
                <div className="flex justify-center">
                  <div className="bg-white rounded-lg p-4 shadow-inner border">
                    <img src={variant.file} alt={variant.name} className="w-32 h-32 mx-auto" style={{ width: '128px', height: '128px' }} />
                  </div>
                </div>
              </div>

              {/* Header preview */}
              <div className="bg-blue-800 rounded-lg p-3">
                <h4 className="text-xs font-semibold text-white mb-2 text-center opacity-70">Header Preview:</h4>
                <div className="flex items-center space-x-3">
                  <img src={variant.file} alt={variant.name} className="w-8 h-8" />
                  <span className="text-white font-bold text-lg">Study Lab</span>
                </div>
              </div>

              {/* Tamaños múltiples */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-gray-700 mb-3 text-center">Tamaños:</h4>
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <img src={variant.file} alt={variant.name} className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs text-gray-500">16px</span>
                  </div>
                  <div className="text-center">
                    <img src={variant.file} alt={variant.name} className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-xs text-gray-500">24px</span>
                  </div>
                  <div className="text-center">
                    <img src={variant.file} alt={variant.name} className="w-8 h-8 mx-auto mb-1" />
                    <span className="text-xs text-gray-500">32px</span>
                  </div>
                  <div className="text-center">
                    <img src={variant.file} alt={variant.name} className="w-12 h-12 mx-auto mb-1" />
                    <span className="text-xs text-gray-500">48px</span>
                  </div>
                </div>
              </div>

              {/* Selección Button */}
              <div className="text-center pt-2">
                <button 
                  className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  onClick={() => alert(`Seleccionaste: ${variant.name}\n\nEsta variante será perfecta para Study Lab!`)}
                >
                  Seleccionar esta variante
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          🎨 Paleta de Colores Educativos Study Lab
        </h3>
        <p className="text-gray-700 text-base mb-6">
          Cada color está diseñado con psicología educativa específica para diferentes momentos del aprendizaje
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="bg-blue-100 p-4 rounded-lg">
            <div className="text-blue-800 font-semibold">🔵 Azul Original</div>
            <div className="text-blue-600 text-sm">Confianza profesional</div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <div className="text-green-800 font-semibold">🟢 Verde Academia</div>
            <div className="text-green-600 text-sm">Crecimiento y éxito</div>
          </div>
          <div className="bg-orange-100 p-4 rounded-lg">
            <div className="text-orange-800 font-semibold">🟠 Naranja Energético</div>
            <div className="text-orange-600 text-sm">Creatividad innovadora</div>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <div className="text-purple-800 font-semibold">🟣 Morado Académico</div>
            <div className="text-purple-600 text-sm">Sabiduría profunda</div>
          </div>
          <div className="bg-slate-100 p-4 rounded-lg">
            <div className="text-slate-800 font-semibold">🔵 Azul Nocturno</div>
            <div className="text-slate-600 text-sm">Concentración intensa</div>
          </div>
          <div className="bg-red-100 p-4 rounded-lg">
            <div className="text-red-800 font-semibold">🔴 Rojo Energía</div>
            <div className="text-red-600 text-sm">Motivación y acción</div>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mt-6">
          Todos los iconos mantienen elementos de IA con destellos de 4 puntas, diseño de libro digital con laboratorio integrado y elementos científicos
        </p>
      </div>
    </div>
  );
};

export default IconPreviewPage;
