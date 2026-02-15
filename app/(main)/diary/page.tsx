import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getIsAdmin } from "@/lib/auth";
import { DiaryView } from "@/components/diary/DiaryView";

export default async function DiaryPage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const isAdmin = await getIsAdmin();

    const { data: diaries } = await supabase
        .from("diaries")
        .select(`
            *,
            spot: spot_id(
                id,
                name,
                type,
                lat,
                lng,
                images,
                location
            )
        `)
        // Removed .eq("user_id", session.user.id) to show all diaries
        .order("visited_at", { ascending: false });

    return (
        <div className="container py-8 px-4 md:px-6 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <BookOpen className="h-8 w-8 text-primary" />
                        店主リレー
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        お店の人たちによる数珠つなぎ日誌。
                    </p>
                </div>
                {isAdmin && (
                    <Link href="/diary/new">
                        <Button className="shadow-lg shadow-primary/20">
                            <Plus className="mr-2 h-4 w-4" />
                            新規作成
                        </Button>
                    </Link>
                )}
            </div>

            {(!diaries || diaries.length === 0) ? (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-3xl bg-card/30 text-center">
                    <div className="bg-muted/20 p-4 rounded-full mb-4">
                        <BookOpen className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">まだ記事がありません</h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                        店主たちのつながりを記録して、隠れ家の輪を広げましょう。
                    </p>
                    {isAdmin && (
                        <Link href="/diary/new">
                            <Button variant="outline">最初の記事を書く</Button>
                        </Link>
                    )}
                </div>
            ) : (
                <DiaryView diaries={diaries} />
            )}
        </div>
    );
}
