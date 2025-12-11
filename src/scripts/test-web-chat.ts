import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Mock Concierge Service call directly or via fetch if server running.
// Since server might not be running in this context, we import the service directly.
// But Service uses 'v1' imports, so we need to run with 'tsx'.

async function testWebChat() {
    console.log('🌐 Testing Web Chat Logic & Multilingual Support...\n');

    // Dynamic import to load env vars first
    const { ConciergeService } = await import('../services/concierge');

    // Scenario 1: English - General Question
    console.log('--- Test 1: English (General) ---');
    const res1 = await ConciergeService.processRequest("Where can I eat?", "test-web", "en");
    console.log(`Intent: ${res1.intent}`);
    console.log(`Response: ${res1.text.substring(0, 50)}...`);
    if (res1.text.includes("Here are 3 recommended")) console.log('✅ PASS');
    else console.log('❌ FAIL');

    // Scenario 2: Italian - Crowd
    console.log('\n--- Test 2: Italian (Crowd) ---');
    const res2 = await ConciergeService.processRequest("c'è gente?", "test-web", "it");
    console.log(`Intent: ${res2.intent}`);
    console.log(`Response: ${res2.text.substring(0, 50)}...`);
    if (res2.text.includes("Previsione Affluenza") || res2.text.includes("Livello")) console.log('✅ PASS');
    else console.log('❌ FAIL');

    // Scenario 3: French - Audio
    console.log('\n--- Test 3: French (Audio Guide) ---');
    const res3 = await ConciergeService.processRequest("Je veux un audio guide", "test-web", "fr");
    console.log(`Intent: ${res3.intent}`);
    console.log(`Has Audio: ${!!res3.audio}`);
    if (res3.audio && res3.audio.length > 0) console.log('✅ PASS');
    else console.log('❌ FAIL');
}

testWebChat();
