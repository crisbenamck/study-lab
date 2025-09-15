import React from 'react';

interface KeyIconProps {
  className?: string;
}

const KeyIcon: React.FC<KeyIconProps> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 16.5V20H7v-3.5L2.257 11.743A6 6 0 0112 2a6 6 0 017 7z" />
  </svg>
);

export default KeyIcon;