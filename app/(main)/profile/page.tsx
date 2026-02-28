import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { User, Mail, LogOut, MapPin, Trophy, Share2 } from "lucide-react";
import Link from "next/link";
import { RankingEditor } from "@/components/profile/RankingEditor";
import { cn } from "@/lib/utils";

export default async function ProfilePage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect("/login");
    }

    const user = session.user;

    // Fetch user's spots count or other info if needed (optional for now)
    const { count: spotsCount } = await supabase
        .from("spots")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id);

    const { count: favoritesCount } = await supabase
        .from("favorites")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

    // Fetch visited spots (based on reviews)
    const { data: visitedSpots } = await supabase
        .from("reviews")
        .select(`
            id,
            created_at,
            rank,
            spot:spots (
                id,
                name,
                location,
                images
            )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    // Extract ranked spots and map to ensure Type compatibility
    const reviewsWithSpots = (visitedSpots || [])?.map((r: any) => ({
        id: r.id,
        rank: r.rank,
        created_at: r.created_at,
        spot: {
            id: r.spot.id,
            name: r.spot.name,
            location: r.spot.location,
            images: r.spot.images, // Supabase might return null, existing type expects string[] | null
        }
    }));

    const rankedSpots = reviewsWithSpots.filter((r) => r.rank !== null && r.rank > 0).sort((a, b) => (a.rank || 0) - (b.rank || 0));

    // Generate Twitter share text
    const shareText = encodeURIComponent(
        "私の茨城隠れ家ベスト\n\n" +
        rankedSpots.map((r: any) => `${r.rank}位: ${r.spot.name}`).join("\n") +
        "\n\n#イバクレ #茨城グルメ #隠れ家"
    );
    const shareUrl = encodeURIComponent("https://food-map.vercel.app"); // Adjust to real domain if known
    const twitterShareLink = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;

    return (
        <div className="container max-w-2xl py-12 px-4">
            <h1 className="text-3xl font-bold tracking-tight mb-8">マイページ</h1>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mb-8">
                <div className="bg-muted/30 p-6 border-b border-border flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User className="h-8 w-8" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{user.email?.split('@')[0]}</h2>
                        <div className="flex items-center text-muted-foreground text-sm mt-1">
                            <Mail className="h-4 w-4 mr-1.5" />
                            {user.email}
                        </div>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-2 gap-4">
                    <Link href="/spots/manage" className="flex flex-col items-center justify-center p-4 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors border border-transparent hover:border-border">
                        <span className="text-2xl font-bold text-foreground">{spotsCount || 0}</span>
                        <span className="text-sm text-muted-foreground mt-1">掲載スポット</span>
                    </Link>
                    <Link href="/favorites" className="flex flex-col items-center justify-center p-4 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors border border-transparent hover:border-border">
                        <span className="text-2xl font-bold text-foreground">{favoritesCount || 0}</span>
                        <span className="text-sm text-muted-foreground mt-1">お気に入り</span>
                    </Link>
                </div>
            </div>

            {/* Ranking Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        My Best Restaurants
                    </h2>
                    <div className="flex items-center gap-2">
                        {rankedSpots.length > 0 && (
                            <a
                                href={twitterShareLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 border border-input bg-background hover:bg-muted h-9 px-3 gap-2"
                            >
                                <Share2 className="h-4 w-4 text-[#1DA1F2]" />
                                {/* Optional text: <span className="hidden sm:inline">シェア</span> */}
                            </a>
                        )}
                        <RankingEditor reviews={reviewsWithSpots} />
                    </div>
                </div>

                {rankedSpots.length > 0 ? (
                    <div className="space-y-4">
                        {rankedSpots.map((review: any) => (
                            <Link key={review.id} href={`/spots/${review.spot.id}`} className="group block relative">
                                <div className={cn(
                                    "bg-card border rounded-lg overflow-hidden transition-all flex",
                                    review.rank === 1 ? "border-yellow-500/50 shadow-[0_0_15px_-3px_rgba(234,179,8,0.3)]" :
                                        review.rank === 2 ? "border-slate-300/50" :
                                            review.rank === 3 ? "border-amber-600/50" :
                                                "border-border"
                                )}>
                                    <div className="absolute top-0 left-0 z-10">
                                        <div className={cn(
                                            "w-8 h-8 flex items-center justify-center text-sm font-bold shadow-sm rounded-br-lg",
                                            review.rank === 1 ? "bg-yellow-500 text-black" :
                                                review.rank === 2 ? "bg-slate-300 text-black" :
                                                    "bg-amber-600 text-white"
                                        )}>
                                            {review.rank}
                                        </div>
                                    </div>

                                    <div className="w-32 h-32 sm:w-40 sm:h-32 bg-muted shrink-0">
                                        {review.spot.images?.[0] ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={review.spot.images[0]} alt={review.spot.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                                        )}
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{review.spot.name}</h3>
                                            <div className="text-sm text-muted-foreground mt-1 flex items-center">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                <span className="line-clamp-1">{review.spot.location}</span>
                                            </div>
                                        </div>
                                        <div className="text-xs text-muted-foreground text-right">
                                            訪問日: {new Date(review.created_at).toLocaleDateString('ja-JP')}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-muted/10 rounded-lg border border-dashed border-border text-muted-foreground text-sm">
                        まだランキングは設定されていません。<br />
                        右上のボタンからベスト3を設定してみましょう！
                    </div>
                )}
            </div>

            {/* Visited Places Section */}
            <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight mb-4">行った場所（口コミ履歴）</h2>
                {visitedSpots && visitedSpots.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {visitedSpots.map((review: any) => (
                            <Link key={review.id} href={`/spots/${review.spot.id}`} className="group block">
                                <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors flex">
                                    <div className="w-24 h-24 bg-muted shrink-0">
                                        {review.spot.images?.[0] ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={review.spot.images[0]} alt={review.spot.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                                        )}
                                    </div>
                                    <div className="p-3 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{review.spot.name}</h3>
                                            <div className="text-xs text-muted-foreground mt-1 flex items-center">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                <span className="line-clamp-1">{review.spot.location}</span>
                                            </div>
                                        </div>
                                        <div className="text-xs text-muted-foreground text-right border-t border-border pt-2 mt-2">
                                            訪問日: {new Date(review.created_at).toLocaleDateString('ja-JP')}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-muted/20 rounded-lg border border-dashed border-border text-muted-foreground">
                        まだ行った場所（口コミ）の履歴がありません。
                    </div>
                )}
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-2">
                    <Link
                        href="/spots/manage"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-foreground"
                    >
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">掲載スポットの管理</span>
                    </Link>

                    <div className="h-px bg-border mx-2 my-1" />

                    <form action="/auth/signout" method="post">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 text-destructive transition-colors text-left">
                            <LogOut className="h-5 w-5" />
                            <span className="font-medium">ログアウト</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
