"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2, Image as ImageIcon, MapPin, X, PlusCircle } from "lucide-react";
import { Spot } from "@/lib/db";
import { createClient } from "@/lib/supabase/client";

interface DiaryFormProps {
    spots: Spot[];
}

export function DiaryForm({ spots }: DiaryFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(3);
    const [spotId, setSpotId] = useState<string>("");
    const [address, setAddress] = useState("");
    const [imageUrls, setImageUrls] = useState<string[]>([""]); // Start with one empty input

    // Future: Use Supabase Storage for actual file upload
    const handleImageChange = (index: number, value: string) => {
        const newUrls = [...imageUrls];
        newUrls[index] = value;
        setImageUrls(newUrls);
    };

    const addImageInput = () => {
        if (imageUrls.length < 5) {
            setImageUrls([...imageUrls, ""]);
        }
    };

    const removeImageInput = (index: number) => {
        const newUrls = imageUrls.filter((_, i) => i !== index);
        setImageUrls(newUrls.length ? newUrls : [""]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert("ログインが必要です。");
            setLoading(false);
            return;
        }

        const validImages = imageUrls.filter(url => url.trim() !== "");

        const { error } = await supabase.from("diaries").insert({
            user_id: user.id,
            spot_id: spotId || null,
            title,
            content,
            rating,
            images: validImages,
            address: address || null,
            visited_at: new Date().toISOString(),
        });

        if (error) {
            console.error(error);
            alert("日記の保存に失敗しました。");
        } else {
            router.push("/diary");
            router.refresh();
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">タイトル</label>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="例: 友達とディナー"
                    required
                    className="bg-transparent border-white/20"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">場所 (任意)</label>
                <select
                    value={spotId}
                    onChange={(e) => setSpotId(e.target.value)}
                    className="w-full bg-background border border-white/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="">場所を選択...</option>
                    {spots.map((spot) => (
                        <option key={spot.id} value={spot.id}>
                            {spot.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">住所 (手動入力)</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="東京都新宿区..."
                        className="pl-9 bg-transparent border-white/20"
                    />
                </div>
                <p className="text-xs text-muted-foreground">
                    ※ 場所を選択した場合は、そちらの住所が優先されます。
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">評価</label>
                <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <button
                            type="button"
                            key={value}
                            onClick={() => setRating(value)}
                            className="focus:outline-none transition-transform active:scale-95"
                        >
                            <Star
                                className={`h-8 w-8 ${value <= rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"}`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">写真URL (最大5枚)</label>
                <div className="space-y-3">
                    {imageUrls.map((url, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex gap-2">
                                <Input
                                    value={url}
                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                    placeholder={`https://example.com/photo-${index + 1}.jpg`}
                                    className="bg-transparent border-white/20 font-mono text-xs flex-1"
                                />
                                {imageUrls.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeImageInput(index)}
                                    >
                                        <X className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                                    </Button>
                                )}
                            </div>
                            {url && (
                                <div className="ml-1 relative aspect-video w-32 overflow-hidden rounded-lg border border-white/10">
                                    <img src={url} alt="Preview" className="object-cover w-full h-full" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                </div>
                            )}
                        </div>
                    ))}
                    {imageUrls.length < 5 && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addImageInput}
                            className="w-full border-dashed border-white/20"
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            写真を追加
                        </Button>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">内容</label>
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="スープがとても濃厚で..."
                    required
                    rows={6}
                    className="bg-transparent border-white/20 resize-none"
                />
            </div>

            <Button type="submit" disabled={loading} className="w-full text-lg font-bold py-6 shadow-lg shadow-primary/20">
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "日記を保存"}
            </Button>
        </form>
    );
}
