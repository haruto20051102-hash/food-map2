import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DiaryForm } from "@/components/diary/DiaryForm"; // We'll create this client component
import { getSpots } from "@/lib/db";
import { getIsAdmin } from "@/lib/auth";

export default async function NewDiaryPage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        redirect("/login");
    }

    const isAdmin = await getIsAdmin();
    if (!isAdmin) {
        redirect("/");
    }

    // Fetch spots for the dropdown
    const spots = await getSpots();

    return (
        <div className="container max-w-2xl py-8 px-4 md:px-6 min-h-screen">
            <h1 className="text-3xl font-bold tracking-tight mb-8">店主リレーを書く</h1>
            <div className="bg-card border border-white/10 rounded-xl p-6 md:p-8">
                <DiaryForm spots={spots} />
            </div>
        </div>
    );
}
