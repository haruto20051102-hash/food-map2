"use client";

import { useState } from "react";
import { MatchCard } from "./MatchCard";
import { X, RefreshCw, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Spot {
    id: string;
    name: string;
    description: string;
    location: string;
    images?: string[];
    rating: number;
    type: string;
}

interface SwipeInterfaceProps {
    initialSpots: Spot[];
    isLoggedIn: boolean;
}

export function SwipeInterface({ initialSpots, isLoggedIn }: SwipeInterfaceProps) {
    const [spots, setSpots] = useState<Spot[]>(initialSpots);
    const router = useRouter();

    const handleSwipeRight = (spotId: string) => {
        // Navigate to spot details
        router.push(`/spots/${spotId}`);
    };

    const handleSwipeLeft = (spotId: string) => {
        // Just remove from stack
        setSpots(prev => prev.filter(s => s.id !== spotId));
    };

    const handleRefresh = () => {
        router.refresh();
        // Fallback simple reset for demo purposes
        setSpots(initialSpots);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto pt-8">

            <div className="relative w-[340px] h-[520px] sm:w-[380px] sm:h-[580px] perspective-1000">
                {spots.length > 0 ? (
                    spots.map((spot, index) => (
                        <MatchCard
                            key={spot.id}
                            spot={spot}
                            active={index === spots.length - 1} // Top card is active
                            onSwipeRight={handleSwipeRight}
                            onSwipeLeft={handleSwipeLeft}
                        />
                    ))
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-card border border-border rounded-2xl shadow-xl text-center p-8">
                        <span className="text-5xl mb-4">🍽️</span>
                        <h3 className="text-2xl font-bold mb-2">おすすめが見つかりません</h3>
                        <p className="text-muted-foreground mb-8">
                            今のところ、これ以上紹介できるお店がありません。
                        </p>
                        <button
                            onClick={handleRefresh}
                            className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-full font-medium hover:bg-secondary/80 transition-colors"
                        >
                            <RefreshCw className="h-4 w-4" />
                            再度探す
                        </button>
                    </div>
                )}
            </div>

            {spots.length > 0 && (
                <div className="flex gap-6 mt-8">
                    {/* Controls for users who prefer clicking over swiping */}
                    <button
                        onClick={() => handleSwipeLeft(spots[spots.length - 1].id)}
                        className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:bg-red-500/10 hover:border-red-500/30 transition-colors group"
                        title="スキップ (左へスワイプ)"
                    >
                        <X className="h-8 w-8 text-red-500 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                        onClick={() => handleSwipeRight(spots[spots.length - 1].id)}
                        className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:bg-blue-500/10 hover:border-blue-500/30 transition-colors group"
                        title="詳細を見る (右へスワイプ)"
                    >
                        <ArrowRight className="h-8 w-8 text-blue-500 group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            )}
        </div>
    );
}
