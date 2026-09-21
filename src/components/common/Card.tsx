import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, hoverable = false, className, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white rounded-xl border border-gray-200/80 shadow-xs p-5 transition-all duration-200',
          hoverable && 'hover:shadow-md hover:border-brand-200 cursor-pointer',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
