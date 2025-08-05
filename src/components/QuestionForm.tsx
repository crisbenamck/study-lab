import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import type { QuestionFormData } from '../types/Question';
import Button from './common/Button';
import { SaveIcon, CloseIcon, CheckIcon, PlusIcon, MinusIcon, EraserIcon } from '../icons';

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
    setValue,
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

  // Watch para detectar cambios en múltiples respuestas y opciones
  const isMultipleAnswers = useWatch({
    control,
    name: 'requires_multiple_answers'
  });

  const watchedOptions = useWatch({
    control,
    name: 'options'
  });

  // Función para manejar el cambio de una opción correcta
  const handleOptionCorrectChange = (index: number, isChecked: boolean) => {
    if (!isMultipleAnswers && isChecked) {
      // Si no permite múltiples respuestas y se marca una opción,
      // desmarcar todas las demás
      const updatedOptions = watchedOptions.map((option, i) => ({
        ...option,
        is_correct: i === index
      }));
      
      // Actualizar todas las opciones
      updatedOptions.forEach((option, i) => {
        setValue(`options.${i}.is_correct`, option.is_correct);
      });
    }
  };

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
                  <Button
                    type="button"
                    onClick={() => onSetInitialNumber && onSetInitialNumber(customNumber)}
                    variant="primary"
                    size="sm"
                    icon={<CheckIcon />}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Solo primera pregunta
                </p>
              </div>
              
              <Button
                type="button"
                onClick={handleClearForm}
                variant="secondary"
                size="md"
                icon={<EraserIcon />}
              >
                Limpiar Formulario
              </Button>
            </div>
          )}
          
          {/* Si no estamos editando, mostrar el botón limpiar */}
          {!isEditing && (
            <Button
              type="button"
              onClick={handleClearForm}
              variant="secondary"
              size="md"
              icon={<EraserIcon />}
            >
              Limpiar Formulario
            </Button>
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
            <div className="flex items-center" style={{ gap: '8px' }}>
              <Button
                type="button"
                onClick={addOption}
                disabled={fields.length >= 5}
                variant="primary"
                size="sm"
                icon={<PlusIcon />}
              >
                Agregar
              </Button>
              
              <Button
                type="button"
                onClick={() => remove(fields.length - 1)}
                disabled={fields.length <= 2}
                variant="warning"
                size="sm"
                icon={<MinusIcon />}
              >
                Eliminar
              </Button>
            </div>
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
                    disabled={!isMultipleAnswers && watchedOptions?.some((opt, i) => i !== index && opt.is_correct)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      handleOptionCorrectChange(index, isChecked);
                      // También necesitamos manejar el registro normal
                      setValue(`options.${index}.is_correct`, isChecked);
                    }}
                  />
                  <label className="text-sm text-gray-700">Correcta</label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Link de referencia */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Link de referencia
          </label>
          <input
            type="url"
            {...register('link', { 
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
            Explicación
          </label>
          <textarea
            {...register('explanation')}
            rows={4}
            className="form-input"
            placeholder="Proporciona una explicación detallada de por qué las respuestas son correctas..."
          />
          {errors.explanation && (
            <p className="text-sm text-red-600 mt-1">{errors.explanation.message}</p>
          )}
        </div>

        {/* Botones de envío */}
        <div className={`${isEditing ? 'flex' : 'flex justify-start'}`} style={{ gap: isEditing ? '8px' : '0' }}>
          <Button
            type="submit"
            variant="success"
            size="md"
            icon={<SaveIcon />}
            iconPosition="left"
          >
            {isEditing ? 'Guardar Cambios' : 'Guardar Pregunta'}
          </Button>
          
          {isEditing && onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              variant="secondary"
              size="md"
              icon={<CloseIcon />}
              iconPosition="left"
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
