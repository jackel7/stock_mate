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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session && pathname !== "/login") {
         router.push("/login"); // Redirect to login if signed out
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
    <AuthContext.Provider value={{ user, signOut: () => supabase.auth.signOut() }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
