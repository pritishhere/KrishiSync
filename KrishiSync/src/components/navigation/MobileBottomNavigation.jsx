import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Scan, TrendingUp, Tractor } from 'lucide-react';

const MobileBottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/scanner', label: 'Scanner', icon: Scan },
    { path: '/mandi', label: 'Mandi', icon: TrendingUp },
    { path: '/agri-pool', label: 'Agri-Pool', icon: Tractor },
  ];

  return (
    <nav className="h-[72px] bg-[#FFFFFF] border-t border-gray-200 sticky bottom-0 z-40 w-full shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
      <div className="flex justify-around items-center h-full px-2">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          
          return (
            <button 
              key={item.path} 
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center w-[72px] h-full rounded-xl transition-colors relative"
            >
              {/* Active Indicator Top Bar */}
              {isActive && <div className="absolute top-0 w-8 h-1 bg-[#2E7D32] rounded-b-full"></div>}
              
              <Icon 
                size={24} 
                className={`mb-1 transition-all duration-200 ${isActive ? 'text-[#2E7D32]' : 'text-[#6B7280]'}`} 
              />
              <span 
                className={`text-[12px] transition-all duration-200 ${isActive ? 'text-[#2E7D32] font-bold' : 'text-[#6B7280] font-medium'}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNavigation;
