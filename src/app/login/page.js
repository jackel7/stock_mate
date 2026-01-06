"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Check for Dummy Admin Credentials
      if (email === "admin@stockmate.com" && password === "admin123") {
        localStorage.setItem("stockmate_mock_session", "true");
        window.location.href = "/"; 
        return;
      }

      
      router.push("/");
      router.refresh();

    } catch (err) {
      setError(err.message || "Invalid login credentials.");
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <div className="w-full max-w-[400px] p-6">
        {/* Minimal Header */}
        <div className="text-center mb-10">
            <div className="h-12 w-12 bg-gray-900 text-white rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22v-9"/></svg>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Sign in to StockMate</h1>
            <p className="text-sm text-gray-500 mt-2">Enter your credentials to access the dashboard.</p>
        </div>

        {/* Clean Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleLogin} className="space-y-5">
                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none text-gray-900 sm:text-sm"
                        placeholder="admin@stockmate.com"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Password</label>
                    <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none text-gray-900 sm:text-sm"
                        placeholder="••••••••"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in"}
                </button>
            </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
            Created for University Final Project
        </p>
      </div>
    </div>
  );
}
