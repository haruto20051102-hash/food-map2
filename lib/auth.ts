import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function getIsAdmin() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

    return profile?.role === 'admin';
}
