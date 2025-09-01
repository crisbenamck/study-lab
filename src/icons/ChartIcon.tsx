import React from 'react';

interface ChartIconProps {
  className?: string;
}

const ChartIcon: React.FC<ChartIconProps> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 19V9a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 11V9a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2" />
  </svg>
);

export default ChartIcon;
