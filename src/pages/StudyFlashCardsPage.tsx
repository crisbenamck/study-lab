import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useStudyStorage } from '../hooks/useStudyStorage';
import { useStudySession } from '../hooks/useStudySession';
import { 
  FlashCard, 
  LoadingState 
} from '../components/flashcards';
import ActivityHeader from '../components/common/ActivityHeader';
import { getScopeText } from '../utils/sessionHelpers';
import { BookIcon } from '../icons';

interface StudyFlashCardsPageProps {
  showConfirm: (message: string, onConfirm: () => void) => void;
}

const StudyFlashCardsPage: React.FC<StudyFlashCardsPageProps> = ({ showConfirm }) => {
  const navigate = useNavigate();
  const { questions } = useLocalStorage();
  const { currentSession, completeSession, abandonSession, isLoaded, createStudySession } = useStudyStorage();
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  const {
    currentQuestionIndex,
    goToNext,
    goToPrevious,
    canGoNext,
    canGoPrevious,
  getCurrentQuestion,
  } = useStudySession(currentSession, questions);

  // Check if there is an active session
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!hasCheckedSession) {
      setHasCheckedSession(true);
      // Check if there is a saved config to repeat flashcards
      const repeatConfig = localStorage.getItem('repeat-session-config');

      if (repeatConfig && !currentSession) {
        try {
          const config = JSON.parse(repeatConfig);
          createStudySession(config, questions);
          // Clean up temporary config
          localStorage.removeItem('repeat-session-config');
        } catch {
          localStorage.removeItem('repeat-session-config');
          navigate('/study');
        }
      } else {
        // Add a small delay to ensure the session is created
        setTimeout(() => {
          if (!currentSession || currentSession.config.mode !== 'flashcards') {
            navigate('/study');
          }
        }, 100);
      }
    }
  }, [currentSession, navigate, isLoaded, hasCheckedSession, createStudySession, questions]);

  // Handle navigation to next
  const handleNext = () => {
    if (canGoNext()) {
      goToNext();
    } else {
      // Es la última pregunta, completar sesión
      handleComplete();
    }
  };

  // Complete flashcards session
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
          navigate('/study/session-results');
        }
      );
    } catch {
      // El usuario canceló
    }
  };

  // Handle early exit
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

  if (!currentSession || !currentQuestion) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header unificado */}
        <ActivityHeader
          icon={<BookIcon className="w-5 h-5" />}
          title="Modo Flashcards"
          subtitle={getScopeText(currentSession.config)}
          progressCurrent={currentQuestionIndex}
          progressTotal={currentSession.questions.length}
          onExit={handleExit}
          showProgressBar={true}
        />

        {/* Contenido principal */}
        <FlashCard
          question={currentQuestion}
          onNext={handleNext}
          onPrevious={goToPrevious}
          canGoNext={canGoNext() || currentQuestionIndex === currentSession.questions.length - 1}
          canGoPrevious={canGoPrevious()}
        />
      </div>
    </div>
  );
};

export default StudyFlashCardsPage;
