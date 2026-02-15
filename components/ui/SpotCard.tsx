import Link from "next/link";
import { MapPin, Star } from "lucide-react";
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
                        <MapPin className="mr-1 h-3 w-3" />
                        <span className="truncate max-w-[150px]">{spot.location}</span>
                    </div>
                    {distance && (
                        <span className="text-xs font-medium bg-white/5 px-2 py-0.5 rounded text-primary">
                            {distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`}
                        </span>
                    )}
                </div>
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
