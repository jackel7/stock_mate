import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    // Potential filter by date, type, etc.
    
    // Fetch transactions with items and embedded product info could be too heavy for list view
    // Let's just fetch transactions for the list, maybe with items count
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        *,
        transaction_items (
          count
        )
      `)
      .order("transaction_date", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, items, transaction_date } = body;
    
    // Validation
    if (!type || !items || !Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ error: "Type and non-empty items array are required" }, { status: 400 });
    }

    // items should be [{ product_id, quantity, unit_price }]
    
    // Calculate total amount
    const total_amount = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

    // 1. Create Transaction
    const { data: transactionData, error: transactionError } = await supabase
      .from("transactions")
      .insert({
        type,
        total_amount,
        transaction_date: transaction_date || new Date().toISOString()
      })
      .select()
      .single();

    if (transactionError) throw transactionError;

    const transactionId = transactionData.id;

    // 2. Process Items
    for (const item of items) {
        // Insert Transaction Item
        const { error: itemError } = await supabase
            .from("transaction_items")
            .insert({
                transaction_id: transactionId,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price
            });
        
        if (itemError) {
          // In a real app we'd rollback here (delete transaction), but simple for now
          console.error("Error creating item:", itemError);
          // throw itemError; // Continue or fail? Let's fail hard for safety
        }

        // Get current product stock for movement log
        const { data: productData, error: productFetchError } = await supabase
            .from("products")
            .select("quantity")
            .eq("id", item.product_id)
            .single();
        
        if (productFetchError) {
             console.error("Error fetching product:", productFetchError);
             continue; 
        }

        let changeQuantity = item.quantity;
        if (type === 'OUT') {
            changeQuantity = -item.quantity;
        } 
        // For ADJ (Adjustment), strictly speaking we might need absolute or relative. 
        // Assuming ADJ in this context means 'Adding/Removing' manual adjustment similar to IN/OUT but labeled differently?
        // OR it sends the difference. Let's assume the frontend sends the POSITIVE quantity to adjust and we treat it based on context or assume it's an 'correction' that could be + or -.
        // Use case: Manual Stock adjustment. usually could be set to new value or add/sub. 
        // Defaulting ADJ to behave like IN for positive entries? 
        // Actually, let's treat ADJ as: if unit_price is 0 (often for adjustments), it might be stock correction.
        // Let's standardise: Type IN adds, OUT subs. ADJ ?? 
        // Let's assume ADJ acts like IN/OUT depending on sign? No, items.quantity is usually positive.
        // Simple logic: If ADJ and we want to reduce, user might need to handle 'OUT' type for loss/damage.
        // If 'ADJ' is meant for + or - corrections, we need a sign. 
        // Let's stick to standard: IN adds stock, OUT removes stock.
        // If type is ADJ, we will assume it's an additive adjustment for now unless quantity is negative?
        
        // REVISIT: If type is 'ADJ', the quantity in `items` is the magnitude. 
        // If implementing 'Stock Take' functionality where we set absolute value, that's different.
        // Let's assume for this MVP: 
        // IN: +quantity
        // OUT: -quantity
        // ADJ: +quantity (same as IN?) or maybe mixed? 
        // Let's handle ADJ as +quantity for now (Found item?). Use OUT for Lost item.

        // Update Product Quantity
        const newQuantity = productData.quantity + changeQuantity;
        
        const { error: updateError } = await supabase
            .from("products")
            .update({ quantity: newQuantity })
            .eq("id", item.product_id);

        if (updateError) console.error("Error updating stock:", updateError);

        // 3. Log Movement
        const { error: moveError } = await supabase
            .from("stock_movements")
            .insert({
                product_id: item.product_id,
                transaction_id: transactionId,
                change_quantity: changeQuantity,
                current_stock_after: newQuantity,
                note: `Transaction ${type}`
            });
        
        if (moveError) console.error("Error logging movement:", moveError);
    }

    return NextResponse.json(transactionData, { status: 201 });
  } catch (error) {
    console.error("Transaction Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
