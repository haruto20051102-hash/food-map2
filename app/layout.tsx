import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Food Map | 隠れ家レストラン＆バー検索",
  description: "あなたの街の隠れた名店を見つけよう。Food Mapで最高のレストランとバーを探索。",
  openGraph: {
    title: "Food Map | 隠れ家レストラン＆バー検索",
    description: "あなたの街の隠れた名店を見つけよう。",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "Food Map | 隠れ家レストラン＆バー検索",
    description: "あなたの街の隠れた名店を見つけよう。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <LanguageProvider>
          <main className="min-h-screen">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
