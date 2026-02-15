import { SpotCard } from "@/components/ui/SpotCard";
import { FavoritesList } from "@/components/favorites/FavoritesList";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Wine, AlertCircle } from "lucide-react";
import Link from "next/link";

export default async function FavoritesPage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect("/login");
    }

    // Fetch favorites with spot details
    const { data: favorites, error } = await supabase
        .from("favorites")
        .select("id, spot_id, spots (*)")
        .eq("user_id", session.user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching favorites:", error);
    }

    // Transform to match FavoritesList props
    const favoriteItems = favorites?.map((f: any) => ({
        id: f.id,
        rank: 0, // No longer used for sorting but keep type compatibility for now
        spot: f.spots
    })).filter((item: any) => item.spot) || [];

    return (
        <div className="container py-8 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">お気に入りスポット</h1>

            {favoriteItems.length > 0 ? (
                <FavoritesList initialFavorites={favoriteItems} />
            ) : (
                <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed border-white/10">
                    <p className="text-muted-foreground mb-4">まだお気に入りに登録されたスポットはありません。</p>
                    <Link href="/explore" className="text-primary hover:underline">
                        スポットを探す
                    </Link>
                </div>
            )}
        </div>
    );
}
