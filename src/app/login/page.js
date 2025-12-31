"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage("Check your email for the confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-brand-600 p-8 text-center">
            <h1 className="text-3xl font-bold text-white tracking-tight">Stock Mate</h1>
            <p className="text-brand-100 mt-2 text-sm">Inventory Management System</p>
        </div>
        
        <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
                {isSignUp ? "Create an Account" : "Welcome Back"}
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center">
                    {error}
                </div>
            )}

            {message && (
                <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-600 text-sm rounded-lg text-center">
                    {message}
                </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                            type="email" 
                            required 
                            className="pl-10" 
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                            type="password" 
                            required 
                            className="pl-10" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <Button 
                    type="submit" 
                    className="w-full bg-brand-600 hover:bg-brand-700" 
                    disabled={loading}
                >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {loading ? "Processing..." : (isSignUp ? "Sign Up" : "Sign In")}
                </Button>
            </form>

            <div className="mt-6 text-center">
                <button 
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-brand-600 hover:text-brand-700 font-medium hover:underline"
                >
                    {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
