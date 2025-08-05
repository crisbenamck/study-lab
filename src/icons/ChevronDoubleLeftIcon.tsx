import React from 'react';

interface ChevronDoubleLeftIconProps {
  className?: string;
}

const ChevronDoubleLeftIcon: React.FC<ChevronDoubleLeftIconProps> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
  </svg>
);

export default ChevronDoubleLeftIcon;
