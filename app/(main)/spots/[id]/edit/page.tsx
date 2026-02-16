import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import SpotForm from "@/components/ui/SpotForm";

export default async function EditSpotPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    const { data: spot } = await supabase
        .from("spots")
        .select("*")
        .eq("id", id)
        .single();

    if (!spot) {
        notFound();
    }

    // Check for admin role (fetch profile)
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    const isAdmin = profile?.role === 'admin';

    if (spot.user_id !== user.id && !isAdmin) {
        // Prevent editing other's spots
        redirect("/spots/manage");
    }

    return (
        <div className="container max-w-2xl py-12 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">登録情報を編集</h1>
                <p className="text-muted-foreground mt-2">
                    スポットの情報を最新の状態に更新します。
                </p>
            </div>

            <SpotForm initialData={spot} isEditing={true} isAdmin={isAdmin} />
        </div>
    );
}
