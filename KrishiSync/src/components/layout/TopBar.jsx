import React, { useState } from 'react';
import { Leaf, LogOut, Menu, X, Home, TrendingUp, Calculator, PhoneCall } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import LanguageSwitcher from '../LanguageSwitcher';

const TopBar = () => {
  let user = null;
  let logout = null;
  try {
    const context = useAppContext();
    user = context?.user || null;
    logout = context?.logout || null;
  } catch (_e) {
    // Safe fallback if rendered outside AppProvider
  }

  const navigate = useNavigate();
  let currentPath = '/';
  try {
    const location = useLocation();
    currentPath = location?.pathname || '/';
  } catch (_e) {
    // Safe fallback
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: '/', label: 'Home', icon: Home, anchor: '#home' },
    { id: '/mandi', label: 'Mandi Prices', icon: TrendingUp, anchor: '#mandi' },
    { id: '#calculator', label: 'Profit Calculator', icon: Calculator, anchor: '#calculator' },
    { id: '#advisory', label: 'SMS/Voice Advisory', icon: PhoneCall, anchor: '#advisory' },
  ];

  const handleNavClick = (item) => {
    setMobileMenuOpen(false);
    if (item.anchor && item.anchor.startsWith('#')) {
      const element = document.querySelector(item.anchor);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    if (item.id && !item.id.startsWith('#')) {
      navigate(item.id);
    }
  };

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  const displayName = user?.name || user?.phone || 'Farmer';
  const avatarLetter = displayName ? displayName.charAt(0).toUpperCase() : 'F';

  return (
    <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 px-4 sm:px-8 py-3.5 border-b border-emerald-500/20 shadow-md">
      <div className="flex items-center justify-between gap-4">
        {/* Brand Logo - Vibrant & Animated */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="bg-linear-to-br from-emerald-600 to-teal-700 p-2.5 rounded-2xl text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform duration-300">
            <Leaf size={22} className="animate-sway" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight block leading-none text-gray-900">
              Krishi<span className="text-emerald-600 font-black">Sync</span>
            </span>
            <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest hidden sm:block mt-0.5">
              🌾 Precision Agriculture Intelligence
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links - Pill Style */}
        <nav className="hidden md:flex items-center gap-1.5 bg-emerald-50/80 p-1.5 rounded-full border border-emerald-200/60 shadow-inner">
          {navItems.map((item) => {
            const isActive = currentPath === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs lg:text-sm font-bold transition-all duration-300 ${isActive
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/30 scale-102'
                    : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-100/60'
                  }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Far Right: Language Switcher & User Avatar */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="bg-white/90 p-1 rounded-xl border border-emerald-200 shadow-xs">
            <LanguageSwitcher />
          </div>

          {user ? (
            <div className="flex items-center gap-2 border-l border-emerald-200 pl-3">
              <div className="w-9 h-9 bg-linear-to-br from-amber-400 to-amber-600 text-white font-black text-sm rounded-full flex items-center justify-center shadow-md shadow-amber-500/20 border-2 border-white">
                {avatarLetter}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition duration-200 flex items-center justify-center border border-red-200 shadow-2xs"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : null}
        </div>

        {/* Mobile Hamburger & Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="hidden sm:block scale-90 origin-right">
            <LanguageSwitcher />
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition active:scale-95 shadow-2xs"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-emerald-200 space-y-3 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-emerald-200 text-gray-900 animate-float-gentle">
          <div className="sm:hidden pb-2 border-b border-gray-100">
            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">Select Language</p>
            <LanguageSwitcher />
          </div>

          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 transition text-left"
                >
                  <Icon size={18} className="text-emerald-600" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {user && (
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-extrabold text-gray-800">{displayName}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3.5 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-200 shadow-2xs"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default TopBar;


