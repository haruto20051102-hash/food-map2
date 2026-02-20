import Link from "next/link";
import { Wine } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full border-t border-white/5 bg-background py-12 md:py-16 lg:py-20">
            <div className="container px-4 md:px-6">
                <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Wine className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold tracking-tight text-foreground">
                                Hidden<span className="text-primary">Gems</span>
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Discovering the city's best kept secrets, one bite at a time.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-semibold text-foreground">Discover</h3>
                        <Link href="/explore" className="text-sm text-muted-foreground hover:text-primary">
                            Restaurants
                        </Link>
                        <Link href="/explore?type=bar" className="text-sm text-muted-foreground hover:text-primary">
                            Bars
                        </Link>
                        <Link href="/explore?type=cafe" className="text-sm text-muted-foreground hover:text-primary">
                            Cafes
                        </Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-semibold text-foreground">Company</h3>
                        <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                            About Us
                        </Link>
                        <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                            Contact
                        </Link>
                        <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                            利用規約
                        </Link>
                        <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                            プライバシーポリシー
                        </Link>
                        <Link href="/law" className="text-sm text-muted-foreground hover:text-primary">
                            特定商取引法に基づく表記
                        </Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-semibold text-foreground">Social</h3>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                            Instagram
                        </Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                            Twitter
                        </Link>
                    </div>
                </div>
                <div className="mt-10 border-t border-white/5 pt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-xs text-muted-foreground">
                        &copy; 2024 Hidden Gems. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
