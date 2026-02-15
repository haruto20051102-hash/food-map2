import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background text-foreground">
            <div className="bg-muted/30 p-8 rounded-full mb-6">
                <AlertCircle className="w-16 h-16 text-muted-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-4 tracking-tight">404 - Page Not Found</h1>
            <p className="text-muted-foreground max-w-md mb-8">
                お探しのページは見つかりませんでした。削除されたか、URLが間違っている可能性があります。
            </p>
            <Link
                href="/"
                className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
                ホームに戻る
            </Link>
        </div>
    );
}
