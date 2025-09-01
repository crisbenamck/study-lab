import React from 'react';

interface NextIconProps {
  className?: string;
}

const NextIcon: React.FC<NextIconProps> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 4l10 8-10 8V4z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 5v14" />
  </svg>
);

export default NextIcon;
