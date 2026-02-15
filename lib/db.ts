import { createClient } from "@/lib/supabase/client";

export type Spot = {
    id: string;
    name: string;
    type: string;
    rating: number;
    location: string;
    description: string;
    lat: number;
    lng: number;
    images: string[] | null;
    tags: string[] | null;
    is_hidden: boolean;
    business_hours?: string;
    opening_time?: string;
    closing_time?: string;
    regular_holiday?: string;
    subscription_expires_at?: string; // ISO 8601 date string
    reviews?: { count: number }[];
    review_count?: number;
};

// Client-side fetch (for simple use cases or if needed)
export async function getSpots() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("spots")
        .select("*, reviews(count)")
        .eq("is_hidden", false)
        .order("subscription_expires_at", { ascending: false, nullsFirst: false });

    if (error) throw error;

    // Transform data to flatten review_count
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((spot: any) => ({
        ...spot,
        review_count: spot.reviews?.[0]?.count || 0
    })) as Spot[];
}

export async function getSpot(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase.from("spots").select("*").eq("id", id).single();
    if (error) throw error;
    return data as Spot;
}
