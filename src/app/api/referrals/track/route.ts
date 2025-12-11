
import { NextRequest, NextResponse } from 'next/server';
import { verifySignature, trackReferral } from '@/lib/commission';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { merchantId, userId, signature, amount } = body;

        if (!merchantId || !userId || !signature) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        // 1. Verify Security
        const isValid = verifySignature(merchantId, userId, signature);
        if (!isValid) {
            console.warn(`Invalid signature attempt: ${merchantId} / ${userId}`);
            return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
        }

        // 2. Track in DB
        const result = await trackReferral(merchantId, userId, amount || 0);

        if (result.error) {
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        return NextResponse.json({ success: true, id: result.data.id });

    } catch (error) {
        console.error('Track API Error:', error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
