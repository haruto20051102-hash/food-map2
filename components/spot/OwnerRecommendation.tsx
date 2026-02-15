import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

interface OwnerRecommendationProps {
    spotId: string;
}

export async function OwnerRecommendation({ spotId }: OwnerRecommendationProps) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Fetch recommendations where source_spot_id is this spot
    const { data: recommendations } = await supabase
        .from("spot_recommendations")
        .select(`
            id,
            comment,
            target_spot:target_spot_id (
                id,
                name,
                type,
                images,
                location
            )
        `)
        .eq("source_spot_id", spotId);

    if (!recommendations || recommendations.length === 0) {
        return null;
    }

    return (
        <div className="mt-12 border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="bg-primary/20 text-primary p-2 rounded-lg">
                    <Quote className="h-5 w-5 fill-current" />
                </span>
                Owner's Recommendation
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
                {recommendations.map((rec: any) => (
                    <div key={rec.id} className="relative group overflow-hidden rounded-xl border border-white/10 bg-card/50 backdrop-blur-sm shadow-lg hover:border-primary/50 transition-colors">
                        {/* Comment Section */}
                        <div className="p-6 pb-20">
                            <div className="relative z-10">
                                <Quote className="h-8 w-8 text-primary/20 absolute -top-2 -left-2 transform -scale-x-100" />
                                <p className="text-lg italic text-muted-foreground pl-6 pt-2 leading-relaxed">
                                    "{rec.comment || "Check this place out!"}"
                                </p>
                            </div>
                        </div>

                        {/* Target Spot Preview (Clickable) */}
                        <Link href={`/spots/${rec.target_spot.id}`} className="absolute bottom-0 left-0 right-0 h-[80px] bg-muted/20 hover:bg-muted/30 transition-colors border-t border-white/5 flex items-center px-4 group-hover:h-[90px] duration-300">
                            {rec.target_spot.images && rec.target_spot.images[0] && (
                                <img
                                    src={rec.target_spot.images[0]}
                                    alt={rec.target_spot.name}
                                    className="h-12 w-12 rounded-full object-cover border border-white/20 mr-4"
                                />
                            )}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-foreground truncate">{rec.target_spot.name}</h4>
                                <p className="text-xs text-muted-foreground truncate">{rec.target_spot.type} • {rec.target_spot.location}</p>
                            </div>
                            <div className="bg-primary h-8 w-8 rounded-full flex items-center justify-center text-primary-foreground transform group-hover:translate-x-1 transition-transform">
                                <ArrowRight className="h-4 w-4" />
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
