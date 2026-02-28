"use client";

import { useState } from "react";
import { Star, MapPin, AlertCircle, Loader2 } from "lucide-react";
import { getCurrentPosition, getDistanceInMeters } from "@/lib/geolocation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ImageUploader } from "./ImageUploader";

interface ReviewFormProps {
    spotId: string;
    spotLat: number;
    spotLng: number;
    onCancel: () => void;
    onSuccess: () => void;
}

export function ReviewForm({ spotId, spotLat, spotLng, onCancel, onSuccess }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
    const [locationVerified, setLocationVerified] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const supabase = createClient();
    const router = useRouter();

    const handleVerifyLocation = async () => {
        setVerifying(true);
        setError(null);
        try {
            const position = await getCurrentPosition();
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            const dist = getDistanceInMeters(userLat, userLng, spotLat, spotLng);
            setDistance(Math.round(dist));

            if (dist <= 25) {
                setLocationVerified(true);
            } else {
                setError(`レビューを投稿するには、スポットから半径25m以内にいる必要があります。現在位置からの距離: ${Math.round(dist)}m`);
            }
        } catch (err: any) {
            setError(err.message || "位置情報の取得に失敗しました。ブラウザの設定で位置情報を許可してください。");
        } finally {
            setVerifying(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return;

        setSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("認証されていません");

            // Handle Image Upload
            const imageUrls: string[] = [];
            for (const imageFile of newImageFiles) {
                if (imageFile && imageFile.size > 0) {
                    const fileExt = imageFile.name.split('.').pop();
                    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                    const { error: uploadError } = await supabase.storage
                        .from('reviews')
                        .upload(fileName, imageFile);

                    if (uploadError) {
                        console.error("Upload error details:", uploadError);
                        throw new Error(`画像アップロードに失敗しました: ${uploadError.message}`);
                    }

                    const { data: { publicUrl } } = supabase.storage
                        .from('reviews')
                        .getPublicUrl(fileName);

                    imageUrls.push(publicUrl);
                }
            }

            const { error } = await supabase.from("reviews").insert({
                spot_id: spotId,
                user_id: user.id,
                rating,
                comment,
                images: imageUrls
            });

            if (error) throw error;
            onSuccess();
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (!locationVerified) {
        return (
            <div className="rounded-lg border border-dashed border-white/20 bg-muted/20 p-6 text-center">
                <MapPin className="mx-auto h-8 w-8 text-primary mb-2" />
                <h3 className="text-lg font-semibold mb-2">位置情報の確認</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    信頼できる口コミのために、現在地がスポットの近く（25m以内）にあるかを確認します。
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm flex items-center justify-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                {distance !== null && distance > 25 && (
                    <div className="mb-4 text-xs text-muted-foreground">
                        記録された距離: {distance}m
                    </div>
                )}

                <button
                    onClick={handleVerifyLocation}
                    disabled={verifying}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
                >
                    {verifying ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            位置情報を確認中...
                        </>
                    ) : (
                        "位置情報を確認してレビューを書く"
                    )}
                </button>
                <button
                    onClick={onCancel}
                    className="block w-full mt-2 text-xs text-muted-foreground hover:underline"
                >
                    キャンセル
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-white/10 bg-card p-6">
            <h3 className="text-lg font-semibold">レビューを書く</h3>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">評価</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((val) => (
                        <button
                            key={val}
                            type="button"
                            onClick={() => setRating(val)}
                            className={cn(
                                "p-1 hover:scale-110 transition-transform",
                                rating >= val ? "text-yellow-500" : "text-muted-foreground/30"
                            )}
                        >
                            <Star className={cn("h-6 w-6", rating >= val && "fill-current")} />
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">コメント</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="体験をシェアしてください..."
                    className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">写真（任意・最大4枚）</label>
                <div className="rounded-md border border-input bg-transparent p-3">
                    <ImageUploader
                        onFilesChange={setNewImageFiles}
                        maxFiles={4}
                    />
                </div>
            </div>

            <div className="flex gap-2 justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                    キャンセル
                </button>
                <button
                    type="submit"
                    disabled={submitting || rating === 0}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
                >
                    {submitting ? "送信中..." : "レビューを投稿"}
                </button>
            </div>
        </form>
    );
}
