import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export default function Card({
  children,
  className = '',
  padded = true,
  ...props
}: CardProps) {
  return (
    <div
      className={`
        bg-lime-200 border-green-700 border-2 rounded-lg
        hover:border-yellow-400
        ${padded ? 'p-4' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}