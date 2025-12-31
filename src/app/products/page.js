"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Search, Info } from "lucide-react";

export default function ProductsGalleryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data } = await supabase
        .from("products")
        .select("*, categories(name), vendors(name)")
        .order("name", { ascending: true });
    
    if (data) setProducts(data);
    setLoading(false);
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Product Gallery</h1>
           <p className="text-gray-500 mt-1">Visual catalog of your inventory.</p>
        </div>
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 focus:border-brand-500 focus:ring-brand-500 bg-white"
            />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
             <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">No products found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
                <Card key={product.id} className="group overflow-hidden border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                    <div className="aspect-square w-full bg-gray-100 relative overflow-hidden flex items-center justify-center">
                        {product.image_url ? (
                            <img 
                                src={product.image_url} 
                                alt={product.name} 
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        ) : (
                            <div className="text-center p-4">
                                <span className="text-4xl font-black text-gray-200">{product.sku.slice(0, 2)}</span>
                            </div>
                        )}
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                            {product.quantity} {product.unit}
                        </div>
                    </div>
                    <CardContent className="p-5">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-[10px] font-bold tracking-wider text-brand-600 uppercase bg-brand-50 px-2 py-1 rounded-full">
                                {product.categories?.name || 'No Category'}
                            </span>
                            <span className="text-xs text-gray-400 font-mono">{product.sku}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-brand-700 transition-colors" title={product.name}>
                            {product.name}
                        </h3>
                         <p className="text-sm text-gray-500 mt-1 line-clamp-2 h-10 leading-snug">
                            {product.description || "No description available."}
                        </p>
                        <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400">Price</span>
                                <span className="font-bold text-lg text-gray-900">${product.selling_price}</span>
                            </div>
                            <Button size="sm" variant="outline" className="text-xs">
                                Details
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}
    </div>
  );
}
