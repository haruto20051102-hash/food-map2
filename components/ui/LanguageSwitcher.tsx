"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
    const { locale, setLocale } = useLanguage();

    return (
        <div className="flex items-center">
            <button
                onClick={() => setLocale(locale === 'ja' ? 'en' : 'ja')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/10 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                aria-label="Switch Language"
            >
                <Globe className="h-4 w-4" />
                <span>{locale === 'ja' ? 'English' : '日本語'}</span>
            </button>
        </div>
    );
}
