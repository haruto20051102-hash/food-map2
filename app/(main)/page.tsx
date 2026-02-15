import { SpotCard } from "@/components/ui/SpotCard";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-background pt-16">
        {/* Background Gradient/Image placeholder */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

        <div className="container relative z-10 flex flex-col items-center gap-6 px-4 text-center md:px-6">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            茨城の隠れ家スポットを発見しよう
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            見つけよう、茨城の <br className="hidden sm:inline" />
            <span className="text-primary text-glow">知られざる名店を</span>
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            ガイドブックには載っていない、<br className="hidden sm:inline" />
            茨城の「本物」の魅力を体験してください。
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/explore"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              今すぐ探す
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background/50 backdrop-blur-sm px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              詳しく見る
            </Link>
          </div>
        </div>
      </section>

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
