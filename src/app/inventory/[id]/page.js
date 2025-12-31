"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { ArrowLeft, Tag, Package, Calendar, Edit, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from 'react';

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (id) {
        fetchProductDetails();
    }
  }, [id]);

  async function fetchProductDetails() {
    setLoading(true);
    // Fetch product info
    const { data: productData, error: pError } = await supabase
        .from("products")
        .select("*, categories(name), vendors(*)")
        .eq("id", id)
        .single();
    
    // Fetch movement history (simple version using transaction items or stock movements)
    // Assuming stock_movements table exists as per schema
    const { data: movementData, error: mError } = await supabase
        .from("stock_movements")
        .select("*")
        .eq("product_id", id)
        .order("created_at", { ascending: false })
        .limit(10);

    if (productData) setProduct(productData);
    if (movementData) setHistory(movementData);
    setLoading(false);
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-brand-500">Loading product details...</div>;
  }

  if (!product) {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
            <Button onClick={() => router.back()}>Go Back</Button>
        </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <Button variant="ghost" onClick={() => router.back()} className="hover:bg-transparent hover:text-brand-600 p-0 -ml-2 mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Image & Quick Stats */}
        <div className="md:col-span-1 space-y-6">
            <Card className="overflow-hidden border-none shadow-lg">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                     {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                     ) : (
                        <div className="text-6xl font-black text-gray-200">{product.sku.slice(0, 2)}</div>
                     )}
                </div>
            </Card>

            <Card className="bg-brand-50 border-brand-100">
                <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Current Stock</span>
                        <span className="text-xl font-bold text-gray-900">{product.quantity} <span className="text-xs font-normal text-gray-500">{product.unit}</span></span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Stock Value</span>
                        <span className="text-xl font-bold text-brand-700">${(product.quantity * product.cost_price).toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Right Column: Details & History */}
        <div className="md:col-span-2 space-y-6">
            <div>
                 <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded uppercase tracking-wider">
                        {product.categories?.name || "Uncategorized"}
                    </span>
                    <span className="text-sm text-gray-400 font-mono">#{product.sku}</span>
                 </div>
                 <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                 <p className="text-gray-600 leading-relaxed text-lg">
                    {product.description || "No description provided for this product."}
                 </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm text-gray-500 mb-1">Cost Price</div>
                        <div className="text-2xl font-semibold text-gray-900">${product.cost_price}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm text-gray-500 mb-1">Selling Price</div>
                        <div className="text-2xl font-semibold text-gray-900">${product.selling_price}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <h3 className="text-lg font-bold flex items-center">
                        <BarChart3 className="mr-2 h-5 w-5 text-gray-400" /> Recent Movements
                    </h3>
                </CardHeader>
                <CardContent>
                    {history.length === 0 ? (
                        <p className="text-gray-500 text-sm">No recent stock movements.</p>
                    ) : (
                        <div className="space-y-4">
                            {history.map(move => (
                                <div key={move.id} className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                                    <div className="flex flex-col">
                                         <span className="text-sm font-medium text-gray-900">{move.note || "Stock Update"}</span>
                                         <span className="text-xs text-gray-400">{new Date(move.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className={`font-bold ${move.change_quantity > 0 ? "text-green-600" : "text-red-500"}`}>
                                        {move.change_quantity > 0 ? "+" : ""}{move.change_quantity}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

             <div className="pt-6 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 mb-2">Vendor Information</h4>
                {product.vendors ? (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <p className="font-semibold text-gray-800">{product.vendors.name}</p>
                        <p className="text-sm text-gray-600">Contact: {product.vendors.contact_name}</p>
                        <p className="text-sm text-gray-600">Email: {product.vendors.email || "N/A"}</p>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No vendor associated.</p>
                )}
             </div>
        </div>
      </div>
    </div>
  );
}
