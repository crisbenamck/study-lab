import React from 'react';
import { Send } from 'lucide-react';
import Button from '../common/Button';
import { WriteIcon } from '../../icons';

interface PromptFormProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  model: string;
  onModelChange: (model: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
  isDisabled: boolean;
  testModels: string[];
}

const PromptForm: React.FC<PromptFormProps> = ({
  prompt,
  onPromptChange,
  model,
  onModelChange,
  isLoading,
  onSubmit,
  isDisabled,
  testModels
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-800">
          <WriteIcon className="w-5 h-5" />
          Prompt de prueba
        </h3>
        
        {/* Model Selection */}
        <div className="mb-4">
          <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 mb-2">
            Modelo a usar:
          </label>
          <select
            id="model-select"
            value={model}
            onChange={(e) => onModelChange(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            {testModels.map(modelOption => (
              <option key={modelOption} value={modelOption}>
                {modelOption}
              </option>
            ))}
          </select>
        </div>

        {/* Prompt Input */}
        <div className="mb-6">
          <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-700 mb-2">
            Tu prompt personalizado
          </label>
          <textarea
            id="prompt-input"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Escribe una pregunta o instrucción para Gemini"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none"
            rows={4}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onSubmit}
            disabled={isDisabled || isLoading}
            isLoading={isLoading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
          >
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? 'Enviando...' : 'Enviar a Gemini'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromptForm;