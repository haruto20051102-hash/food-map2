"use client";

import { Spot } from "@/lib/db";
import { CATEGORIES, CATEGORY_MAP } from "@/lib/constants";
import { SpotCard } from "@/components/ui/SpotCard";
import { Sparkles } from "lucide-react";

interface CategoryDailyPicksProps {
    spots: Spot[];
    isLoggedIn: boolean;
    favoriteIds: Set<string>;
    userLocation: { lat: number; lng: number } | null;
    calculateDistance: (lat1: number, lng1: number, lat2: number, lng2: number) => number;
}

export function CategoryDailyPicks({ spots, isLoggedIn, favoriteIds, userLocation, calculateDistance }: CategoryDailyPicksProps) {
    // Helper to get daily random index based on seed
    const getDailyRandomSpot = (categorySpots: Spot[], seedStr: string) => {
        if (categorySpots.length === 0) return null;

        // Simple seeded random
        let seed = 0;
        for (let i = 0; i < seedStr.length; i++) {
            seed += seedStr.charCodeAt(i);
        }

        const index = seed % categorySpots.length;
        return categorySpots[index];
    };

    const todayStr = new Date().toDateString(); // e.g. "Mon Feb 12 2024"

    // Filter out "All" and map to daily picks
    const categoryPicks = CATEGORIES
        .filter(cat => cat !== "All")
        .map(category => {
            const categorySpots = spots.filter(s => s.type === category);
            // Use category name + date as unique seed for each category
            const spot = getDailyRandomSpot(categorySpots, todayStr + category);

            return {
                category,
                spot
            };
        })
        .filter(item => item.spot !== null); // Remove empty categories

    if (categoryPicks.length === 0) return null;

    return (
        <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <h2 className="text-xl font-bold">Category Daily Picks</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categoryPicks.map(({ category, spot }) => (
                    <div key={category} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                                {CATEGORY_MAP[category]}のおすすめ
                            </span>
                        </div>
                        {spot && (
                            <SpotCard
                                spot={spot}
                                isLoggedIn={isLoggedIn}
                                isFavorite={favoriteIds.has(spot.id)}
                                distance={userLocation ? calculateDistance(userLocation.lat, userLocation.lng, spot.lat, spot.lng) : null}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
