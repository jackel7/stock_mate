"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Download, History, Bot } from "lucide-react";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("movements");
  const [movements, setMovements] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    setLoading(true);
    try {
        const res = await fetch(`/api/reports?type=${activeTab}`);
        const data = await res.json();
        
        if (data.error) throw new Error(data.error);

        if (activeTab === "movements") {
            setMovements(data);
        } else {
            setLogs(data);
        }
    } catch (error) {
        console.error("Error loading report data:", error);
    } finally {
        setLoading(false);
    }
  }

  const downloadCSV = () => {
    const data = activeTab === "movements" ? movements : logs;
    if (!data.length) return;

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(row => 
        Object.values(row).map(val => 
            typeof val === 'object' ? JSON.stringify(val).replace(/,/g, ';') : val
        ).join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeTab}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-surface-900 bg-clip-text text-transparent bg-gradient-to-r from-surface-900 to-surface-600">Reports & Logs</h1>
           <p className="text-surface-500 mt-2 text-lg">View audit trails and AI agent interactions.</p>
        </div>
        <Button onClick={downloadCSV} variant="outline" className="shadow-sm border-surface-200 text-surface-600 hover:border-brand-200 hover:text-brand-600 hover:bg-brand-50">
            <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="flex space-x-1 border-b border-surface-200 bg-white px-4 pt-2 rounded-t-xl">
        <button
            className={`px-4 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === 'movements' ? 'border-brand-500 text-brand-600' : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'}`}
            onClick={() => setActiveTab('movements')}
        >
            <div className="flex items-center"><History className="mr-2 h-4 w-4" /> Stock Movements</div>
        </button>
        <button
            className={`px-4 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === 'agent' ? 'border-brand-500 text-brand-600' : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'}`}
            onClick={() => setActiveTab('agent')}
        >
             <div className="flex items-center"><Bot className="mr-2 h-4 w-4" /> Agent Activity</div>
        </button>
      </div>

      <div className="rounded-b-xl border border-t-0 border-surface-200 bg-white shadow-sm overflow-hidden min-h-[500px]">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow>
              {activeTab === "movements" ? (
                  <>
                    <TableHead className="font-semibold text-gray-600">Date</TableHead>
                    <TableHead className="font-semibold text-gray-600">Product</TableHead>
                    <TableHead className="font-semibold text-gray-600">Change</TableHead>
                    <TableHead className="font-semibold text-gray-600">Stock After</TableHead>
                    <TableHead className="font-semibold text-gray-600">Note</TableHead>
                  </>
              ) : (
                  <>
                    <TableHead className="font-semibold text-gray-600">Date</TableHead>
                    <TableHead className="font-semibold text-gray-600">Action</TableHead>
                    <TableHead className="font-semibold text-gray-600">Query</TableHead>
                    <TableHead className="font-semibold text-gray-600">Response</TableHead>
                  </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-12 text-gray-500">Loading data...</TableCell></TableRow>
            ) : (activeTab === "movements" ? movements : logs).length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-12 text-gray-500">No records found.</TableCell></TableRow>
            ) : (
                activeTab === "movements" ? (
                    movements.map((m) => (
                        <TableRow key={m.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="font-medium text-gray-900">
                                {new Date(m.created_at).toLocaleDateString()}
                                <span className="text-gray-400 text-xs ml-2">{new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </TableCell>
                            <TableCell>
                                <span className="font-medium">{m.products?.name}</span>
                                <span className="text-gray-400 text-xs ml-2 font-mono">({m.products?.sku})</span>
                            </TableCell>
                            <TableCell>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${m.change_quantity >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                    {m.change_quantity > 0 ? "+" : ""}{m.change_quantity}
                                </span>
                            </TableCell>
                            <TableCell className="font-mono">{m.current_stock_after}</TableCell>
                            <TableCell className="text-gray-500 text-sm max-w-xs truncate" title={m.note}>{m.note}</TableCell>
                        </TableRow>
                    ))
                ) : (
                    logs.map((l) => (
                        <TableRow key={l.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="font-medium text-gray-900">
                                {new Date(l.created_at).toLocaleDateString()}
                                <span className="text-gray-400 text-xs ml-2">{new Date(l.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </TableCell>
                            <TableCell>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                    {l.action_type}
                                </span>
                            </TableCell>
                            <TableCell className="max-w-xs truncate text-gray-600" title={l.query_text}>{l.query_text}</TableCell>
                            <TableCell className="max-w-xs truncate text-gray-600" title={l.response_summary}>{l.response_summary}</TableCell>
                        </TableRow>
                    ))
                )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
