import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
    apiVersion: '2024-11-20.acacia',
}) : null;

/**
 * Create a Stripe Checkout Session for an experience or reservation
 */
export async function createCheckoutSession(params: {
    experienceId: string;
    experienceName: string;
    priceInCents: number;
    merchantId: string;
    successUrl: string;
    cancelUrl: string;
}): Promise<string | null> {
    if (!stripe) {
        console.error('[STRIPE] Stripe not configured');
        return null;
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: params.experienceName,
                            description: `Réservation via Assisi Concierge`,
                        },
                        unit_amount: params.priceInCents,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: params.successUrl,
            cancel_url: params.cancelUrl,
            metadata: {
                experienceId: params.experienceId,
                merchantId: params.merchantId,
                source: 'assisi_concierge',
            },
        });

        console.log(`[STRIPE] Checkout session created: ${session.id}`);
        return session.url;

    } catch (error) {
        console.error('[STRIPE] Error creating checkout session:', error);
        return null;
    }
}

/**
 * Verify Stripe webhook signature
 */
export function verifyWebhookSignature(
    payload: string | Buffer,
    signature: string,
    webhookSecret: string
): Stripe.Event | null {
    if (!stripe) return null;

    try {
        return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error) {
        console.error('[STRIPE] Webhook signature verification failed:', error);
        return null;
    }
}
