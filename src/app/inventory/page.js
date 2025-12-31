"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Modal } from "@/components/ui/Modal";
import { Trash2, Edit, Plus, Search, Filter, AlertTriangle, Grid, List, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InventoryPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  
  const initialForm = {
    sku: "",
    name: "",
    description: "",
    category_id: "",
    vendor_id: "",
    quantity: 0,
    unit: "pcs",
    reorder_level: 10,
    cost_price: 0,
    selling_price: 0,
    selling_price: 0,
    image_url: ""
  };
  const [formData, setFormData] = useState(initialForm);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
        setSearchTerm(query);
    }
  }, [searchParams]);

  async function fetchData() {
    setLoading(true);
    try {
        const [pRes, cRes, vRes] = await Promise.all([
            fetch('/api/products').then(res => res.json()),
            fetch('/api/categories').then(res => res.json()),
            fetch('/api/vendors').then(res => res.json())
        ]);
        
        if (Array.isArray(pRes)) setProducts(pRes);
        if (Array.isArray(cRes)) setCategories(cRes);
        if (Array.isArray(vRes)) setVendors(vRes);
    } catch (error) {
        console.error("Error loading inventory:", error);
    } finally {
        setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await supabase.from("products").delete().eq("id", id);
      fetchData();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    // Ensure numeric values
    payload.quantity = parseInt(payload.quantity);
    payload.reorder_level = parseInt(payload.reorder_level);
    payload.cost_price = parseFloat(payload.cost_price);
    payload.selling_price = parseFloat(payload.selling_price);

    if (editingProduct) {
      await supabase.from("products").update(payload).eq("id", editingProduct.id);
    } else {
      await supabase.from("products").insert(payload);
    }
    setIsModalOpen(false);
    fetchData();
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
        sku: product.sku,
        name: product.name,
        description: product.description || "",
        category_id: product.category_id || "",
        vendor_id: product.vendor_id || "",
        quantity: product.quantity,
        unit: product.unit,
        reorder_level: product.reorder_level,
        cost_price: product.cost_price,
        selling_price: product.selling_price,
        image_url: product.image_url || ""
    });
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-surface-900 bg-clip-text text-transparent bg-gradient-to-r from-surface-900 to-surface-600">Inventory</h1>
           <p className="text-surface-500 mt-2 text-lg">Manage your products, stock levels, and pricing.</p>
        </div>
        <Button onClick={openAddModal} className="w-full sm:w-auto shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>



      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 bg-white p-4 rounded-xl border border-surface-200 shadow-sm">
        <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
            <Input
            placeholder="Search by name, SKU, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-surface-200 focus:border-brand-500 focus:ring-brand-500 text-surface-900 placeholder:text-surface-400"
            />
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
             <Button variant="outline" className="w-full sm:w-auto text-surface-600 border-surface-200 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50">
                <Filter className="mr-2 h-4 w-4" /> Filter
             </Button>
             <div className="border-l border-gray-200 h-6 mx-2 hidden sm:block"></div>
             <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                    onClick={() => setViewMode("grid")}
                    className={cn(
                        "p-2 rounded-md transition-all text-sm font-medium",
                        viewMode === "grid" ? "bg-white text-brand-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                    title="Grid View"
                >
                    <Grid className="h-4 w-4" />
                </button>
                <button 
                    onClick={() => setViewMode("list")}
                    className={cn(
                        "p-2 rounded-md transition-all text-sm font-medium",
                        viewMode === "list" ? "bg-white text-brand-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                    title="List View"
                >
                    <List className="h-4 w-4" />
                </button>
             </div>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <Table>
            <TableHeader className="bg-gray-50/80">
                <TableRow>
                <TableHead className="font-semibold text-gray-600 pl-4">Product</TableHead>
                <TableHead className="font-semibold text-gray-600">Category</TableHead>
                <TableHead className="font-semibold text-gray-600">Vendor</TableHead>
                <TableHead className="font-semibold text-gray-600">Stock Status</TableHead>
                <TableHead className="font-semibold text-gray-600">Price</TableHead>
                <TableHead className="text-right font-semibold text-gray-600 pr-4">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-12 text-gray-500">Loading inventory...</TableCell></TableRow>
                ) : filteredProducts.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-12 text-gray-500">No products found matching your search.</TableCell></TableRow>
                ) : (
                    filteredProducts.map((product) => {
                    const isLowStock = product.quantity <= product.reorder_level;
                    return (
                    <TableRow key={product.id} className="group hover:bg-brand-50/30 transition-colors cursor-pointer" onClick={() => window.location.href = `/inventory/${product.id}`}>
                    <TableCell className="pl-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                                ) : (
                                    <span className="text-xs text-gray-400 font-bold">{product.sku.slice(0,2)}</span>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">{product.name}</span>
                                <span className="text-xs text-gray-500 font-mono">{product.sku}</span>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                            {product.categories?.name || 'Uncategorized'}
                        </span>
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">{product.vendors?.name || '-'}</TableCell>
                    <TableCell>
                        <div className="flex flex-col">
                            <div className="flex items-center space-x-2">
                                <span className={cn(
                                    "text-sm font-semibold", 
                                    isLowStock ? "text-red-600" : "text-green-600"
                                )}>
                                    {product.quantity} {product.unit}
                                </span>
                                {isLowStock && <AlertTriangle className="h-3 w-3 text-red-500 animate-pulse" />}
                            </div>
                            {isLowStock && <span className="text-[10px] text-red-500 font-medium">Reorder needed!</span>}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">${product.selling_price}</span>
                            {product.cost_price > 0 && <span className="text-xs text-gray-400">Cost: ${product.cost_price}</span>}
                        </div>
                    </TableCell>
                    <TableCell className="text-right pr-4">
                        <div className="flex items-center justify-end space-x-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-brand-600 hover:bg-brand-50" onClick={() => openEditModal(product)}>
                            <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(product.id)}>
                            <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </TableCell>
                    </TableRow>
                )})
                )}
            </TableBody>
            </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
                <div className="col-span-full py-20 text-center text-gray-500">Loading inventory...</div>
            ) : filteredProducts.length === 0 ? (
                <div className="col-span-full py-20 text-center text-gray-500">No products found.</div>
            ) : (
                filteredProducts.map(product => {
                    const isLowStock = product.quantity <= product.reorder_level;
                    return (
                        <div key={product.id} className="group flex flex-col bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-brand-500/10 hover:border-brand-200 transition-all duration-300 hover:-translate-y-1 cursor-pointer relative" onClick={() => window.location.href = `/inventory/${product.id}`}>
                            <div className="aspect-square w-full bg-gray-50 relative overflow-hidden flex items-center justify-center p-4">
                                {product.image_url ? (
                                    <img 
                                        src={product.image_url} 
                                        alt={product.name} 
                                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-sm" 
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-gray-300">
                                        <Package className="h-12 w-12 mb-2 opacity-50" />
                                        <span className="text-2xl font-black">{product.sku.slice(0, 2)}</span>
                                    </div>
                                )}
                                <div className={cn(
                                    "absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md border",
                                    isLowStock 
                                        ? "bg-red-500/90 text-white border-red-400 animate-pulse" 
                                        : "bg-white/80 text-gray-700 border-gray-200"
                                )}>
                                    {product.quantity} {product.unit}
                                </div>
                            </div>
                            
                            <div className="p-5 flex flex-col flex-1">
                                <div className="mb-3 flex items-start justify-between">
                                    <span className="text-[10px] font-bold tracking-wider text-brand-700 uppercase bg-brand-50 px-2 py-1 rounded-md border border-brand-100">
                                        {product.categories?.name || 'Uncategorized'}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-900 leading-snug text-lg line-clamp-2 group-hover:text-brand-600 transition-colors mb-1" title={product.name}>
                                    {product.name}
                                </h3>
                                <div className="text-xs text-gray-400 font-mono mb-4">{product.sku}</div>
                                
                                <div className="mt-auto flex items-end justify-between pt-4 border-t border-dashed border-gray-100">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wide">Price</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="font-bold text-xl text-gray-900">${product.selling_price}</span>
                                            {product.cost_price > 0 && <span className="text-[10px] text-gray-400 line-through">${Number(product.selling_price * 1.2).toFixed(2)}</span>}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-200" onClick={(e) => e.stopPropagation()}>
                                         <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-full border border-transparent hover:border-brand-100" onClick={() => openEditModal(product)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Add Product"}
        className="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
            
          {/* Image Upload Section */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
             <label className="text-sm font-semibold text-gray-900 flex items-center justify-between">
                <span>Product Image</span>
                <span className="text-xs font-normal text-gray-500">Optional</span>
             </label>
             <div className="flex items-start gap-4">
                 <div className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 bg-white flex items-center justify-center overflow-hidden flex-shrink-0 relative group">
                    {formData.image_url ? (
                        <img src={formData.image_url} alt="Preview" className="h-full w-full object-cover" />
                    ) : ( 
                        <div className="text-gray-300 text-xs text-center p-2">No Image</div>
                     )}
                     {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><span className="text-xs font-bold text-brand-600 animate-pulse">Running...</span></div>}
                 </div>
                 
                 <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                         <Button type="button" variant="outline" size="sm" className="relative overflow-hidden">
                             <input 
                                type="file" 
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                disabled={uploading}
                                onChange={async (e) => {
                                    try {
                                        setUploading(true);
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        const fileExt = file.name.split('.').pop();
                                        const fileName = `${Math.random()}.${fileExt}`;
                                        const filePath = `${fileName}`;

                                        const { error: uploadError } = await supabase.storage
                                            .from('product-images')
                                            .upload(filePath, file);

                                        if (uploadError) throw uploadError;

                                        const { data } = supabase.storage
                                            .from('product-images')
                                            .getPublicUrl(filePath);
                                        
                                        setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
                                    } catch (error) {
                                        alert('Error uploading: ' + error.message);
                                    } finally {
                                        setUploading(false);
                                    }
                                }}
                            />
                            {uploading ? "Uploading..." : "Upload File"}
                         </Button>
                         <span className="text-xs text-gray-400">or</span>
                         <Input 
                            placeholder="Paste Image URL..." 
                            className="h-9 text-xs" 
                            value={formData.image_url} 
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} 
                        />
                    </div>
                    <p className="text-[10px] text-gray-400">
                        Supports JPG, PNG, WebP. Recommended size: 800x800px.
                    </p>
                 </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Details */}
              <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b pb-1">Basic Details</h4>
                  <div className="space-y-3">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Product Name <span className="text-red-500">*</span></label>
                        <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Wireless Mouse" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">SKU (Stock Keeping Unit) <span className="text-red-500">*</span></label>
                        <Input required value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} placeholder="e.g. WM-001" />
                    </div>
                     <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Category</label>
                            <select 
                                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
                                value={formData.category_id} 
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                            >
                                <option value="">Select...</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Vendor</label>
                            <select 
                                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
                                value={formData.vendor_id} 
                                onChange={(e) => setFormData({ ...formData, vendor_id: e.target.value })}
                            >
                                <option value="">Select...</option>
                                {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                            </select>
                        </div>
                    </div>
                  </div>
              </div>

              {/* Pricing & Stock */}
              <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b pb-1">Inventory & Pricing</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Selling Price ($)</label>
                            <Input type="number" step="0.01" value={formData.selling_price} onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })} />
                            <p className="text-[10px] text-gray-400 mt-1">Cost: ${formData.cost_price || 0}</p>
                        </div>
                         <div>
                            <label className="text-sm font-medium text-gray-700">Cost Price ($)</label>
                            <Input type="number" step="0.01" value={formData.cost_price} onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })} />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                         <div className="col-span-1">
                            <label className="text-sm font-medium text-gray-700">Quantity</label>
                            <Input type="number" required value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
                        </div>
                         <div className="col-span-1">
                            <label className="text-sm font-medium text-gray-700">Unit</label>
                            <Input value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} placeholder="pcs" />
                        </div>
                        <div className="col-span-1">
                            <label className="text-sm font-medium text-gray-700" title="Low Stock Level">Reorder</label>
                            <Input type="number" value={formData.reorder_level} onChange={(e) => setFormData({ ...formData, reorder_level: e.target.value })} />
                        </div>
                    </div>
                    
                     <div>
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea 
                            className="flex min-h-[60px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Product details..."
                        />
                    </div>
                  </div>
              </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-brand-600 hover:bg-brand-700 px-8">
                {editingProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
