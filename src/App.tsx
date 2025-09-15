import { useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CreateQuestionPage from './pages/CreateQuestionPage';
import ViewQuestionsPage from './pages/ViewQuestionsPage';
import ImportPDFPage from './pages/ImportPDFPage';
import TestAPIPage from './pages/TestAPIPage';
import StudyPage from './pages/StudyPage';
import StudyFlashCardsPage from './pages/StudyFlashCardsPage';
import StudyExamPage from './pages/StudyExamPage';
import StudyResultsPage from './pages/StudyResultsPage';
import ButtonDemoPage from './pages/ButtonDemoPage';
import IconPreviewPage from './pages/IconPreviewPage';
import AlertModal from './components/common/AlertModal';
import ConfirmModal from './components/common/ConfirmModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAppState } from './hooks/useAppState';
import { useAlert } from './hooks/useAlert';
import { useConfirm } from './hooks/useConfirm';
import type { QuestionFormData, Question } from './types/Question';

function App() {
  const navigate = useNavigate();
  
  const {
    questions,
    addQuestion,
    addQuestionsWithNumbers,
    removeQuestion,
    updateQuestion,
    clearAllQuestions,
    getNextQuestionNumber,
    isLoaded: questionsLoaded
  } = useLocalStorage();

  const appState = useAppState();
  
  // Hooks para modales
  const { 
    isAlertOpen, 
    alertMessage, 
    alertOptions, 
    showAlert: showAlertRaw, 
    hideAlert 
  } = useAlert();
  
  const { 
    isConfirmOpen, 
    confirmMessage, 
    confirmOptions, 
    confirmCallback, 
    showConfirm: showConfirmRaw, 
    hideConfirm 
  } = useConfirm();

  // Envolver en useCallback para evitar re-renders
  const showAlert = useCallback(showAlertRaw, [showAlertRaw]);
  const showConfirm = useCallback(showConfirmRaw, [showConfirmRaw]);

  const handleSubmitQuestion = (formData: QuestionFormData) => {
    // Convertir las opciones del formulario al formato correcto
    const optionsWithLetters = formData.options.map((option, index) => ({
      option_letter: String.fromCharCode(65 + index), // A, B, C, D...
      option_text: option.option_text,
      is_correct: option.is_correct
    }));

    addQuestion({
      question_text: formData.question_text,
      options: optionsWithLetters,
      requires_multiple_answers: formData.requires_multiple_answers,
      explanation: formData.explanation,
      link: formData.link
    });
  };

  const handleImportQuestions = (importedQuestions: Question[]) => {
    // Las preguntas importadas ya vienen con números asignados correctamente
    addQuestionsWithNumbers(importedQuestions);

    // Navegar a la página de ver preguntas para ver las preguntas agregadas
    navigate('/study-lab/questions');
  };

  // Mostrar loading mientras se cargan los datos del localStorage
  if (!questionsLoaded || !appState.isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white min-h-screen">
        <Header questions={questions} />

  <main className="main-content pt-20">
          <div className="px-4 sm:px-6 lg:px-8">
            <Routes>
            <Route 
              path="/study-lab/" 
              element={<HomePage />} 
            />
            <Route 
              path="/study-lab/create" 
              element={
                <CreateQuestionPage
                  onSubmit={handleSubmitQuestion}
                  nextQuestionNumber={getNextQuestionNumber()}
                />
              } 
            />
            <Route 
              path="/study-lab/questions" 
              element={
                <ViewQuestionsPage
                  questions={questions}
                  onRemoveQuestion={removeQuestion}
                  onUpdateQuestion={updateQuestion}
                  onClearAll={clearAllQuestions}
                  showAlert={showAlert}
                  showConfirmModal={showConfirm}
                />
              } 
            />
            <Route 
              path="/study-lab/import" 
              element={
                <ImportPDFPage
                  onImportQuestions={handleImportQuestions}
                  appState={appState}
                  nextQuestionNumber={getNextQuestionNumber()}
                  showAlert={showAlert}
                  showConfirm={showConfirm}
                />
              } 
            />
            <Route 
              path="/study-lab/api-test" 
              element={
                <TestAPIPage
                  appState={appState}
                  showAlert={showAlert}
                />
              } 
            />
            {/* Mantener /test como alias para compatibilidad */}
            <Route 
              path="/study-lab/test" 
              element={
                <TestAPIPage
                  appState={appState}
                  showAlert={showAlert}
                />
              } 
            />
            <Route 
              path="/study-lab/study" 
              element={<StudyPage />} 
            />
            <Route 
              path="/study-lab/study/flashcards" 
              element={<StudyFlashCardsPage showConfirm={showConfirm} />} 
            />
            <Route 
              path="/study-lab/study/exam" 
              element={<StudyExamPage />} 
            />
            {/* Mantener /study/test como alias para compatibilidad */}
            <Route 
              path="/study-lab/study/test" 
              element={<StudyExamPage />} 
            />
            <Route 
              path="/study-lab/study/session-results" 
              element={<StudyResultsPage />} 
            />
            {/* Mantener /study/results como alias para compatibilidad */}
            <Route 
              path="/study-lab/study/results" 
              element={<StudyResultsPage />} 
            />
            {/* Rutas de desarrollo/demo */}
            <Route 
              path="/study-lab/dev/buttons" 
              element={<ButtonDemoPage />} 
            />
            <Route 
              path="/study-lab/dev/icons" 
              element={<IconPreviewPage />} 
            />
          </Routes>
          </div>
        </main>

        {/* Modales */}
        <AlertModal
          isOpen={isAlertOpen}
          onClose={hideAlert}
          title={alertOptions.title}
          message={alertMessage}
          type={alertOptions.type}
          buttonText={alertOptions.buttonText}
        />

        <ConfirmModal
          isOpen={isConfirmOpen}
          onConfirm={confirmCallback || (() => {})}
          onCancel={hideConfirm}
          title={confirmOptions.title}
          message={confirmMessage}
          confirmText={confirmOptions.confirmText}
          cancelText={confirmOptions.cancelText}
          type={confirmOptions.type}
        />
      </div>
    </div>
  );
}

export default App;
