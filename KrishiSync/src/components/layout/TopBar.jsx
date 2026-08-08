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
    <header className="bg-[#02140c]/90 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8 py-3 border-b border-emerald-950/80 shadow-md">
      <div className="flex items-center justify-between gap-4">
        {/* Brand Logo - Subtle & Understated */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="bg-emerald-900/80 border border-emerald-700/50 p-2 rounded-xl text-emerald-400 flex items-center justify-center">
            <Leaf size={20} />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight block leading-none text-gray-200">
              Krishi<span className="text-emerald-400">Sync</span>
            </span>
            <span className="text-[10px] font-medium text-emerald-500/80 uppercase tracking-widest hidden sm:block mt-0.5">
              Agricultural Platform
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#011a0f] p-1 rounded-xl border border-emerald-950">
          {navItems.map((item) => {
            const isActive = currentPath === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-800/90 text-white border border-emerald-700/60 shadow-xs'
                    : 'text-emerald-300/70 hover:text-white hover:bg-emerald-900/40'
                }`}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Far Right: Language Switcher & Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="bg-[#011a0f] p-0.5 rounded-xl border border-emerald-950">
            <LanguageSwitcher />
          </div>

          {user ? (
            <div className="flex items-center gap-2 border-l border-emerald-900/80 pl-3">
              <div className="w-8 h-8 bg-emerald-900 border border-emerald-700/60 rounded-full flex items-center justify-center text-emerald-300 font-bold text-xs">
                {avatarLetter}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-lg bg-emerald-950 hover:bg-red-950 text-emerald-400 hover:text-red-300 transition duration-200 flex items-center justify-center border border-emerald-900"
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
            className="p-2 rounded-xl bg-[#011a0f] text-emerald-400 border border-emerald-900 hover:bg-emerald-900/50 transition active:scale-95"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-emerald-900 space-y-3 bg-[#02140c] rounded-2xl p-4 shadow-xl border border-emerald-900 text-white">
          <div className="sm:hidden pb-2 border-b border-emerald-900">
            <p className="text-[10px] font-semibold text-emerald-500 uppercase tracking-widest mb-1">Select Language</p>
            <LanguageSwitcher />
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-emerald-200 hover:bg-emerald-900/50 hover:text-white transition text-left"
                >
                  <Icon size={16} className="text-emerald-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {user && (
            <div className="pt-2 border-t border-emerald-900 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-300">{displayName}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1 bg-red-950 text-red-300 text-xs font-semibold rounded-lg border border-red-900"
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


