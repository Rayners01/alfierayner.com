import React from 'react';

export default function Button({
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`
        rounded-lg w-1/5 h-full 
        border-t-2 border-l-2 border-b-4 border-r-4 
        border-green-700 
        flex justify-center items-center 
        hover:border-yellow-400
        active:translate-x-[2px] active:translate-y-[2px] 
        active:border-b-2 active:border-r-2
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
