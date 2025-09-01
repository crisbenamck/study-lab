import React from 'react';

interface CheckMarkIconProps {
  className?: string;
}

const CheckMarkIcon: React.FC<CheckMarkIconProps> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill="#22c55e" />
    <path fill="white" d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default CheckMarkIcon;
