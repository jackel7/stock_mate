import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'movements' or 'agent'

    let data, error;

    if (type === 'agent') {
        const result = await supabase
            .from("agent_logs")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(100);
        data = result.data;
        error = result.error;
    } else {
        // Default to stock movements
        const result = await supabase
            .from("stock_movements")
            .select("*, products(name, sku)")
            .order("created_at", { ascending: false })
            .limit(100);
        data = result.data;
        error = result.error;
    }

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Reports API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
