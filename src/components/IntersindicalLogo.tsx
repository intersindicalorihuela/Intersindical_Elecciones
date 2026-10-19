import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const IntersindicalLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const heightClass =
    size === 'sm' ? 'h-10' : size === 'lg' ? 'h-20' : 'h-14 sm:h-16';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <img
        src="/intersindical-salut-logo.png"
        alt="Intersindical Salut Orihuela"
        className={`${heightClass} w-auto object-contain flex-shrink-0 drop-shadow-2xs`}
      />
    </div>
  );
};
