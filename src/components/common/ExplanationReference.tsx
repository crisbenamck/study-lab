
import React, { type FC } from 'react';
import { LinkIcon } from '../../icons';

interface ExplanationReferenceProps {
  explanation?: string;
  link?: string;
  className?: string;
}

/**
 * Common component to display the explanation and reference link for a question.
 * Uses the same visual format as the View Questions page.
 */
const ExplanationReference: FC<ExplanationReferenceProps> = ({ explanation, link, className = '' }) => {
  if (!explanation && !link) return null;

  return (
    <div className={`mb-6 ${className}`}>
      {explanation && (
        <>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Explicación:</h4>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-gray-900 leading-relaxed">{explanation}</p>
          </div>
        </>
      )}
      {link && (
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center gap-2 text-sm">
            <LinkIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-gray-500 font-medium">Fuente:</span>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors truncate flex-1 hover:underline"
            >
              {link}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplanationReference;
