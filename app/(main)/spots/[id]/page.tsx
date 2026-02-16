import { SecretAddress } from "@/components/ui/SecretAddress";
import { Map } from "@/components/ui/Map";
import { getSpot } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { Star, Clock, Info, MapPin, Navigation, Banknote, CreditCard, Smartphone, QrCode, Wallet, Car } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { getIsFavorite } from "@/lib/actions";
import { ReviewSection } from "@/components/ui/ReviewSection";
import { AdminDeleteButton } from "@/components/ui/AdminDeleteButton";
import { OwnerRecommendation } from "@/components/spot/OwnerRecommendation";
import { AdminRenewalButton } from "@/components/admin/AdminRenewalButton";


// Next.js 15: Props type for params is Promise
type Params = Promise<{ id: string }>;

export default async function SpotPage(props: { params: Params }) {
    const params = await props.params;
    const spot = await getSpot(params.id);
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { session } } = await supabase.auth.getSession();
    const isFavorite = await getIsFavorite(params.id);

    // Check for admin role
    let isAdmin = false;
    if (session?.user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();
        isAdmin = profile?.role === 'admin';
    }

    // Fetch reviews
    const { data: reviews } = await supabase
        .from("reviews")
        .select("*")
        .eq("spot_id", params.id)
        .order("created_at", { ascending: false });

    if (!spot) {
        notFound();
    }



    // ... existing code ...

    return (
        <div className="flex flex-col">

            {/* Hero Image Area - Simulated */}
            <div className="relative h-[50vh] w-full bg-muted/30 overflow-hidden">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
                {spot.images && spot.images.length > 0 && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={spot.images[0]} alt={spot.name} className="absolute inset-0 h-full w-full object-cover z-0" />
                )}
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 text-4xl font-bold uppercase tracking-widest z-0">
                    {!spot.images?.length && `${spot.name} Image`}
                </div>
                {/* Favorite Button Overlay */}
                <div className="absolute top-4 right-4 z-20">
                    <FavoriteButton
                        spotId={spot.id}
                        initialIsFavorite={isFavorite}
                        isLoggedIn={!!session}
                    />
                </div>
            </div>

            <div className="container relative z-20 -mt-10 md:-mt-20 px-4 md:px-6 pb-20">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start">

                    {/* Left Column: Main Info */}
                    <div className="flex-1 space-y-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="inline-flex items-center rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground shadow">
                                    {spot.type}
                                </span>
                                {spot.is_proxy && (
                                    <span className="inline-flex items-center rounded-md bg-yellow-500/20 px-3 py-1 text-sm font-medium text-yellow-500 shadow border border-yellow-500/30">
                                        公認アンバサダー代理登録
                                    </span>
                                )}
                                <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-md">
                                    <Star className="h-4 w-4 fill-current" />
                                    <span className="font-bold">{spot.rating}</span>
                                </div>
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl lg:text-6xl text-glow">{spot.name}</h1>
                            <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-2xl">
                                {spot.description}
                            </p>

                            {/* Admin/Owner Actions */}
                            {(isAdmin || (session?.user?.id === spot.user_id)) && (
                                <div className="mt-4 space-y-4">
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/spots/${spot.id}/edit`}
                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                                        >
                                            編集する
                                        </Link>
                                        {isAdmin && <AdminDeleteButton spotId={spot.id} />}
                                    </div>

                                    {isAdmin && (
                                        <AdminRenewalButton
                                            spotId={spot.id}
                                            expiresAt={spot.subscription_expires_at}
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {spot.tags?.map(tag => (
                                <span key={tag} className="text-sm border border-white/10 bg-white/5 px-3 py-1 rounded-full text-muted-foreground">
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <SecretAddress address={spot.location} />

                            <div className="rounded-lg border border-white/10 bg-muted/10 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium text-foreground">Opening Hours</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Mon-Sun: 18:00 - 04:00<br />
                                    Happy Hour: 18:00 - 20:00
                                </p>
                            </div>

                            <div className="rounded-lg border border-white/10 bg-muted/10 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Car className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium text-foreground">Parking</span>
                                </div>
                                <p className="text-sm text-muted-foreground font-bold">
                                    {spot.has_parking ? "駐車場あり 🅿️" : "駐車場なし"}
                                </p>
                            </div>

                            {spot.average_cost && (
                                <div className="rounded-lg border border-white/10 bg-muted/10 p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Wallet className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-medium text-foreground">Average Cost</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        ¥{spot.average_cost.toLocaleString()}~ /人
                                    </p>
                                </div>
                            )}

                            <div className="rounded-lg border border-white/10 bg-muted/10 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <CreditCard className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium text-foreground">Payment Methods</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {spot.payment_methods?.map(method => {
                                        const labels: Record<string, string> = {
                                            "cash": "現金",
                                            "credit_card": "クレジットカード",
                                            "electronic_money": "電子マネー",
                                            "qr_code": "QR決済"
                                        };
                                        return (
                                            <span key={method} className="text-sm text-muted-foreground flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
                                                {method === 'cash' && <Banknote className="h-3 w-3" />}
                                                {method === 'credit_card' && <CreditCard className="h-3 w-3" />}
                                                {method === 'electronic_money' && <Smartphone className="h-3 w-3" />}
                                                {method === 'qr_code' && <QrCode className="h-3 w-3" />}
                                                {labels[method]}
                                            </span>
                                        );
                                    })}
                                    {(!spot.payment_methods || spot.payment_methods.length === 0) && <span className="text-sm text-muted-foreground">情報なし</span>}
                                </div>
                            </div>
                        </div>

                        {/* Mini Map */}
                        <div className="mt-6 mb-8">
                            <div className="rounded-lg border border-white/10 overflow-hidden h-[300px] relative group mb-4">
                                <Map center={[spot.lat, spot.lng]} zoom={15} spots={[spot] as any} className="h-full w-full" />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a
                                    href={`http://maps.apple.com/?daddr=${spot.lat},${spot.lng}&dirflg=d`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-white text-zinc-900 border border-zinc-200 px-4 py-3 rounded-md text-center font-bold hover:bg-zinc-100 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-sm"
                                >
                                    <MapPin className="h-4 w-4 text-zinc-900" />
                                    <span>標準マップ</span>
                                </a>
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-white text-zinc-900 border border-zinc-200 px-4 py-3 rounded-md text-center font-bold hover:bg-zinc-100 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-sm"
                                >
                                    <Navigation className="h-4 w-4 text-[#4285F4]" />
                                    <span>Google Map</span>
                                </a>
                            </div>
                        </div>

                        {/* Owner Recommendations - REMOVED */}
                        {/* <OwnerRecommendation spotId={spot.id} /> */}

                        {/* Reviews */}
                        <ReviewSection
                            spotId={spot.id}
                            spotLat={spot.lat}
                            spotLng={spot.lng}
                            initialReviews={reviews as any}
                            isLoggedIn={!!session}
                        />
                    </div>


                </div>
            </div>

        </div>
    );
}
