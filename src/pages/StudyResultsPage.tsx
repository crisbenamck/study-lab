import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudyStorage } from '../hooks/useStudyStorage';

const StudyResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { sessions } = useStudyStorage();

  // Obtener la última sesión completada
  const lastSession = sessions
    .filter(s => s.status === 'completed')
    .sort((a, b) => new Date(b.endTime || 0).getTime() - new Date(a.endTime || 0).getTime())[0];

  if (!lastSession) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            No hay resultados disponibles
          </h1>
          <p className="text-gray-600 mb-6">
            No se encontraron sesiones de estudio completadas.
          </p>
          <button
            onClick={() => navigate('/study')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Iniciar Nueva Sesión
          </button>
        </div>
      </div>
    );
  }

  const sessionDuration = lastSession.endTime && lastSession.startTime
    ? Math.round((new Date(lastSession.endTime).getTime() - new Date(lastSession.startTime).getTime()) / (1000 * 60))
    : 0;

  const scorePercentage = lastSession.totalQuestions > 0
    ? Math.round((lastSession.correctAnswers / lastSession.totalQuestions) * 100)
    : 0;

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">
              {scorePercentage >= 80 ? '🎉' : scorePercentage >= 60 ? '👍' : '📚'}
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              ¡Sesión Completada!
            </h1>
            <p className="text-gray-600">
              {lastSession.config.mode === 'flashcards' ? 'Flash Cards' : 'Test de Práctica'}
            </p>
          </div>

          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {lastSession.correctAnswers}
              </div>
              <div className="text-sm text-blue-800">
                Respuestas Correctas
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {scorePercentage}%
              </div>
              <div className="text-sm text-green-800">
                Puntuación
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {sessionDuration}
              </div>
              <div className="text-sm text-purple-800">
                Minutos
              </div>
            </div>
          </div>

          {/* Resumen detallado */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Resumen de la Sesión</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de preguntas:</span>
                <span className="font-medium">{lastSession.totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Respuestas correctas:</span>
                <span className="font-medium text-green-600">{lastSession.correctAnswers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Respuestas incorrectas:</span>
                <span className="font-medium text-red-600">
                  {lastSession.totalQuestions - lastSession.correctAnswers}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha:</span>
                <span className="font-medium">
                  {new Date(lastSession.startTime).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/study')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Nueva Sesión
            </button>
            
            <button
              onClick={() => navigate('/questions')}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Ver Preguntas
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Inicio
            </button>
          </div>

          {/* Motivación */}
          <div className="mt-6 text-center">
            {scorePercentage >= 90 && (
              <p className="text-green-600 font-medium">
                ¡Excelente trabajo! Dominas muy bien el material.
              </p>
            )}
            {scorePercentage >= 70 && scorePercentage < 90 && (
              <p className="text-blue-600 font-medium">
                ¡Muy bien! Sigue practicando para mejorar aún más.
              </p>
            )}
            {scorePercentage >= 50 && scorePercentage < 70 && (
              <p className="text-yellow-600 font-medium">
                Buen progreso. Considera repasar las preguntas más difíciles.
              </p>
            )}
            {scorePercentage < 50 && (
              <p className="text-red-600 font-medium">
                Sigue estudiando. La práctica hace al maestro.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyResultsPage;
