import { useState, useCallback } from 'react';
import Header from './components/Header';
import QuestionForm from './components/QuestionForm';
import QuestionManager from './components/QuestionManager';
import PDFImport from './components/PDFImport';
import GeminiTest from './components/GeminiTest';
import AlertModal from './components/AlertModal';
import ConfirmModal from './components/ConfirmModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAppState } from './hooks/useAppState';
import { useAlert } from './hooks/useAlert';
import { useConfirm } from './hooks/useConfirm';
import type { QuestionFormData, Question } from './types/Question';

type TabType = 'manual' | 'view' | 'import' | 'test';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('manual');
  
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

    // Cambiar a la pestaña de ver preguntas para ver las preguntas agregadas
    setActiveTab('view');
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
      <Header 
        questions={questions}
        onClearAll={clearAllQuestions}
        showAlert={showAlert}
        showConfirm={showConfirm}
      />
      
      {/* Navegación por pestañas */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-1">
            <button
              onClick={() => setActiveTab('manual')}
              className={`relative px-6 py-4 text-sm font-semibold rounded-t-lg transition-all duration-200 border-0 ${
                activeTab === 'manual'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
              }`}
              style={{
                marginBottom: activeTab === 'manual' ? '0' : '2px',
                zIndex: activeTab === 'manual' ? '10' : '1',
                backgroundColor: activeTab === 'manual' ? '#2563eb' : '#f3f4f6',
                color: activeTab === 'manual' ? '#ffffff' : '#4b5563',
                border: 'none',
                outline: 'none'
              }}
            >
              Crear Preguntas
              {activeTab === 'manual' && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-blue-800 rounded-b-sm"
                  style={{ marginBottom: '-1px' }}
                ></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('view')}
              className={`relative px-6 py-4 text-sm font-semibold rounded-t-lg transition-all duration-200 border-0 ${
                activeTab === 'view'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
              }`}
              style={{
                marginBottom: activeTab === 'view' ? '0' : '2px',
                zIndex: activeTab === 'view' ? '10' : '1',
                backgroundColor: activeTab === 'view' ? '#2563eb' : '#f3f4f6',
                color: activeTab === 'view' ? '#ffffff' : '#4b5563',
                border: 'none',
                outline: 'none'
              }}
            >
              Ver Preguntas
              {activeTab === 'view' && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-blue-800 rounded-b-sm"
                  style={{ marginBottom: '-1px' }}
                ></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`relative px-6 py-4 text-sm font-semibold rounded-t-lg transition-all duration-200 border-0 ${
                activeTab === 'import'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
              }`}
              style={{
                marginBottom: activeTab === 'import' ? '0' : '2px',
                zIndex: activeTab === 'import' ? '10' : '1',
                backgroundColor: activeTab === 'import' ? '#2563eb' : '#f3f4f6',
                color: activeTab === 'import' ? '#ffffff' : '#4b5563',
                border: 'none',
                outline: 'none'
              }}
            >
              Importar PDF
              {activeTab === 'import' && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-blue-800 rounded-b-sm"
                  style={{ marginBottom: '-1px' }}
                ></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className={`relative px-6 py-4 text-sm font-semibold rounded-t-lg transition-all duration-200 border-0 ${
                activeTab === 'test'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
              }`}
              style={{
                marginBottom: activeTab === 'test' ? '0' : '2px',
                zIndex: activeTab === 'test' ? '10' : '1',
                backgroundColor: activeTab === 'test' ? '#2563eb' : '#f3f4f6',
                color: activeTab === 'test' ? '#ffffff' : '#4b5563',
                border: 'none',
                outline: 'none'
              }}
            >
              Test API
              {activeTab === 'test' && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-blue-800 rounded-b-sm"
                  style={{ marginBottom: '-1px' }}
                ></div>
              )}
            </button>
          </nav>
        </div>
      </div>
      
      <main className="main-content bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
          {activeTab === 'manual' && (
            <QuestionForm
              onSubmit={handleSubmitQuestion}
              nextQuestionNumber={getNextQuestionNumber()}
              onSetInitialNumber={setCustomInitialNumber}
              showInitialNumberField={questions.length === 0}
            />
          )}
          
          {activeTab === 'view' && (
            <QuestionManager
              questions={questions}
              onRemoveQuestion={removeQuestion}
              onUpdateQuestion={updateQuestion}
            />
          )}
          
          {activeTab === 'import' && (
            <PDFImport 
              onImportQuestions={handleImportQuestions}
              appState={appState}
              nextQuestionNumber={getNextQuestionNumber()}
              showAlert={showAlert}
              showConfirm={showConfirm}
            />
          )}
          
          {activeTab === 'test' && (
            <GeminiTest 
              appState={appState}
              showAlert={showAlert}
            />
          )}
          </div>
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
