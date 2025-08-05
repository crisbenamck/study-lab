import React from 'react';

interface ArrowRightIconProps {
  className?: string;
}

const ArrowRightIcon: React.FC<ArrowRightIconProps> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export default ArrowRightIcon;
