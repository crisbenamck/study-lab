
import { type FC } from 'react';
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
          <h4 className="text-sm font-medium text-primary mb-2">Explicación:</h4>
          <div className="bg-info-50 rounded-lg p-4 border border-info-200 theme-transition">
            <p className="text-primary leading-relaxed">{explanation}</p>
          </div>
        </>
      )}
      {link && (
        <div className="border-t border-gray-light pt-4 mt-4 theme-transition">
          <div className="flex items-center gap-2 text-sm">
            <LinkIcon className="w-4 h-4 text-secondary flex-shrink-0" />
            <span className="text-secondary font-medium">Fuente:</span>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-800 transition-colors truncate flex-1 hover:underline"
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
