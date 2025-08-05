import { useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CreateQuestionPage from './pages/CreateQuestionPage';
import ViewQuestionsPage from './pages/ViewQuestionsPage';
import ImportPDFPage from './pages/ImportPDFPage';
import TestAPIPage from './pages/TestAPIPage';
import StudyPage from './pages/StudyPageNew';
import StudyFlashCardsPage from './pages/StudyFlashCardsPage';
import StudyTestPage from './pages/StudyTestPage';
import StudyResultsPage from './pages/StudyResultsPage';
import ButtonDemoPage from './pages/ButtonDemoPage';
import IconPreviewPage from './pages/IconPreviewPage';
import AlertModal from './components/AlertModal';
import ConfirmModal from './components/ConfirmModal';
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
    setCustomInitialNumber,
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
    navigate('/questions');
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
      <Header questions={questions} />
      
      {/* Spacer para compensar el header fijo */}
      <div style={{ height: '80px' }}></div>
      
      <main className="main-content bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route 
              path="/" 
              element={<HomePage />} 
            />
            <Route 
              path="/create" 
              element={
                <CreateQuestionPage
                  onSubmit={handleSubmitQuestion}
                  nextQuestionNumber={getNextQuestionNumber()}
                  onSetInitialNumber={setCustomInitialNumber}
                  showInitialNumberField={questions.length === 0}
                />
              } 
            />
            <Route 
              path="/questions" 
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
              path="/import" 
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
              path="/api-test" 
              element={
                <TestAPIPage
                  appState={appState}
                  showAlert={showAlert}
                />
              } 
            />
            {/* Mantener /test como alias para compatibilidad */}
            <Route 
              path="/test" 
              element={
                <TestAPIPage
                  appState={appState}
                  showAlert={showAlert}
                />
              } 
            />
            <Route 
              path="/study" 
              element={<StudyPage />} 
            />
            <Route 
              path="/study/flashcards" 
              element={<StudyFlashCardsPage showConfirm={showConfirm} />} 
            />
            <Route 
              path="/study/exam" 
              element={<StudyTestPage />} 
            />
            {/* Mantener /study/test como alias para compatibilidad */}
            <Route 
              path="/study/test" 
              element={<StudyTestPage />} 
            />
            <Route 
              path="/study/session-results" 
              element={<StudyResultsPage />} 
            />
            {/* Mantener /study/results como alias para compatibilidad */}
            <Route 
              path="/study/results" 
              element={<StudyResultsPage />} 
            />
            {/* Rutas de desarrollo/demo */}
            <Route 
              path="/dev/buttons" 
              element={<ButtonDemoPage />} 
            />
            <Route 
              path="/dev/icons" 
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
  );
}

export default App;
