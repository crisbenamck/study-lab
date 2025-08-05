import React from 'react';

interface MinusIconProps {
  className?: string;
}

const MinusIcon: React.FC<MinusIconProps> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
);

export default MinusIcon;
