"use client";

import { Spot } from "@/lib/db";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import Image from "next/image";

interface SwipeCardProps {
    spot: Spot;
    onSwipe: (direction: "left" | "right") => void;
    active: boolean;
}

export function SwipeCard({ spot, onSwipe, active }: SwipeCardProps) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
    // Opacity for overlays
    const likeOpacity = useTransform(x, [10, 100], [0, 1]);
    const nopeOpacity = useTransform(x, [-100, -10], [1, 0]);

    const handleDragEnd = (event: any, info: PanInfo) => {
        const threshold = 100;
        if (info.offset.x > threshold) {
            onSwipe("right");
        } else if (info.offset.x < -threshold) {
            onSwipe("left");
        }
    };

    if (!active) return null; // Or render behind if stacking

    return (
        <motion.div
            style={{
                x,
                rotate,
                opacity,
                position: "absolute",
                top: 0,
                cursor: "grab",
                zIndex: 10,
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="h-[600px] w-full max-w-[360px] touch-none select-none rounded-3xl bg-card shadow-xl overflow-hidden relative border border-white/10"
            whileTap={{ cursor: "grabbing" }}
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                {spot.images?.[0] ? (
                    <Image
                        src={spot.images[0]}
                        alt={spot.name}
                        fill
                        className="object-cover pointer-events-none"
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No Image</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
            </div>

            {/* Overlays */}
            <motion.div
                style={{ opacity: likeOpacity }}
                className="absolute top-8 left-8 z-20 pointer-events-none"
            >
                <div className="border-4 border-green-500 rounded-lg px-4 py-2 transform -rotate-12">
                    <span className="text-4xl font-bold text-green-500 uppercase tracking-widest">LIKE</span>
                </div>
            </motion.div>

            <motion.div
                style={{ opacity: nopeOpacity }}
                className="absolute top-8 right-8 z-20 pointer-events-none"
            >
                <div className="border-4 border-red-500 rounded-lg px-4 py-2 transform rotate-12">
                    <span className="text-4xl font-bold text-red-500 uppercase tracking-widest">NOPE</span>
                </div>
            </motion.div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white pointer-events-none">
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                        {spot.type}
                    </span>
                    {spot.rating > 0 && (
                        <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-bold">{spot.rating}</span>
                        </div>
                    )}
                </div>

                <h2 className="text-3xl font-bold mb-1 shadow-black drop-shadow-sm">{spot.name}</h2>

                <div className="flex items-center gap-1 text-white/90 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm truncate">{spot.location}</span>
                </div>

                <p className="text-sm text-white/80 line-clamp-2 mb-4">
                    {spot.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {spot.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs border border-white/10">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
