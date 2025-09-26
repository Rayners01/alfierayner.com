import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  width?: string | number;
  height?: string | number;
}

export default function Button({
  children,
  className = '',
  width,
  height,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        rounded-lg 
        w-${width ? width : '1/2'}
        h-${height ? height : 'full'}
        border-t-2 border-l-2 border-b-4 border-r-4 
        border-green-700 
        text-green-700
        bg-lime-200
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
