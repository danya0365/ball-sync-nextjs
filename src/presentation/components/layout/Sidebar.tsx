"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Key, Database, BookOpen, Settings } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "API Keys", href: "/keys", icon: Key },
    { name: "Data Sources", href: "/sources", icon: Database },
    { name: "Documentation", href: "/docs", icon: BookOpen },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <span className="text-2xl font-black tracking-tight text-brand-600 dark:text-brand-500">BallSync</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2 mt-4">Menu</div>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive 
                  ? "bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 font-medium shadow-sm" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border mt-auto">
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <p className="text-sm font-semibold flex justify-between items-center text-foreground">
            Pro Plan <span className="text-xs bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300 px-2 py-0.5 rounded-full">Active</span>
          </p>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-brand-500 h-2 rounded-full w-[45%]"></div>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">4.5M / 10M API Requests</p>
        </div>
      </div>
    </aside>
  );
}
