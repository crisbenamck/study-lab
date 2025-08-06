import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="container py-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Cargando sesión de estudio...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
