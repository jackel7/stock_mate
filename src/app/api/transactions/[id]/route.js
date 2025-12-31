import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // Fetch transaction with items and products details
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        *,
        transaction_items (
            *,
            products (name, sku)
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
