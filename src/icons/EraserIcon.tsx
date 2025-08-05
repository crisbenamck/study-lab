import React from 'react';

interface EraserIconProps {
  className?: string;
}

const EraserIcon: React.FC<EraserIconProps> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.9 2.7l8.4 8.4a1 1 0 010 1.4l-8.4 8.4a1 1 0 01-1.4 0l-8.4-8.4a1 1 0 010-1.4l8.4-8.4a1 1 0 011.4 0zM7.5 7.5l9 9" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 21H3" />
  </svg>
);

export default EraserIcon;
