import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Scan, TrendingUp, Tractor, Bot } from 'lucide-react';

const MobileBottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/scanner', label: 'Scanner', icon: Scan },
    { path: '/mandi', label: 'Mandi', icon: TrendingUp },
    { path: '/agri-pool', label: 'Agri-Pool', icon: Tractor },
    { path: '/bot-guide', label: 'Bot Guide', icon: Bot },
  ];

  return (
    <nav className="h-[72px] bg-white border-t border-[#e2dcd0] sticky bottom-0 z-40 w-full shrink-0 font-body pb-safe shadow-sm">
      <div className="flex justify-around items-center h-full px-1">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          
          return (
            <button 
              key={item.path} 
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center flex-1 h-[56px] mx-0.5 rounded-xl transition-all duration-150 relative cursor-pointer"
            >
              {/* Active Indicator Top Bar */}
              {isActive && <div className="absolute top-0 w-8 h-1 bg-[#2d5a27] rounded-b-full" />}
              
              <Icon 
                size={22} 
                strokeWidth={isActive ? 2.5 : 2}
                className={`mb-1 transition-all duration-150 ${isActive ? 'text-[#2d5a27]' : 'text-gray-500'}`} 
              />
              <span 
                className={`text-[12px] font-heading tracking-tight transition-all duration-150 ${
                  isActive ? 'text-[#2d5a27] font-bold' : 'text-gray-500 font-medium'
                }`}
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
