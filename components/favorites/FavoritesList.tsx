"use client";

import { Spot } from "@/lib/db";
import { SpotCard } from "@/components/ui/SpotCard";

interface FavoriteItem {
    id: string; // favorite id
    rank: number;
    spot: Spot;
}

interface FavoritesListProps {
    initialFavorites: FavoriteItem[];
}

export function FavoritesList({ initialFavorites }: FavoritesListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {initialFavorites.map((item) => (
                <SpotCard
                    key={item.id}
                    spot={item.spot}
                    isLoggedIn={true}
                    isFavorite={true}
                />
            ))}
        </div>
    );
}

