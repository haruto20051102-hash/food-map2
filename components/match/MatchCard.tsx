"use client";

import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from "framer-motion";
import { Star, MapPin, X, Heart } from "lucide-react";
import { useState, useEffect } from "react";

interface Spot {
    id: string;
    name: string;
    description: string;
    location: string;
    images?: string[];
    rating: number;
    type: string;
}

interface MatchCardProps {
    spot: Spot;
    active: boolean;
    onSwipeRight: (spotId: string) => void;
    onSwipeLeft: (spotId: string) => void;
}

export function MatchCard({ spot, active, onSwipeRight, onSwipeLeft }: MatchCardProps) {
    const x = useMotionValue(0);
    const controls = useAnimation();
    const [exitX, setExitX] = useState<number | string>(0);

    const rotate = useTransform(x, [-200, 200], [-15, 15]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    // Indicators for Like/Nope overlay
    const likeOpacity = useTransform(x, [20, 100], [0, 1]);
    const nopeOpacity = useTransform(x, [-20, -100], [0, 1]);

    const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 100;

        if (info.offset.x > threshold) {
            setExitX(1000);
            await controls.start({ x: 1000, transition: { duration: 0.3 } });
            setTimeout(() => onSwipeRight(spot.id), 100);
        } else if (info.offset.x < -threshold) {
            setExitX(-1000);
            await controls.start({ x: -1000, transition: { duration: 0.3 } });
            setTimeout(() => onSwipeLeft(spot.id), 100);
        } else {
            // Revert back to center
            controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
        }
    };

    // Auto-swipe for buttons
    useEffect(() => {
        if (!active) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                handleDragEnd(new MouseEvent(""), { offset: { x: 200 }, velocity: { x: 0, y: 0 }, point: { x: 0, y: 0 }, delta: { x: 0, y: 0 } });
            } else if (e.key === "ArrowLeft") {
                handleDragEnd(new MouseEvent(""), { offset: { x: -200 }, velocity: { x: 0, y: 0 }, point: { x: 0, y: 0 }, delta: { x: 0, y: 0 } });
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [active]);


    return (
        <motion.div
            className="absolute w-full h-full cursor-grab active:cursor-grabbing origin-bottom"
            style={{
                x,
                rotate,
                opacity: active ? 1 : 0,
                pointerEvents: active ? "auto" : "none",
                zIndex: active ? 10 : 0
            }}
            drag={active ? "x" : false}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
            animate={controls}
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: active ? 1 : 0.95, opacity: active ? 1 : 0 }}
            transition={{ duration: 0.2 }}
        >
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-card border border-border shadow-2xl">
                {/* Background Image */}
                <div className="absolute inset-0 bg-muted/20">
                    {spot.images && spot.images.length > 0 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={spot.images[0]} alt={spot.name} className="w-full h-full object-cover" draggable={false} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary/20">
                            <span className="text-muted-foreground">No Image</span>
                        </div>
                    )}

                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
                </div>

                {/* Overlays */}
                <motion.div
                    style={{ opacity: likeOpacity }}
                    className="absolute top-10 left-10 z-20 pointer-events-none rotate-[-15deg] border-4 border-green-500 rounded-md px-4 py-2"
                >
                    <span className="text-green-500 font-black text-4xl tracking-widest uppercase shadow-sm">LIKE</span>
                </motion.div>

                <motion.div
                    style={{ opacity: nopeOpacity }}
                    className="absolute top-10 right-10 z-20 pointer-events-none rotate-[15deg] border-4 border-red-500 rounded-md px-4 py-2"
                >
                    <span className="text-red-500 font-black text-4xl tracking-widest uppercase shadow-sm">NOPE</span>
                </motion.div>

                {/* Card Content */}
                <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end text-white z-10 pointer-events-none">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-primary/90 text-primary-foreground text-xs font-bold rounded shadow-sm backdrop-blur-sm">
                            {spot.type}
                        </span>
                        <div className="flex items-center gap-1 text-yellow-500 bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="text-xs font-bold">{spot.rating}</span>
                        </div>
                    </div>

                    <h2 className="text-3xl font-extrabold mb-1 drop-shadow-md text-glow">{spot.name}</h2>

                    <div className="flex items-center gap-1.5 text-white/80 text-sm mb-3 drop-shadow-md">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="truncate">{spot.location}</span>
                    </div>

                    <p className="text-sm text-white/90 line-clamp-3 leading-relaxed drop-shadow-md pb-4 border-b border-white/20">
                        {spot.description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
