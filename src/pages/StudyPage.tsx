import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useStudyStorage } from '../hooks/useStudyStorage';
import { useAlert } from '../hooks/useAlert';
import Layout from '../components/Layout';
import PageHeader from '../components/common/PageHeader';
import EmptyLibraryActions from '../components/common/EmptyLibraryActions';
import StudyModeSelector from '../components/study/StudyModeSelector';
import QuestionScopeSelector from '../components/study/QuestionScopeSelector';
import ExamConfiguration from '../components/study/ExamConfiguration';
import StartStudyButton from '../components/study/StartStudyButton';
import type { StudySessionConfig, StudyMode, StudyScope, ShowAnswersMode } from '../types/StudySession';

const StudyPage: React.FC = () => {
  const navigate = useNavigate();
  const { questions } = useLocalStorage();
  const { createStudySession } = useStudyStorage();
  const { showAlert } = useAlert();

  const [mode, setMode] = useState<StudyMode>('flashcards');
  const [scope, setScope] = useState<StudyScope | null>(null);
  const [rangeStart, setRangeStart] = useState<string>('');
  const [rangeEnd, setRangeEnd] = useState<string>('');
  const [randomCount, setRandomCount] = useState<string>('');
  const [showAnswersMode, setShowAnswersMode] = useState<ShowAnswersMode>('end');
  const [timeLimit, setTimeLimit] = useState<string>('');
  const [rangeError, setRangeError] = useState<string>('');

  // Initialize randomCount with a default value when questions are loaded
  useEffect(() => {
    if (questions.length > 0 && randomCount === '') {
      const defaultCount = Math.min(60, questions.length);
      setRandomCount(defaultCount.toString());
    }
  }, [questions.length, randomCount]);

  // Validate range when values change
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

  // Handlers for value changes
  const handleRangeStartChange = (value: string) => {
    setRangeStart(value);
    validateRange(value, rangeEnd);
  };

  const handleRangeEndChange = (value: string) => {
    setRangeEnd(value);
    validateRange(rangeStart, value);
  };

  // Validate configuration before starting session
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

  // Start a new study session with validated config
  const startStudySession = () => {
    const validation = validateConfig();
    if (validation) {
      showAlert(validation, { type: 'error' });
      return;
    }
    const config: StudySessionConfig = {
      mode,
      scope: scope || 'all', // Use 'all' if scope is null
      rangeStart: scope === 'range' ? parseInt(rangeStart) : undefined,
      rangeEnd: scope === 'range' ? parseInt(rangeEnd) : undefined,
      randomCount: scope === 'random' ? parseInt(randomCount) : undefined,
      showAnswersMode: mode === 'exam' ? showAnswersMode : 'end',
      timeLimit: mode === 'exam' && timeLimit ? parseInt(timeLimit) : undefined
    };
    createStudySession(config, questions);
    // Navigate to the corresponding page
    const targetPath = mode === 'flashcards' ? '/study/flashcards' : '/study/exam';
    navigate(targetPath);
  };

  return (
    <Layout>
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <PageHeader
            title="Centro de Estudio"
            description="Centro de control para tus sesiones de estudio. Crea preguntas, importa contenido o configura tu práctica personalizada."
          />

          {/* Show empty state if there are no questions */}
          {questions.length === 0 ? (
            <EmptyLibraryActions
              onCreate={() => window.location.href = '/create'}
              onImport={() => window.location.href = '/import'}
            />
          ) : (
            <>
              <StudyModeSelector 
                mode={mode} 
                onModeChange={setMode} 
              />

              <QuestionScopeSelector
                scope={scope || 'all'}
                onScopeChange={setScope}
                questionsCount={questions.length}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                randomCount={randomCount}
                rangeError={rangeError}
                onRangeStartChange={handleRangeStartChange}
                onRangeEndChange={handleRangeEndChange}
                onRandomCountChange={setRandomCount}
              />

              {mode === 'exam' && (
                <ExamConfiguration
                  showAnswersMode={showAnswersMode}
                  onShowAnswersModeChange={setShowAnswersMode}
                  timeLimit={timeLimit}
                  onTimeLimitChange={setTimeLimit}
                />
              )}

              <StartStudyButton 
                mode={mode} 
                onStartSession={startStudySession} 
              />
            </>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default StudyPage;
