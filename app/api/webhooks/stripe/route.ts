import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    // NOTE: This secret must be set in .env.local
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
        if (!signature || !webhookSecret) {
            console.error("Webhook Error: Top-level missing signature or secret");
            return new NextResponse("Webhook Secret missing", { status: 400 });
        }
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`❌ Webhook signature verification failed: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Initialize Supabase Admin Client (Service Role)
    // This bypasses RLS to update any spot
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        // Handle Payment Success for New Subscription
        if (session.mode === "subscription" && session.metadata?.spotId) {
            const spotId = session.metadata.spotId;

            // Retrieve subscription details to get accurate expiry
            const subscriptionId = session.subscription as string;
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const currentPeriodEnd = new Date((subscription as any).current_period_end * 1000);

            console.log(`Payment success for spot ${spotId}. activating listing...`);

            const { error } = await supabaseAdmin
                .from("spots")
                .update({
                    listing_status: 'active',
                    is_hidden: false,
                    subscription_expires_at: currentPeriodEnd.toISOString(),
                    subscription_id: subscriptionId,
                })
                .eq("id", spotId);

            if (error) {
                console.error('Error updating spot in Supabase:', error);
                return new NextResponse('Database update failed', { status: 500 });
            }
        }
    }
    else if (event.type === "invoice.payment_succeeded") {
        // Handle renewal payment
        const invoice = event.data.object as Stripe.Invoice;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscriptionId = (invoice as any).subscription as string;

        // Verify it's a subscription renewal
        if (subscriptionId && invoice.billing_reason === 'subscription_cycle') {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);

            // Get spotId from subscription metadata
            const spotId = subscription.metadata?.spotId;

            if (spotId) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const currentPeriodEnd = new Date((subscription as any).current_period_end * 1000);

                console.log(`Renewal payment received for subscription ${subscriptionId}, updating spot ${spotId}`);

                const { error } = await supabaseAdmin
                    .from("spots")
                    .update({
                        listing_status: 'active',
                        is_hidden: false,
                        subscription_expires_at: currentPeriodEnd.toISOString(),
                        subscription_id: subscriptionId,
                    })
                    .eq("id", spotId);

                if (error) {
                    console.error('Error updating spot on renewal:', error);
                }
            } else {
                console.warn(`No spotId found in subscription metadata for subscription ${subscriptionId}`);
            }
        }
    }

    return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
}
