import React, { useState, useEffect } from 'react';
import { Download, X, Leaf, Sparkles } from 'lucide-react';

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] Install prompt outcome: ${outcome}`);

    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="bg-[#2E7D32] text-white p-3.5 px-4 shadow-md border-b border-green-700 flex items-center justify-between font-body animate-fade-in sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-white p-2 rounded-xl text-[#2E7D32] shrink-0 shadow-xs">
          <Leaf size={20} strokeWidth={2.5} />
        </div>

        <div className="space-y-0.5">
          <h4 className="text-[14px] font-extrabold font-heading text-white flex items-center gap-1.5 leading-tight">
            Install KrishiSync App <Sparkles size={13} className="text-[#F57C00]" />
          </h4>
          <p className="text-[12px] text-green-100 font-medium leading-none">
            Add to Home Screen for fast offline access.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleInstallClick}
          className="bg-[#F57C00] hover:bg-[#d66b00] text-white font-extrabold font-heading text-[12px] px-3 py-1.5 rounded-xl transition-transform active:scale-95 shadow-xs flex items-center gap-1 cursor-pointer"
        >
          <Download size={14} />
          Install
        </button>

        <button
          onClick={handleDismiss}
          className="p-1.5 text-green-200 hover:text-white rounded-lg transition-colors cursor-pointer"
          title="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
