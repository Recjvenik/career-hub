import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs animate-pulse flex flex-col gap-3">
      <div className="flex justify-between items-start gap-4">
        <div className="h-5 bg-gray-200 rounded w-2/3" />
        <div className="h-5 bg-gray-200 rounded-pill w-16" />
      </div>
      <div className="h-4 bg-gray-100 rounded w-full" />
      <div className="h-4 bg-gray-100 rounded w-4/5" />
      <div className="flex gap-2 mt-2">
        <div className="h-6 bg-gray-100 rounded-pill w-16" />
        <div className="h-6 bg-gray-100 rounded-pill w-20" />
      </div>
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
        <div className="h-6 bg-gray-200 rounded w-24" />
        <div className="h-9 bg-gray-200 rounded-pill w-28" />
      </div>
    </div>
  );
};

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-xs animate-pulse flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full" />
        <div className="flex flex-col gap-2">
          <div className="h-6 bg-gray-200 rounded w-40" />
          <div className="h-4 bg-gray-100 rounded w-56" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-10 bg-gray-100 rounded-lg" />
        <div className="h-10 bg-gray-100 rounded-lg" />
        <div className="h-10 bg-gray-100 rounded-lg" />
        <div className="h-10 bg-gray-100 rounded-lg" />
      </div>
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-64" />
      <div className="h-28 bg-gray-200 rounded-xl w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-32 bg-gray-200 rounded-xl" />
        <div className="h-32 bg-gray-200 rounded-xl" />
        <div className="h-32 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
};
