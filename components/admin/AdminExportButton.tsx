"use client";

import { useTransition } from "react";
import { exportSpots } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

export function AdminExportButton() {
    const [isPending, startTransition] = useTransition();

    const handleExport = () => {
        startTransition(async () => {
            try {
                const result = await exportSpots();
                if (result.success && result.csv) {
                    // Create blob and download
                    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), result.csv], { type: 'text/csv;charset=utf-8;' }); // Add BOM for Excel
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', result.filename || 'export.csv');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    alert("データがありませんでした。");
                }
            } catch (error) {
                console.error(error);
                alert("エクスポートに失敗しました。");
            }
        });
    };

    return (
        <Button
            onClick={handleExport}
            disabled={isPending}
            variant="outline"
            className="gap-2"
        >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            CSV出力（バックアップ）
        </Button>
    );
}
