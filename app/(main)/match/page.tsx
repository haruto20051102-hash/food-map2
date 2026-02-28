import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { SwipeInterface } from "@/components/match/SwipeInterface";
import { Coffee, Flame, UtensilsCrossed } from "lucide-react";

export const metadata = {
    title: "感覚で選ぶ (Match) | イバクレ",
    description: "直感的にスワイプして、茨城の隠れ家スポットを見つけよう。",
};

// Next.js 15 requires cookies() to be awaited
export default async function MatchPage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { session } } = await supabase.auth.getSession();

    // Fetch random spots for the user (limit 20 for performance)
    // We fetch some spots. Ideally, we filter out ones already favorited or reviewed,
    // but for simplicity in this demo, we'll just fetch a bunch and shuffle them.
    const { data: spots } = await supabase
        .from("spots")
        .select("*")
        .limit(30);

    const initialSpots = spots || [];

    // Simple Fisher-Yates shuffle
    for (let i = initialSpots.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [initialSpots[i], initialSpots[j]] = [initialSpots[j], initialSpots[i]];
    }

    return (
        <div className="container py-8 min-h-screen flex flex-col items-center">

            <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl flex items-center justify-center gap-3">
                    <Flame className="h-8 w-8 text-orange-500" />
                    Match
                </h1>
                <p className="mt-2 text-muted-foreground">
                    右にスワイプで「詳細を見る」、左にスワイプで「スキップ」
                </p>
            </div>

            <div className="w-full max-w-md mx-auto relative h-[600px] flex justify-center">
                <SwipeInterface initialSpots={initialSpots} isLoggedIn={!!session} />
            </div>

        </div>
    );
}
