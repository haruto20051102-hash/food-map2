"use client";

import { useState } from "react";
import { toggleAutoRenewal } from "@/lib/actions";
import { RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscriptionToggleProps {
    spotId: string;
    isAutoRenewal: boolean;
    expiresAt: string;
}

export function SubscriptionToggle({ spotId, isAutoRenewal, expiresAt }: SubscriptionToggleProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        if (isAutoRenewal) {
            const confirmed = window.confirm("次回の自動更新を停止しますか？\n\n※契約期間終了までは掲載を続けることができます。\n※契約期間終了後に自動的に非公開になります。");
            if (!confirmed) return;
        } else {
            const confirmed = window.confirm("自動更新を再開しますか？\n\n※次回の更新料は登録済みのカードに請求されます。");
            if (!confirmed) return;
        }

        setIsLoading(true);
        try {
            await toggleAutoRenewal(spotId, !isAutoRenewal);
        } catch (error) {
            console.error("Failed to toggle auto-renewal:", error);
            alert("更新に失敗しました。もう一度お試しください。");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-white/5">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                サブスクリプション管理
            </h4>

            <div className="text-xs text-muted-foreground mb-4">
                <p>現在のステータス: <span className={isAutoRenewal ? "text-green-500 font-bold" : "text-red-500 font-bold"}>{isAutoRenewal ? "自動更新ON" : "自動更新OFF"}</span></p>
                <p>契約有効期限: {new Date(expiresAt).toLocaleDateString()}</p>
            </div>

            <button
                onClick={handleToggle}
                disabled={isLoading}
                className={cn(
                    "w-full px-4 py-2.5 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors",
                    isAutoRenewal
                        ? "border border-red-500/30 text-red-500 hover:bg-red-500/10"
                        : "bg-primary text-primary-foreground hover:bg-primary/90",
                    isLoading && "opacity-50 cursor-not-allowed"
                )}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <>
                        {isAutoRenewal ? "次回の自動更新を停止する" : "自動更新を再開する"}
                    </>
                )}
            </button>

            {!isAutoRenewal && (
                <div className="mt-3 text-xs text-red-400 bg-red-500/5 p-2 rounded border border-red-500/10 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <p>自動更新が停止されています。有効期限 ({new Date(expiresAt).toLocaleDateString()}) を過ぎると、スポットは自動的に非公開になります。</p>
                </div>
            )}
        </div>
    );
}
