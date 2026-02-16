import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cancelSpotListing, toggleSpotStatus } from "@/lib/actions";
import { Eye, EyeOff } from "lucide-react";
import { SubscriptionToggle } from "@/components/spots/SubscriptionToggle";
import { AdminExportButton } from "@/components/admin/AdminExportButton";

export default async function ManageSpotsPage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    // Check for admin role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
    const isAdmin = profile?.role === 'admin';

    // If admin, fetch ALL spots? Or just own spots?
    // Manage page usually shows OWN spots.
    // But export button exports ALL spots.
    // The previous code fetched own spots:
    // .eq("user_id", user.id);

    // I will keep showing OWN spots in the list, but the Export button (Admin only) will export ALL spots (handled by server action).

    const { data: spots } = await supabase
        .from("spots")
        .select("*")
        .eq("user_id", user.id);

    // Filter and sort proxy spots for admin
    const proxySpots = isAdmin && spots
        ? spots.filter(s => s.is_proxy).sort((a, b) => {
            if (!a.subscription_expires_at) return 1;
            if (!b.subscription_expires_at) return -1;
            return new Date(a.subscription_expires_at).getTime() - new Date(b.subscription_expires_at).getTime();
        })
        : [];

    return (
        <div className="container py-12 px-4 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-bold">掲載スポットの管理</h1>
                {isAdmin && <AdminExportButton />}
            </div>

            {isAdmin && (
                <div className="mb-12 p-6 bg-card border border-yellow-500/30 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-yellow-500">⚠</span> 公認アンバサダー代理登録の更新管理
                    </h2>

                    {proxySpots.length > 0 ? (
                        <>
                            <p className="text-sm text-muted-foreground mb-4">
                                有効期限が近い順に表示されています。期限が切れる前に更新手続き（集金・延長）を行ってください。
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-muted-foreground border-b border-white/10">
                                        <tr>
                                            <th className="py-2 px-4">スポット名</th>
                                            <th className="py-2 px-4">有効期限</th>
                                            <th className="py-2 px-4">残り日数</th>
                                            <th className="py-2 px-4">アクション</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {proxySpots.map(spot => {
                                            const expiresAt = spot.subscription_expires_at ? new Date(spot.subscription_expires_at) : null;
                                            const now = new Date();
                                            const daysLeft = expiresAt ? Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;
                                            const isUrgent = daysLeft <= 60;
                                            const isExpired = daysLeft < 0;

                                            return (
                                                <tr key={spot.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="py-3 px-4 font-medium">{spot.name}</td>
                                                    <td className="py-3 px-4">
                                                        {expiresAt ? expiresAt.toLocaleDateString('ja-JP') : '未設定'}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {isExpired ? (
                                                            <span className="text-red-500 font-bold">期限切れ ({daysLeft * -1}日経過)</span>
                                                        ) : (
                                                            <span className={isUrgent ? "text-yellow-500 font-bold" : "text-green-500"}>
                                                                あと {daysLeft} 日
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <Link href={`/spots/${spot.id}`} className="text-primary hover:underline">
                                                            詳細・更新へ
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <p className="text-muted-foreground">現在、代理登録されているスポットはありません。</p>
                    )}
                </div>
            )}

            {!spots || spots.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-muted-foreground mb-4">掲載しているスポットはありません。</p>
                    <Link href="/spots/new" className="text-primary hover:underline">
                        お店を掲載する
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {spots.map((spot) => (
                        <div key={spot.id} className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-xl bg-card border border-white/10 shadow-sm">
                            <div className="bg-muted w-full md:w-48 h-32 rounded-lg flex items-center justify-center overflow-hidden">
                                {spot.images && spot.images.length > 0 ? (
                                    <img src={spot.images[0]} alt={spot.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-muted-foreground text-xs">No Image</span>
                                )}
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-bold mb-2">{spot.name}</h3>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-2">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${spot.listing_status === 'active'
                                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                                        }`}>
                                        {spot.listing_status === 'active' ? '掲載中' : '掲載停止'}
                                    </span>
                                    <span className="text-muted-foreground text-sm">
                                        {spot.business_hours || "営業時間未設定"}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">{spot.description}</p>
                            </div>

                            <div className="flex flex-col gap-2 w-full md:w-auto min-w-[200px]">
                                <Link
                                    href={`/spots/${spot.id}`}
                                    className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 text-center"
                                >
                                    詳細を見る
                                </Link>

                                <Link
                                    href={`/spots/${spot.id}/edit`}
                                    className="px-4 py-2 rounded-md border border-primary/50 text-primary text-sm font-medium hover:bg-primary/10 text-center"
                                >
                                    編集する
                                </Link>

                                <div className="h-px bg-white/10 my-1" />

                                {/* Visibility Toggle */}
                                <form action={async () => {
                                    "use server";
                                    await toggleSpotStatus(spot.id, !spot.is_hidden);
                                }}>
                                    <button
                                        type="submit"
                                        className={`w-full px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 ${spot.is_hidden
                                            ? "bg-white/10 hover:bg-white/20 text-muted-foreground"
                                            : "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                            }`}
                                    >
                                        {spot.is_hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        {spot.is_hidden ? "非公開（公開する）" : "公開中（非公開にする）"}
                                    </button>
                                </form>

                                {/* Auto-Renewal Toggle (Only if active/subscribed) */}
                                {spot.listing_status === 'active' && spot.subscription_id && (
                                    <SubscriptionToggle
                                        spotId={spot.id}
                                        isAutoRenewal={spot.is_auto_renewal}
                                        expiresAt={spot.subscription_expires_at}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
