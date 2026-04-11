"use client";

import { Bell, Menu, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-card border-b border-border fixed lg:static w-full z-10">
      <div className="flex items-center gap-4 lg:hidden">
        <button className="p-2 -ml-2 text-slate-200 hover:bg-slate-100 rounded-md dark:text-slate-400 dark:hover:bg-slate-800">
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-xl font-bold text-brand-600 dark:text-brand-500">BallSync</span>
      </div>

      <div className="hidden lg:flex items-center bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 px-3 py-2 rounded-lg w-96 transition-colors focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500">
        <Search className="w-4 h-4 text-slate-400 mr-2" />
        <input 
          type="text" 
          placeholder="Search endpoints, matches or teams..." 
          className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-slate-400 font-medium"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto lg:ml-0">
        {mounted && (
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-md dark:text-slate-400 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
        )}
        
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-md dark:text-slate-400 dark:hover:bg-slate-800 relative transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card"></span>
        </button>
        
        <div className="h-8 w-8 bg-brand-100 text-brand-700 border border-brand-200 dark:border-none dark:bg-brand-900 overflow-hidden dark:text-brand-300 rounded-full flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer ml-2">
          DA
        </div>
      </div>
    </header>
  );
}
