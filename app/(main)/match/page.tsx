import { SwipeInterface } from "@/components/match/SwipeInterface";
import { getSpots } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export default async function MatchPage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { session } } = await supabase.auth.getSession();

    // Fetch spots
    const spots = await getSpots();

    const jstOffset = 9 * 60; // minutes
    const utcNow = new Date();
    const jstNow = new Date(utcNow.getTime() + (utcNow.getTimezoneOffset() + jstOffset * 60) * 60 * 1000);

    const currentHours = jstNow.getHours();
    const currentMinutes = jstNow.getMinutes();
    const currentTimeValue = currentHours * 60 + currentMinutes;

    const openSpots = spots.filter(spot => {
        if (!spot.opening_time || !spot.closing_time) return false;

        const mapTimeToMinutes = (timeStr: string) => {
            const [h, m] = timeStr.split(':').map(Number);
            return h * 60 + m;
        };

        const open = mapTimeToMinutes(spot.opening_time);
        const close = mapTimeToMinutes(spot.closing_time);

        if (open < close) {
            return currentTimeValue >= open && currentTimeValue < close;
        } else {
            return currentTimeValue >= open || currentTimeValue < close;
        }
    });

    let spotsToShow = openSpots;

    if (session) {
        const { data: favorites } = await supabase
            .from("favorites")
            .select("spot_id")
            .eq("user_id", session.user.id);

        const favoriteIds = new Set(favorites?.map(f => f.spot_id));
        spotsToShow = openSpots.filter(spot => !favoriteIds.has(spot.id));
    }

    // Shuffle spots for randomness
    const shuffledSpots = spotsToShow.sort(() => Math.random() - 0.5);

    return (
        <div className="container min-h-[calc(100vh-80px)] py-8 flex flex-col items-center justify-center overflow-hidden">
            <div className="text-center mb-8">
                <p className="text-muted-foreground">
                    右は見つけた！左はまた今度！
                </p>
            </div>

            <SwipeInterface initialSpots={shuffledSpots} />
        </div>
    );
}
