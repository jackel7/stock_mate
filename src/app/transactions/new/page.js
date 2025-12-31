"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/Table";
import { Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewTransactionPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "OUT",
    date: new Date().toISOString().split('T')[0]
  });
  
  const [cart, setCart] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    product_id: "",
    quantity: 1,
    unit_price: 0
  });

  useEffect(() => {
    async function loadProducts() {
        const { data } = await supabase.from("products").select("*");
        if(data) setProducts(data);
    }
    loadProducts();
  }, []);

  const handleAddItem = () => {
    if (!currentItem.product_id || currentItem.quantity <= 0) return;
    
    const product = products.find(p => p.id === currentItem.product_id);
    const item = {
        ...currentItem,
        product_name: product.name,
        sku: product.sku,
        subtotal: currentItem.quantity * currentItem.unit_price
    };
    
    setCart([...cart, item]);
    setCurrentItem({ product_id: "", quantity: 1, unit_price: 0 }); // Reset
  };

  const handeRemoveItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleProductSelect = (e) => {
    const pid = e.target.value;
    const product = products.find(p => p.id === pid);
    let price = 0;
    if (product) {
        price = formData.type === 'IN' ? product.cost_price : product.selling_price;
    }
    setCurrentItem({ ...currentItem, product_id: pid, unit_price: price || 0 });
  };

  const totalAmount = cart.reduce((acc, item) => acc + item.subtotal, 0);

  const handleSubmit = async () => {
    if (cart.length === 0) return alert("Please add items to the transaction.");
    setLoading(true);

    try {
        // 1. Create Transaction Header
        const { data: trans, error: transError } = await supabase
            .from("transactions")
            .insert({
                type: formData.type,
                total_amount: totalAmount,
                transaction_date: new Date().toISOString() // Or formData.date
            })
            .select()
            .single();

        if (transError) throw transError;

        const transactionId = trans.id;

        // 2. Process items
        for (const item of cart) {
            // Insert Item
            await supabase.from("transaction_items").insert({
                transaction_id: transactionId,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price
            });

            // Update Stock
            const product = products.find(p => p.id === item.product_id);
            let change = 0;
            if (formData.type === 'IN') change = parseInt(item.quantity);
            if (formData.type === 'OUT') change = -parseInt(item.quantity);
            // ADJ logic: usually user defines +/-. Assuming ADJ here is adding stock or removing? 
            // Simplified: ADJ behaves like IN if positive, OUT if negative. 
            // For this UI, let's assume ADJ adds stock (positive) or handle manually. 
            // Or maybe separate logic. Let's simplify: IN(+), OUT(-), ADJ(=set? No, ADJ usually is delta).
            // Let's treat ADJ as direct set or delta. Let's assume delta for simplicity in this logic, reuse IN/OUT logic or just allow +/- in quantity?
            // "Validation: stock auto log movement".
            
            // Allow negative quantity in cart? No.
            // Let's stick to IN adds, OUT removes. ADJ? Maybe just log it.
            // For 'ADJ', we often want to set absolute value or add/sub. 
            // We'll treat ADJ as 'Stock Correction (+/-)'. 
            // For now, let's implement IN and OUT cleanly.
            if (formData.type === 'ADJ') change = parseInt(item.quantity); // Simplification

            const newStock = (product.quantity || 0) + change;

            await supabase.from("products").update({ quantity: newStock }).eq("id", item.product_id);

            // Log Movement
            await supabase.from("stock_movements").insert({
                product_id: item.product_id,
                transaction_id: transactionId,
                change_quantity: change,
                current_stock_after: newStock,
                note: `Transaction ${formData.type}`
            });
            
            // Check Low Stock & Create Alert (Agent)
            if (newStock <= (product.reorder_level || 10)) {
                await supabase.from("agent_alerts").insert({
                    type: "LOW_STOCK",
                    message: `Low stock alert: ${product.name} is now at ${newStock} ${product.unit}.`,
                    is_resolved: false
                });
            }
        }

        router.push("/transactions");
    } catch (error) {
        console.error("Transaction failed:", error);
        alert(`Error creating transaction: ${error.message || JSON.stringify(error)}`);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">New Transaction</h1>
        <p className="text-gray-500 text-sm">Record a purchase, sale, or stock adjustment.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-t-4 border-t-brand-500 shadow-md">
            <CardHeader className="bg-gray-50/50 pb-4">
                 <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Transaction Type</label>
                    <select 
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                        <option value="OUT">Sale (OUT)</option>
                        <option value="IN">Purchase (IN)</option>
                        <option value="ADJ">Adjustment</option>
                    </select>
                </div>
                <div className="space-y-2">
                     <label className="text-sm font-medium text-gray-700">Date</label>
                     <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                </div>
            </CardContent>
        </Card>

        <Card className="border-t-4 border-t-brand-500 shadow-md">
            <CardHeader className="bg-gray-50/50 pb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add Item</h3>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Product</label>
                    <select 
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                        value={currentItem.product_id}
                        onChange={handleProductSelect}
                    >
                        <option value="">Select Product...</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.sku} - {p.name} (Stock: {p.quantity})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-4">
                    <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium text-gray-700">Quantity</label>
                        <Input 
                            type="number" 
                            min="1" 
                            value={currentItem.quantity} 
                            onChange={(e) => setCurrentItem({ ...currentItem, quantity: Number(e.target.value) })} 
                        />
                    </div>
                    <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium text-gray-700">Unit Price</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <Input 
                                className="pl-6"
                                type="number" 
                                step="0.01" 
                                value={currentItem.unit_price} 
                                onChange={(e) => setCurrentItem({ ...currentItem, unit_price: Number(e.target.value) })} 
                            />
                        </div>
                    </div>
                </div>
                <Button className="w-full bg-brand-600 hover:bg-brand-700" onClick={handleAddItem} disabled={!currentItem.product_id}>
                    <Plus className="mr-2 h-4 w-4" /> Add to Transaction
                </Button>
            </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border-gray-200">
        <CardContent className="pt-0 p-0">
            <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Transaction Items</h3>
            </div>
            <div className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="pl-6">Product</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Qty</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Subtotal</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cart.map((item, idx) => (
                            <TableRow key={idx} className="hover:bg-gray-50">
                                <TableCell className="pl-6 font-medium text-gray-900">{item.product_name}</TableCell>
                                <TableCell className="text-gray-500 font-mono text-xs">{item.sku}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>${item.unit_price.toFixed(2)}</TableCell>
                                <TableCell className="font-bold text-gray-900">${item.subtotal.toFixed(2)}</TableCell>
                                <TableCell className="text-right pr-6">
                                    <Button variant="ghost" size="icon" onClick={() => handeRemoveItem(idx)} className="text-gray-400 hover:text-red-600 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {cart.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                                    No items added yet. Select a product above to start.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="bg-gray-50 px-6 py-6 border-t border-gray-100 flex justify-end items-center gap-6 rounded-b-xl">
                <div className="text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
                </div>
                <Button size="lg" className="bg-brand-600 hover:bg-brand-700 shadow-md px-8" onClick={handleSubmit} disabled={loading || cart.length === 0}>
                    {loading ? "Processing..." : "Complete Transaction"}
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
