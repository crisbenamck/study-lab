import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import type { QuestionFormData } from '../types/Question';

interface QuestionFormProps {
  onSubmit: (data: QuestionFormData) => void;
  nextQuestionNumber: number;
  onClearForm?: () => void;
  onSetInitialNumber?: (number: number) => void;
  showInitialNumberField?: boolean;
  initialData?: QuestionFormData;
  isEditing?: boolean;
  onCancel?: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ 
  onSubmit, 
  nextQuestionNumber, 
  onClearForm, 
  onSetInitialNumber, 
  showInitialNumberField,
  initialData,
  isEditing = false,
  onCancel
}) => {
  const [customNumber, setCustomNumber] = useState(nextQuestionNumber);

  const getDefaultValues = (): QuestionFormData => {
    if (initialData) {
      return initialData;
    }
    return {
      question_text: '',
      options: [
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
      ],
      requires_multiple_answers: false,
      explanation: '',
      link: ''
    };
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<QuestionFormData>({
    defaultValues: getDefaultValues()
  });

  // Reset del formulario cuando cambian los datos iniciales
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options'
  });

  const handleFormSubmit = (data: QuestionFormData) => {
    // Asignar letras automáticamente (A, B, C, D, etc.)
    const optionsWithLetters = data.options.map((option, index) => ({
      ...option,
      option_letter: String.fromCharCode(65 + index), // A=65, B=66, etc.
    }));

    onSubmit({
      ...data,
      options: optionsWithLetters
    });

    reset();
  };

  const addOption = () => {
    append({ option_text: '', is_correct: false });
  };

  const handleClearForm = () => {
    reset();
    if (onClearForm) {
      onClearForm();
    }
  };

  return (
    <div className="question-card container">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Nueva Pregunta #{nextQuestionNumber.toString().padStart(4, '0')}
            </h2>
            <p className="text-gray-600">
              Completa todos los campos para agregar una nueva pregunta
            </p>
          </div>
          
          {/* Campo compacto para número inicial - solo si no hay preguntas */}
          {showInitialNumberField && (
            <div className="flex items-center space-x-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 px-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Número inicial
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    value={customNumber}
                    onChange={(e) => setCustomNumber(parseInt(e.target.value) || 1)}
                    className="form-input w-20 text-sm"
                    placeholder="0001"
                  />
                  <button
                    type="button"
                    onClick={() => onSetInitialNumber && onSetInitialNumber(customNumber)}
                    className="btn btn-secondary text-xs px-2 py-1"
                  >
                    ✓
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Solo primera pregunta
                </p>
              </div>
              
              <button
                type="button"
                onClick={handleClearForm}
                className="btn btn-secondary"
              >
                🧹 Limpiar Formulario
              </button>
            </div>
          )}
          
          {/* Si no hay campo de número inicial, mostrar solo el botón limpiar */}
          {!showInitialNumberField && (
            <button
              type="button"
              onClick={handleClearForm}
              className="btn btn-secondary"
            >
              🧹 Limpiar Formulario
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Texto de la pregunta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Texto de la pregunta *
          </label>
          <textarea
            {...register('question_text', { required: 'El texto de la pregunta es requerido' })}
            rows={4}
            className="form-input"
            placeholder="Escribe aquí el texto de la pregunta..."
          />
          {errors.question_text && (
            <p className="text-sm text-red-600 mt-1">{errors.question_text.message}</p>
          )}
        </div>

        {/* Múltiples respuestas */}
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('requires_multiple_answers')}
            className="form-checkbox mr-2"
          />
          <label className="text-sm text-gray-700">
            Esta pregunta permite múltiples respuestas correctas
          </label>
        </div>

        {/* Opciones */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Opciones de respuesta *
            </label>
            <button
              type="button"
              onClick={addOption}
              className="btn btn-accent text-sm"
            >
              ➕ Agregar opción
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="option-item">
                <div className="option-letter">
                  {String.fromCharCode(65 + index)}
                </div>
                
                <div className="flex-1">
                  <textarea
                    {...register(`options.${index}.option_text`, {
                      required: 'El texto de la opción es requerido'
                    })}
                    className="form-input"
                    placeholder={`Texto de la opción ${String.fromCharCode(65 + index)}`}
                    rows={2}
                  />
                  {errors.options?.[index]?.option_text && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.options[index]?.option_text?.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register(`options.${index}.is_correct`)}
                    className="form-checkbox"
                  />
                  <label className="text-sm text-gray-700">Correcta</label>
                </div>

                {fields.length > 2 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="delete-btn text-red-600 hover:text-red-800 ml-3"
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Link de referencia */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Link de referencia *
          </label>
          <input
            type="url"
            {...register('link', { 
              required: 'El link de referencia es requerido',
              pattern: {
                value: /^https?:\/\/.+/,
                message: 'Debe ser una URL válida (http:// o https://)'
              }
            })}
            className="form-input"
            placeholder="https://ejemplo.com/fuente-de-informacion"
          />
          {errors.link && (
            <p className="text-sm text-red-600 mt-1">{errors.link.message}</p>
          )}
        </div>

        {/* Explicación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Explicación *
          </label>
          <textarea
            {...register('explanation', { required: 'La explicación es requerida' })}
            rows={4}
            className="form-input"
            placeholder="Proporciona una explicación detallada de por qué las respuestas son correctas..."
          />
          {errors.explanation && (
            <p className="text-sm text-red-600 mt-1">{errors.explanation.message}</p>
          )}
        </div>

        {/* Botones de envío */}
        <div className={`${isEditing ? 'flex space-x-4' : ''}`}>
          <button
            type="submit"
            className={`btn btn-primary ${isEditing ? 'flex-1' : 'btn-full'}`}
          >
            💾 {isEditing ? 'Guardar Cambios' : 'Guardar Pregunta'}
          </button>
          
          {isEditing && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary flex-1"
            >
              ❌ Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
