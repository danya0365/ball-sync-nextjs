"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Key, Database, BookOpen, Settings, ShieldAlert } from "lucide-react";

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Data Sources", href: "/sources", icon: Database },
    { name: "Resolution Center", href: "/resolutions", icon: ShieldAlert },
    { name: "API Keys", href: "/keys", icon: Key },
    { name: "Documentation", href: "/docs", icon: BookOpen },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl border-r border-white/20 dark:border-white/10 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="h-20 flex items-center px-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/30 text-white mr-3">
            <Database className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">
            Ball<span className="text-brand-500">Sync</span>
          </span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-4 mt-2">Main Menu</div>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => onClose()}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group relative overflow-hidden ${
                  isActive 
                    ? "text-brand-600 dark:text-brand-300 font-semibold" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-transparent dark:from-brand-500/20" />
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-500 rounded-r-full" />
                )}
                <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-brand-500" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`} />
                <span className="z-10 relative">{link.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-6 mt-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800/80 dark:to-slate-900/80 border border-white/50 dark:border-white/5 rounded-3xl p-5 shadow-sm">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <p className="text-sm font-bold flex justify-between items-center text-slate-800 dark:text-slate-200 mb-4">
              Pro Plan 
              <span className="text-[10px] font-black uppercase tracking-wider bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300 px-2.5 py-1 rounded-full shadow-sm">Active</span>
            </p>
            <div className="w-full bg-slate-200/50 dark:bg-slate-950/50 h-1.5 rounded-full overflow-hidden shadow-inner">
              <div className="bg-gradient-to-r from-brand-400 to-brand-600 h-1.5 rounded-full w-[45%] relative">
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 font-semibold flex justify-between">
              <span>Usage</span>
              <span>4.5M / 10M</span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
