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
    <nav className="bg-white/80 backdrop-blur-xl border-t border-emerald-500/20 sticky bottom-0 z-40 pb-safe shadow-2xl">
      <div className="flex justify-around items-center px-3 py-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.id;
          const Icon = item.icon;
          
          if (item.isPrimary) {
            return (
              <button 
                key={item.id} onClick={() => navigate(item.id)}
                className="relative -mt-8 flex items-center justify-center w-16 h-16 bg-linear-to-br from-emerald-600 to-teal-700 text-white rounded-2xl shadow-xl shadow-emerald-700/40 border-4 border-white active:scale-95 transition-all duration-300 hover:scale-105"
              >
                <Icon size={28} className="animate-pulse" />
              </button>
            );
          }

          return (
            <button 
              key={item.id} onClick={() => navigate(item.id)}
              className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-200 ${isActive ? 'text-emerald-700 bg-emerald-100/60 font-black' : 'text-gray-500 hover:text-gray-900 hover:bg-emerald-50/50'}`}
            >
              <Icon size={22} className={isActive ? 'stroke-emerald-700 animate-bounce' : ''} />
              <span className={`text-[11px] mt-1 font-bold ${isActive ? 'text-emerald-800' : ''}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
export default BottomNav;
