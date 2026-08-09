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
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8 py-3 border-b border-[#e2dcd0] shadow-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Brand Logo - Subtle & Understated */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="bg-[#f9f8f6] border border-[#e2dcd0] p-2 rounded-md text-[#2d5a27] flex items-center justify-center">
            <Leaf size={20} />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight block leading-none text-gray-900">
              Krishi<span className="text-[#2d5a27]">Sync</span>
            </span>
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest hidden sm:block mt-0.5">
              Agricultural Platform
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#f9f8f6] p-1 rounded-md border border-[#e2dcd0]">
          {navItems.map((item) => {
            const isActive = currentPath === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs lg:text-sm font-semibold transition-all duration-200 ${isActive
                    ? 'bg-white text-[#2d5a27] border border-[#e2dcd0] shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-[#e8e0d5]/50'
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
          <div className="bg-white p-0.5 rounded-md border border-[#e2dcd0]">
            <LanguageSwitcher />
          </div>

          {user ? (
            <div className="flex items-center gap-2 border-l border-[#e2dcd0] pl-3">
              <div className="w-8 h-8 bg-[#f9f8f6] border border-[#e2dcd0] rounded-full flex items-center justify-center text-[#2d5a27] font-bold text-xs">
                {avatarLetter}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-md bg-[#f9f8f6] hover:bg-red-50 text-gray-500 hover:text-red-600 transition duration-200 flex items-center justify-center border border-[#e2dcd0]"
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
            className="p-2 rounded-md bg-[#f9f8f6] text-gray-700 border border-[#e2dcd0] hover:bg-gray-100 transition active:scale-95"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-[#e2dcd0] space-y-3 bg-white rounded-md p-4 shadow-sm border border-[#e2dcd0] text-gray-900">
          <div className="sm:hidden pb-2 border-b border-[#e2dcd0]">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1">Select Language</p>
            <LanguageSwitcher />
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold text-gray-700 hover:bg-[#f9f8f6] hover:text-gray-900 transition text-left"
                >
                  <Icon size={16} className="text-[#2d5a27]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {user && (
            <div className="pt-2 border-t border-[#e2dcd0] flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700">{displayName}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-md border border-red-200"
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


