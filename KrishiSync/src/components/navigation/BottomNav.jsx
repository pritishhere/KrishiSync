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
    <nav className="bg-[#FFFFFF] border-t border-gray-200 sticky bottom-0 z-20 pb-safe">
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.id;
          const Icon = item.icon;
          
          if (item.isPrimary) {
            return (
              <button 
                key={item.id} onClick={() => navigate(item.id)}
                className="relative -mt-8 flex items-center justify-center w-16 h-16 bg-[#2E7D32] text-white rounded-full shadow-lg border-4 border-[#F9FAFB] active:scale-95 transition-transform"
              >
                <Icon size={28} />
              </button>
            );
          }

          return (
            <button 
              key={item.id} onClick={() => navigate(item.id)}
              className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-colors ${isActive ? 'text-[#2E7D32]' : 'text-[#6B7280] hover:bg-gray-50'}`}
            >
              <Icon size={24} className={isActive ? 'fill-[#2E7D32]/10 stroke-[#2E7D32]' : ''} />
              <span className={`text-[12px] mt-1 font-medium ${isActive ? 'text-[#2E7D32] font-bold' : ''}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
export default BottomNav;
