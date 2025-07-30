import { useState } from 'react';
import Header from './components/Header';
import QuestionForm from './components/QuestionForm';
import QuestionList from './components/QuestionList';
import PDFImport from './components/PDFImport';
import GeminiTest from './components/GeminiTest';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAppState } from './hooks/useAppState';
import type { QuestionFormData, Question } from './types/Question';

type TabType = 'manual' | 'import' | 'test';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('manual');
  
  const {
    questions,
    addQuestion,
    removeQuestion,
    clearAllQuestions,
    getNextQuestionNumber,
    setCustomInitialNumber,
    isLoaded: questionsLoaded
  } = useLocalStorage();

  const appState = useAppState();

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
    // Agregar preguntas importadas con numeración consecutiva
    importedQuestions.forEach((question) => {
      // Omitir question_number para que addQuestion asigne el número correcto
      const questionWithoutNumber: Omit<Question, 'question_number'> = {
        question_text: question.question_text,
        options: question.options,
        requires_multiple_answers: question.requires_multiple_answers,
        explanation: question.explanation,
        link: question.link
      };
      addQuestion(questionWithoutNumber);
    });

    // Cambiar a la pestaña de manual para ver las preguntas agregadas
    setActiveTab('manual');
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
            <>
              <QuestionForm
                onSubmit={handleSubmitQuestion}
                nextQuestionNumber={getNextQuestionNumber()}
                onSetInitialNumber={setCustomInitialNumber}
                showInitialNumberField={questions.length === 0}
              />
              
              <QuestionList
                questions={questions}
                onRemoveQuestion={removeQuestion}
              />
            </>
          )}
          
          {activeTab === 'import' && (
            <PDFImport 
              onImportQuestions={handleImportQuestions}
              appState={appState}
              nextQuestionNumber={getNextQuestionNumber()}
            />
          )}
          
          {activeTab === 'test' && (
            <GeminiTest 
              appState={appState}
            />
          )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
