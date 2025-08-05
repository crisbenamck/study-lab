import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudyStorage } from '../hooks/useStudyStorage';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Question } from '../types/Question';

const StudyResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { sessions } = useStudyStorage();
  const { questions } = useLocalStorage();
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);

  // Obtener la última sesión completada
  const lastSession = sessions
    .filter(s => s.status === 'completed')
    .sort((a, b) => new Date(b.endTime || 0).getTime() - new Date(a.endTime || 0).getTime())[0];

  if (!lastSession) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
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
      </div>
    );
  }

  const sessionDuration = lastSession.endTime && lastSession.startTime
    ? Math.round((new Date(lastSession.endTime).getTime() - new Date(lastSession.startTime).getTime()) / (1000 * 60))
    : 0;

  const scorePercentage = lastSession.totalQuestions > 0
    ? Math.round((lastSession.correctAnswers / lastSession.totalQuestions) * 100)
    : 0;

  // Obtener preguntas falladas
  const failedQuestions = lastSession.questions
    .filter(q => q.answered && !q.isCorrect)
    .map(q => q.questionId);

  // Función para obtener pregunta por ID
  const getQuestionById = (questionId: number): Question | undefined => {
    return questions.find(q => q.question_number === questionId);
  };

  // Función para obtener estado de la pregunta en la sesión
  const getQuestionSessionData = (questionId: number) => {
    return lastSession.questions.find(q => q.questionId === questionId);
  };

  // Función para mostrar el modal de revisión de pregunta
  const showQuestionModal = (questionId: number) => {
    setSelectedQuestionId(questionId);
  };

  // Función para cerrar el modal
  const closeQuestionModal = () => {
    setSelectedQuestionId(null);
  };

  // Función para iniciar nueva sesión
  const startNewSession = () => {
    if (!lastSession) return;
    
    // Recrear la misma configuración de sesión
    const sessionConfig = lastSession.config;
    
    // Guardar la configuración en localStorage temporalmente
    localStorage.setItem('repeat-session-config', JSON.stringify(sessionConfig));
    
    // Navegar directamente al tipo de sesión correspondiente
    if (sessionConfig.mode === 'flashcards') {
      navigate('/study/flashcards');
    } else {
      navigate('/study/test');
    }
  };

  // Función para practicar preguntas falladas
  const practiceFailedQuestions = () => {
    if (failedQuestions.length === 0) return;
    
    // Guardar las preguntas falladas en localStorage temporalmente
    localStorage.setItem('failed-questions-practice', JSON.stringify(failedQuestions));
    
    // Navegar a la página de estudio
    navigate('/study');
  };

  const renderQuestionModal = () => {
    if (selectedQuestionId === null) return null;

    const question = getQuestionById(selectedQuestionId);
    const sessionData = getQuestionSessionData(selectedQuestionId);

    if (!question || !sessionData) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
          <div className="p-8">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900">
                Pregunta {question.question_number}
              </h3>
              <button
                onClick={closeQuestionModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-light transition-colors p-1"
              >
                ×
              </button>
            </div>

            {/* Question Text */}
            <div className="mb-8">
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <p className="text-lg text-gray-800 leading-relaxed font-medium">
                  {question.question_text}
                </p>
              </div>
              
              {/* Options */}
              <div className="space-y-3 mb-8">
                {question.options.map((option) => {
                  const isSelected = sessionData.selectedOptions.includes(option.option_letter);
                  const isCorrect = option.is_correct;
                  
                  let containerClass = 'bg-white border-2 border-gray-200';
                  let textClass = 'text-gray-800';
                  let statusBadge = null;
                  
                  if (isCorrect) {
                    containerClass = 'bg-green-50 border-2 border-green-200';
                    textClass = 'text-green-800';
                    statusBadge = (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {isSelected ? 'Tu respuesta - Correcta' : 'Respuesta correcta'}
                      </span>
                    );
                  } else if (isSelected) {
                    containerClass = 'bg-red-50 border-2 border-red-200';
                    textClass = 'text-red-800';
                    statusBadge = (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Tu respuesta - Incorrecta
                      </span>
                    );
                  }

                  return (
                    <div
                      key={option.option_letter}
                      className={`${containerClass} rounded-lg p-4 transition-all duration-200`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <span className={`font-bold text-lg ${textClass} min-w-[1.5rem]`}>
                            {option.option_letter}.
                          </span>
                          <span className={`${textClass} text-base leading-relaxed`}>
                            {option.option_text}
                          </span>
                        </div>
                        {statusBadge && (
                          <div className="flex-shrink-0">
                            {statusBadge}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {question.explanation && (
                <div className="bg-blue-50 rounded-lg border-l-4 border-blue-400 p-6 mb-6">
                  <h4 className="font-semibold text-blue-900 mb-3 text-lg">
                    Explicación
                  </h4>
                  <p className="text-blue-800 leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              )}

              {/* Skipped Notice */}
              {sessionData.skipped && (
                <div className="bg-yellow-50 rounded-lg border-l-4 border-yellow-400 p-4">
                  <p className="text-yellow-800 font-medium">
                    Esta pregunta fue saltada durante el test
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-center pt-4 border-t border-gray-200">
              <button
                onClick={closeQuestionModal}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="w-full max-w-4xl mx-auto px-6 space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="space-y-3">
            <h1 className="text-5xl font-bold text-gray-900">
              Sesión Completada
            </h1>
            <p className="text-xl text-gray-600">
              {lastSession.config.mode === 'flashcards' ? 'Modo Flash Cards' : 'Modo Test de Práctica'}
            </p>
          </div>
          
          {/* Score Badge */}
          <div className="inline-flex items-center justify-center">
            <div className={`text-6xl font-bold px-8 py-6 rounded-2xl ${
              scorePercentage >= 80 ? 'bg-green-100 text-green-700' :
              scorePercentage >= 60 ? 'bg-blue-100 text-blue-700' :
              scorePercentage >= 40 ? 'bg-orange-100 text-orange-700' :
              'bg-red-100 text-red-700'
            }`}>
              {scorePercentage}%
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
            Resumen de Rendimiento
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {lastSession.totalQuestions}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Total de Preguntas
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {lastSession.correctAnswers}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Respuestas Correctas
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {lastSession.totalQuestions - lastSession.correctAnswers}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Respuestas Incorrectas
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {lastSession.questions.filter(q => q.skipped).length}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Preguntas Saltadas
              </div>
            </div>
          </div>
        </section>

        {/* Session Details */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
            Detalles de la Sesión
          </h2>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Duración total:</span>
                  <span className="text-lg font-bold text-gray-900">{sessionDuration} minutos</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Porcentaje de aciertos:</span>
                  <span className="text-lg font-bold text-gray-900">{scorePercentage}%</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Fecha de realización:</span>
                  <span className="text-sm font-medium text-gray-700">
                    {new Date(lastSession.startTime).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Hora de finalización:</span>
                  <span className="text-sm font-medium text-gray-700">
                    {new Date(lastSession.startTime).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Question Map */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
            Mapa de Respuestas
          </h2>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-15 xl:grid-cols-20 gap-2 mb-8">
              {lastSession.questions.map((sessionQuestion) => {
                const question = getQuestionById(sessionQuestion.questionId);
                if (!question) return null;

                let statusClass = 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700';

                if (sessionQuestion.skipped) {
                  statusClass = 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300 text-yellow-800';
                } else if (sessionQuestion.answered && sessionQuestion.isCorrect) {
                  statusClass = 'bg-green-100 hover:bg-green-200 border-green-300 text-green-800';
                } else if (sessionQuestion.answered && !sessionQuestion.isCorrect) {
                  statusClass = 'bg-red-100 hover:bg-red-200 border-red-300 text-red-800';
                }

                return (
                  <button
                    key={sessionQuestion.questionId}
                    onClick={() => showQuestionModal(sessionQuestion.questionId)}
                    className={`${statusClass} p-2 rounded-lg border font-medium transition-all duration-200 cursor-pointer min-h-[2.5rem] flex items-center justify-center hover:shadow-sm text-sm`}
                    title={`Pregunta ${question.question_number} - ${
                      sessionQuestion.skipped ? 'Saltada' : 
                      sessionQuestion.isCorrect ? 'Correcta' : 'Incorrecta'
                    }`}
                  >
                    {question.question_number}
                  </button>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span className="text-gray-600 font-medium">Correcta</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                <span className="text-gray-600 font-medium">Incorrecta</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                <span className="text-gray-600 font-medium">Saltada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                <span className="text-gray-600 font-medium">No respondida</span>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Feedback */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
            Evaluación del Desempeño
          </h2>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              {scorePercentage >= 80 && (
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                    <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                  </div>
                  <p className="text-lg font-semibold text-green-700">
                    ¡Excelente dominio!
                  </p>
                  <p className="text-gray-600">
                    Tienes un gran conocimiento del material. ¡Sigue así!
                  </p>
                </div>
              )}
              {scorePercentage >= 60 && scorePercentage < 80 && (
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                    <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                  </div>
                  <p className="text-lg font-semibold text-blue-700">
                    ¡Muy buen progreso!
                  </p>
                  <p className="text-gray-600">
                    Vas por excelente camino. Con un poco más de práctica serás un experto.
                  </p>
                </div>
              )}
              {scorePercentage >= 40 && scorePercentage < 60 && (
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full">
                    <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
                  </div>
                  <p className="text-lg font-semibold text-orange-700">
                    En buen camino
                  </p>
                  <p className="text-gray-600">
                    Tienes una buena base. Repasa las preguntas falladas para mejorar aún más.
                  </p>
                </div>
              )}
              {scorePercentage < 40 && (
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                    <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                  </div>
                  <p className="text-lg font-semibold text-red-700">
                    ¡Sigue adelante!
                  </p>
                  <p className="text-gray-600">
                    Cada intento te acerca más al éxito. Dedica más tiempo al estudio y verás resultados.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
            Próximos Pasos
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/study')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors border border-indigo-600"
            >
              Ir a Estudiar
            </button>
            
            <button
              onClick={startNewSession}
              className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-6 rounded-lg transition-colors border border-gray-300"
            >
              Repetir Test
            </button>
            
            {failedQuestions.length > 0 && (
              <button
                onClick={practiceFailedQuestions}
                className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors border border-orange-600"
              >
                Practicar Falladas ({failedQuestions.length})
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Modal de pregunta */}
      {renderQuestionModal()}
    </div>
  );
};

export default StudyResultsPage;
