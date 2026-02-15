"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContact } from "@/lib/actions";
import { Loader2, CheckCircle } from "lucide-react";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);

        try {
            await submitContact(formData);
            setIsSuccess(true);
        } catch (error) {
            alert("送信に失敗しました。後ほど再度お試しください。");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isSuccess) {
        return (
            <div className="container py-20 px-4 md:px-6 flex flex-col items-center justify-center text-center">
                <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 text-green-500">
                    <CheckCircle className="h-10 w-10" />
                </div>
                <h1 className="text-3xl font-bold mb-4">送信完了</h1>
                <p className="text-muted-foreground mb-8 max-w-md">
                    お問い合わせありがとうございます。<br />
                    内容を確認の上、担当者よりご連絡させていただきます。
                </p>
                <Button onClick={() => setIsSuccess(false)} variant="outline">
                    フォームに戻る
                </Button>
            </div>
        );
    }

    return (
        <div className="container py-12 px-4 md:px-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tight mb-6 text-center">お問い合わせ</h1>
                <p className="text-muted-foreground text-center mb-8">
                    ご質問、ご要望、バグ報告などがございましたら、<br />
                    以下のフォームよりお気軽にお問い合わせください。
                </p>

                <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border p-6 rounded-xl shadow-sm">
                    <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-medium">お名前</label>
                        <Input id="name" name="name" placeholder="山田 太郎" required />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="email" className="text-sm font-medium">メールアドレス</label>
                        <Input id="email" name="email" type="email" placeholder="example@email.com" required />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="subject" className="text-sm font-medium">件名</label>
                        <Input id="subject" name="subject" placeholder="お問い合わせ内容の概要" required />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="message" className="text-sm font-medium">お問い合わせ内容</label>
                        <Textarea
                            id="message"
                            name="message"
                            className="min-h-[120px]"
                            placeholder="詳細をご記入ください"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                送信中...
                            </>
                        ) : (
                            "送信する"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
