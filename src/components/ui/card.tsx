import React from 'react';

export default function Card({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`
        ${className}
        bg-lime-200 border-green-700 border-2 rounded-lg
        p-4 hover:border-yellow-400
      `}
      {...props}
    >
      {children}
    </div>
  );
}
