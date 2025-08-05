import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudyStorage } from '../hooks/useStudyStorage';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from '../hooks/useTheme';
import type { Question } from '../types/Question';
import Button from '../components/common/Button';
import { SunIcon, MoonIcon, BookIcon, RefreshIcon, ClipboardIcon, PlusIcon, CloseIcon } from '../icons';

const StudyResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { sessions } = useStudyStorage();
  const { questions } = useLocalStorage();
  const { theme, toggleTheme } = useTheme();
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);

  // Obtener la última sesión completada
  const lastSession = sessions
    .filter(s => s.status === 'completed')
    .sort((a, b) => new Date(b.endTime || 0).getTime() - new Date(a.endTime || 0).getTime())[0];

  if (!lastSession) {
    return (
      <div className="surface-base min-h-screen theme-transition">
        <div className="content-container py-16">
          <div className="surface-elevated card-spacing text-center max-w-2xl mx-auto">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-lg)' }}>
                No hay resultados disponibles
              </h1>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
                No se encontraron sesiones de estudio completadas.
              </p>
            </div>
            <Button
              onClick={() => navigate('/study')}
              variant="primary"
              size="lg"
              icon={<PlusIcon />}
              className="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Iniciar Nueva Sesión
            </Button>
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
    
    const sessionConfig = lastSession.config;
    localStorage.setItem('repeat-session-config', JSON.stringify(sessionConfig));
    
    if (sessionConfig.mode === 'flashcards') {
      navigate('/study/flashcards');
    } else {
      navigate('/study/exam');
    }
  };

  // Función para practicar preguntas falladas
  const practiceFailedQuestions = () => {
    if (failedQuestions.length === 0) return;
    
    localStorage.setItem('failed-questions-practice', JSON.stringify(failedQuestions));
    navigate('/study');
  };

  // Función para obtener configuración de color según el puntaje
  const getScoreConfig = (score: number) => {
    if (score >= 80) return {
      gradient: 'from-green-500 to-emerald-600',
      bg: 'bg-green-50',
      text: 'text-green-700',
      icon: '🎉',
      title: '¡Excelente dominio!',
      message: 'Tienes un gran conocimiento del material. ¡Sigue así!'
    };
    if (score >= 60) return {
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      icon: '💪',
      title: '¡Muy buen progreso!',
      message: 'Vas por excelente camino. Con un poco más de práctica serás un experto.'
    };
    if (score >= 40) return {
      gradient: 'from-yellow-500 to-orange-500',
      bg: 'bg-yellow-50',
      text: 'text-orange-700',
      icon: '📚',
      title: 'En buen camino',
      message: 'Tienes una buena base. Repasa las preguntas falladas para mejorar aún más.'
    };
    return {
      gradient: 'from-red-500 to-red-600',
      bg: 'bg-red-50',
      text: 'text-red-700',
      icon: '🚀',
      title: '¡Sigue adelante!',
      message: 'Cada intento te acerca más al éxito. Dedica más tiempo al estudio y verás resultados.'
    };
  };

  const scoreConfig = getScoreConfig(scorePercentage);

  const renderQuestionModal = () => {
    if (selectedQuestionId === null) return null;

    const question = getQuestionById(selectedQuestionId);
    const sessionData = getQuestionSessionData(selectedQuestionId);

    if (!question || !sessionData) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="surface-elevated max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="card-spacing">
            <div className="flex justify-between items-center element-spacing pb-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
              <h3 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-semibold)' }}>
                Pregunta {question.question_number}
              </h3>
              <Button
                onClick={closeQuestionModal}
                variant="secondary"
                size="sm"
                buttonType="ghost"
                icon={<CloseIcon />}
                className="w-8 h-8"
              />
            </div>

            <div className="element-spacing">
              <div className="surface-elevated card-spacing mb-6">
                <p style={{ fontSize: 'var(--font-size-lg)', lineHeight: 'var(--line-height-relaxed)' }}>
                  {question.question_text}
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                {question.options.map((option) => {
                  const isSelected = sessionData.selectedOptions.includes(option.option_letter);
                  const isCorrect = option.is_correct;
                  
                  let containerClass = 'surface-elevated p-4 transition-all duration-200';
                  let statusBadge = null;
                  
                  if (isCorrect) {
                    containerClass += ' status-success';
                    statusBadge = (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {isSelected ? 'Tu respuesta - Correcta' : 'Respuesta correcta'}
                      </span>
                    );
                  } else if (isSelected) {
                    containerClass += ' status-error';
                    statusBadge = (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Tu respuesta - Incorrecta
                      </span>
                    );
                  }

                  return (
                    <div key={option.option_letter} className={containerClass}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <span className="font-bold text-lg min-w-[1.5rem]">
                            {option.option_letter}.
                          </span>
                          <span className="text-base leading-relaxed">
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

              {question.explanation && (
                <div className="status-info surface-elevated card-spacing border-l-4 border-blue-400 mb-6">
                  <h4 className="font-semibold mb-3 text-lg">
                    Explicación
                  </h4>
                  <p className="leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              )}

              {sessionData.skipped && (
                <div className="status-warning surface-elevated p-4 border-l-4 border-yellow-400">
                  <p className="font-medium">
                    Esta pregunta fue saltada durante el test
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-center pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
              <Button
                onClick={closeQuestionModal}
                variant="secondary"
                size="md"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="surface-base min-h-screen theme-transition">
      <div className="content-container py-16">
        
        {/* CONTENEDOR PRINCIPAL UNIFICADO */}
        <div className="surface-elevated max-w-5xl mx-auto">
          <div className="card-spacing">
            
            {/* HEADER CON SCORE */}
            <div className="text-center section-spacing">
              <div className="mb-6">
                <div className="inline-flex items-center gap-4 mb-4">
                  <Button
                    onClick={toggleTheme}
                    variant="secondary"
                    size="sm"
                    buttonType="ghost"
                    icon={theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
                  />
                  <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 'var(--font-weight-bold)' }}>
                    Sesión Completada
                  </h1>
                </div>
                <p style={{ fontSize: 'var(--font-size-xl)', color: 'var(--text-secondary)' }}>
                  {lastSession.config.mode === 'flashcards' ? 'Modo Flash Cards' : 'Modo Test de Práctica'}
                </p>
              </div>
              
              {/* SCORE PRINCIPAL */}
              <div className="mb-12">
                <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${scoreConfig.gradient} text-white shadow-xl mb-4`}>
                  <span style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 'var(--font-weight-bold)' }}>
                    {scorePercentage}%
                  </span>
                </div>
                <div className={`inline-block px-6 py-3 rounded-xl ${scoreConfig.bg}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{scoreConfig.icon}</span>
                    <div>
                      <p className={`font-semibold text-lg ${scoreConfig.text}`}>
                        {scoreConfig.title}
                      </p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                        {scoreConfig.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MÉTRICAS PRINCIPALES */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 section-spacing">
              <div className="text-center p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)' }}>
                  {lastSession.totalQuestions}
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>
                  Total de Preguntas
                </div>
              </div>
              
              <div className="text-center p-4 rounded-xl bg-green-50 border border-green-100">
                <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)' }} className="text-green-600">
                  {lastSession.correctAnswers}
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>
                  Respuestas Correctas
                </div>
              </div>
              
              <div className="text-center p-4 rounded-xl bg-red-50 border border-red-100">
                <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)' }} className="text-red-600">
                  {lastSession.totalQuestions - lastSession.correctAnswers}
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>
                  Respuestas Incorrectas
                </div>
              </div>
              
              <div className="text-center p-4 rounded-xl bg-yellow-50 border border-yellow-100">
                <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)' }} className="text-yellow-600">
                  {lastSession.questions.filter(q => q.skipped).length}
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>
                  Preguntas Saltadas
                </div>
              </div>
            </div>

            {/* DETALLES DE LA SESIÓN */}
            <div className="section-spacing">
              <h2 className="border-b pb-3" style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-lg)', borderColor: 'var(--border-light)' }}>
                Detalles de la Sesión
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: 'var(--border-light)' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>Duración total:</span>
                    <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>{sessionDuration} minutos</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>Porcentaje de aciertos:</span>
                    <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>{scorePercentage}%</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: 'var(--border-light)' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>Fecha de realización:</span>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                      {new Date(lastSession.startTime).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>Hora de finalización:</span>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                      {new Date(lastSession.startTime).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* MAPA DE RESPUESTAS */}
            <div className="section-spacing">
              <h2 className="border-b pb-3" style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-lg)', borderColor: 'var(--border-light)' }}>
                Mapa de Respuestas
              </h2>
              
              <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-15 xl:grid-cols-20 gap-2 mb-6">
                {lastSession.questions.map((sessionQuestion) => {
                  const question = getQuestionById(sessionQuestion.questionId);
                  if (!question) return null;

                  return (
                    <Button
                      key={sessionQuestion.questionId}
                      onClick={() => showQuestionModal(sessionQuestion.questionId)}
                      variant={
                        sessionQuestion.skipped ? 'warning' : 
                        sessionQuestion.answered && sessionQuestion.isCorrect ? 'success' : 
                        sessionQuestion.answered && !sessionQuestion.isCorrect ? 'danger' : 'secondary'
                      }
                      size="sm"
                      buttonType="outline"
                      className="min-h-[2.5rem] text-sm"
                      title={`Pregunta ${question.question_number} - ${
                        sessionQuestion.skipped ? 'Saltada' : 
                        sessionQuestion.isCorrect ? 'Correcta' : 'Incorrecta'
                      }`}
                    >
                      {question.question_number}
                    </Button>
                  );
                })}
              </div>
              
              {/* Leyenda */}
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>Correcta</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>Incorrecta</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>Saltada</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>No respondida</span>
                </div>
              </div>
            </div>

            {/* ACCIONES */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t" style={{ borderColor: 'var(--border-light)' }}>
              <Button
                onClick={() => navigate('/study')}
                variant="primary"
                size="lg"
                icon={<BookIcon />}
                className="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Ir a Estudiar
              </Button>
              
              <Button
                onClick={startNewSession}
                variant="secondary"
                size="lg"
                icon={<RefreshIcon />}
              >
                Repetir Test
              </Button>
              
              {failedQuestions.length > 0 && (
                <Button
                  onClick={practiceFailedQuestions}
                  variant="warning"
                  size="lg"
                  icon={<ClipboardIcon />}
                  className="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Practicar Falladas ({failedQuestions.length})
                </Button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Modal de pregunta */}
      {renderQuestionModal()}
    </div>
  );
};

export default StudyResultsPage;
