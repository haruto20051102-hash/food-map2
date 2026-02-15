"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { cancelSpotListing } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface AdminDeleteButtonProps {
    spotId: string;
}

export function AdminDeleteButton({ spotId }: AdminDeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("本当にこのスポットを削除（掲載停止）しますか？\nこの操作は管理者権限で行われます。")) {
            return;
        }

        setIsDeleting(true);
        try {
            await cancelSpotListing(spotId);
            alert("スポットを削除しました。");
            router.push("/explore");
            router.refresh();
        } catch (error) {
            console.error("Failed to delete spot:", error);
            alert("削除に失敗しました。");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-md transition-colors border border-red-500/20 text-sm font-medium"
        >
            {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
            管理者削除
        </button>
    );
}
