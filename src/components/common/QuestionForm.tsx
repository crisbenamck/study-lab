import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import type { QuestionFormData } from '../../types/Question';
import Button from './Button';
import { SaveIcon, CloseIcon, CheckIcon, PlusIcon, MinusIcon, EraserIcon } from '../../icons';

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

  // Reset form when initialData changes
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

  // Ensures only one correct answer if multiple answers are not allowed
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

  // Assigns letters to options and submits the form
  const handleFormSubmit = (data: QuestionFormData) => {
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
              New Question #{nextQuestionNumber.toString().padStart(4, '0')}
            </h2>
          </div>
          {/* Compact field for initial number - only if there are no questions */}
          {showInitialNumberField && (
            <div className="flex items-center space-x-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 px-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Initial number
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
                  Only for the first question
                </p>
              </div>
              <Button
                type="button"
                onClick={handleClearForm}
                variant="secondary"
                size="md"
                icon={<EraserIcon />}
              >
                Clear Form
              </Button>
            </div>
          )}
          {/* If not editing, show clear button */}
          {!isEditing && (
            <Button
              type="button"
              onClick={handleClearForm}
              variant="secondary"
              size="md"
              icon={<EraserIcon />}
            >
              Clear Form
            </Button>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Question text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question text *
          </label>
          <textarea
            {...register('question_text', { required: 'Question text is required' })}
            rows={4}
            className="form-input"
            placeholder="Write the question text here..."
          />
          {errors.question_text && (
            <p className="text-sm text-red-600 mt-1">{errors.question_text.message}</p>
          )}
        </div>
        {/* Multiple answers */}
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('requires_multiple_answers')}
            className="form-checkbox mr-2"
          />
          <label className="text-sm text-gray-700">
            This question allows multiple correct answers
          </label>
        </div>
        {/* Answer options */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Answer options *
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
                Add
              </Button>
              <Button
                type="button"
                onClick={() => remove(fields.length - 1)}
                disabled={fields.length <= 2}
                variant="warning"
                size="sm"
                icon={<MinusIcon />}
              >
                Remove
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
                      required: 'Option text is required'
                    })}
                    className="form-input"
                    placeholder={`Option text ${String.fromCharCode(65 + index)}`}
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
                      setValue(`options.${index}.is_correct`, isChecked);
                    }}
                  />
                  <label className="text-sm text-gray-700">Correct</label>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Reference link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reference link
          </label>
          <input
            type="url"
            {...register('link', { 
              pattern: {
                value: /^https?:\/\/.+/, // eslint-disable-line
                message: 'Must be a valid URL (http:// or https://)'
              }
            })}
            className="form-input"
            placeholder="https://example.com/information-source"
          />
          {errors.link && (
            <p className="text-sm text-red-600 mt-1">{errors.link.message}</p>
          )}
        </div>
        {/* Explanation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Explanation
          </label>
          <textarea
            {...register('explanation')}
            rows={4}
            className="form-input"
            placeholder="Provide a detailed explanation of why the answers are correct..."
          />
          {errors.explanation && (
            <p className="text-sm text-red-600 mt-1">{errors.explanation.message}</p>
          )}
        </div>
        {/* Submit buttons */}
        <div className={`${isEditing ? 'flex' : 'flex justify-start'}`} style={{ gap: isEditing ? '8px' : '0' }}>
          <Button
            type="submit"
            variant="success"
            size="md"
            icon={<SaveIcon />}
            iconPosition="left"
          >
            {isEditing ? 'Save Changes' : 'Save Question'}
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
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default QuestionForm;
