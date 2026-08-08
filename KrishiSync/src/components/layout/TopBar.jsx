import React from 'react';
import { Leaf, LogOut } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white sticky top-0 z-10 px-4 py-3 flex justify-between items-center border-b border-gray-100 shadow-sm">
      <div className="flex items-center gap-2">
        <Leaf className="text-green-600" fill="currentColor" />
        <h1 className="text-xl font-black text-green-800 tracking-tight">KrishiSync</h1>
      </div>
      {user && (
        <div className="flex items-center gap-3">
          <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors">
            <LogOut size={20} />
          </button>
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-bold border-2 border-white shadow-sm">
            {user.name.charAt(0)}
          </div>
        </div>
      )}
    </header>
  );
};

export default TopBar;