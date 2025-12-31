import { useState, useEffect, useRef } from "react";
import { Menu, Search, Bell, LogOut, User, Settings, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function Header({ onMenuClick }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
        if (notificationRef.current && !notificationRef.current.contains(event.target)) {
            setShowNotifications(false);
        }
        if (profileRef.current && !profileRef.current.contains(event.target)) {
            setShowProfile(false);
        }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch alerts (Simulated "Real" data based on logic)
  useEffect(() => {
     // In a real app we might use SWR or React Query. Here we just fetch once on mount.
     async function fetchAlerts() {
         try {
             const res = await fetch('/api/dashboard');
             const data = await res.json();
             // We can infer low stock if we had a list, for now let's just use the count
             // Or better, let's fake a few items if the count > 0 for UX demo purposes
             // since our dashboard API only returns count.
             if (data.stats?.lowStock > 0) {
                 setLowStockItems(new Array(data.stats.lowStock).fill("Product requires reordering")); 
             }
         } catch (e) {
             console.error(e);
         }
     }
     fetchAlerts();
  }, []);

  const handleSearch = (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
          router.push(`/inventory?search=${encodeURIComponent(searchQuery)}`);
      }
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-surface-200 bg-white/70 px-4 shadow-sm backdrop-blur-xl md:px-8 transition-all duration-300">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={onMenuClick}>
          <Menu className="h-6 w-6 text-surface-600" />
        </Button>
        <div className="hidden md:block">
            <h2 className="text-xl font-bold tracking-tight text-surface-900">
                {/* Dynamic Title could go here, for now static is fine */}
                Overview
            </h2>
        </div>
      </div>
      
      <div className="flex items-center gap-3 md:gap-5">
        {/* Global Search */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center bg-surface-50 rounded-full px-4 py-2 border border-surface-200 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all w-64 lg:w-80 group hover:shadow-sm hover:bg-white">
           <Search className="h-4 w-4 text-surface-400 mr-2 group-hover:text-brand-500 transition-colors" />
           <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search inventory..." 
              className="bg-transparent border-none focus:outline-none text-sm w-full text-surface-600 placeholder:text-surface-400"
           />
        </form>

        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-full text-surface-400 hover:text-brand-600 hover:bg-brand-50 transition-all duration-200 outline-none focus:ring-2 focus:ring-brand-100"
            >
                <Bell className="h-5 w-5" />
                {lowStockItems.length > 0 && (
                    <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-accent-500 border-2 border-white animate-pulse"></span>
                )}
            </button>

            {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 origin-top-right rounded-xl bg-white p-2 shadow-xl ring-1 ring-black/5 focus:outline-none animate-in fade-in zoom-in-95 duration-200">
                    <div className="mb-2 px-3 py-2 text-xs font-semibold uppercase text-surface-400 tracking-wider flex justify-between">
                        <span>Notifications</span>
                        <span className="text-brand-600 cursor-pointer hover:underline">Mark all read</span>
                    </div>
                    <div className="space-y-1 max-h-[300px] overflow-y-auto">
                        {lowStockItems.length === 0 ? (
                            <div className="px-4 py-6 text-center text-sm text-surface-500">
                                <span className="block mb-1">🎉</span> No new notifications
                            </div>
                        ) : (
                            lowStockItems.map((_, i) => (
                                <Link href="/inventory" key={i} onClick={() => setShowNotifications(false)}>
                                    <div className="flex items-start gap-3 rounded-lg p-3 hover:bg-brand-50 transition-colors cursor-pointer">
                                        <div className="mt-0.5 rounded-full bg-accent-100 p-1.5 text-accent-600">
                                            <AlertTriangle className="h-3.5 w-3.5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-surface-900">Low Stock Alert</p>
                                            <p className="text-xs text-surface-500 mt-0.5">Some items have fallen below reorder levels.</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
        
        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
            <button 
                onClick={() => setShowProfile(!showProfile)}
                className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-brand-500/20 ring-4 ring-white/50 cursor-pointer hover:scale-105 transition-transform duration-200"
            >
                A
            </button>
            
            {showProfile && (
                <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-xl bg-white p-2 shadow-xl ring-1 ring-black/5 focus:outline-none animate-in fade-in zoom-in-95 duration-200">
                    <div className="border-b border-surface-100 px-3 py-3 mb-1">
                        <p className="text-sm font-medium text-surface-900">Admin User</p>
                        <p className="text-xs text-surface-500 truncate">admin@stockmate.com</p>
                    </div>
                     <div className="space-y-1">
                        <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-surface-600 hover:bg-surface-50 transition-colors">
                            <User className="h-4 w-4" /> Profile
                        </button>
                        <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-surface-600 hover:bg-surface-50 transition-colors">
                            <Settings className="h-4 w-4" /> Settings
                        </button>
                        <hr className="my-1 border-surface-100" />
                        <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                            <LogOut className="h-4 w-4" /> Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </header>
  );
}
