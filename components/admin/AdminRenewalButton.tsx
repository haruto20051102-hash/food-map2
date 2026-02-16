"use client";

import { useState, useTransition } from "react";
import { extendSubscription } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminRenewalButton({ spotId, expiresAt }: { spotId: string, expiresAt?: string }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleRenewal = () => {
        if (!confirm("手動で有効期限を1年延長しますか？\n（現金などで更新料を受け取った場合に実行してください）")) return;

        startTransition(async () => {
            try {
                await extendSubscription(spotId);
                alert("有効期限を更新しました！");
                router.refresh();
            } catch (error) {
                console.error(error);
                alert("更新に失敗しました。");
            }
        });
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "未設定";
        return new Date(dateString).toLocaleDateString('ja-JP');
    };

    return (
        <div className="mt-4 p-4 border border-yellow-500/20 bg-yellow-500/5 rounded-lg">
            <h4 className="text-sm font-bold text-yellow-500 mb-2">管理者用更新メニュー</h4>
            <div className="flex items-center justify-between gap-4">
                <div className="text-sm">
                    <span className="text-muted-foreground">現在の有効期限: </span>
                    <span className="font-mono font-medium">{formatDate(expiresAt)}</span>
                </div>
                <Button
                    onClick={handleRenewal}
                    disabled={isPending}
                    size="sm"
                    variant="outline"
                    className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                >
                    {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            1年延長する
                        </>
                    )}
                </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
                ※ 現金等で更新料を受け取った後に押してください。
            </p>
        </div>
    );
}
