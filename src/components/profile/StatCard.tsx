import React from 'react';
import { Card } from '../common/Card';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBg = 'bg-brand-50 text-brand-700',
  className,
}) => {
  return (
    <Card className={twMerge(clsx('flex items-center gap-4', className))}>
      <div className={twMerge(clsx('w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-lg font-bold', iconBg))}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
        <h4 className="text-xl font-extrabold text-gray-900 mt-0.5">{value}</h4>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </Card>
  );
};
