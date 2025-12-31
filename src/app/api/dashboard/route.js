import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; // Ensure this runs dynamically every request

export async function GET() {
  try {
    const [
      { count: productsCount, data: allProducts },
      { count: lowStockCount },
      { count: vendorsCount },
    ] = await Promise.all([
      supabase.from("products").select("*", { count: "exact" }),
      supabase.from("products").select("*", { count: "exact", head: true }).lt("quantity", 10),
      supabase.from("vendors").select("*", { count: "exact", head: true }),
    ]);

    // Calculate approximate total value
    const totalVal = allProducts?.reduce((acc, p) => acc + (p.quantity * (p.cost_price || 0)), 0) || 0;

    return NextResponse.json({
      stats: {
        products: productsCount || 0,
        lowStock: lowStockCount || 0,
        transactions: 0, 
        vendors: vendorsCount || 0,
        totalValue: totalVal,
      },
      recentActivity: []
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
