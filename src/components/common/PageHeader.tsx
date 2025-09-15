import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

/**
 * PageHeader is a reusable header for main pages.
 * Use for consistent title and description layout.
 */
const PageHeader: React.FC<PageHeaderProps> = ({ title, description, className }) => (
  <div className={`mb-12 text-left ${className || ''}`}>
    <h1 className="text-4xl font-bold text-foreground mb-4">{title}</h1>
    {description && (
      <p className="text-lg text-muted-foreground max-w-3xl">{description}</p>
    )}
  </div>
);

export default PageHeader;
