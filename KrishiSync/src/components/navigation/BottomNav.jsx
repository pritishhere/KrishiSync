import React from 'react';
import { Home, Scan, TrendingUp, Tractor, MessageCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { id: '/dashboard', label: 'Home', icon: Home },
    { id: '/mandi', label: 'Mandi', icon: TrendingUp },
    { id: '/scanner', label: 'Scan', icon: Scan, isPrimary: true },
    { id: '/agri-pool', label: 'Pool', icon: Tractor },
    { id: '/bot-guide', label: 'Guide', icon: MessageCircle },
  ];

  return (
    <nav className="bg-white border-t border-gray-200 sticky bottom-0 z-20 pb-safe">
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.id;
          const Icon = item.icon;
          
          if (item.isPrimary) {
            return (
              <button 
                key={item.id}
                onClick={() => navigate(item.id)}
                className="-mt-8 bg-green-600 text-white p-4 rounded-full shadow-lg border-4 border-gray-50 active:scale-95 transition-transform hover:bg-green-700"
              >
                <Icon size={28} />
              </button>
            );
          }

          return (
            <button 
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex flex-col items-center p-2 min-w-[64px] transition-colors ${isActive ? 'text-green-600' : 'text-gray-500 hover:text-green-500'}`}
            >
              <Icon size={24} className={isActive ? 'fill-green-100 stroke-green-600' : ''} />
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
