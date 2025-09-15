import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookIcon, 
  EditIcon, 
  UploadIcon, 
  InfoIcon,
  ChartIcon,
  ExamIcon
} from '../icons';

const HomePage: React.FC = () => {
  const features = [
    {
      id: 'create',
      title: 'Crear Preguntas',
      description: 'Diseña preguntas efectivas para tus exámenes con opciones múltiples, explicaciones y referencias educativas.',
      icon: <EditIcon className="w-8 h-8" />,
      link: '/create',
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-200 hover:border-blue-300',
      features: [
        'Formulario intuitivo con validación',
        'Opciones de respuesta dinámicas',
        'Campos de explicación y referencia',
        'Numeración automática de preguntas'
      ]
    },
    {
      id: 'questions',
      title: 'Gestión de Preguntas',
      description: 'Organiza y gestiona tu biblioteca de preguntas de manera eficiente. Edita, elimina y descarga tu contenido.',
      icon: <InfoIcon className="w-8 h-8" />,
      link: '/questions',
      color: 'bg-green-50 text-green-600',
      borderColor: 'border-green-200 hover:border-green-300',
      features: [
        'Vista completa de todas las preguntas',
        'Edición in-situ de contenido',
        'Eliminación individual o masiva',
        'Exportación a JSON'
      ]
    },
    {
      id: 'import',
      title: 'Importar desde PDF',
      description: 'Sube archivos PDF para extraer preguntas automáticamente usando inteligencia artificial.',
      icon: <UploadIcon className="w-8 h-8" />,
      link: '/import',
      color: 'bg-purple-50 text-purple-600',
      borderColor: 'border-purple-200 hover:border-purple-300',
      features: [
        'Procesamiento automático de PDF',
        'Extracción inteligente con IA',
        'Configuración de parámetros de generación',
        'Validación antes de importar'
      ]
    },
    {
      id: 'study',
      title: 'Sistema de Estudio',
      description: 'Practica con tus preguntas usando diferentes modalidades: flashcards interactivas o exámenes simulados.',
      icon: <BookIcon className="w-8 h-8" />,
      link: '/study',
      color: 'bg-orange-50 text-orange-600',
      borderColor: 'border-orange-200 hover:border-orange-300',
      features: [
        'Modo Flashcards: estudio interactivo',
        'Modo Examen: simulacros con tiempo',
        'Selección de alcance (todas, rango, aleatorias)',
        'Configuración de límite de tiempo'
      ]
    },
    {
      id: 'results',
      title: 'Resultados y Análisis',
      description: 'Revisa tu desempeño en sesiones completadas con estadísticas detalladas y análisis de progreso.',
      icon: <ChartIcon className="w-8 h-8" />,
      link: '/study/session-results',
      color: 'bg-indigo-50 text-indigo-600',
      borderColor: 'border-indigo-200 hover:border-indigo-300',
      features: [
        'Estadísticas detalladas de rendimiento',
        'Análisis de respuestas incorrectas',
        'Historial de sesiones de estudio',
        'Opción de repetir configuraciones'
      ]
    },
    {
      id: 'api-test',
      title: 'Test de API',
      description: 'Prueba la conexión y configuración de la API de Google AI Studio para asegurar el correcto funcionamiento.',
      icon: <ExamIcon className="w-8 h-8" />,
      link: '/api-test',
      color: 'bg-red-50 text-red-600',
      borderColor: 'border-red-200 hover:border-red-300',
      features: [
        'Verificación de conectividad',
        'Validación de API key',
        'Test de generación de contenido',
        'Diagnóstico de problemas'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Bienvenido a Study Lab
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Una plataforma completa para crear, gestionar y estudiar preguntas de examen. 
            Utiliza inteligencia artificial para optimizar tu proceso de aprendizaje.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Link
              key={feature.id}
              to={feature.link}
              className={`block bg-white rounded-xl border-2 ${feature.borderColor} p-6 transition-all duration-200 hover:shadow-lg hover:scale-105 group`}
            >
              <div className="mb-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
              </div>
              
              <ul className="space-y-2">
                {feature.features.map((item, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-500">
                    <svg className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>

        {/* Quick Start Section */}
        <div className="mt-16 bg-white rounded-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🚀 Primeros pasos recomendados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">1</div>
              <h3 className="font-semibold text-gray-900 mb-2">Configura la API</h3>
              <p className="text-sm text-gray-600">Realiza el test de API para asegurar la conectividad con Google AI Studio</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">2</div>
              <h3 className="font-semibold text-gray-900 mb-2">Crea o Importa</h3>
              <p className="text-sm text-gray-600">Añade preguntas manualmente o importa desde archivos PDF</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-2">3</div>
              <h3 className="font-semibold text-gray-900 mb-2">Comienza a Estudiar</h3>
              <p className="text-sm text-gray-600">Utiliza flashcards o exámenes simulados para practicar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
