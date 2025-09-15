import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <div className="mr-4">
        <img 
          src="/study-lab/icons/study-lab-azul-nocturno-optimized.svg" 
          alt="Study Lab" 
          className="w-12 h-12 drop-shadow-sm"
        />
      </div>
      <div className="ml-2">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Study Lab
        </h1>
      </div>
    </div>
  );
};

export default Logo;
