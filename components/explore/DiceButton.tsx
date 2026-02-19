"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Spot } from "@/lib/db";
import { Dice5, MapPin, Star, X } from "lucide-react"; // Dice5 as icon
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CATEGORIES, CATEGORY_MAP } from "@/lib/constants";

interface DiceButtonProps {
    spots: Spot[];
    userLocation: { lat: number; lng: number } | null;
    initialCategory?: string; // Optional: can start with what was selected on page
}

export function DiceButton({ spots, userLocation, initialCategory = "All" }: DiceButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isRolling, setIsRolling] = useState(false);
    const [resultSpot, setResultSpot] = useState<Spot | null>(null);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);

    // Sync when prop changes (optional, but good UX if they change page filter)
    useEffect(() => {
        if (isOpen) {
            setSelectedCategory(initialCategory);
        }
    }, [initialCategory, isOpen]);

    // Parse business hours and check if open (Duplicate logic for self-containment or could share)
    const isOpenNow = (spot: Spot): boolean => {
        const now = new Date();
        const days = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
        const today = days[now.getDay()];

        if (spot.regular_holiday && spot.regular_holiday.includes(today)) return false;

        if (spot.opening_time && spot.closing_time) {
            const [startH, startM] = spot.opening_time.split(':').map(Number);
            const [endH, endM] = spot.closing_time.split(':').map(Number);
            const current = now.getHours() * 60 + now.getMinutes();
            const start = startH * 60 + startM;
            let end = endH * 60 + endM;

            if (end < start) end += 24 * 60;
            let effCurrent = current;
            if (effCurrent < start && effCurrent < (end - 24 * 60)) effCurrent += 24 * 60;

            return effCurrent >= start && effCurrent <= end;
        }
        return true; // Fallback
    };

    const handleRoll = () => {
        setIsRolling(true);
        setResultSpot(null);

        // Filter by Internal Category
        let targetSpots = spots;
        if (selectedCategory !== "All") {
            targetSpots = spots.filter(s => s.type === selectedCategory);
        }

        // Filter valid candidates (Open Now)
        const openSpots = targetSpots.filter(isOpenNow);
        const candidates = openSpots.length > 0 ? openSpots : targetSpots;

        if (candidates.length === 0) {
            setIsRolling(false);
            // Optionally handle "No spots found" case here
            return;
        }

        // Simulate rolling delay
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * candidates.length);
            setResultSpot(candidates[randomIndex]);
            setIsRolling(false);
        }, 1500); // 1.5s animation
    };

    // Reset when dialog opens
    const onOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            setResultSpot(null);
            setIsRolling(false);
            // We can reset to initialCategory or keep last selection. 
            // Resetting to initial for consistency with page state is usually safer.
            setSelectedCategory(initialCategory);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button
                    size="icon"
                    className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-xl bg-gradient-to-br from-primary to-purple-600 hover:scale-105 transition-transform z-40 border-2 border-white/20"
                >
                    <Dice5 className="h-8 w-8 text-white animate-pulse" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-black/90 border-primary/20 backdrop-blur-md">
                <DialogTitle className="sr-only">Random Spot Dice</DialogTitle>
                <DialogDescription className="sr-only">Click to roll the dice and find a random spot.</DialogDescription>
                <div className="flex flex-col items-center justify-center py-6 text-center">

                    {!isRolling && !resultSpot && (
                        <>
                            <Dice5 className="h-20 w-20 text-primary mb-6" />
                            <h2 className="text-2xl font-bold mb-2 text-white">運命のお店を決める</h2>
                            <p className="text-muted-foreground mb-6">
                                迷ったらサイコロに任せましょう。
                            </p>

                            {/* Category Selector */}
                            <div className="w-full mb-8">
                                <p className="text-xs text-muted-foreground mb-2 text-left w-full px-1">ジャンルを選択:</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    <button
                                        onClick={() => setSelectedCategory("All")}
                                        className={cn(
                                            "rounded-full px-3 py-1 text-xs font-medium transition-colors border",
                                            selectedCategory === "All"
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-white/5 hover:bg-white/10 border-white/10 text-muted-foreground"
                                        )}
                                    >
                                        All
                                    </button>
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={cn(
                                                "rounded-full px-3 py-1 text-xs font-medium transition-colors border",
                                                selectedCategory === cat
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-white/5 hover:bg-white/10 border-white/10 text-muted-foreground"
                                            )}
                                        >
                                            {CATEGORY_MAP[cat]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button
                                onClick={handleRoll}
                                size="lg"
                                className="w-full text-lg font-bold bg-primary hover:bg-primary/90"
                            >
                                <Dice5 className="mr-2 h-5 w-5" />
                                {selectedCategory === "All" ? "全ジャンル" : CATEGORY_MAP[selectedCategory]}から選ぶ
                            </Button>
                        </>
                    )}

                    {isRolling && (
                        <div className="py-10 flex flex-col items-center">
                            <Dice5 className="h-24 w-24 text-primary animate-spin mb-6 duration-700" />
                            <h3 className="text-xl font-bold animate-pulse text-white">Selecting...</h3>
                            <p className="text-sm text-primary/80 mt-2">Target: {selectedCategory === "All" ? "All" : CATEGORY_MAP[selectedCategory]}</p>
                        </div>
                    )}

                    {resultSpot && (
                        <div className="w-full animate-in zoom-in duration-300">
                            <div className="text-sm text-primary font-bold mb-2 tracking-widest uppercase">IT'S DESTINY!</div>
                            <h2 className="text-3xl font-extrabold mb-6 text-white text-glow">{resultSpot.name}</h2>

                            <div className="aspect-video w-full relative rounded-lg overflow-hidden mb-6 border border-white/20">
                                {resultSpot.images?.[0] ? (
                                    <img src={resultSpot.images[0]} alt={resultSpot.name} className="object-cover w-full h-full" />
                                ) : (
                                    <div className="w-full h-full bg-muted flex items-center justify-center">No Image</div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 flex justify-between items-center backdrop-blur-sm">
                                    <span className="text-white text-sm font-medium ml-2">{spotTypeMap(resultSpot.type)}</span>
                                    <div className="flex items-center text-yellow-400 mr-2">
                                        <Star className="h-4 w-4 fill-current mr-1" />
                                        <span>{resultSpot.rating}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-muted-foreground mb-6 line-clamp-2 text-sm">{resultSpot.description}</p>

                            <div className="grid gap-3 w-full">
                                <Link href={`/spots/${resultSpot.id}`} className="w-full">
                                    <Button className="w-full bg-primary hover:bg-primary/90 text-lg py-6">
                                        ここに行く！
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    onClick={() => { setResultSpot(null); setIsRolling(false); }}
                                    className="w-full border-white/10 text-muted-foreground hover:bg-white/5"
                                >
                                    もう一回振る
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function spotTypeMap(type: string) {
    return CATEGORY_MAP[type] || type;
}
