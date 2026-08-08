import React from 'react';
import { H2, BodyText } from './Typography';
import Button from './Button';
import { AlertCircle } from 'lucide-react';

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center text-center p-8 w-full">
    <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center text-[#6B7280] mb-4">
      {Icon && <Icon size={32} />}
    </div>
    <H2 className="mb-2">{title}</H2>
    <BodyText className="text-[#6B7280] mb-6 max-w-[250px]">{description}</BodyText>
    {action}
  </div>
);

export const ErrorState = ({ title = "Something went wrong", description, onRetry }) => (
  <div className="flex flex-col items-center justify-center text-center p-8 w-full border-2 border-dashed border-[#EF4444]/20 rounded-[16px] bg-[#EF4444]/5">
    <AlertCircle size={40} className="text-[#EF4444] mb-4" />
    <H2 className="mb-2 text-[#EF4444]">{title}</H2>
    {description && <BodyText className="text-[#6B7280] mb-6">{description}</BodyText>}
    {onRetry && <Button variant="outline" onClick={onRetry}>Try Again</Button>}
  </div>
);
