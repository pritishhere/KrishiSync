import React from 'react';
import { Info, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

export const Alert = ({ title, description, variant = 'info', icon: CustomIcon }) => {
  const config = {
    info: { bg: 'bg-blue-50 text-blue-950', border: 'border-2 border-black shadow-sharp-sm', icon: Info, iconColor: 'text-blue-700' },
    warning: { bg: 'bg-amber-100 text-amber-950', border: 'border-2 border-black shadow-sharp-sm', icon: AlertTriangle, iconColor: 'text-amber-800' },
    danger: { bg: 'bg-red-100 text-red-950', border: 'border-2 border-black shadow-sharp-sm', icon: ShieldAlert, iconColor: 'text-red-700' },
    success: { bg: 'bg-emerald-100 text-emerald-950', border: 'border-2 border-black shadow-sharp-sm', icon: CheckCircle, iconColor: 'text-emerald-800' }
  };
  const current = config[variant];
  const Icon = CustomIcon || current.icon;

  return (
    <div className={`flex gap-3 p-3.5 rounded-sm ${current.bg} ${current.border}`}>
      <Icon size={22} strokeWidth={2.5} className={`shrink-0 ${current.iconColor} mt-0.5`} />
      <div className="flex flex-col">
        {title && <h4 className="text-[15px] font-bold font-heading uppercase tracking-wide mb-0.5">{title}</h4>}
        {description && <p className="text-[13px] font-medium leading-normal">{description}</p>}
      </div>
    </div>
  );
};

export const AlertBanner = ({ children, variant = 'warning' }) => {
  const variants = {
    warning: "bg-amber-400 text-black border-b-2 border-black font-mono-code font-bold",
    danger: "bg-red-600 text-white border-b-2 border-black font-mono-code font-bold",
    primary: "bg-[#0B2217] text-[#C8F526] border-b-2 border-black font-mono-code font-bold"
  };
  return (
    <div className={`w-full px-4 py-2.5 flex items-center justify-center gap-2 ${variants[variant]} text-[13px] tracking-wide uppercase`}>
      {children}
    </div>
  );
};
