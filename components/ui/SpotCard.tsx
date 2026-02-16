import Link from "next/link";
import { MapPin, Star, Banknote, CreditCard, Smartphone, QrCode, Car, Clock } from "lucide-react";
import { Spot } from "@/lib/db";
import { cn } from "@/lib/utils";
import { FavoriteButton } from "@/components/ui/FavoriteButton";

interface SpotCardProps {
    spot: Spot;
    className?: string;
    isFavorite?: boolean;
    isLoggedIn?: boolean;
    distance?: number | null;
}

export function SpotCard({ spot, className, isFavorite = false, isLoggedIn = false, distance }: SpotCardProps) {
    const imageUrl = spot.images && spot.images.length > 0 ? spot.images[0] : null;

    return (
        <div className={cn("group relative block overflow-hidden rounded-lg border border-white/10 bg-card text-card-foreground shadow-sm transition-all hover:border-primary/50 hover:shadow-md", className)}>
            <Link href={`/spots/${spot.id}`} className="absolute inset-0 z-0">
                <span className="sr-only">View spot</span>
            </Link>
            <div className="aspect-video w-full bg-muted/50 transition-transform group-hover:scale-105 relative">
                {/* Image */}
                {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageUrl} alt={spot.name} className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-zinc-600">
                        <span className="text-xs">No Image</span>
                    </div>
                )}

                {/* Favorite Button - Absolute positioned on top */}
                <div className="absolute top-2 right-2 z-10">
                    <FavoriteButton spotId={spot.id} initialIsFavorite={isFavorite} isLoggedIn={isLoggedIn} />
                </div>
            </div>
            <div className="p-4 relative z-10 pointer-events-none">
                <div className="mb-2 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                        {spot.type}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-sm font-bold">{spot.rating}</span>
                        {spot.review_count !== undefined && (
                            <span className="text-xs text-muted-foreground ml-1">({spot.review_count})</span>
                        )}
                    </div>
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {spot.name}
                </h3>
                <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span className="truncate max-w-[100px]">{spot.business_hours}</span>
                    </div>
                    {spot.has_parking && (
                        <div className="flex items-center text-blue-400" title="駐車場あり">
                            <Car className="h-3 w-3 mr-1" />
                            <span className="text-[10px]">Pあり</span>
                        </div>
                    )}
                </div>
                <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        <span className="truncate max-w-[150px]">{spot.location}</span>
                        {spot.average_cost && (
                            <span className="ml-2 text-xs border-l border-white/20 pl-2">
                                ¥{spot.average_cost.toLocaleString()}~
                            </span>
                        )}
                    </div>
                    {distance && (
                        <span className="text-xs font-medium bg-white/5 px-2 py-0.5 rounded text-primary">
                            {distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`}
                        </span>
                    )}
                </div>

                {/* Payment Icons */}
                {spot.payment_methods && spot.payment_methods.length > 0 && (
                    <div className="mt-2 flex gap-1.5 opacity-80">
                        {spot.payment_methods.includes('cash') && <div title="現金"><Banknote className="h-3.5 w-3.5 text-muted-foreground" /></div>}
                        {spot.payment_methods.includes('credit_card') && <div title="クレジットカード"><CreditCard className="h-3.5 w-3.5 text-muted-foreground" /></div>}
                        {spot.payment_methods.includes('electronic_money') && <div title="電子マネー"><Smartphone className="h-3.5 w-3.5 text-muted-foreground" /></div>}
                        {spot.payment_methods.includes('qr_code') && <div title="QR決済"><QrCode className="h-3.5 w-3.5 text-muted-foreground" /></div>}
                    </div>
                )}

                <div className="mt-3 flex flex-wrap gap-1">
                    {spot.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
