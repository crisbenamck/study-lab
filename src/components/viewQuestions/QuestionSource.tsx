import React from 'react';
import { LinkIcon } from '../../icons';

interface QuestionSourceProps {
  link: string;
}

const QuestionSource: React.FC<QuestionSourceProps> = ({ link }) => {
  if (!link || link.trim() === '') {
    return (
      <div className="border-t pt-4">
        <div className="flex items-center gap-2 text-sm">
          <LinkIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-400 italic">
            No se proporcionó fuente para esta pregunta
          </span>
        </div>
      </div>
    );
  }

  // Verificar si es una URL válida
  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="border-t pt-4">
      <div className="flex items-center gap-2 text-sm">
        <LinkIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
        {isValidUrl(link) ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors truncate flex-1 hover:underline"
          >
            {link}
          </a>
        ) : (
          <span className="text-gray-700 truncate flex-1">
            {link}
          </span>
        )}
      </div>
    </div>
  );
};

export default QuestionSource;
