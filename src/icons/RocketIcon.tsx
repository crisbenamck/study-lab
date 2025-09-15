import React from 'react';

interface RocketIconProps {
  className?: string;
}

const RocketIcon: React.FC<RocketIconProps> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l4-4a4 4 0 000-5.656z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21V9a4.987 4.987 0 011.451-3.549L14.5 1.451a2 2 0 012.828 0l3.221 3.221a2 2 0 010 2.828L16.5 11.549A4.987 4.987 0 0115 15v6h-6z" />
  </svg>
);

export default RocketIcon;