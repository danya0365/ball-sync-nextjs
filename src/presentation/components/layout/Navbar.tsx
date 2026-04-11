"use client";

import { Bell, Menu, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-20 flex items-center justify-between px-6 lg:px-10 bg-white/40 dark:bg-[#09090b]/40 backdrop-blur-xl border-b border-white/20 dark:border-white/5 sticky top-0 z-30 transition-all">
      <div className="flex items-center gap-4 lg:hidden">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-200/50 rounded-xl dark:text-slate-400 dark:hover:bg-slate-800/50 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-xl font-black tracking-tight text-slate-800 dark:text-white">
          Ball<span className="text-brand-500">Sync</span>
        </span>
      </div>

      <div className="hidden lg:flex items-center bg-white/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 px-4 py-2.5 rounded-2xl w-[400px] transition-all focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10 shadow-sm">
        <Search className="w-4 h-4 text-slate-400 mr-3" />
        <input 
          type="text" 
          placeholder="Search endpoints, matches or teams..." 
          className="bg-transparent border-none outline-none text-sm w-full text-slate-800 dark:text-slate-200 placeholder:text-slate-400 font-medium"
        />
      </div>

      <div className="flex items-center gap-3 ml-auto lg:ml-0">
        {mounted && (
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="px-4 py-2 text-slate-500 hover:bg-slate-200/50 hover:text-slate-800 rounded-xl dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white text-sm font-bold transition-colors"
          >
            {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
        )}
        
        <button className="p-2.5 text-slate-500 hover:bg-slate-200/50 rounded-xl dark:text-slate-400 dark:hover:bg-slate-800/50 relative transition-colors shadow-sm bg-white/50 dark:bg-slate-900/50 border border-white/20 dark:border-white/5">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950 animate-pulse"></span>
        </button>
        
        <div className="h-10 w-10 bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700 border border-white dark:border-white/10 dark:from-slate-800 dark:to-slate-900 overflow-hidden dark:text-brand-300 rounded-xl flex items-center justify-center font-black text-sm shadow-md cursor-pointer ml-2 hover:scale-105 transition-transform">
          DA
        </div>
      </div>
    </header>
  );
}
