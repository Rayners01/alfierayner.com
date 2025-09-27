'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  width?: string | number;
  height?: string | number;
  link?: string;
}

export default function Button({
  children,
  className = '',
  width,
  height,
  link,
  onClick,
  ...props
}: ButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e); // run the provided onClick
    } else if (link) {
      // slight delay to show click animation
      setTimeout(() => {
        window.open(link, '_blank'); // opens link in new tab
      }, 150);
    }
  };

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
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}
