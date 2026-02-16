import { SpotCard } from "@/components/ui/SpotCard";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { session } } = await supabase.auth.getSession();
  const { data: spots } = await supabase.from("spots").select("*").limit(3);

  const favoriteIds = new Set<string>();
  if (session) {
    const { data: favorites } = await supabase
      .from("favorites")
      .select("spot_id")
      .eq("user_id", session.user.id);

    favorites?.forEach(f => favoriteIds.add(f.spot_id));
  }

  return (
    <div className="flex flex-col">
      <HeroSection />

      {/* Featured Spots Section */}

      {/* Featured Spots Section */}
      <section className="container py-12 md:py-24 lg:py-32">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">注目の隠れ家</h2>
          <Link href="/explore" className="text-sm font-medium text-primary hover:underline">
            すべて見る
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {spots?.map((spot) => (
            <SpotCard
              key={spot.id}
              spot={spot as any}
              isLoggedIn={!!session}
              isFavorite={favoriteIds.has(spot.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
