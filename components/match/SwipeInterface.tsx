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

    const [reaction, setReaction] = useState<"like" | "nope" | null>(null);

    const handleSwipe = async (direction: "left" | "right") => {
        if (!activeSpot) return;

        // Trigger reaction animation
        setReaction(direction === "right" ? "like" : "nope");
        setTimeout(() => setReaction(null), 1200);

        // Keep track of the spot being removed
        const removedSpot = activeSpot;

        // Remove CURRENT ACTIVE spot from the main spots list
        const newSpots = spots.filter(s => s.id !== activeSpot.id);
        setSpots(newSpots);

        if (removedSpot) {
            setHistory([...history, removedSpot]);
        }

        if (direction === "right" && removedSpot) {
            onLike?.(removedSpot.id);
            // Call server action to save favorite
            addToFavorites(removedSpot.id).catch(console.error);

            // Wait for door animation to close (approx 600ms) before navigating
            await new Promise(resolve => setTimeout(resolve, 600));

            // Navigate to spot details
            router.push(`/spots/${removedSpot.id}`);
        } else {
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
                            <Filter className="w-3 h-3 text-muted-foreground mr-1" />
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
                        <Filter className="w-3 h-3 text-muted-foreground mr-1" />
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
            <div className="mt-8 flex items-center gap-12 z-10">
                <div className="flex flex-col items-center gap-2">
                    <Button
                        size="icon"
                        className="h-16 w-16 rounded-full bg-background border-2 border-muted hover:border-red-500 text-muted-foreground hover:text-red-500 hover:bg-red-50 shadow-lg transition-all"
                        onClick={() => handleButtonSwipe("left")}
                    >
                        <motion.div whileTap={{ scale: 0.8 }} className="flex items-center justify-center w-full h-full">
                            <X className="h-8 w-8" />
                        </motion.div>
                    </Button>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Skip</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <Button
                        size="icon"
                        className="h-16 w-16 rounded-full bg-background border-2 border-muted hover:border-green-500 text-muted-foreground hover:text-green-500 hover:bg-green-50 shadow-lg transition-all"
                        onClick={() => handleButtonSwipe("right")}
                    >
                        <motion.div whileTap={{ scale: 0.8 }} className="flex items-center justify-center w-full h-full">
                            <Heart className="h-8 w-8 fill-current" />
                        </motion.div>
                    </Button>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Like</span>
                </div>
            </div>
            {/* Global Reaction Overlay - Fixed to cover screen */}
            <AnimatePresence>
                {reaction === "like" && (
                    <div className="fixed inset-0 z-[100] pointer-events-none">
                        {/* Door Opening Animation - Premium Version */}

                        {/* Left Door Panel */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: ["-100%", "0%", "0%", "-100%"] }}
                            transition={{ duration: 1.2, times: [0, 0.3, 0.6, 1], ease: "easeInOut" }}
                            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#1a0f0a] via-[#2d1b14] to-[#0f0805] border-r-4 border-[#bf953f] shadow-[10px_0_30px_rgba(0,0,0,0.8)] flex items-center justify-end pr-6 z-20"
                        >
                            {/* Wood grain effect overlay */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10 mix-blend-overlay"></div>

                            {/* Knob Base */}
                            <div className="relative w-16 h-16 rounded-full bg-[#2d1b14] shadow-[0_2px_5px_rgba(0,0,0,0.8)] flex items-center justify-center border border-[#bf953f]/30">
                                {/* Rotating Knob */}
                                <motion.div
                                    animate={{ rotate: [0, 0, 90, 90, 0] }}
                                    transition={{ duration: 1.2, times: [0, 0.35, 0.55, 0.6, 1], ease: "easeInOut" }}
                                    className="w-12 h-12 rounded-full bg-gradient-to-br from-[#fbf5b7] via-[#bf953f] to-[#aa771c] shadow-inner border border-[#fbf5b7]/40 flex items-center justify-center"
                                >
                                    {/* Keyhole */}
                                    <div className="w-1.5 h-4 bg-[#1a0f0a] rounded-full opacity-80 shadow-[inset_0_1px_2px_rgba(0,0,0,1)]"></div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Right Door Panel */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: ["100%", "0%", "0%", "100%"] }}
                            transition={{ duration: 1.2, times: [0, 0.3, 0.6, 1], ease: "easeInOut" }}
                            className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#1a0f0a] via-[#2d1b14] to-[#0f0805] border-l-4 border-[#bf953f] shadow-[-10px_0_30px_rgba(0,0,0,0.8)] flex items-center justify-start pl-6 z-20"
                        >
                            {/* Wood grain effect overlay */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10 mix-blend-overlay"></div>

                            {/* Knob Base */}
                            <div className="relative w-16 h-16 rounded-full bg-[#2d1b14] shadow-[0_2px_5px_rgba(0,0,0,0.8)] flex items-center justify-center border border-[#bf953f]/30">
                                {/* Rotating Knob - Counter Clockwise */}
                                <motion.div
                                    animate={{ rotate: [0, 0, -90, -90, 0] }}
                                    transition={{ duration: 1.2, times: [0, 0.35, 0.55, 0.6, 1], ease: "easeInOut" }}
                                    className="w-12 h-12 rounded-full bg-gradient-to-bl from-[#fbf5b7] via-[#bf953f] to-[#aa771c] shadow-inner border border-[#fbf5b7]/40 flex items-center justify-center"
                                >
                                    {/* Keyhole */}
                                    <div className="w-1.5 h-4 bg-[#1a0f0a] rounded-full opacity-80 shadow-[inset_0_1px_2px_rgba(0,0,0,1)]"></div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Welcome Text Area */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: [0, 1, 1, 0], scale: [0.9, 1, 1, 1.1] }}
                            transition={{ duration: 1.2, times: [0, 0.3, 0.6, 1] }}
                            className="absolute inset-0 flex items-center justify-center z-30"
                        >
                            <div className="relative py-8 px-16 border-y border-[#bf953f] bg-black/60 backdrop-blur-md">
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#fbf5b7] to-transparent opacity-50"></div>
                                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#fbf5b7] to-transparent opacity-50"></div>

                                <span className="block text-center text-sm text-[#bf953f] tracking-[0.5em] mb-2 uppercase font-light">Enter to</span>
                                <span className="block text-4xl md:text-6xl font-serif font-medium tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-[#fbf5b7] via-[#e5c573] to-[#bf953f] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                                    THE HIDDEN
                                </span>
                            </div>
                        </motion.div>
                    </div>
                )}
                {reaction === "nope" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, x: 0 }}
                        animate={{ opacity: 1, scale: 1.5, x: -100 }}
                        exit={{ opacity: 0, scale: 2 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center text-red-500 drop-shadow-2xl"
                    >
                        <X className="w-48 h-48" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
