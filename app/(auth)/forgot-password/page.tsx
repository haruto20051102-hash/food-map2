"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Loader2, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const supabase = createClient();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
            });

            if (error) throw error;

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Failed to send reset email.");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -z-10" />
                <div className="w-full max-w-md space-y-8 glass p-8 rounded-xl text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-4">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold">メールを送信しました</h2>
                    <p className="text-muted-foreground">
                        パスワード再設定用のリンクを {email} 宛に送信しました。メールをご確認ください。
                    </p>
                    <div className="mt-6">
                        <Link href="/login" className="text-primary hover:underline flex items-center justify-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            ログイン画面に戻る
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -z-10" />

            <div className="w-full max-w-md space-y-8 glass p-8 rounded-xl">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                        パスワードの再設定
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        ご登録のメールアドレスを入力してください。再設定用のリンクをお送りします。
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleReset}>
                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-md flex items-center gap-2 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}
                    <div>
                        <label htmlFor="email-address" className="sr-only">
                            メールアドレス
                        </label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="relative block w-full rounded-md border border-input bg-background/50 px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
                            placeholder="メールアドレス"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                "再設定メールを送信"
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center text-sm">
                    <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1">
                        <ArrowLeft className="h-3 w-3" />
                        ログイン画面に戻る
                    </Link>
                </div>
            </div>
        </div>
    );
}
