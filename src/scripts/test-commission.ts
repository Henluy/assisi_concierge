
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { signParams, verifySignature } from '../lib/commission';

// Needs dynamic import like previous scripts if using database
// checks, but here we can mostly test logic and API mocking.

const BASE_URL = 'http://localhost:3000/api/referrals/track';

const runTests = async () => {
    console.log('🚀 Starting Commission System Tests...');

    const merchantId = 'test-merchant-123';
    const userId = 'user-456';
    const signature = signParams(merchantId, userId);

    // 1. Verify HMAC Logic locally
    console.log('\n1. Testing HMAC Logic...');
    const isValid = verifySignature(merchantId, userId, signature);
    console.log(`Signature Valid? ${isValid ? '✅' : '❌'}`);

    const isInvalid = verifySignature(merchantId, userId, 'hacked-signature');
    console.log(`Bad Signature Rejected? ${!isInvalid ? '✅' : '❌'}`);

    // 2. Test Tracking API (Mock call)
    console.log('\n2. Testing /api/referrals/trackEndpoint...');
    // Note: this fetch might fail if Supabase tables aren't set up perfectly or RLS blocks anon,
    // but the logic path is what we are testing.

    try {
        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                merchantId,
                userId,
                signature,
                amount: 50.00
            })
        });

        if (res.ok) {
            console.log('✅ Tracking Success (200 OK)');
            const json = await res.json();
            console.log('Response:', json);
        } else {
            const txt = await res.text();
            console.log(`⚠️ API returned ${res.status}: ${txt}`);
            console.log('(Might be expected if FK constraint fails on test-merchant-123)');
        }
    } catch (e) {
        console.error('API Call Failed', e);
    }

    console.log('\nTests completed.');
};

runTests();
