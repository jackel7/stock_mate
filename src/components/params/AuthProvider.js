"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
        // 1. Check for Dummy Admin (Local Storage)
        const mockSession = localStorage.getItem("stockmate_mock_session");
        if (mockSession) {
            setUser({ email: "admin@stockmate.com", role: "admin", id: "dummy-admin-id" });
            setLoading(false);
            return;
        }

        // 2. Check Supabase Session
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setLoading(false);
    };

    checkSession();

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // If we are in mock mode, ignore Supabase updates (unless explicit sign out)
      if (localStorage.getItem("stockmate_mock_session")) return;
      
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session && pathname !== "/login") {
         router.push("/login"); 
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  // Route Protection Logic
  useEffect(() => {
      if (!loading) {
          if (!user && pathname !== "/login") {
              router.push("/login");
          } else if (user && pathname === "/login") {
              router.push("/"); // Logged in users shouldn't see login page
          }
      }
  }, [user, loading, pathname, router]);

  // Unified Sign Out
  const signOut = async () => {
      localStorage.removeItem("stockmate_mock_session"); // Clear mock
      await supabase.auth.signOut(); // Clear Supabase
      setUser(null);
      router.push("/login");
  };

  if (loading) {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
                <p className="text-sm text-gray-400 font-medium">Loading Stock Mate...</p>
            </div>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
