import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
    try {
        const payload = await req.text();
        const signature = req.headers.get('stripe-signature');

        if (!signature) {
            return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
        }

        const event = verifyWebhookSignature(payload, signature, webhookSecret);

        if (!event) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // Handle successful payment
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as any;
            const { experienceId, merchantId } = session.metadata || {};

            console.log(`[STRIPE] Payment completed for experience: ${experienceId}`);

            // Record the referral with 'paid' status
            if (merchantId) {
                await supabase.from('referrals').insert({
                    merchant_id: merchantId,
                    user_id: session.customer_email || 'anonymous',
                    amount: session.amount_total / 100,
                    status: 'paid',
                });
                console.log(`[STRIPE] Referral recorded for merchant: ${merchantId}`);
            }
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('Stripe Webhook Error:', error);
        return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
    }
}
