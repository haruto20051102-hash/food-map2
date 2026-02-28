"use client";

import { useState } from "react";
import { ReviewForm } from "./ReviewForm";
import { Star, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Review {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    user_id: string;
    images?: string[];
}

interface ReviewSectionProps {
    spotId: string;
    spotLat: number;
    spotLng: number;
    initialReviews?: Review[];
    isLoggedIn: boolean;
}

export function ReviewSection({ spotId, spotLat, spotLng, initialReviews = [], isLoggedIn }: ReviewSectionProps) {
    const [showForm, setShowForm] = useState(false);

    // In a real app, we might want to fetch reviews client-side or receive them from server.
    // For simplicity, we assume initialReviews are passed from server component.
    // If we add a review, we should probably refresh the page or update local state.
    // Since ReviewForm calls router.refresh(), we can rely on that to re-fetch server data.

    return (
        <div className="mt-12 border-t border-white/10 pt-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    口コミ
                </h2>
                {isLoggedIn && !showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                    >
                        レビューを書く
                    </button>
                )}
            </div>

            {showForm && (
                <div className="mb-8">
                    <ReviewForm
                        spotId={spotId}
                        spotLat={spotLat}
                        spotLng={spotLng}
                        onCancel={() => setShowForm(false)}
                        onSuccess={() => setShowForm(false)}
                    />
                </div>
            )}

            <div className="space-y-6">
                {initialReviews.length > 0 ? (
                    initialReviews.map((review) => (
                        <div key={review.id} className="rounded-lg border border-white/5 bg-white/5 p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1 text-yellow-500">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-muted-foreground/20"}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(review.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm text-foreground/90 leading-relaxed">
                                {review.comment}
                            </p>
                            {review.images && review.images.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {review.images.map((src, i) => (
                                        <div key={i} className="relative h-20 w-20 overflow-hidden rounded-md border border-white/10 shrink-0">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={src} alt="Review attachment" className="h-full w-full object-cover hover:scale-105 transition-transform" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-muted-foreground text-center py-8">
                        まだ口コミはありません。この場所の最初のレビューを投稿しませんか？
                    </p>
                )}
            </div>
        </div>
    );
}
