"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
    return (
        <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-background pt-16">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/images/hero-bg.webp"
                    alt="Ibaraki Hidden Gem"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                <motion.div
                    animate={{
                        opacity: [0.1, 0.3, 0.1],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[100px]"
                />
            </div>

            <div className="container relative z-10 flex flex-col items-center gap-6 px-4 text-center md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary backdrop-blur-sm"
                >
                    <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                    イバクレで茨城の隠れ家スポットを発見しよう
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60"
                >
                    見つけよう、茨城の <br className="hidden sm:inline" />
                    <span className="text-primary text-glow">知られざる名店を</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8"
                >
                    ガイドブックには載っていない、<br className="hidden sm:inline" />
                    茨城の「本物」の魅力を体験してください。
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="flex flex-col gap-4 sm:flex-row mt-4"
                >
                    <Link
                        href="/explore"
                        className="group inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        今すぐ探す
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                        href="/match"
                        className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-8 text-sm font-medium shadow-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        感覚で選ぶ (Match)
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
