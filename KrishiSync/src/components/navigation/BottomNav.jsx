import React from 'react';
import { Home, Scan, TrendingUp, Tractor, MessageCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppContext();

  if (!user) return null;
  
  const navItems = [
    { id: '/dashboard', label: 'Home', icon: Home },
    { id: '/mandi', label: 'Mandi', icon: TrendingUp },
    { id: '/scanner', label: 'Scan', icon: Scan, isPrimary: true },
    { id: '/agri-pool', label: 'Pool', icon: Tractor },
    { id: '/bot-guide', label: 'Guide', icon: MessageCircle },
  ];

  return (
    <nav className="bg-white border-t border-[#e2dcd0] sticky bottom-0 z-20 pb-safe">
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.id;
          const Icon = item.icon;
          
          if (item.isPrimary) {
            return (
              <button 
                key={item.id} onClick={() => navigate(item.id)}
                className="relative -mt-8 flex items-center justify-center w-16 h-16 bg-[#2d5a27] text-white rounded-md shadow-sm border-2 border-[#f9f8f6] active:scale-95 transition-transform"
              >
                <Icon size={28} />
              </button>
            );
          }

          return (
            <button 
              key={item.id} onClick={() => navigate(item.id)}
              className={`flex flex-col items-center justify-center w-16 h-14 rounded-md transition-colors ${isActive ? 'text-[#2d5a27]' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Icon size={24} className={isActive ? 'fill-[#2d5a27]/10 stroke-[#2d5a27]' : ''} />
              <span className={`text-[12px] mt-1 font-medium ${isActive ? 'text-[#2d5a27] font-bold' : ''}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
export default BottomNav;
