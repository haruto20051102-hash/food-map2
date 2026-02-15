"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(spotId: string) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("User not authenticated");
    }

    // Check if already favorited
    const { data: existing } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .eq("spot_id", spotId)
        .single();

    if (existing) {
        // Remove favorite
        await supabase.from("favorites").delete().eq("id", existing.id);
    } else {
        // Add favorite
        await supabase.from("favorites").insert({
            user_id: user.id,
            spot_id: spotId,
        });
    }

    revalidatePath("/favorites");
    revalidatePath(`/spots/${spotId}`);
    revalidatePath("/explore");
    revalidatePath("/explore");
}

export async function addToFavorites(spotId: string) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        // Return false or throw? For swipe interface, maybe just ignore or return false
        return { success: false, error: "Not authenticated" };
    }

    // Check if already favorited to avoid duplicates (though DB constraint might handle it)
    const { data: existing } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("spot_id", spotId)
        .single();

    if (!existing) {
        await supabase.from("favorites").insert({
            user_id: user.id,
            spot_id: spotId,
        });
        revalidatePath("/favorites");
        return { success: true };
    }

    return { success: true, alreadyExists: true };
}

export async function getIsFavorite(spotId: string) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { data } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .eq("spot_id", spotId)
        .single();

    return !!data;
}

export async function createSpot(formData: FormData) {
    console.log("createSpot action started");

    try {
        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);

        // Check auth
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: "You must be logged in to list a spot." };
        }

        const name = formData.get("name") as string;
        const type = formData.get("type") as string;
        const description = formData.get("description") as string;
        const location = formData.get("location") as string;
        const businessHours = formData.get("business_hours") as string;
        const openingTime = formData.get("opening_time") as string || null;
        const closingTime = formData.get("closing_time") as string || null;
        const regularHoliday = formData.get("regular_holiday") as string;

        // Handle Image Upload
        const imageFiles = formData.getAll("images") as File[];
        const imageUrls: string[] = [];

        for (const imageFile of imageFiles) {
            if (imageFile && imageFile.size > 0) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('spots')
                    .upload(fileName, imageFile);

                if (uploadError) {
                    console.error("Upload error details:", uploadError);
                    return { success: false, error: `Image upload failed: ${uploadError.message}` };
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('spots')
                    .getPublicUrl(fileName);

                imageUrls.push(publicUrl);
            }
        }

        // Default coordinates (Mito Station area) with slight randomization
        // Base: 36.3659, 140.4712
        const baseLat = 36.3659;
        const baseLng = 140.4712;

        // Check if lat/lng provided in form data
        const formLat = formData.get("lat") ? parseFloat(formData.get("lat") as string) : null;
        const formLng = formData.get("lng") ? parseFloat(formData.get("lng") as string) : null;

        // Use provided coords or fallback to random offset
        const lat = formLat || (baseLat + (Math.random() - 0.5) * 0.02);
        const lng = formLng || (baseLng + (Math.random() - 0.5) * 0.02);

        // Check for admin role
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        const isAdmin = profile?.role === 'admin';

        const { data: insertedSpot, error } = await supabase.from("spots").insert({
            name,
            type,
            description,
            location,
            lat,
            lng,
            images: imageUrls,
            business_hours: businessHours,
            opening_time: openingTime,
            closing_time: closingTime,
            regular_holiday: regularHoliday,
            user_id: user.id,
            listing_status: isAdmin ? 'active' : 'pending_payment',
            tags: ["New", type],
            rating: 0,
            is_hidden: !isAdmin // If admin, show immediately
        }).select().single();

        if (error) {
            console.error("Database insert error:", error);
            return { success: false, error: error.message };
        }

        // If Admin, skip stripe
        if (isAdmin) {
            revalidatePath("/spots/manage");
            revalidatePath("/explore");
            return { success: true, bypassedPayment: true };
        }

        const origin = (await headers()).get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

        if (!process.env.STRIPE_SECRET_KEY) {
            return { success: false, error: "Stripe secret key is not configured." };
        }

        const { stripe } = await import("@/lib/stripe");

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'jpy',
                        product_data: {
                            name: 'Food Map プレミアム掲載 (1年間)',
                            description: `${name} の掲載料 (年間プラン)`,
                        },
                        unit_amount: 6000,
                        recurring: {
                            interval: 'year',
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            subscription_data: {
                metadata: {
                    spotId: insertedSpot.id,
                    userId: user.id,
                },
            },
            success_url: `${origin}/spots/manage?success=true`,
            cancel_url: `${origin}/spots/manage?canceled=true`,
            metadata: {
                spotId: insertedSpot.id,
                userId: user.id,
            },
        });

        if (!session.url) {
            return { success: false, error: "Failed to create checkout session" };
        }

        return { success: true, checkoutUrl: session.url };

    } catch (error: unknown) {
        console.error("Unexpected error in createSpot:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        return { success: false, error: errorMessage };
    }
}

