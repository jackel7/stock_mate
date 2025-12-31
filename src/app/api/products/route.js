import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const vendor = searchParams.get("vendor");
    const lowStock = searchParams.get("lowStock");

    let query = supabase
      .from("products")
      .select(`
        *,
        categories (name),
        vendors (name)
      `)
      .order("created_at", { ascending: false });

    if (category) {
      query = query.eq("category_id", category);
    }

    if (vendor) {
      query = query.eq("vendor_id", vendor);
    }

    if (lowStock === 'true') {
        // This is a bit complex in Supabase basic filtering if comparing two columns directly without raw sql
        // But for simplicity if we can't compare columns directly easily in JS SDK simple filter, we might need a stored procedure or filter in JS.
        // For performance, let's keep it simple or use .lt('quantity', 10) if reorder_level was constant, but it's dynamic.
        // Let's filter in JS for now or use rpc if needed.
        // Actually, let's just fetch all and filter in JS if the dataset isn't huge, OR better: 
        // We can't easily do "where quantity <= reorder_level" in standard SDK without RPC.
        // We'll ignore the lowStock params for the DB query and handle it or assume the frontend handles it via fetching all.
        // ALTERNATIVE: Use a postgres function. 
    }

    const { data, error } = await query;

    if (error) throw error;
    
    // If lowStock filter is requested and we do it in JS (not ideal for huge datasets but fine for MVP)
    let filteredData = data;
    if (lowStock === 'true') {
       filteredData = data.filter(p => p.quantity <= p.reorder_level);
    }

    // Flatten data for easier consumption if needed, or keep structure
    // Mapped data to include category_name and vendor_name at top level
    const products = filteredData.map(product => ({
        ...product,
        category_name: product.categories?.name,
        vendor_name: product.vendors?.name
    }));

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.sku || !body.name) {
        return NextResponse.json({ error: "SKU and Name are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("products")
      .insert(body)
      .select()
      .single();

    if (error) {
        if (error.code === '23505') { // Unique violation for SKU
            return NextResponse.json({ error: "Product with this SKU already exists" }, { status: 409 });
        }
        throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
