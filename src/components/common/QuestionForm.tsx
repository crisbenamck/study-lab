import React, { useEffect } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import type { QuestionFormData } from '../../types/Question';
import Button from './Button';
import { SaveIcon, CloseIcon, PlusIcon, MinusIcon, EraserIcon } from '../../icons';

interface QuestionFormProps {
  onSubmit: (data: QuestionFormData) => void;
  nextQuestionNumber: number;
  onClearForm?: () => void;
  initialData?: QuestionFormData;
  isEditing?: boolean;
  onCancel?: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  onSubmit,
  nextQuestionNumber,
  onClearForm,
  // Removed: onSetInitialNumber, showInitialNumberField
  initialData,
  isEditing = false,
  onCancel
}) => {

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

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options'
  });

  const isMultipleAnswers = useWatch({
    control,
    name: 'requires_multiple_answers'
  });

  const watchedOptions = useWatch({
    control,
    name: 'options'
  });


  const addOption = () => {
    if (fields.length < 5) {
      append({ option_text: '', is_correct: false });
    }
  };
  const handleOptionCorrectChange = (index: number, isChecked: boolean) => {
    if (!isMultipleAnswers && isChecked) {
      const updatedOptions = watchedOptions.map((option, i) => ({
        ...option,
        is_correct: i === index
      }));
      updatedOptions.forEach((option, i) => {
        setValue(`options.${i}.is_correct`, option.is_correct);
      });
    }
  };



  // Custom validation: at least one option must be marked as correct
  const [showCorrectOptionError, setShowCorrectOptionError] = React.useState(false);
  const handleFormSubmit = (data: QuestionFormData) => {
    const hasCorrect = data.options.some(option => option.is_correct);
    if (!hasCorrect) {
      setShowCorrectOptionError(true);
      return;
    }
    setShowCorrectOptionError(false);
    const optionsWithLetters = data.options.map((option, index) => ({
      ...option,
      option_letter: String.fromCharCode(65 + index),
    }));
    onSubmit({
      ...data,
      options: optionsWithLetters
    });
    reset();
  };

  const handleClearForm = () => {
    reset();
    if (onClearForm) {
      onClearForm();
    }
  };

  // Hide error when user marks any option as correct
  useEffect(() => {
    if (watchedOptions.some(option => option.is_correct)) {
      setShowCorrectOptionError(false);
    }
  }, [watchedOptions]);

  return (
    <div className="question-card container">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            {!isEditing && (
              <h2 className="text-2xl font-bold text-primary mb-2">
                Nueva pregunta {nextQuestionNumber.toString().padStart(4, '0')}
              </h2>
            )}
          </div>
          {/* If not editing, show clear button */}
          {!isEditing && (
            <Button
              type="button"
              onClick={handleClearForm}
              variant="secondary"
              size="md"
              icon={<EraserIcon />}
            >
              Limpiar formulario
            </Button>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Question text */}
        <div>
          <label className="block text-md font-medium text-secondary mb-2">
            <span className="text-sm font-bold text-primary mb-2">Texto de la pregunta</span> <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('question_text', { required: 'El texto de la pregunta es obligatorio' })}
            rows={4}
            className="w-full border border-primary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition resize-y bg-input text-primary"
            placeholder="Escribe el texto de la pregunta aquí..."
          />
          {errors.question_text && (
            <p className="text-sm text-red-600 mt-1">{errors.question_text.message}</p>
          )}
        </div>
        {/* Allow multiple correct answers */}
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('requires_multiple_answers')}
            className="form-checkbox mr-2"
          />
          <label className="text-sm text-secondary">
            Esta pregunta permite varias respuestas correctas
          </label>
        </div>
        {/* Answer options */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-md font-medium text-secondary">
              <span className="text-sm font-bold text-primary mb-2">Opciones de respuesta</span> <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
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
                Quitar
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="option-item flex gap-2 items-center min-h-[56px]">
                <div className="flex flex-col items-center">
                  <div className="option-letter flex items-center justify-center text-base font-semibold text-secondary bg-elevated rounded-full min-w-[32px] min-h-[32px]">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="min-h-[20px] w-full mt-1 flex items-center justify-center">
                    {errors.options?.[index]?.option_text && (
                      <span className="text-xs text-red-500 text-center w-full"></span>
                    )}
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-2">
                    <textarea
                      {...register(`options.${index}.option_text`, {
                        required: 'El texto de la opción es obligatorio'
                      })}
                      className="w-full border border-primary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition resize-y bg-input text-primary min-h-[56px]"
                      placeholder={`Texto de opción ${String.fromCharCode(65 + index)}`}
                      rows={2}
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...register(`options.${index}.is_correct`)}
                        className="form-checkbox"
                        disabled={!isMultipleAnswers && watchedOptions?.some((opt, i) => i !== index && opt.is_correct)}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          handleOptionCorrectChange(index, isChecked);
                          setValue(`options.${index}.is_correct`, isChecked);
                        }}
                      />
                      <label className="text-sm text-secondary">Correcta</label>
                    </div>
                  </div>
                  {errors.options?.[index]?.option_text && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.options[index]?.option_text?.message}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Error message for correct option (after options, before reference link) */}
        {showCorrectOptionError && (
          <div className="w-full flex justify-end">
            <span className="text-red-500 text-sm text-right">
              {isMultipleAnswers
                ? 'Debes marcar las opciones correctas.'
                : 'Debes marcar la opción correcta.'}
            </span>
          </div>
        )}

        {/* Reference link */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            <span className="text-sm font-bold text-primary mb-2">Enlace de referencia</span>
          </label>
          <input
            type="url"
            {...register('link', {
              pattern: {
                value: /^https?:\/\/.+/,
                message: 'Debe ser una URL válida (http:// o https://)'
              }
            })}
            className="w-full border border-primary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-input text-primary"
            placeholder="https://ejemplo.com/fuente-informacion"
          />
          {errors.link && (
            <p className="text-sm text-red-600 mt-1">{errors.link.message}</p>
          )}
        </div>
        {/* Explanation */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            <span className="text-sm font-bold text-primary mb-2">Explicación</span>
          </label>
          <textarea
            {...register('explanation')}
            rows={4}
            className="w-full border border-primary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition resize-y bg-input text-primary"
            placeholder="Agrega una explicación detallada de por qué las respuestas son correctas..."
          />
          {errors.explanation && (
            <p className="text-sm text-red-600 mt-1">{errors.explanation.message}</p>
          )}
        </div>
        {/* Action buttons */}
        <div className={isEditing ? 'flex gap-2' : 'flex justify-start'}>
          <Button
            type="submit"
            variant="success"
            size="md"
            icon={<SaveIcon />}
            iconPosition="left"
          >
            {isEditing ? 'Guardar cambios' : 'Guardar pregunta'}
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
}

export default QuestionForm;
