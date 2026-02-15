"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Locale } from '@/lib/translations';

type LanguageContextType = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: typeof translations.ja; // This might still be an issue if structures differ, but removing 'as const' helps.
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('ja');

    useEffect(() => {
        // Determine initial language from browser or local storage
        const savedLocale = localStorage.getItem('food-map-locale') as Locale;
        if (savedLocale && (savedLocale === 'ja' || savedLocale === 'en')) {
            setLocaleState(savedLocale);
        } else {
            const browserLang = navigator.language.startsWith('ja') ? 'ja' : 'en';
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setLocaleState(browserLang);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('food-map-locale', newLocale);
    };

    const t = translations[locale];

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
