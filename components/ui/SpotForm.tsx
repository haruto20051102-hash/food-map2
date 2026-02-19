"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSpot, updateSpot } from "@/lib/actions"; // We will add updateSpot later
import { MapPin, Upload, Loader2, X, Plus, DollarSign, Clock, Calendar, Car, Phone, Mail, CheckCircle, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ImageUploader } from "./ImageUploader";
import { getCoordinates } from "@/lib/getCoordinates";

type SpotFormProps = {
    initialData?: {
        id: string;
        name: string;
        type: string;
        description: string;
        location: string;
        business_hours: string;
        opening_time?: string;
        closing_time?: string;
        regular_holiday: string;
        payment_methods?: string[] | null;
        average_cost?: number | null;
        images: string[];
        is_proxy?: boolean;
        has_parking?: boolean;
        phone_number?: string | null;
        owner_email?: string | null;
    };
    isEditing?: boolean;
    isAdmin?: boolean;
};

export default function SpotForm({ initialData, isEditing = false, isAdmin = false }: SpotFormProps) {
    const [step, setStep] = useState<"form" | "payment" | "success">("form");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const router = useRouter();

    const handleLocationBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const address = e.target.value;
        if (!address) return;

        setIsGeocoding(true);
        const coords = await getCoordinates(address);
        setIsGeocoding(false);

        if (coords) {
            // Check if address is in Ibaraki
            // Nominatim returns address details. We check relevant fields or string match across the object.
            const addrStr = JSON.stringify(coords.address || {});
            const isIbaraki = addrStr.includes("Ibaraki") || addrStr.includes("茨城");

            if (!isIbaraki) {
                alert("申し訳ありません。現在、茨城県内のスポットのみ登録可能です。");
                setCoordinates(null);
                return;
            }

            setCoordinates(coords);
        } else {
            // Optional: Handle error or not found
            alert("場所が見つかりませんでした。住所を詳しく入力してみてください。");
        }
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        // Manually append new images from state
        newImageFiles.forEach((file) => {
            formData.append("images", file);
        });

        setIsSubmitting(true);

        try {
            if (isEditing && initialData) {
                // Update existing spot
                await updateSpot(initialData.id, formData);
                alert("スポット情報を更新しました！");
                router.push("/spots/manage");
                return;
            }

            // Create new spot
            const result = await createSpot(formData);

            if (result.checkoutUrl) {
                // Redirect to Stripe Checkout
                window.location.href = result.checkoutUrl;
            } else if (result.bypassedPayment) {
                // Admin free listing
                alert("管理者権限で無料掲載しました！");
                setStep("success"); // Or redirect to manage
                router.push("/spots/manage");
            } else if (result.success) { // Handle explicit success without other flags
                setStep("success");
            } else {
                // Handle returned error
                console.error("Server action failed:", result.error);
                alert(`エラーが発生しました: ${result.error || "不明なエラー"}`);
            }
        } catch (error: any) {
            console.error("Error submitting spot:", error);
            alert(`予期せぬエラーが発生しました: ${error.message || "もう一度お試しください"}`);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (step === "success") {
        return (
            <div className="container py-20 flex flex-col items-center justify-center text-center">
                <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 text-green-500">
                    <CheckCircle className="h-10 w-10" />
                </div>
                <h1 className="text-3xl font-bold mb-2">決済が完了しました！</h1>
                <p className="text-muted-foreground mb-8">
                    スポットの掲載登録が完了しました。¥6,000のお支払いをありがとうございます。
                </p>
                <button
                    onClick={() => router.push("/explore")}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90"
                >
                    掲載リストを見る
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 rounded-xl border border-white/10 bg-card p-6 md:p-8 shadow-lg">

            {/* Parking - Anyone can edit */}
            <div className="flex items-center space-x-2 border p-4 rounded-lg bg-card/50">
                <input
                    type="checkbox"
                    id="has_parking"
                    name="has_parking"
                    defaultChecked={initialData?.has_parking || false}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="has_parking" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    駐車場あり
                </label>
            </div>

            {/* Spot Details */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b border-white/10 pb-2">1. お店の情報</h3>

                <div className="grid gap-2">
                    <label className="text-sm font-medium">お店の名前</label>
                    <input
                        name="name"
                        defaultValue={initialData?.name}
                        required
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        placeholder="例: 隠れ家バー X"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">カテゴリー</label>
                        <select
                            name="type"
                            defaultValue={initialData?.type || "Bar"}
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="Bar">バー</option>
                            <option value="Izakaya">居酒屋</option>
                            <option value="Restaurant">レストラン</option>
                            <option value="Cafe">カフェ</option>
                            <option value="Speakeasy">隠れ家バー</option>
                            <option value="Teishoku">定食屋</option>
                            <option value="Ramen">ラーメン</option>
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">住所</label>
                        <input
                            name="location"
                            defaultValue={initialData?.location}
                            required

                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            placeholder="例: 水戸市, 茨城県"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label htmlFor="phone_number" className="text-base font-semibold flex items-center gap-2">
                        <Phone className="w-4 h-4" /> 電話番号
                    </label>
                    <Input
                        id="phone_number"
                        name="phone_number"
                        defaultValue={initialData?.phone_number || ""}
                        placeholder="例: 03-1234-5678"
                        className="bg-muted/50 border-input"
                    />
                </div>

                {isAdmin && (
                    <div className="space-y-4 border border-yellow-500/30 bg-yellow-500/10 p-4 rounded-lg">
                        <label htmlFor="owner_email" className="text-base font-semibold flex items-center gap-2 text-yellow-500">
                            <Mail className="w-4 h-4" /> オーナーメールアドレス (代理登録用)
                        </label>
                        <p className="text-xs text-muted-foreground mb-2">
                            このメールアドレスでログインしたユーザーに編集権限を付与します。
                        </p>
                        <Input
                            id="owner_email"
                            name="owner_email"
                            type="email"
                            defaultValue={initialData?.owner_email || ""}
                            placeholder="owner@example.com"
                            className="bg-black/50 border-yellow-500/30 text-white"
                        />
                    </div>
                )}

                <div className="grid gap-2">
                    <label className="text-sm font-medium">説明文</label>
                    <textarea
                        name="description"
                        defaultValue={initialData?.description}
                        required
                        className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        placeholder="このお店の魅力や特徴を教えてください"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">営業時間</label>
                        <input
                            name="business_hours"
                            defaultValue={initialData?.business_hours}
                            required
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            placeholder="例: 18:00 - 24:00"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">開店時間 (検索用)</label>
                        <input
                            type="time"
                            name="opening_time"
                            defaultValue={initialData?.opening_time}
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">閉店時間 (検索用)</label>
                        <input
                            type="time"
                            name="closing_time"
                            defaultValue={initialData?.closing_time}
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">定休日</label>
                        <input
                            name="regular_holiday"
                            defaultValue={initialData?.regular_holiday}
                            required
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            placeholder="例: 月曜日"
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <label className="text-sm font-medium">支払い方法</label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {["cash", "credit_card", "electronic_money", "qr_code"].map((method) => {
                            const labels: Record<string, string> = {
                                "cash": "現金",
                                "credit_card": "クレジットカード",
                                "electronic_money": "電子マネー",
                                "qr_code": "QR決済"
                            };
                            return (
                                <label key={method} className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        name="payment_methods"
                                        value={method}
                                        defaultChecked={initialData?.payment_methods?.includes(method)}
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm">{labels[method]}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                <div className="grid gap-2">
                    <label className="text-sm font-medium">平均予算 (1人あたり)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">¥</span>
                        <input
                            type="number"
                            name="average_cost"
                            defaultValue={initialData?.average_cost || ""}
                            min="0"
                            step="1000"
                            className="w-full rounded-md border border-input bg-transparent pl-7 pr-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            placeholder="3000"
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <label className="text-sm font-medium">画像 (最大5枚)</label>
                    <ImageUploader
                        onFilesChange={setNewImageFiles}
                        initialImages={initialData?.images}
                        maxFiles={5}
                    />
                    <p className="text-xs text-muted-foreground">お店の雰囲気が伝わる写真をアップロードしてください。</p>
                </div>

                {isAdmin && (
                    <div className="mt-4 p-4 border border-dashed border-yellow-500/50 bg-yellow-500/10 rounded-lg">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_proxy"
                                defaultChecked={initialData?.is_proxy}
                                className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-600"
                            />
                            <span className="text-sm font-bold text-yellow-500">
                                代理登録 (管理者機能)
                            </span>
                        </label>
                        <p className="text-xs text-muted-foreground mt-1 ml-6">
                            チェックを入れると「代理登録済み」としてマークされ、支払いステップがスキップされます。
                        </p>
                    </div>
                )}
            </div>

            {/* Payment Section - Only for New Spots */}
            {!isEditing && (
                <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-semibold border-b border-white/10 pb-2 flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        2. お支払い
                    </h3>

                    <div className="rounded-lg bg-secondary/20 border border-secondary p-4 flex items-center justify-between">
                        <div>
                            <span className="font-medium block">掲載料 (年間プラン)</span>
                            <span className="text-xs text-muted-foreground">年額</span>
                        </div>
                        <div className="text-xl font-bold">¥6,000<span className="text-sm font-normal text-muted-foreground">/年</span></div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        以下のボタンをクリックすることで、利用規約に同意したものとみなされます。これは256ビット暗号化された安全な取引です (デモ)。
                    </p>
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                    "w-full rounded-md bg-gradient-to-r from-primary to-blue-600 py-4 text-base font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2",
                    isSubmitting && "cursor-not-allowed"
                )}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        処理中...
                    </>
                ) : (
                    <>
                        {isEditing ? "更新する" : "¥6,000支払って掲載する"}
                    </>
                )}
            </button>

        </form>
    );
}
