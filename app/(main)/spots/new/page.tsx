"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSpot } from "@/lib/actions";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle } from "lucide-react";
import SpotForm from "@/components/ui/SpotForm";

export default function NewSpotPage() {
    const [step, setStep] = useState<"form" | "payment" | "success">("form");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login?next=/spots/new");
            }
            setIsLoading(false);
        };
        checkUser();
    }, [router, supabase]);

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        setIsSubmitting(true);

        // Simulate Payment Processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const result = await createSpot(formData);

            if (result.checkoutUrl) {
                // Redirect to Stripe Checkout
                window.location.href = result.checkoutUrl;
            } else {
                // Fallback (should not happen with new logic)
                setStep("success");
            }
        } catch (error) {
            console.error("Error creating spot:", error);
            alert("エラーが発生しました。もう一度お試しください。");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (step === "success") {
        return (
            <div className="container py-20 flex flex-col items-center justify-center text-center">
                <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 text-green-500">
                    <CheckCircle className="h-10 w-10" />
                </div>
                <h1 className="text-3xl font-bold mb-2">決済が完了しました！</h1>
                <p className="text-muted-foreground mb-8">
                    スポットの掲載登録が完了しました。¥6,000のお支払いをありがとうございます。
                </p>
                <button
                    onClick={() => router.push("/explore")}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90"
                >
                    掲載リストを見る
                </button>
            </div>
        );
    }

    return (
        <div className="container max-w-2xl py-12 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">お店を掲載する</h1>
                <p className="text-muted-foreground mt-2">
                    あなたのお店や、とっておきの隠れ家をコミュニティにシェアしましょう。
                </p>
                <div className="bg-muted p-4 rounded-lg mb-6 text-sm text-center">
                    <span className="block mt-1 font-medium text-primary">掲載料: ¥6,000 (年間)</span>
                </div>
            </div>

            <SpotForm />
        </div>
    );
}
