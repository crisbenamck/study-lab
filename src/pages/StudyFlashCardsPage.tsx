import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useStudyStorage } from '../hooks/useStudyStorage';
import { useStudySession } from '../hooks/useStudySession';
import FlashCard from '../components/study/FlashCard';

interface StudyFlashCardsPageProps {
  showConfirm: (message: string, onConfirm: () => void) => void;
}

const StudyFlashCardsPage: React.FC<StudyFlashCardsPageProps> = ({ showConfirm }) => {
  const navigate = useNavigate();
  const { questions } = useLocalStorage();
  const { currentSession, completeSession, abandonSession, isLoaded } = useStudyStorage();
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  const {
    currentQuestionIndex,
    goToNext,
    goToPrevious,
    canGoNext,
    canGoPrevious,
    getCurrentQuestion,
    getProgress,
  } = useStudySession(currentSession, questions);

  // Verificar si hay sesión activa
  useEffect(() => {
    console.log('📱 StudyFlashCardsPage - currentSession:', currentSession, 'isLoaded:', isLoaded);
    
    // Esperar a que se cargue el estado antes de verificar
    if (!isLoaded) {
      console.log('⏳ Esperando a que se cargue el estado...');
      return;
    }

    if (!hasCheckedSession) {
      setHasCheckedSession(true);
      
      // Dar un pequeño delay para asegurar que la sesión se haya creado
      setTimeout(() => {
        if (!currentSession || currentSession.config.mode !== 'flashcards') {
          console.log('❌ No hay sesión válida, redirigiendo a /study');
          navigate('/study');
        } else {
          console.log('✅ Sesión válida encontrada');
        }
      }, 100);
    }
  }, [currentSession, navigate, isLoaded, hasCheckedSession]);

  // Manejar navegación hacia siguiente
  const handleNext = () => {
    if (canGoNext()) {
      goToNext();
    } else {
      // Es la última pregunta, completar sesión
      handleComplete();
    }
  };

  // Completar sesión de flash cards
  const handleComplete = async () => {
    if (!currentSession) return;

    try {
      await showConfirm(
        '¿Has terminado de revisar las flash cards?',
        () => {
          // Actualizar todas las preguntas como "vistas"
          const updatedSession = {
            ...currentSession,
            questions: currentSession.questions.map(q => ({
              ...q,
              answered: true,
              timeSpent: 0, // En flash cards no medimos tiempo específico
            })),
            correctAnswers: currentSession.questions.length, // Asumimos que todas se "completaron"
          };

          completeSession(updatedSession);
          navigate('/study/results');
        }
      );
    } catch {
      // El usuario canceló
    }
  };

  // Manejar salida prematura
  const handleExit = async () => {
    try {
      await showConfirm(
        '¿Estás seguro de que quieres salir?',
        () => {
          abandonSession();
          navigate('/study');
        }
      );
    } catch {
      // El usuario canceló
    }
  };

  const currentQuestion = getCurrentQuestion();
  const progress = getProgress();

  if (!currentSession || !currentQuestion) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-gray-600">Cargando sesión de estudio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fijo */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Flash Cards - Modo Estudio
              </h1>
              <p className="text-sm text-gray-600">
                {currentSession.config.scope === 'all' && 'Todas las preguntas'}
                {currentSession.config.scope === 'range' && 
                  `Preguntas ${currentSession.config.rangeStart} - ${currentSession.config.rangeEnd}`}
                {currentSession.config.scope === 'random' && 
                  `${currentSession.config.randomCount} preguntas aleatorias`}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {progress.current} / {progress.total}
              </div>
              <button
                onClick={handleExit}
                className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm border border-red-300 rounded-lg hover:border-red-400 transition-colors font-medium"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container py-8">
        <FlashCard
          question={currentQuestion}
          onNext={handleNext}
          onPrevious={goToPrevious}
          canGoNext={canGoNext() || currentQuestionIndex === currentSession.questions.length - 1}
          canGoPrevious={canGoPrevious()}
          currentIndex={currentQuestionIndex}
          totalQuestions={currentSession.questions.length}
        />

        {/* Botón de completar cuando sea la última pregunta */}
        {currentQuestionIndex === currentSession.questions.length - 1 && (
          <div className="max-w-2xl mx-auto mt-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-800 mb-3">
                🎉 ¡Has llegado al final de las flash cards!
              </p>
              <button
                onClick={handleComplete}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Completar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyFlashCardsPage;
