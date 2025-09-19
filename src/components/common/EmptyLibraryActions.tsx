import React from 'react';
import EmptyLibraryActionCard from './EmptyLibraryActionCard';
import { PlusIcon, UploadIcon } from '../../icons';

interface EmptyLibraryActionsProps {
  onCreate: () => void;
  onImport: () => void;
}

/**
 * Displays action cards for creating or importing questions when the library is empty.
 * Used in question and study pages.
 */
const EmptyLibraryActions: React.FC<EmptyLibraryActionsProps> = ({ onCreate, onImport }) => (
  <div className="bg-primary">
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-16">
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            Tu biblioteca está vacía
          </h2>
          <p className="text-lg text-secondary leading-relaxed">
            Comienza creando tu primera pregunta o importa contenido desde un archivo PDF para construir tu colección de estudio.
          </p>
        </div>
        <div className="mb-16">
          <h3 className="text-lg font-bold text-theme-info">
            ¡Selecciona una opción para comenzar ahora!
          </h3>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <EmptyLibraryActionCard
            icon={<PlusIcon className="w-12 h-12 text-white" />}
            title="Crear Primera Pregunta"
            description="Diseña preguntas personalizadas usando nuestro formulario intuitivo"
            buttonText="Empezar a Crear"
            buttonIcon={<PlusIcon className="w-5 h-5" />}
            onClick={onCreate}
            variant="primary"
          />
          <EmptyLibraryActionCard
            icon={<UploadIcon className="w-12 h-12 text-white" />}
            title="Importar desde PDF"
            description="Deja que la IA extraiga preguntas automáticamente de tus documentos"
            buttonText="Subir Documento"
            buttonIcon={<UploadIcon className="w-5 h-5" />}
            onClick={onImport}
            variant="primary"
          />
        </div>
      </div>
    </div>
  </div>
);

export default EmptyLibraryActions;
