import Header from './components/Header';
import QuestionForm from './components/QuestionForm';
import QuestionList from './components/QuestionList';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { QuestionFormData } from './types/Question';

function App() {
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
      
      <main className="main-content">
        <div className="space-y-8">
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
        </div>
      </main>
    </div>
  );
}

export default App;
