import React from 'react';
import { Skeleton } from '../common/Loaders';

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse font-body">
      {/* Greeting Skeleton */}
      <div className="flex justify-between items-center pt-1">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28 bg-gray-200 rounded-md" />
          <Skeleton className="h-8 w-48 bg-gray-200 rounded-md" />
        </div>
        <Skeleton className="h-10 w-10 bg-gray-200 rounded-md" />
      </div>

      {/* Weather Card Skeleton */}
      <div className="w-full bg-gray-200 rounded-md h-[175px] p-5 flex flex-col justify-between" />

      {/* Irrigation Alert Skeleton */}
      <div className="w-full bg-gray-200 rounded-md h-[110px] p-4 flex items-center gap-3" />

      {/* Quick Action Grid Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-36 bg-gray-200 rounded-md" />
        <div className="h-[140px] bg-gray-200 rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="h-[135px] bg-gray-200 rounded-md" />
          <div className="h-[135px] bg-gray-200 rounded-md" />
          <div className="h-[135px] bg-gray-200 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
