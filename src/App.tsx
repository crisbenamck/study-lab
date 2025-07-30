import { useState } from 'react';
import Header from './components/Header';
import QuestionForm from './components/QuestionForm';
import QuestionList from './components/QuestionList';
import PDFImport from './components/PDFImport';
import PDFImportTest from './components/PDFImportTest';
import GeminiTest from './components/GeminiTest';
import { useLocalStorage } from './hooks/useLocalStorage';
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
    isLoaded
  } = useLocalStorage();

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
  if (!isLoaded) {
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
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('manual')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'manual'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Crear Preguntas
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'import'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Importar desde PDF
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'test'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🧪 Test Gemini
            </button>
          </nav>
        </div>
      </div>
      
      <main className="main-content">
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
            <PDFImport onImportQuestions={handleImportQuestions} />
          )}
          
          {activeTab === 'test' && (
            <GeminiTest />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
