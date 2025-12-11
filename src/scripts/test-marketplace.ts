import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testMarketplace() {
    console.log('🎟️ Testing Experience Marketplace...\n');

    // Dynamic import to load env vars first
    const { ConciergeService } = await import('../services/concierge');

    // Scenario 1: Ask for activities
    console.log('--- Test 1: Ask for activities ---');
    const input = "Je veux faire des activités ou une dégustation";
    const res = await ConciergeService.processRequest(input, "test-market", "fr");

    console.log(`Input: "${input}"`);
    console.log(`Intent: ${res.intent}`);
    console.log(`Response Snippet: ${res.text.substring(0, 100)}...`);

    if (res.intent === 'experience' && res.text.includes('Dégustation')) {
        console.log('✅ PASS: Experiences recommended.');
    } else {
        console.log('❌ FAIL: Experience intent not detected.');
    }
}

testMarketplace();
