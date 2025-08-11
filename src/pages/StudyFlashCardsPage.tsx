import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useStudyStorage } from '../hooks/useStudyStorage';
import { useStudySession } from '../hooks/useStudySession';
import { 
  FlashCard, 
  FlashCardsHeader, 
  LoadingState 
} from '../components/flashcards';

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
      
      // Verificar si hay una configuración guardada para repetir flashcards
      const repeatConfig = localStorage.getItem('repeat-session-config');
      
      if (repeatConfig && !currentSession) {
        try {
          const config = JSON.parse(repeatConfig);
          console.log('🔄 Configuración para repetir encontrada:', config);
          
          // Crear nueva sesión con la configuración guardada
          createStudySession(config, questions);
          console.log('✅ Nueva sesión creada para repetir flashcards');
          
          // Limpiar la configuración temporal
          localStorage.removeItem('repeat-session-config');
          
        } catch (error) {
          console.error('❌ Error al crear sesión para repetir:', error);
          localStorage.removeItem('repeat-session-config');
          navigate('/study');
        }
      } else {
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
    }
  }, [currentSession, navigate, isLoaded, hasCheckedSession, createStudySession, questions]);

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
          navigate('/study/session-results');
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

  if (!currentSession || !currentQuestion) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header fijo */}
  <FlashCardsHeader
          currentSession={currentSession}
          onExit={handleExit}
        />

        {/* Contenido principal */}
        <FlashCard
          question={currentQuestion}
          onNext={handleNext}
          onPrevious={goToPrevious}
          canGoNext={canGoNext() || currentQuestionIndex === currentSession.questions.length - 1}
          canGoPrevious={canGoPrevious()}
          currentIndex={currentQuestionIndex}
          totalQuestions={currentSession.questions.length}
        />


      </div>
    </div>
  );
};

export default StudyFlashCardsPage;
