"use client";

import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-slate-50 dark:bg-[#0B0F19] text-foreground flex min-h-screen relative overflow-x-hidden selection:bg-brand-500/30">
      
      {/* Subtle Liquid Glass Mesh Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-400/20 dark:bg-brand-500/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/20 dark:bg-indigo-500/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-blue-400/10 dark:bg-blue-500/10 blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
        
        {/* Noise texture overlay for premium feel */}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.015] dark:opacity-[0.03] mix-blend-overlay" />
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex flex-col flex-1 min-w-0 z-10 relative">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        
        <div className="p-4 lg:p-6 flex-1 flex flex-col">
          <main className="flex-1 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/40 dark:border-white/5 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] overflow-hidden relative">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent pointer-events-none" />
            <div className="h-full overflow-y-auto p-4 lg:p-8 custom-scrollbar">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
