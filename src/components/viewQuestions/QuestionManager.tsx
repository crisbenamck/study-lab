import React, { useState } from 'react';
import type { Question, QuestionFormData } from '../../types/Question';
import { formatQuestionNumber, downloadQuestionsAsJSON } from '../../utils/downloadUtils';
import QuestionForm from '../common/QuestionForm';
import ConfirmModal from '../common/ConfirmModal';
import QuestionCard from './QuestionCard';
import Pagination from '../Pagination';
import Button from '../common/Button';
import ActionCard from '../ActionCard';
import { useConfirm } from '../../hooks/useConfirm';
import {
  DownloadIcon,
  TrashIcon,
  ArrowLeftIcon,
  EyeIcon,
  PlusIcon,
  UploadIcon,
  EditIcon
} from '../../icons';

interface QuestionManagerProps {
  questions: Question[];
  onRemoveQuestion: (questionNumber: number) => void;
  onUpdateQuestion: (questionNumber: number, updatedQuestion: Omit<Question, 'question_number'>) => void;
  onClearAll: () => void;
  showAlert: (message: string, options?: { title?: string; type?: 'info' | 'success' | 'warning' | 'error'; buttonText?: string; }) => void;
  showConfirmModal: (message: string, onConfirm: () => void, options?: { title?: string; confirmText?: string; cancelText?: string; }) => void;
}

