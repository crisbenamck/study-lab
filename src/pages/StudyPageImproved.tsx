import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useStudyStorage } from '../hooks/useStudyStorage';
import { useAlert } from '../hooks/useAlert';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { PlusIcon, UploadIcon, TargetIcon } from '../components/icons';
import type { StudySessionConfig, StudyMode, StudyScope, ShowAnswersMode } from '../types/StudySession';

const StudyPageImproved: React.FC = () => {
  const navigate = useNavigate();
  const { questions } = useLocalStorage();
  const { createStudySession } = useStudyStorage();
  const { showAlert } = useAlert();

  const [mode, setMode] = useState<StudyMode>('flashcards');
  const [scope, setScope] = useState<StudyScope>('all');
  const [rangeStart, setRangeStart] = useState<string>('');
  const [rangeEnd, setRangeEnd] = useState<string>('');
  const [randomCount, setRandomCount] = useState<string>('');
  const [showAnswersMode, setShowAnswersMode] = useState<ShowAnswersMode>('end');
  const [timeLimit, setTimeLimit] = useState<string>('');
  const [rangeError, setRangeError] = useState<string>('');

  // Inicializar randomCount con valor por defecto
  React.useEffect(() => {
    if (questions.length > 0 && randomCount === '') {
      const defaultCount = Math.min(60, questions.length);
      setRandomCount(defaultCount.toString());
    }
  }, [questions.length, randomCount]);

  // Validar rango cuando cambian los valores
  const validateRange = (start: string, end: string) => {
    if (!start || !end) {
      setRangeError('');
      return;
    }

    const startNum = parseInt(start);
    const endNum = parseInt(end);

    if (isNaN(startNum) || isNaN(endNum)) {
      setRangeError('Los valores deben ser números válidos');
      return;
    }

    if (startNum < 1) {
      setRangeError('El número inicial no puede ser menor a 1');
      return;
    }

    if (questions.length > 0) {
      const maxQuestionNumber = Math.max(...questions.map(q => q.question_number));
      if (endNum > maxQuestionNumber) {
        setRangeError(`El número final no puede ser mayor a ${maxQuestionNumber}`);
        return;
      }
    }

    if (startNum > endNum) {
      setRangeError('El número inicial no puede ser mayor que el final');
      return;
    }

    setRangeError('');
  };

  // Validar configuración
  const validateConfig = (): string | null => {
    if (questions.length === 0) {
      return 'No hay preguntas disponibles. Crea algunas preguntas primero.';
    }

    if (scope === 'range') {
      const start = parseInt(rangeStart);
      const end = parseInt(rangeEnd);
      
      if (!rangeStart || !rangeEnd || isNaN(start) || isNaN(end)) {
        return 'Por favor ingresa un rango válido de preguntas.';
      }
      
      if (start > end) {
        return 'El número inicial no puede ser mayor que el final.';
      }
      
      const maxQuestionNumber = Math.max(...questions.map(q => q.question_number));
      const minQuestionNumber = Math.min(...questions.map(q => q.question_number));
      
      if (start < minQuestionNumber || end > maxQuestionNumber) {
        return `El rango debe estar entre ${minQuestionNumber} y ${maxQuestionNumber}.`;
      }
    }

    if (scope === 'random') {
      const count = parseInt(randomCount);
      if (!randomCount || isNaN(count) || count <= 0) {
        return 'Por favor ingresa un número válido de preguntas aleatorias.';
      }
      
      if (count > questions.length) {
        return `No puedes seleccionar más de ${questions.length} preguntas.`;
      }
    }

    return null;
  };

  // Función para iniciar sesión de estudio
  const startStudySession = () => {
    const validation = validateConfig();
    if (validation) {
      showAlert(validation, { type: 'error' });
      return;
    }

    const config: StudySessionConfig = {
      mode,
      scope,
      rangeStart: scope === 'range' ? parseInt(rangeStart) : undefined,
      rangeEnd: scope === 'range' ? parseInt(rangeEnd) : undefined,
      randomCount: scope === 'random' ? parseInt(randomCount) : undefined,
      showAnswersMode: mode === 'test' ? showAnswersMode : 'end', // Valor por defecto para flashcards
      timeLimit: mode === 'test' && timeLimit ? parseInt(timeLimit) : undefined
    };

    console.log('🚀 Iniciando sesión de estudio...');
    console.log('Mode:', mode);
    console.log('Questions:', questions);
    console.log('📋 Config:', config);

    const session = createStudySession(config, questions);
    console.log('✅ Sesión creada:', session);

    // Navegar a la página correspondiente
    const targetPath = mode === 'flashcards' ? '/study/flashcards' : '/study/exam';
    console.log('🎯 Navegando a', targetPath);
    navigate(targetPath);
  };

  if (questions.length === 0) {
    return (
      <Layout>
        <div className="py-16">
          <div className="surface-elevated card-spacing text-center max-w-2xl mx-auto">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
                <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-lg)' }}>
                No hay preguntas disponibles
              </h1>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
                Necesitas crear algunas preguntas antes de poder estudiar.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => navigate('/create')}
                variant="primary"
                size="lg"
                icon={<PlusIcon />}
                iconPosition="left"
              >
                Crear Preguntas
              </Button>
              <Button
                onClick={() => navigate('/import')}
                variant="secondary"
                buttonType="outline"
                size="lg"
                icon={<UploadIcon />}
                iconPosition="left"
              >
                Importar PDF
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-16">
        
        {/* CONTENEDOR PRINCIPAL UNIFICADO */}
        <div className="surface-elevated max-w-4xl mx-auto">
          <div className="card-spacing">
            
            {/* HEADER */}
            <div className="text-center section-spacing">
              <div className="mb-6">
                <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-lg)' }}>
                  Estudiar
                </h1>
                <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
                  Configura tu sesión de estudio y elige cómo quieres practicar.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                  <span className="text-2xl">📚</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-weight-medium)' }}>
                    {questions.length} pregunta{questions.length !== 1 ? 's' : ''} disponible{questions.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* MODALIDAD DE ESTUDIO */}
            <div className="section-spacing">
              <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-lg)' }}>
                Modalidad de Estudio
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setMode('flashcards')}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md ${
                    mode === 'flashcards'
                      ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      mode === 'flashcards' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-sm)' }}>
                        Flash Cards
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                        Tarjetas interactivas con preguntas y respuestas. Perfecto para memorización y repaso rápido.
                      </p>
                    </div>
                  </div>
                  {mode === 'flashcards' && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium">Seleccionado</span>
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setMode('test')}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md ${
                    mode === 'test'
                      ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      mode === 'test' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-sm)' }}>
                        Test de Práctica
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                        Examen con preguntas de opción múltiple. Incluye puntuación y análisis de resultados.
                      </p>
                    </div>
                  </div>
                  {mode === 'test' && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium">Seleccionado</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* PREGUNTAS A ESTUDIAR */}
            <div className="section-spacing">
              <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-lg)' }}>
                Preguntas a Estudiar
              </h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                {/* Todas las preguntas */}
                <button
                  onClick={() => setScope('all')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    scope === 'all'
                      ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-sm)' }}>
                      Todas las preguntas
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                      {questions.length} pregunta{questions.length !== 1 ? 's' : ''} disponible{questions.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </button>

                {/* Rango específico */}
                <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  scope === 'range'
                    ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200'
                    : 'border-gray-200'
                }`}>
                  <button
                    onClick={() => setScope('range')}
                    className="w-full text-left mb-3"
                  >
                    <div className="flex items-start gap-2">
                      <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)' }}>
                        Rango específico
                      </h3>
                      <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                      Ingresa el rango de preguntas a estudiar
                    </p>
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Desde"
                      value={rangeStart}
                      onChange={(e) => {
                        setRangeStart(e.target.value);
                        validateRange(e.target.value, rangeEnd);
                      }}
                      disabled={scope !== 'range'}
                      className="flex-1 p-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100 disabled:text-gray-500"
                      min="1"
                    />
                    <span className="text-gray-500 text-sm">a</span>
                    <input
                      type="number"
                      placeholder="Hasta"
                      value={rangeEnd}
                      onChange={(e) => {
                        setRangeEnd(e.target.value);
                        validateRange(rangeStart, e.target.value);
                      }}
                      disabled={scope !== 'range'}
                      className="flex-1 p-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100 disabled:text-gray-500"
                      min="1"
                    />
                  </div>
                  {rangeError && (
                    <p className="text-red-600 text-xs mt-2">{rangeError}</p>
                  )}
                </div>

                {/* Preguntas aleatorias */}
                <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  scope === 'random'
                    ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200'
                    : 'border-gray-200'
                }`}>
                  <button
                    onClick={() => setScope('random')}
                    className="w-full text-left mb-3"
                  >
                    <div className="flex items-start gap-2">
                      <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)' }}>
                        Preguntas aleatorias
                      </h3>
                      <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                      Selecciona cuántas preguntas aleatorias quieres estudiar
                    </p>
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Cantidad"
                      value={randomCount}
                      onChange={(e) => setRandomCount(e.target.value)}
                      disabled={scope !== 'random'}
                      className="flex-1 p-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100 disabled:text-gray-500"
                      min="1"
                      max={questions.length}
                    />
                    <span className="text-gray-500 text-xs">(máx. {questions.length})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CONFIGURACIÓN DEL TEST */}
            {mode === 'test' && (
              <div className="section-spacing">
                <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-lg)' }}>
                  Configuración del Test
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Mostrar respuestas */}
                  <div>
                    <div className="flex items-start gap-2 mb-3">
                      <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)' }}>
                        Mostrar Respuestas
                      </h3>
                      <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-sm)' }}>
                      Elige cuándo quieres ver las respuestas correctas durante el test
                    </p>
                    
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowAnswersMode('immediate')}
                        className={`w-full p-3 rounded-lg border transition-colors text-left ${
                          showAnswersMode === 'immediate'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <h4 className="font-medium mb-1">Inmediatamente</h4>
                        <p className="text-sm text-gray-600">Después de cada pregunta</p>
                      </button>
                      
                      <button
                        onClick={() => setShowAnswersMode('end')}
                        className={`w-full p-3 rounded-lg border transition-colors text-left ${
                          showAnswersMode === 'end'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <h4 className="font-medium mb-1">Al finalizar</h4>
                        <p className="text-sm text-gray-600">Todo el test completo</p>
                      </button>
                    </div>
                  </div>

                  {/* Límite de tiempo */}
                  <div>
                    <div className="flex items-start gap-2 mb-3">
                      <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)' }}>
                        Límite de Tiempo (opcional)
                      </h3>
                      <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-sm)' }}>
                      Establece un tiempo límite para completar el test. Deja vacío para tiempo ilimitado
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Ej: 30"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg"
                        min="1"
                      />
                      <span className="text-gray-500">minutos</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-2">
                      Deja vacío para tiempo ilimitado
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* BOTÓN DE INICIO */}
            <div className="flex justify-center pt-6 border-t" style={{ borderColor: 'var(--border-light)' }}>
              <Button
                onClick={startStudySession}
                variant="primary"
                size="xl"
                icon={<TargetIcon />}
                iconPosition="left"
              >
                Iniciar {mode === 'flashcards' ? 'Flash Cards' : 'Test'}
              </Button>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudyPageImproved;
