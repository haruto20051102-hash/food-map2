"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spot } from "@/lib/db";
import { SwipeCard } from "./SwipeCard";
import { AnimatePresence, motion } from "framer-motion";
import { X, Heart, RefreshCw, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToFavorites } from "@/lib/actions";
import { CATEGORIES, CATEGORY_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";

interface SwipeInterfaceProps {
    initialSpots: Spot[];
    onLike?: (spotId: string) => void;
}

export function SwipeInterface({ initialSpots, onLike }: SwipeInterfaceProps) {
    const [spots, setSpots] = useState<Spot[]>(initialSpots);
    const [history, setHistory] = useState<Spot[]>([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const router = useRouter();

    // Filter spots based on active category
    const visibleSpots = spots.filter(spot =>
        activeCategory === "All" || spot.type === activeCategory
    );

    // Active spot is the last one in the FILTERED array
    const activeSpot = visibleSpots.length > 0 ? visibleSpots[visibleSpots.length - 1] : null;

    const handleSwipe = async (direction: "left" | "right") => {
        if (!activeSpot) return;

        // Keep track of the spot being removed
        const removedSpot = activeSpot;

        // Remove CURRENT ACTIVE spot from the main spots list
        const newSpots = spots.filter(s => s.id !== activeSpot.id);
        setSpots(newSpots);

        if (removedSpot) {
            setHistory([...history, removedSpot]);
        }

        if (direction === "right" && removedSpot) {
            console.log("Liked:", removedSpot.name);
            onLike?.(removedSpot.id);
            // Call server action to save favorite
            addToFavorites(removedSpot.id).catch(console.error);
            // Navigate to spot details
            router.push(`/spots/${removedSpot.id}`);
        } else {
            console.log("Passed:", removedSpot?.name);
            // Passed spot is removed from state, so it's "gone" for this session
        }
    };

    const handleButtonSwipe = (direction: "left" | "right") => {
        handleSwipe(direction);
    };

    if (visibleSpots.length === 0) {
        return (
            <div className="relative h-[650px] w-full flex flex-col items-center justify-center">
                {/* Category Filters (Keep visible even when empty) */}
                <div className="absolute top-0 z-20 w-full overflow-x-auto pb-2 px-4 no-scrollbar">
                    <div className="flex items-center gap-2 justify-center min-w-max mx-auto">
                        <div className="bg-background/80 backdrop-blur-md p-1 rounded-full border border-white/10 flex items-center gap-2 shadow-lg">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={cn(
                                        "flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                                        activeCategory === cat
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted text-muted-foreground"
                                    )}
                                >
                                    {CATEGORY_MAP[cat]}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="h-[600px] w-full max-w-[360px] flex flex-col items-center justify-center text-center p-6 border border-white/10 rounded-3xl bg-card/50 backdrop-blur-sm mt-12 bg-gradient-to-b from-card/50 to-background">
                    <div className="bg-primary/20 p-6 rounded-full mb-6 ring-1 ring-white/10">
                        <RefreshCw className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">No more {activeCategory === "All" ? "" : CATEGORY_MAP[activeCategory]} spots!</h3>
                    <p className="text-muted-foreground mb-8 max-w-[250px] mx-auto leading-relaxed">
                        We've run out of hidden gems in your area for now. try changing the category or check back later.
                    </p>

                    <div className="flex flex-col gap-3 w-full max-w-[200px]">
                        <Button onClick={() => window.location.reload()} size="lg" className="w-full font-bold shadow-lg shadow-primary/20">
                            Start Over
                        </Button>
                        {activeCategory !== "All" && (
                            <Button onClick={() => setActiveCategory("All")} variant="outline" className="w-full">
                                Show All Categories
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full flex flex-col items-center justify-center">

            {/* Category Filters */}
            <div className="absolute top-0 z-20 w-full overflow-x-auto pb-2 px-4 no-scrollbar">
                <div className="flex items-center gap-2 justify-center min-w-max mx-auto">
                    <div className="bg-background/80 backdrop-blur-md p-1 rounded-full border border-white/10 flex items-center gap-2 shadow-lg">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                                    activeCategory === cat
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted text-muted-foreground"
                                )}
                            >
                                {CATEGORY_MAP[cat]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative w-full max-w-[360px] h-[520px] mt-8">
                <AnimatePresence>
                    {visibleSpots.map((spot, index) => (
                        <SwipeCard
                            key={spot.id}
                            spot={spot}
                            active={index === visibleSpots.length - 1}
                            onSwipe={handleSwipe}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Controls */}
            {/* Controls */}
            <div className="mt-8 flex items-center gap-12 z-10">
                <div className="flex flex-col items-center gap-2">
                    <Button
                        size="icon"
                        className="h-16 w-16 rounded-full bg-background border-2 border-muted hover:border-red-500 text-muted-foreground hover:text-red-500 hover:bg-red-50 shadow-lg transition-all hover:scale-110"
                        onClick={() => handleButtonSwipe("left")}
                    >
                        <X className="h-8 w-8" />
                    </Button>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Skip</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <Button
                        size="icon"
                        className="h-16 w-16 rounded-full bg-background border-2 border-muted hover:border-green-500 text-muted-foreground hover:text-green-500 hover:bg-green-50 shadow-lg transition-all hover:scale-110"
                        onClick={() => handleButtonSwipe("right")}
                    >
                        <Heart className="h-8 w-8 fill-current" />
                    </Button>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Like</span>
                </div>
            </div>
        </div>
    );
}
