import React from 'react';

interface RobotIconProps {
  className?: string;
}

const RobotIcon: React.FC<RobotIconProps> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="6" y="10" width="12" height="8" rx="2" strokeWidth="2" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2" />
    <circle cx="9" cy="13" r="1" fill="currentColor" />
    <circle cx="15" cy="13" r="1" fill="currentColor" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 16h6" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 14h1m12 0h1" />
  </svg>
);

export default RobotIcon;
