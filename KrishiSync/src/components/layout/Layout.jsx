import React from 'react';
import TopBar from './TopBar';

const Layout = ({ children }) => (
  <div className="bg-[#02180e] min-h-screen flex justify-center w-full font-sans antialiased text-slate-100 overflow-x-hidden selection:bg-emerald-400 selection:text-black">
    <div className="w-full max-w-7xl bg-gradient-to-b from-[#021f14] via-[#052e16] to-[#01140b] min-h-screen shadow-2xl flex flex-col relative overflow-hidden border-x border-emerald-900/30">
      {/* Ambient background glowing orbs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-10 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      <TopBar />
      <main className="flex-1 overflow-y-auto pb-12 custom-scrollbar relative z-10">
        {children}
      </main>

      <footer className="bg-[#01140b] text-emerald-300/80 py-8 px-6 sm:px-10 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-emerald-500/20 border border-emerald-400/40 rounded-xl flex items-center justify-center text-emerald-400 font-black shadow-[0_0_15px_rgba(52,211,153,0.3)]">
            🌾
          </div>
          <span className="font-black text-white text-base tracking-tight drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
            Krishi<span className="text-emerald-400">Sync</span>
          </span>
          <span className="text-emerald-400/60 hidden sm:inline">| AI-Powered Precision Agriculture Platform</span>
        </div>
        <p className="m-0 text-emerald-400/70 font-semibold">
          © 2026 KrishiSync. Empowering Indian Farmers with Deep Tech.
        </p>
      </footer>
    </div>
  </div>
);
export default Layout;




