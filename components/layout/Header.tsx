"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MapPin, Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

export function Header() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const supabase = createClient();
    const { t } = useLanguage();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        // Check auth status
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);

            if (session?.user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", session.user.id)
                    .single();
                setIsAdmin(profile?.role === 'admin');
            } else {
                setIsAdmin(false);
            }
        };
        checkUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            subscription.unsubscribe();
        };
    }, [supabase.auth]);

    const navItems = [
        { name: t.nav.home, href: "/" },
        { name: t.nav.explore, href: "/explore" },
        { name: "マッチング", href: "/match" },
        { name: t.nav.favorites, href: "/favorites" }, // Protected route handled by middleware/page logic
        { name: "店主リレー", href: "/diary" },
        { name: "お問い合わせ", href: "/contact" },
    ];

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                isScrolled ? "bg-background/80 backdrop-blur-md border-white/10 py-3" : "bg-transparent py-5"
            )}
        >
            <div className="container px-4 md:px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                        <MapPin className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">イバクレ</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary relative py-1",
                                pathname === item.href
                                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:content-['']"
                                    : "text-muted-foreground"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <LanguageSwitcher />

                    {user ? (
                        <>
                            <Link href="/spots/manage" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                                {t.nav.manageSpots}
                            </Link>
                            <Link href="/profile">
                                <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-secondary/80 transition-colors">
                                    <User className="h-5 w-5" />
                                </div>
                            </Link>
                        </>
                    ) : (
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                {t.nav.login}
                            </Button>
                        </Link>
                    )}

                    <Link href="/spots/new">
                        <Button size="sm" className="shadow-lg shadow-primary/20 font-semibold bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-opacity">
                            {t.nav.listSpot}
                        </Button>
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    {/* Mobile menu button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        <span className="sr-only">Toggle mobile menu</span>
                    </Button>
                </div>
            </div>


            {/* Mobile Menu Overlay */}
            {
                isMobileMenuOpen && (
                    <div className="fixed inset-0 z-40 bg-background md:hidden flex flex-col pt-20 px-4 animate-in slide-in-from-top-10 fade-in duration-200">
                        <nav className="flex flex-col gap-6 text-lg">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "font-medium border-b border-borderpb-2 transition-colors",
                                        pathname === item.href ? "text-primary" : "text-muted-foreground"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            <div className="h-px bg-border my-2" />

                            <div className="flex flex-col gap-4">
                                {user ? (
                                    <>
                                        <Link
                                            href="/spots/manage"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            {t.nav.manageSpots}
                                        </Link>
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                                        >
                                            <User className="w-5 h-5" /> マイページ
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                                            {t.nav.login}
                                        </Button>
                                    </Link>
                                )}

                                <Link
                                    href="/spots/new"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Button className="w-full font-semibold bg-gradient-to-r from-primary to-blue-600">
                                        {t.nav.listSpot}
                                    </Button>
                                </Link>

                                <div className="pt-4 flex justify-center">
                                    <LanguageSwitcher />
                                </div>
                            </div>
                        </nav>
                    </div>
                )
            }
        </header >
    );
}
