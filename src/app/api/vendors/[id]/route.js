import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { data, error } = await supabase
      .from("vendors")
      .update(body)
      .eq("id", id)
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Check constraints manually or rely on DB (DB is better but let's be safe)
    const { count } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('vendor_id', id);
    if(count > 0) {
        return NextResponse.json({ error: "Cannot delete vendor associated with products." }, { status: 400 });
    }

    const { error } = await supabase
      .from("vendors")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
