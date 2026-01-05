"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    Package, 
    Tag, 
    Users, 
    ArrowRightLeft, 
    BarChart3,
    LogOut,
    ChevronLeft, 
    ChevronRight, 
    Settings, 
    Menu, 
    X, 
    Database, 
    Grid, 
    PanelLeft 
} from "lucide-react";
import { useAuth } from "../params/AuthProvider";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Categories", href: "/categories", icon: Tag },
  { name: "Vendors", href: "/vendors", icon: Users },
];

export function Sidebar({ isOpen, isCollapsed, toggleCollapse, onCloseMobile }) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
            "fixed inset-0 z-40 bg-gray-900/80 backdrop-blur-sm transition-opacity md:hidden",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onCloseMobile}
      />

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-brand-950 text-white shadow-2xl transition-all duration-300 ease-in-out md:translate-x-0 border-r border-brand-900",
          isOpen ? "translate-x-0" : "-translate-x-full", // Mobile toggle
          isCollapsed ? "w-20" : "w-64" // Desktop collapse
        )}
      >
        {/* Header Logo Area */}
        <div className="flex h-20 items-center justify-between px-4 border-b border-brand-900/50 bg-brand-950/50">
           {!isCollapsed && (
             <div className="flex items-center gap-3 font-bold text-xl tracking-wide text-white">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                    <Package className="h-5 w-5" />
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-brand-100 whitespace-nowrap">StockMate</span>
             </div>
           )}
           
           <button 
                onClick={toggleCollapse}
                className={cn(
                    "p-2 rounded-lg text-brand-400 hover:text-white hover:bg-white/10 transition-colors",
                    isCollapsed ? "mx-auto" : "ml-auto"
                )}
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
             >
                <PanelLeft className="h-5 w-5" />
           </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2 p-4 mt-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "group flex items-center rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300 relative overflow-hidden",
                  isActive
                    ? "bg-white/10 text-white shadow-inner"
                    : "text-brand-200 hover:bg-brand-900/50 hover:text-white",
                   isCollapsed && "justify-center px-0"
                )}
                title={isCollapsed ? item.name : ""}
              >
                {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-500 rounded-r-full shadow-[0_0_10px_#e11d48]"></div>
                )}
                <Icon className={cn(
                    "h-5 w-5 transition-transform duration-300", 
                    isActive ? "text-accent-400 scale-110" : "text-brand-400 group-hover:text-white group-hover:scale-105",
                    !isCollapsed && "mr-3"
                )} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
        
        {/* Footer Actions */}
        <div className="p-4 border-t border-brand-900/50 space-y-2 bg-brand-950/50">

             <button 
                 onClick={() => signOut()}
                 className={cn(
                 "flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium text-brand-200 hover:bg-red-500/10 hover:text-red-400 transition-colors",
                 isCollapsed && "justify-center px-0"
             )}>
                <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                {!isCollapsed && <span>Logout</span>}
             </button>
        </div>
      </aside>
    </>
  );
}