const QuestionManager: React.FC<QuestionManagerProps> = ({
  questions,
  onRemoveQuestion,
  onUpdateQuestion,
  onClearAll,
  showAlert,
  showConfirmModal
}) => {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage, setQuestionsPerPage] = useState(5);
  const {
    isConfirmOpen,
    confirmMessage,
    confirmOptions,
    confirmCallback,
    showConfirm,
    hideConfirm
  } = useConfirm();

  // Pagination calculations
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle questions per page change
  const handleQuestionsPerPageChange = (perPage: number) => {
    setQuestionsPerPage(perPage);
    setCurrentPage(1); // Reset to first page
  };

  const handleRemoveQuestion = (questionNumber: number) => {
    const questionNumberFormatted = formatQuestionNumber(questionNumber);

    showConfirm(
      `¿Estás seguro de que quieres eliminar la Pregunta #${questionNumberFormatted}?`,
      () => onRemoveQuestion(questionNumber),
      {
        title: 'Eliminar Pregunta',
        confirmText: 'Sí, Eliminar',
        cancelText: 'Cancelar'
      }
    );
  };

  const handleDownload = () => {
    if (questions.length === 0) {
      showAlert('No hay preguntas para descargar', {
        title: 'Lista vacía',
        type: 'warning'
      });
      return;
    }

    const questionCount = questions.length;
    const questionText = questionCount === 1 ? 'pregunta' : 'preguntas';

    showConfirmModal(
      `¿Estás seguro de que quieres descargar ${questionCount} ${questionText} en formato JSON?`,
      () => downloadQuestionsAsJSON(questions),
      {
        title: 'Descargar Preguntas',
        confirmText: 'Sí, Descargar',
        cancelText: 'Cancelar'
      }
    );
  };

  const handleClearAll = () => {
    if (questions.length === 0) {
      showAlert('No hay preguntas para eliminar', {
        title: 'Lista vacía',
        type: 'warning'
      });
      return;
    }

    showConfirmModal(
      `¿Estás seguro de que quieres eliminar todas las ${questions.length} preguntas? Esta acción no se puede deshacer.`,
      onClearAll,
      {
        title: 'Confirmar eliminación',
        confirmText: 'Sí, eliminar todo',
        cancelText: 'Cancelar'
      }
    );
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
  };

  const handleSaveEdit = (formData: QuestionFormData) => {
    if (!editingQuestion) return;

    // Convert form options to correct format
    const optionsWithLetters = formData.options.map((option, index) => ({
      option_letter: String.fromCharCode(65 + index), // A, B, C, D...
      option_text: option.option_text,
      is_correct: option.is_correct
    }));

    onUpdateQuestion(editingQuestion.question_number, {
      question_text: formData.question_text,
      options: optionsWithLetters,
      requires_multiple_answers: formData.requires_multiple_answers,
      explanation: formData.explanation,
      link: formData.link
    });

    setEditingQuestion(null);
  };

  // Convert Question to QuestionFormData for edit form
  const questionToFormData = (question: Question): QuestionFormData => {
    return {
      question_text: question.question_text,
      options: question.options.map(option => ({
        option_text: option.option_text,
        is_correct: option.is_correct
      })),
      requires_multiple_answers: question.requires_multiple_answers,
      explanation: question.explanation,
      link: question.link
    };
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-center mb-24">
            <div className="max-w-3xl mx-auto mb-16">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Tu biblioteca está vacía
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Comienza creando tu primera pregunta o importa contenido desde un archivo PDF para construir tu colección de estudio.
              </p>
            </div>
            <div className="mb-16">
              <h3 className="text-lg font-medium text-gray-700">
                Elige cómo empezar
              </h3>
            </div>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <ActionCard
                icon={<PlusIcon className="w-12 h-12 text-white" />}
                title="Crear Primera Pregunta"
                description="Diseña preguntas personalizadas usando nuestro formulario intuitivo"
                buttonText="Empezar a Crear"
                buttonIcon={<PlusIcon className="w-5 h-5" />}
                onClick={() => window.location.href = '/create'}
                variant="primary"
              />
              <ActionCard
                icon={<UploadIcon className="w-12 h-12 text-white" />}
                title="Importar desde PDF"
                description="Deja que la IA extraiga preguntas automáticamente de tus documentos"
                buttonText="Subir Documento"
                buttonIcon={<UploadIcon className="w-5 h-5" />}
                onClick={() => window.location.href = '/import'}
                variant="primary"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show edit form if editingQuestion is set
  if (editingQuestion) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header with title and back button */}
        <div className="mb-8">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCancelEdit}
            className="mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Volver a la lista
          </Button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <EditIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Editando Pregunta #{formatQuestionNumber(editingQuestion.question_number)}
                </h1>
                <p className="text-gray-600">
                  Modifica los campos necesarios y guarda los cambios
                </p>
              </div>
            </div>

            <QuestionForm
              onSubmit={handleSaveEdit}
              nextQuestionNumber={editingQuestion.question_number}
              showInitialNumberField={false}
              initialData={questionToFormData(editingQuestion)}
              isEditing={true}
              onCancel={handleCancelEdit}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Main header with title, description and stats */}
      <div className="mb-8">

        {/* Actions bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <EyeIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Biblioteca de Preguntas
                </h2>
                <p className="text-sm text-gray-600">
                  {questions.length} {questions.length === 1 ? 'pregunta guardada' : 'preguntas guardadas'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="success"
                size="md"
                onClick={handleDownload}
                disabled={questions.length === 0}
              >
                <DownloadIcon className="w-4 h-4" />
                Descargar JSON
              </Button>

              <Button
                variant="warning"
                size="md"
                onClick={handleClearAll}
                disabled={questions.length === 0}
              >
                <TrashIcon className="w-4 h-4" />
                Eliminar Todo
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          {/* Quick stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Total: {questions.length} preguntas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Página {currentPage} de {totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Mostrando {Math.min(questionsPerPage, questions.length - startIndex)} elementos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Improved questions list */}
      <div className="space-y-6">
        {currentQuestions.map((question, index) => (
          <QuestionCard
            key={`${question.question_number}-${index}`}
            question={question}
            onEdit={handleEditQuestion}
            onDelete={handleRemoveQuestion}
          />
        ))}
      </div>

      {/* Modern pagination system */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        questionsPerPage={questionsPerPage}
        totalQuestions={questions.length}
        onPageChange={handlePageChange}
        onQuestionsPerPageChange={handleQuestionsPerPageChange}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onConfirm={confirmCallback || (() => { })}
        onCancel={hideConfirm}
        title={confirmOptions.title}
        message={confirmMessage}
        confirmText={confirmOptions.confirmText}
        cancelText={confirmOptions.cancelText}
        type={confirmOptions.type}
      />
    </div>
  );
};

export default QuestionManager;
