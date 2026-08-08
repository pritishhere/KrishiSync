import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 24, className = '' }) => (
  <Loader2 size={size} className={`animate-spin text-[#2E7D32] ${className}`} />
);

export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-[#E5E7EB] rounded-[12px] ${className}`}></div>
);
