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
  const [randomCount, setRandomCount] = useState<string>('60');
  const [showAnswersMode, setShowAnswersMode] = useState<ShowAnswersMode>('end');
  const [timeLimit, setTimeLimit] = useState<string>('');

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
    
    const minNum = Math.min(...questions.map(q => q.question_number));
    const maxNum = Math.max(...questions.map(q => q.question_number));
    
    return `${questions.length} preguntas disponibles (${minNum} - ${maxNum})`;
  };

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
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

          <div className="space-y-6">
            {/* Selección de modalidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Modalidad de Estudio
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                    mode === 'flashcards'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setMode('flashcards')}
                >
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      name="mode"
                      value="flashcards"
                      checked={mode === 'flashcards'}
                      onChange={(e) => setMode(e.target.value as StudyMode)}
                      className="mr-2"
                    />
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
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      name="mode"
                      value="test"
                      checked={mode === 'test'}
                      onChange={(e) => setMode(e.target.value as StudyMode)}
                      className="mr-2"
                    />
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
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preguntas a Estudiar
              </label>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="scope"
                    value="all"
                    checked={scope === 'all'}
                    onChange={(e) => setScope(e.target.value as StudyScope)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">
                    Todas las preguntas ({questions.length})
                  </span>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    name="scope"
                    value="range"
                    checked={scope === 'range'}
                    onChange={(e) => setScope(e.target.value as StudyScope)}
                    className="mr-2"
                  />
                  <span className="text-gray-700 mr-4">Rango específico:</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Desde"
                      value={rangeStart}
                      onChange={(e) => setRangeStart(e.target.value)}
                      disabled={scope !== 'range'}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                    />
                    <span className="text-gray-500">a</span>
                    <input
                      type="number"
                      placeholder="Hasta"
                      value={rangeEnd}
                      onChange={(e) => setRangeEnd(e.target.value)}
                      disabled={scope !== 'range'}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    name="scope"
                    value="random"
                    checked={scope === 'random'}
                    onChange={(e) => setScope(e.target.value as StudyScope)}
                    className="mr-2"
                  />
                  <span className="text-gray-700 mr-4">Preguntas aleatorias:</span>
                  <input
                    type="number"
                    placeholder="Cantidad"
                    value={randomCount}
                    onChange={(e) => setRandomCount(e.target.value)}
                    disabled={scope !== 'random'}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                    max={questions.length}
                  />
                  <span className="text-gray-500 ml-2 text-sm">
                    (máx. {questions.length})
                  </span>
                </div>
              </div>
            </div>

            {/* Configuración específica para Test */}
            {mode === 'test' && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-medium text-gray-800">Configuración del Test</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mostrar Respuestas
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="showAnswers"
                        value="immediate"
                        checked={showAnswersMode === 'immediate'}
                        onChange={(e) => setShowAnswersMode(e.target.value as ShowAnswersMode)}
                        className="mr-2"
                      />
                      <span className="text-gray-700">
                        Inmediatamente después de cada pregunta
                      </span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="showAnswers"
                        value="end"
                        checked={showAnswersMode === 'end'}
                        onChange={(e) => setShowAnswersMode(e.target.value as ShowAnswersMode)}
                        className="mr-2"
                      />
                      <span className="text-gray-700">
                        Al finalizar todo el test
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Límite de Tiempo (opcional)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Minutos"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(e.target.value)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      min="1"
                    />
                    <span className="text-gray-500 text-sm">minutos</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Deja vacío para tiempo ilimitado
                  </p>
                </div>
              </div>
            )}

            {/* Botón de inicio */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleStartStudy}
                disabled={questions.length === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
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
