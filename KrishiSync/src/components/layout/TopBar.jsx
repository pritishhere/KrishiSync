import React from 'react';
import { Leaf, LogOut } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import IconButton from '../common/IconButton';

const TopBar = () => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  
  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-[#FFFFFF] sticky top-0 z-10 px-4 py-3 flex justify-between items-center border-b border-gray-100">
      <div className="flex items-center gap-2">
        <div className="bg-[#2E7D32] p-1.5 rounded-lg">
          <Leaf className="text-white" size={20} />
        </div>
        <span className="text-[20px] font-bold text-[#1F2937] tracking-tight">KrishiSync</span>
      </div>
      <div className="flex items-center gap-2">
        <IconButton icon={LogOut} onClick={handleLogout} />
        <div className="w-10 h-10 bg-[#F57C00]/10 rounded-full flex items-center justify-center text-[#F57C00] font-bold text-[16px]">
          {user.name.charAt(0)}
        </div>
      </div>
    </header>
  );
};
export default TopBar;
