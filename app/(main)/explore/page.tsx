"use client";

import { useState, useEffect } from "react";
import { SpotCard } from "@/components/ui/SpotCard";
import { Map } from "@/components/ui/Map";
import { getSpots, Spot } from "@/lib/db";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Map as MapIcon, List, Filter, Loader2, Sparkles, Clock, Star, MapPin } from "lucide-react";
import Link from "next/link";


import { CATEGORIES, CATEGORY_MAP } from "@/lib/constants";

export default function ExplorePage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
    const [sortBy, setSortBy] = useState<"distance" | "rating" | "reviews">("distance");
    const [spots, setSpots] = useState<Spot[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
    const supabase = createClient();

    const [reviews, setReviews] = useState<any[]>([]);
    const [recommendedSpot, setRecommendedSpot] = useState<Spot | null>(null);

    // Parse business hours and check if open
    const isOpenNow = (spot: Spot): boolean => {
        if (!spot.business_hours) return true; // Assume open if no hours set (or false depending on preference)

        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = currentHour * 60 + currentMinute;

        // Check holiday
        const days = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
        const today = days[now.getDay()];
        if (spot.regular_holiday && spot.regular_holiday.includes(today)) {
            return false;
        }

        // Parse hours "18:00 - 24:00" or "18:00 - 02:00"
        // Simple regex for "HH:MM - HH:MM"
        const match = spot.business_hours.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
        if (!match) return true; // Could not parse, default to true or false

        const startH = parseInt(match[1]);
        const startM = parseInt(match[2]);
        const endH = parseInt(match[3]);
        const endM = parseInt(match[4]);

        const startTime = startH * 60 + startM;
        let endTime = endH * 60 + endM;

        // Handle crossing midnight (e.g. 26:00 or 02:00)
        // If end time is smaller than start time, add 24 hours
        if (endTime < startTime) {
            endTime += 24 * 60;
        }

        // Adjust current time if it's past midnight but before closing (for late night spots)
        // e.g. Now is 01:00 (25:00), Shop is 18:00 - 02:00 (26:00)
        let effectiveCurrentTime = currentTime;
        if (effectiveCurrentTime < startTime && effectiveCurrentTime < (endTime - 24 * 60)) {
            // It's early morning, treat as previous day's late night
            effectiveCurrentTime += 24 * 60;
        }

        return effectiveCurrentTime >= startTime && effectiveCurrentTime <= endTime;
    };

    // Check if open today (not a regular holiday)
    const isOpenToday = (spot: Spot): boolean => {
        const now = new Date();
        const days = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
        const today = days[now.getDay()];

        if (spot.regular_holiday && spot.regular_holiday.includes(today)) {
            return false;
        }
        return true;
    };

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch spots and session in parallel
                const [spotsData, sessionResult] = await Promise.all([
                    getSpots(),
                    supabase.auth.getSession()
                ]);

                setSpots(spotsData);

                // Select Random Spot Open Today
                // Select Random Spot Open Today (Sticky per day)
                const todayStr = new Date().toDateString(); // e.g. "Mon Feb 12 2024"
                let seed = 0;
                for (let i = 0; i < todayStr.length; i++) {
                    seed += todayStr.charCodeAt(i);
                }

                const openSpots = spotsData.filter(isOpenToday);
                if (openSpots.length > 0) {
                    const index = seed % openSpots.length;
                    setRecommendedSpot(openSpots[index]);
                } else if (spotsData.length > 0) {
                    const index = seed % spotsData.length;
                    setRecommendedSpot(spotsData[index]);
                }

                const session = sessionResult.data.session;
                setIsLoggedIn(!!session);

                if (session) {
                    const { data: favorites } = await supabase
                        .from("favorites")
                        .select("spot_id")
                        .eq("user_id", session.user.id);

                    if (favorites) {
                        setFavoriteIds(new Set(favorites.map(f => f.spot_id)));
                    }
                }

            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.log("Geolocation error:", error);
                }
            );
        }
    }, []);

    const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLng = deg2rad(lng2 - lng1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    };

    const deg2rad = (deg: number) => {
        return deg * (Math.PI / 180);
    };

    const filteredSpots = activeCategory === "All"
        ? spots
        : spots.filter(spot => spot.type === activeCategory);

    // Sort spots
    const sortedSpots = [...filteredSpots].sort((a, b) => {
        if (sortBy === "distance") {
            if (!userLocation) return 0;
            const distA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
            const distB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
            return distA - distB;
        } else if (sortBy === "rating") {
            return (b.rating || 0) - (a.rating || 0);
        } else if (sortBy === "reviews") {
            return (b.review_count || 0) - (a.review_count || 0);
        }
        return 0;
    });

    return (
        <div className="container min-h-screen py-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">探索する</h1>
                    <p className="text-muted-foreground">
                        厳選された茨城の隠れ家スポットを見つけましょう。
                        {userLocation && <span className="text-primary ml-2 text-xs">現在地周辺を表示中</span>}
                    </p>
                </div>

            </div>

            {/* Mobile Controls (Sticky) */}
            <div className="md:hidden sticky top-[60px] z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 mb-6 border-b border-white/5 -mx-4 px-4 flex gap-2 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1 bg-muted/20 p-1 rounded-lg shrink-0">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={cn(
                            "p-1.5 rounded-md transition-colors",
                            viewMode === "grid" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                        )}
                    >
                        <List className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setViewMode("map")}
                        className={cn(
                            "p-1.5 rounded-md transition-colors",
                            viewMode === "map" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                        )}
                    >
                        <MapIcon className="h-4 w-4" />
                    </button>
                </div>

                <div className="h-8 w-px bg-border mx-1 shrink-0" />

                <div className="flex gap-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors border whitespace-nowrap",
                                activeCategory === cat
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background hover:bg-muted border-white/10"
                            )}
                        >
                            {CATEGORY_MAP[cat]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Daily Pick Section */}
            {recommendedSpot && (
                <div className="mb-10 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkles className="h-32 w-32 text-primary" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                                TODAY
                            </span>
                            <h2 className="text-xl font-bold text-foreground">今日のおすすめ</h2>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-full md:w-1/3 aspect-video rounded-lg overflow-hidden border border-white/10 bg-muted relative">
                                {recommendedSpot.images?.[0] ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={recommendedSpot.images[0]} alt={recommendedSpot.name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">No Image</div>
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-medium text-primary">{recommendedSpot.type}</span>
                                    <div className="flex items-center text-yellow-500 text-sm">
                                        <Star className="h-3 w-3 fill-current mr-1" />
                                        {recommendedSpot.rating}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold mb-2">{recommendedSpot.name}</h3>
                                <p className="text-muted-foreground mb-4 line-clamp-2">{recommendedSpot.description}</p>

                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-1.5" />
                                        {recommendedSpot.business_hours || "営業時間情報なし"}
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-1.5" />
                                        {recommendedSpot.location}
                                    </div>
                                </div>

                                <Link
                                    href={`/spots/${recommendedSpot.id}`}
                                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                                >
                                    詳細を見る
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Sort Controls */}
            <div className="mb-4 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-muted-foreground mr-2">並び替え:</span>
                <button
                    onClick={() => setSortBy("distance")}
                    className={cn(
                        "px-3 py-1 rounded-md text-sm transition-colors border",
                        sortBy === "distance"
                            ? "bg-primary/20 text-primary border-primary/50"
                            : "bg-background hover:bg-muted border-white/10 text-muted-foreground"
                    )}
                >
                    現在地から近い
                </button>
                <button
                    onClick={() => setSortBy("rating")}
                    className={cn(
                        "px-3 py-1 rounded-md text-sm transition-colors border",
                        sortBy === "rating"
                            ? "bg-primary/20 text-primary border-primary/50"
                            : "bg-background hover:bg-muted border-white/10 text-muted-foreground"
                    )}
                >
                    高評価
                </button>
                <button
                    onClick={() => setSortBy("reviews")}
                    className={cn(
                        "px-3 py-1 rounded-md text-sm transition-colors border",
                        sortBy === "reviews"
                            ? "bg-primary/20 text-primary border-primary/50"
                            : "bg-background hover:bg-muted border-white/10 text-muted-foreground"
                    )}
                >
                    口コミが多い
                </button>
            </div>

            {/* Desktop Category Filters */}
            <div className="hidden md:block mb-8 overflow-x-auto pb-4 md:pb-0">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors border",
                                activeCategory === cat
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background hover:bg-muted border-white/10"
                            )}
                        >
                            {CATEGORY_MAP[cat]}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : viewMode === "grid" ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {sortedSpots.map((spot) => (
                        <SpotCard
                            key={spot.id}
                            spot={spot}
                            isLoggedIn={isLoggedIn}
                            isFavorite={favoriteIds.has(spot.id)}
                            distance={userLocation ? calculateDistance(userLocation.lat, userLocation.lng, spot.lat, spot.lng) : null}
                        />
                    ))}
                    {sortedSpots.length === 0 && (
                        <div className="col-span-full py-20 text-center text-muted-foreground border border-dashed border-white/10 rounded-lg">
                            条件に一致するスポットが見つかりませんでした。
                        </div>
                    )}
                </div>
            ) : (
                <div className="h-[600px] w-full rounded-xl border border-white/10 overflow-hidden relative z-0">
                    <Map spots={filteredSpots} className="h-full w-full" />
                </div>
            )}
        </div>
    );
}
