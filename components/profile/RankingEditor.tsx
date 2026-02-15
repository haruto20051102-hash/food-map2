"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateReviewRank } from "@/lib/actions";
import { Trophy, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Define locally to avoid heavy imports if not needed elsewhere
interface ReviewWithSpot {
    id: string; // review id
    rank: number | null;
    spot: {
        id: string;
        name: string;
        images: string[] | null;
        location: string;
    };
}

interface RankingEditorProps {
    reviews: ReviewWithSpot[];
}

export function RankingEditor({ reviews }: RankingEditorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Sort by rank (nulls last)
    const sortedReviews = [...reviews].sort((a, b) => {
        if (a.rank && b.rank) return a.rank - b.rank;
        if (a.rank) return -1;
        if (b.rank) return 1;
        return 0;
    });

    const handleRankChange = (reviewId: string, newRank: number | null) => {
        startTransition(async () => {
            try {
                await updateReviewRank(reviewId, newRank);
            } catch (error) {
                console.error("Failed to update rank", error);
                alert("ランキングの更新に失敗しました。");
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    ランキングを編集
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>マイベストレストラン編集</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <p className="text-sm text-muted-foreground">
                        行ったお店の中から、あなたのベスト3を設定しましょう。
                        同じ順位は設定できません（自動的に入れ替わります）。
                    </p>

                    <div className="space-y-4">
                        {sortedReviews.map((review) => (
                            <div
                                key={review.id}
                                className={cn(
                                    "flex items-center gap-4 p-3 rounded-lg border transition-all",
                                    review.rank === 1 ? "border-yellow-500/50 bg-yellow-500/10" :
                                        review.rank === 2 ? "border-slate-300/50 bg-slate-300/10" :
                                            review.rank === 3 ? "border-amber-600/50 bg-amber-600/10" :
                                                "border-border bg-card"
                                )}
                            >
                                {/* Rank Selector */}
                                <div className="flex flex-col gap-1 shrink-0">
                                    {[1, 2, 3].map((rank) => (
                                        <button
                                            key={rank}
                                            disabled={isPending}
                                            onClick={() => handleRankChange(review.id, review.rank === rank ? null : rank)}
                                            className={cn(
                                                "w-8 h-8 rounded flex items-center justify-center text-sm font-bold border transition-colors",
                                                review.rank === rank
                                                    ? rank === 1 ? "bg-yellow-500 text-black border-yellow-500" :
                                                        rank === 2 ? "bg-slate-300 text-black border-slate-300" :
                                                            "bg-amber-600 text-white border-amber-600"
                                                    : "bg-background hover:bg-muted border-border text-muted-foreground"
                                            )}
                                        >
                                            {rank}
                                        </button>
                                    ))}
                                </div>

                                {/* Spot Info */}
                                <div className="h-16 w-24 bg-muted rounded overflow-hidden shrink-0">
                                    {review.spot.images?.[0] ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={review.spot.images[0]} alt={review.spot.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold truncate">{review.spot.name}</h4>
                                    <p className="text-xs text-muted-foreground truncate">{review.spot.location}</p>
                                </div>

                                {review.rank && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={isPending}
                                        onClick={() => handleRankChange(review.id, null)}
                                        className="shrink-0 text-muted-foreground hover:text-destructive"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
