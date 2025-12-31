"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Plus, Search, Filter } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("ALL");

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    setLoading(true);
    try {
        const res = await fetch('/api/transactions');
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        if (Array.isArray(data)) setTransactions(data);
    } catch (error) {
        console.error("Error loading transactions:", error);
    } finally {
        setLoading(false);
    }
  }

  const filteredTransactions = transactions.filter(t => 
    filterType === "ALL" || t.type === filterType
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-surface-900 bg-clip-text text-transparent bg-gradient-to-r from-surface-900 to-surface-600">Transactions</h1>
           <p className="text-surface-500 mt-2 text-lg">History of all stock movements and adjustments.</p>
        </div>
        
        <Link href="/transactions/new">
            <Button className="w-full sm:w-auto shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all">
            <Plus className="mr-2 h-4 w-4" /> New Transaction
            </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 bg-white p-4 rounded-xl border border-surface-200 shadow-sm">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
                <select 
                    className="h-10 pl-9 pr-8 rounded-lg border border-surface-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow appearance-none cursor-pointer hover:bg-surface-50 min-w-[150px] text-surface-700"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="ALL">All Types</option>
                    <option value="IN">IN (Purchase)</option>
                    <option value="OUT">OUT (Sale)</option>
                    <option value="ADJ">ADJ (Adjustment)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-surface-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow>
              <TableHead className="font-semibold text-gray-600">Date & Time</TableHead>
              <TableHead className="font-semibold text-gray-600">Type</TableHead>
              <TableHead className="font-semibold text-gray-600">Total Amount</TableHead>
              <TableHead className="font-semibold text-gray-600">Transaction ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                 <TableRow><TableCell colSpan={4} className="text-center py-12 text-gray-500">Loading transactions...</TableCell></TableRow>
            ) : filteredTransactions.length === 0 ? (
                 <TableRow><TableCell colSpan={4} className="text-center py-12 text-gray-500">No transactions found.</TableCell></TableRow>
            ) : (
                filteredTransactions.map((t) => (
                <TableRow key={t.id} className="group hover:bg-brand-50/30 transition-colors">
                  <TableCell className="font-medium text-gray-900">
                    {new Date(t.created_at).toLocaleDateString()} 
                    <span className="text-gray-400 ml-2 text-xs">{new Date(t.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold",
                        t.type === 'IN' ? "bg-green-100 text-green-700 border border-green-200" :
                        t.type === 'OUT' ? "bg-blue-100 text-blue-700 border border-blue-200" :
                        "bg-orange-100 text-orange-700 border border-orange-200"
                    )}>
                        {t.type === 'IN' ? 'PURCHASE' : t.type === 'OUT' ? 'SALE' : 'ADJUSTMENT'}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900">${t.total_amount}</TableCell>
                  <TableCell className="font-mono text-xs text-gray-400">{t.id}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
