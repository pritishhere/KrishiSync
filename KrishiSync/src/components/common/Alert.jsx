import React from 'react';
import { Info, AlertCircle, CheckCircle } from 'lucide-react';

export const Alert = ({ title, description, variant = 'info', icon: CustomIcon }) => {
  const config = {
    info: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-800', icon: Info, iconColor: 'text-blue-500' },
    warning: { bg: 'bg-[#F57C00]/10', border: 'border-[#F57C00]/20', text: 'text-[#8a4500]', icon: AlertCircle, iconColor: 'text-[#F57C00]' },
    danger: { bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/20', text: 'text-[#991b1b]', icon: AlertCircle, iconColor: 'text-[#EF4444]' },
    success: { bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/20', text: 'text-[#065f46]', icon: CheckCircle, iconColor: 'text-[#10B981]' }
  };
  const current = config[variant];
  const Icon = CustomIcon || current.icon;

  return (
    <div className={`flex gap-3 p-4 rounded-[16px] border ${current.bg} ${current.border}`}>
      <Icon size={24} className={`shrink-0 ${current.iconColor}`} />
      <div className="flex flex-col">
        {title && <h4 className={`text-[16px] font-semibold ${current.text} mb-1`}>{title}</h4>}
        {description && <p className={`text-[14px] font-medium ${current.text} opacity-90`}>{description}</p>}
      </div>
    </div>
  );
};

export const AlertBanner = ({ children, variant = 'warning' }) => {
  const variants = {
    warning: "bg-[#F57C00] text-white",
    danger: "bg-[#EF4444] text-white",
    primary: "bg-[#2E7D32] text-white"
  };
  return (
    <div className={`w-full px-4 py-3 flex items-center justify-center gap-2 ${variants[variant]} text-[14px] font-medium shadow-sm`}>
      {children}
    </div>
  );
};
