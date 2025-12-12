import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { experienceId } = body;

        if (!experienceId) {
            return NextResponse.json({ error: 'experienceId required' }, { status: 400 });
        }

        // Get experience details
        const { data: experience, error } = await supabase
            .from('experiences')
            .select('*, merchants(id, name)')
            .eq('id', experienceId)
            .single();

        if (error || !experience) {
            return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
        }

        // Create Stripe Checkout
        const checkoutUrl = await createCheckoutSession({
            experienceId: experience.id,
            experienceName: experience.title,
            priceInCents: Math.round(experience.price * 100),
            merchantId: experience.merchant_id || 'default',
            successUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://assisi-concierge.vercel.app'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://assisi-concierge.vercel.app'}/chat`,
        });

        if (!checkoutUrl) {
            return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
        }

        return NextResponse.json({ url: checkoutUrl });

    } catch (error) {
        console.error('Checkout API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
