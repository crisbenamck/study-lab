import React from 'react';
import { LightBulbIcon } from '../../icons';

interface ExampleButtonsProps {
  samplePrompts: string[];
  onPromptSelect: (prompt: string) => void;
  isDisabled: boolean;
}

const ExampleButtons: React.FC<ExampleButtonsProps> = ({
  samplePrompts,
  onPromptSelect,
  isDisabled
}) => {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-primary">
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-primary">
          <LightBulbIcon className="w-5 h-5" />
          Ejemplos de prompts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {samplePrompts.map((samplePrompt, index) => (
            <button
              key={index}
              onClick={() => onPromptSelect(samplePrompt)}
              disabled={isDisabled}
              className="text-left p-3 border border-primary rounded-lg hover:bg-elevated hover:border-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm text-primary"
            >
              {samplePrompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExampleButtons;