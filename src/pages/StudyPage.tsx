import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useStudyStorage } from '../hooks/useStudyStorage';
import { useAlert } from '../hooks/useAlert';
import type { StudySessionConfig, StudyMode, StudyScope, ShowAnswersMode } from '../types/StudySession';

const StudyPage: React.FC = () => {
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

  // Iniciar sesión de estudio
  const handleStartStudy = () => {
    console.log('🚀 Iniciando sesión de estudio...');
    console.log('Mode:', mode);
    console.log('Questions:', questions);
    
    const error = validateConfig();
    if (error) {
      console.log('❌ Error de validación:', error);
      showAlert(error);
      return;
    }

    const config: StudySessionConfig = {
      mode,
      scope,
      rangeStart: scope === 'range' ? parseInt(rangeStart) : undefined,
      rangeEnd: scope === 'range' ? parseInt(rangeEnd) : undefined,
      randomCount: scope === 'random' ? parseInt(randomCount) : undefined,
      showAnswersMode,
      timeLimit: timeLimit ? parseInt(timeLimit) : undefined,
    };

    console.log('📋 Config:', config);

    try {
      const session = createStudySession(config, questions);
      console.log('✅ Sesión creada:', session);
      
      if (mode === 'flashcards') {
        console.log('🎯 Navegando a /study/flashcards');
        navigate('/study/flashcards');
      } else {
        console.log('🎯 Navegando a /study/test');
        navigate('/study/test');
      }
    } catch (error) {
      console.error('❌ Error creando sesión:', error);
    }
  };

  const getAvailableQuestionsText = () => {
    if (questions.length === 0) return 'No hay preguntas disponibles';
    
    return `${questions.length} preguntas disponibles`;
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mx-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Estudiar
          </h1>
          <p className="text-gray-600 mb-6">
            Configura tu sesión de estudio y elige cómo quieres practicar.
          </p>

          {/* Estado de preguntas disponibles */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 font-medium">
              📚 {getAvailableQuestionsText()}
            </p>
          </div>

          <div className="space-y-8">
            {/* Selección de modalidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3" style={{ marginBottom: '1.5rem' }}>
                Modalidad de Estudio
              </label>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div
                  className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                    mode === 'flashcards'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setMode('flashcards')}
                >
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-800">Flash Cards</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Tarjetas interactivas con preguntas y respuestas. Perfecto para memorización y repaso rápido.
                  </p>
                </div>

                <div
                  className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                    mode === 'test'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setMode('test')}
                >
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-800">Test de Práctica</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Examen con preguntas de opción múltiple. Incluye puntuación y análisis de resultados.
                  </p>
                </div>
              </div>
            </div>

            {/* Alcance de preguntas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4" style={{ marginTop: '1rem' }}>
                Preguntas a Estudiar
              </label>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className={`flex items-center p-4 border-2 rounded-lg hover:border-gray-300 transition-colors cursor-pointer ${
                  scope === 'all' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`} onClick={() => setScope('all')}>
                  <div>
                    <span className="font-medium text-gray-700">
                      Todas las preguntas
                    </span>
                    <p className="text-sm text-gray-500">
                      {questions.length} preguntas disponibles
                    </p>
                  </div>
                </div>

                <div className={`flex items-center p-4 border-2 rounded-lg hover:border-gray-300 transition-colors cursor-pointer ${
                  scope === 'range' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`} onClick={() => setScope('range')}>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">Rango específico</span>
                      {scope === 'range' && (
                        <div className="relative group">
                          <div className="text-blue-500 cursor-help">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="absolute right-0 top-6 z-10 w-48 bg-gray-700 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" style={{ padding: '12px' }}>
                            Ingresa el rango de preguntas a estudiar
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Desde"
                        value={rangeStart}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          setRangeStart(value);
                          validateRange(value, rangeEnd);
                        }}
                        disabled={scope !== 'range'}
                        className={`w-20 px-2 py-1 border rounded text-sm transition-colors ${
                          scope === 'range'
                            ? 'border-blue-400 bg-white text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-200'
                            : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        }`}
                        style={{ appearance: 'textfield' }}
                      />
                      <span className={`transition-colors ${scope === 'range' ? 'text-gray-700' : 'text-gray-400'}`}>a</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Hasta"
                        value={rangeEnd}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          setRangeEnd(value);
                          validateRange(rangeStart, value);
                        }}
                        disabled={scope !== 'range'}
                        className={`w-20 px-2 py-1 border rounded text-sm transition-colors ${
                          scope === 'range'
                            ? 'border-blue-400 bg-white text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-200'
                            : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        }`}
                        style={{ appearance: 'textfield' }}
                      />
                    </div>
                    {rangeError && scope === 'range' && (
                      <p className="text-xs text-red-500 mt-1">{rangeError}</p>
                    )}
                  </div>
                </div>

                <div className={`flex items-center p-4 border-2 rounded-lg hover:border-gray-300 transition-colors cursor-pointer ${
                  scope === 'random' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`} onClick={() => setScope('random')}>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">Preguntas aleatorias</span>
                      {scope === 'random' && (
                        <div className="relative group">
                          <div className="text-blue-500 cursor-help">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="absolute right-0 top-6 z-10 w-56 bg-gray-700 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" style={{ padding: '12px' }}>
                            Selecciona cuántas preguntas aleatorias quieres estudiar
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Cantidad"
                        value={randomCount}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          setRandomCount(value);
                        }}
                        disabled={scope !== 'random'}
                        className={`flex-1 px-2 py-1 border rounded text-sm transition-colors ${
                          scope === 'random'
                            ? 'border-blue-400 bg-white text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-200'
                            : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        }`}
                        style={{ 
                          appearance: 'textfield'
                        }}
                      />
                      <span className={`text-sm whitespace-nowrap transition-colors ${
                        scope === 'random' ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        (máx. {questions.length})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Configuración específica para Test */}
            {mode === 'test' && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6" style={{ marginTop: '2rem' }}>
                <h3 className="text-lg font-medium text-gray-800 mb-6">
                  Configuración del Test
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium text-gray-700">
                        Mostrar Respuestas
                      </label>
                      <div className="relative group">
                        <div className="text-blue-500 cursor-help">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="absolute right-0 top-6 z-10 w-64 bg-gray-700 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" style={{ padding: '12px' }}>
                          Elige cuándo quieres ver las respuestas correctas durante el test
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div 
                        className={`flex items-center p-4 border-2 rounded-lg hover:border-gray-300 transition-all cursor-pointer ${
                          showAnswersMode === 'immediate' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200'
                        }`}
                        onClick={() => setShowAnswersMode('immediate')}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                            showAnswersMode === 'immediate' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                          }`}>
                            {showAnswersMode === 'immediate' && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 block">
                              Inmediatamente
                            </span>
                            <p className="text-sm text-gray-500">
                              Después de cada pregunta
                            </p>
                          </div>
                        </div>
                      </div>
                      <div 
                        className={`flex items-center p-4 border-2 rounded-lg hover:border-gray-300 transition-all cursor-pointer ${
                          showAnswersMode === 'end' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200'
                        }`}
                        onClick={() => setShowAnswersMode('end')}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                            showAnswersMode === 'end' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                          }`}>
                            {showAnswersMode === 'end' && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 block">
                              Al finalizar
                            </span>
                            <p className="text-sm text-gray-500">
                              Todo el test completo
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium text-gray-700">
                        Límite de Tiempo (opcional)
                      </label>
                      <div className="relative group">
                        <div className="text-blue-500 cursor-help">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="absolute right-0 top-6 z-10 w-64 bg-gray-700 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" style={{ padding: '12px' }}>
                          Establece un tiempo límite para completar el test. Deja vacío para tiempo ilimitado
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="Ej: 30"
                            value={timeLimit}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              setTimeLimit(value);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            style={{ appearance: 'textfield' }}
                          />
                        </div>
                        <span className="text-gray-600 text-sm font-medium whitespace-nowrap">minutos</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Deja vacío para tiempo ilimitado
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Botón de inicio */}
            <div style={{ 
              borderTop: '1px solid #e5e7eb', 
              paddingTop: '3rem', 
              marginTop: '2rem', 
              display: 'flex', 
              justifyContent: 'center' 
            }}>
              <button
                onClick={handleStartStudy}
                disabled={questions.length === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                {mode === 'flashcards' ? 'Iniciar Flash Cards' : 'Iniciar Test'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPage;
