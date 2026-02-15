"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
    session: any;
}

export function MobileMenu({ session }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <div className="md:hidden">
            <button
                onClick={toggleMenu}
                className="rounded-full bg-white/5 p-2 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="sr-only">メニュー</span>
            </button>

            {isOpen && (
                <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-white/10 p-4 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-5">
                    <nav className="flex flex-col gap-4">
                        <Link
                            href="/explore"
                            onClick={() => setIsOpen(false)}
                            className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground hover:text-glow px-2 py-1"
                        >
                            探索
                        </Link>
                        <Link
                            href="/spots/new"
                            onClick={() => setIsOpen(false)}
                            className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary hover:text-glow px-2 py-1 flex items-center gap-2"
                        >
                            <span className="font-bold text-sm">プレミアムプラン</span>
                            <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded leading-none">¥5,000/年</span>
                            お店を載せる
                        </Link>
                        <Link
                            href="/map"
                            onClick={() => setIsOpen(false)}
                            className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground hover:text-glow px-2 py-1"
                        >
                            マップ
                        </Link>
                        {session && (
                            <>
                                <Link
                                    href="/favorites"
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground hover:text-glow px-2 py-1"
                                >
                                    お気に入り
                                </Link>
                                <Link
                                    href="/spots/manage"
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground hover:text-glow px-2 py-1"
                                >
                                    掲載管理
                                </Link>
                            </>
                        )}
                        <Link
                            href="/about"
                            onClick={() => setIsOpen(false)}
                            className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground hover:text-glow px-2 py-1"
                        >
                            概要
                        </Link>
                    </nav>

                    <div className="h-px bg-white/10 my-2" />

                    <div className="flex flex-col gap-4">
                        <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground px-2 py-1 w-full text-left">
                            <Search className="h-5 w-5" />
                            <span>検索</span>
                        </button>

                        {session ? (
                            <div className="flex flex-col gap-4">
                                <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground px-2 py-1">
                                    <User className="h-5 w-5" />
                                    <span>プロフィール</span>
                                </Link>
                                <form action="/auth/signout" method="post" className="w-full">
                                    <button className="w-full rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                                        ログアウト
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                                ログイン
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
