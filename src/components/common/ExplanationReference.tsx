
import { type FC } from 'react';
import { LinkIcon } from '../../icons';

interface ExplanationReferenceProps {
  explanation?: string;
  link?: string;
  className?: string;
}

/**
 * Common component to display the explanation and reference link for a question.
 * Uses the same visual format as the View Questions page with proper theme support.
 */
const ExplanationReference: FC<ExplanationReferenceProps> = ({ explanation, link, className = '' }) => {
  if (!explanation && !link) return null;

  return (
    <div className={`explanation-reference-container mb-6 ${className}`}>
      {explanation && (
        <>
          <h4 className="text-sm font-bold text-primary mb-2">
            Explicación:
          </h4>
          <div className="bg-theme-info rounded-lg p-4 border border-blue-200 dark:border-blue-700 theme-transition">
            <p className="text-primary leading-relaxed">
              {explanation}
            </p>
          </div>
        </>
      )}
      {link && (
        <div className="border-t border-primary pt-4 mt-4 theme-transition">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-secondary">
              <LinkIcon className="w-4 h-4 flex-shrink-0" />
            </span>
            <span className="text-secondary font-medium">
              Fuente:
            </span>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium underline hover:no-underline transition-colors flex-1 block"
              style={{ wordBreak: 'break-all' }}
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
