"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Package, AlertTriangle, ArrowRightLeft, Users, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    lowStock: 0,
    vendors: 0,
    totalValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      setStats(data.stats);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="relative">
             <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-brand-50"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-surface-900 bg-clip-text text-transparent bg-gradient-to-r from-surface-900 to-surface-600">Dashboard</h1>
        <p className="text-surface-500 mt-2 text-lg">Overview of your inventory status.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-t-4 border-t-brand-500 hover:translate-y-[-4px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-surface-600 group-hover:text-brand-700 transition-colors">Total Products</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center shadow-inner">
                 <Package className="h-5 w-5 text-brand-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-surface-900">{stats.products}</div>
            <p className="text-xs text-brand-600 font-medium mt-1 inline-flex items-center gap-1">
                 <TrendingUp className="h-3 w-3" />
                 +2 from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-accent-500 hover:translate-y-[-4px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-surface-600">Low Stock Alerts</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-accent-50 flex items-center justify-center shadow-inner">
                <AlertTriangle className="h-5 w-5 text-accent-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-surface-900">{stats.lowStock}</div>
            <p className="text-xs text-accent-600 font-medium mt-1 bg-accent-50 px-2 py-0.5 rounded-full inline-block">
                Action required
            </p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-blue-500 hover:translate-y-[-4px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-surface-600">Total Value</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shadow-inner">
                <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-surface-900">${stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-blue-600 font-medium mt-1">Estimated asset value</p>
          </CardContent>
        </Card>

         <Card className="border-t-4 border-t-orange-500 hover:translate-y-[-4px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-surface-600">Active Vendors</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center shadow-inner">
                <Users className="h-5 w-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-surface-900">{stats.vendors}</div>
            <p className="text-xs text-orange-600 font-medium mt-1">Trusted partners</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Areas */}
      <div className="grid gap-6 md:grid-cols-7 ">
        {/* Recent Activity */}



      </div>
    </div>
  );
}


