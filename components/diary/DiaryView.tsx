"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Calendar, MapPin, Star, List, Map as MapIcon, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Map } from "@/components/ui/Map";
import { Spot } from "@/lib/db";

interface DiaryViewProps {
    diaries: any[];
}

export function DiaryView({ diaries }: DiaryViewProps) {
    const [viewMode, setViewMode] = useState<"list" | "map">("list");

    const spotsWithDiaries = diaries
        .filter(d => d.spot)
        .map(d => ({
            ...d.spot,
            // Add diary context to the spot if needed for popup customization in future
            diaryId: d.id,
            diaryTitle: d.title
        })) as Spot[];

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <div className="bg-muted/20 p-1 rounded-lg flex items-center gap-1 border border-white/10">
                    <Button
                        variant={viewMode === "list" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="flex items-center gap-2"
                    >
                        <List className="h-4 w-4" />
                        リスト
                    </Button>
                    <Button
                        variant={viewMode === "map" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("map")}
                        className="flex items-center gap-2"
                    >
                        <MapIcon className="h-4 w-4" />
                        マップ
                    </Button>
                </div>
            </div>

            {viewMode === "list" ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {diaries.map((diary: any) => (
                        <div key={diary.id} className="group relative overflow-hidden rounded-xl border border-white/10 bg-card hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
                            {diary.images && diary.images.length > 0 ? (
                                <div className="aspect-video w-full overflow-hidden relative">
                                    <img
                                        src={diary.images[0]}
                                        alt={diary.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {diary.images.length > 1 && (
                                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                            <ImageIcon className="h-3 w-3" />
                                            <span>+{diary.images.length - 1}</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="aspect-video w-full bg-muted/20 flex items-center justify-center">
                                    <BookOpen className="h-10 w-10 text-muted-foreground/30" />
                                </div>
                            )}

                            <div className="p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(diary.visited_at).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-0.5 text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-3 w-3 ${i < (diary.rating || 0) ? "fill-current" : "text-muted/30"}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                    {diary.title || "無題"}
                                </h3>

                                {diary.spot ? (
                                    <Link href={`/spots/${diary.spot.id}`} className="flex items-center gap-1 text-sm text-primary mb-3 hover:underline">
                                        <MapPin className="h-3 w-3" />
                                        {diary.spot.name}
                                    </Link>
                                ) : diary.address ? (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                                        <MapPin className="h-3 w-3" />
                                        {diary.address}
                                    </div>
                                ) : null}

                                <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                                    {diary.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-[600px] w-full rounded-xl overflow-hidden border border-white/10 shadow-xl relative group">
                    {/* Pass filtered spots to Map */}
                    <Map
                        center={spotsWithDiaries.length > 0 ? [spotsWithDiaries[0].lat, spotsWithDiaries[0].lng] : undefined}
                        zoom={11}
                        spots={spotsWithDiaries}
                        className="h-full w-full"
                    />
                    <div className="absolute top-4 left-4 z-[400] bg-background/90 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 shadow-lg pointer-events-none">
                        <p className="text-sm font-bold flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            {spotsWithDiaries.length} 箇所の記録
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
