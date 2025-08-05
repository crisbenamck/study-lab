import React from 'react';

interface ChevronDoubleRightIconProps {
  className?: string;
}

const ChevronDoubleRightIcon: React.FC<ChevronDoubleRightIconProps> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
  </svg>
);

export default ChevronDoubleRightIcon;