export async function cancelSpotListing(spotId: string) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Check for admin role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    const isAdmin = profile?.role === 'admin';

    // Verify ownership or admin status
    let query = supabase
        .from("spots")
        .update({ listing_status: 'cancelled', is_hidden: true })
        .eq("id", spotId);

    // If not admin, restrict to own spots
    if (!isAdmin) {
        query = query.eq("user_id", user.id);
    }

    // Get current subscription_id first
    const { data: spot } = await supabase
        .from("spots")
        .select("subscription_id, user_id")
        .eq("id", spotId)
        .single();

    if (!isAdmin && spot?.user_id !== user.id) {
        throw new Error("Unauthorized");
    }

    if (spot?.subscription_id) {
        try {
            // Import stripe instance

            const { stripe } = await import("@/lib/stripe");

            // Cancel at period end
            await stripe.subscriptions.update(spot.subscription_id, {
                cancel_at_period_end: true
            });
            await stripe.subscriptions.update(spot.subscription_id, {
                cancel_at_period_end: true
            });
        } catch (e) {
            console.error("Failed to cancel stripe subscription:", e);
            // Proceed to hide spot even if stripe fails
        }
    }

    const { error } = await query;

    if (error) throw error;
    revalidatePath("/spots/manage");
}

export async function updateSpot(spotId: string, formData: FormData) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const businessHours = formData.get("business_hours") as string;
    const openingTime = formData.get("opening_time") as string || null;
    const closingTime = formData.get("closing_time") as string || null;
    const regularHoliday = formData.get("regular_holiday") as string;

    // Handle Image Upload (new images)
    const imageFiles = formData.getAll("images") as File[];
    const newImageUrls: string[] = [];

    for (const imageFile of imageFiles) {
        if (imageFile && imageFile.size > 0) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('spots')
                .upload(fileName, imageFile);

            if (uploadError) {
                console.error("Upload error details:", uploadError);
                throw new Error(`Image upload failed: ${uploadError.message}`);
            }

            const { data: { publicUrl } } = supabase.storage
                .from('spots')
                .getPublicUrl(fileName);

            newImageUrls.push(publicUrl);
        }
    }

    // Get existing/remaining images from form data (sent as hidden inputs)
    // If user deleted an image in UI, it won't be in this list.
    const remainingExistingImages = formData.getAll("existing_images") as string[];

    // Combine remaining existing images with new ones.
    const updatedImages = [...remainingExistingImages, ...newImageUrls];

    const { error } = await supabase
        .from("spots")
        .update({
            name,
            type,
            description,
            location,
            business_hours: businessHours,
            opening_time: openingTime,
            closing_time: closingTime,
            regular_holiday: regularHoliday,
            images: updatedImages,
            // Update lat/lng if provided (re-geocoded)
            ...(formData.get("lat") && formData.get("lng") ? {
                lat: parseFloat(formData.get("lat") as string),
                lng: parseFloat(formData.get("lng") as string)
            } : {})
        })
        .eq("id", spotId)
        .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/spots/manage");
    revalidatePath(`/spots/${spotId}`);
    return { success: true };
}


export async function submitContact(formData: FormData) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    const { error } = await supabase.from("contacts").insert({
        name,
        email,
        subject,
        message,
        status: 'unread'
    });

    if (error) {
        console.error("Error submitting contact:", error);
        throw new Error("Failed to submit contact form");
    }

    return { success: true };
}

export async function toggleSpotStatus(spotId: string, isHidden: boolean) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Check ownership
    const { data: spot } = await supabase
        .from("spots")
        .select("user_id")
        .eq("id", spotId)
        .single();

    if (spot?.user_id !== user.id) {
        // Check if admin
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profile?.role !== 'admin') {
            throw new Error("Unauthorized");
        }
    }

    const { error } = await supabase
        .from("spots")
        .update({ is_hidden: isHidden })
        .eq("id", spotId);

    if (error) throw error;
    revalidatePath("/spots/manage");
    revalidatePath(`/spots/${spotId}`);
}

export async function toggleAutoRenewal(spotId: string, enable: boolean) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Get current subscription_id first
    const { data: spot } = await supabase
        .from("spots")
        .select("subscription_id, user_id")
        .eq("id", spotId)
        .single();

    if (spot?.user_id !== user.id) {
        // Check if admin
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profile?.role !== 'admin') {
            throw new Error("Unauthorized");
        }
    }

    if (spot?.subscription_id) {
        try {
            // Import stripe instance

            const { stripe } = await import("@/lib/stripe");

            // Update subscription cancellation
            await stripe.subscriptions.update(spot.subscription_id, {
                cancel_at_period_end: !enable
            });

            // Update local state
            await supabase
                .from("spots")
                .update({ is_auto_renewal: enable })
                .eq("id", spotId);



        } catch (e) {
            console.error("Failed to update stripe subscription:", e);
            throw new Error("Failed to update subscription status");
        }
    } else {
        throw new Error("No subscription found for this spot");
    }

    revalidatePath("/spots/manage");
}

export async function updateReviewRank(reviewId: string, rank: number | null) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    // specific rank (1, 2, 3) assignment logic
    if (rank !== null) {
        // 1. Check if another review already holds this rank for this user
        const { data: existingRankReview } = await supabase
            .from("reviews")
            .select("id")
            .eq("user_id", user.id)
            .eq("rank", rank)
            .single();

        // 2. If exists and it's not the same review, clear its rank (or could swap, but clearing is simpler)
        if (existingRankReview && existingRankReview.id !== reviewId) {
            await supabase
                .from("reviews")
                .update({ rank: null })
                .eq("id", existingRankReview.id);
        }
    }

    // 3. Update the target review
    const { error } = await supabase
        .from("reviews")
        .update({ rank: rank })
        .eq("id", reviewId)
        .eq("user_id", user.id);

    if (error) {
        console.error("Error updating review rank:", error);
        throw new Error("Failed to update rank");
    }

    revalidatePath("/profile");
    return { success: true };
}



