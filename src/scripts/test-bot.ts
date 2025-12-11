
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); // Load env for local test if needed (mostly for OpenAI key if logic uses it)

const WEBHOOK_URL = 'http://localhost:3000/api/bot/webhook';

// Mock Telegram Update object
const createMockUpdate = (text: string) => ({
    update_id: 123456789,
    message: {
        message_id: 1,
        from: { id: 999999, is_bot: false, first_name: 'Test', username: 'tester' },
        chat: { id: 999999, first_name: 'Test', username: 'tester', type: 'private' },
        date: Math.floor(Date.now() / 1000),
        text: text,
    },
});

const testScenarios = [
    { name: 'Intent: Mangiare', text: 'Dove mangiare a Assisi?' },
    { name: 'Intent: Pregare', text: 'Voglio pregare' },
    { name: 'Intent: Dormire', text: 'Dove dormire?' },
    { name: 'Intent: Crowd (Prediction)', text: 'Il y a du monde à la basilique ?' },
    { name: 'Intent: General (OpenAI)', text: 'Qui est Saint François?' },
];

const runTests = async () => {
    console.log('🚀 Starting Bot Logic Tests...');
    console.log(`Target: ${WEBHOOK_URL}\n`);

    // Note: Since the API aims to send a message via Telegram API, 
    // and we don't have a real running bot with valid token in this test environment usually,
    // the "sendTelegramMessage" might fail or log error if token is invalid or missing.
    // However, the API should still return 200 OK.

    for (const scenario of testScenarios) {
        console.log(`Testing: ${scenario.name}...`);
        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createMockUpdate(scenario.text)),
            });

            if (response.ok) {
                console.log(`✅ Success (Status: ${response.status})`);
            } else {
                console.error(`❌ Failed (Status: ${response.status})`);
                const text = await response.text();
                console.error('Response:', text);
            }
        } catch (error) {
            console.error(`❌ Error connecting to API:`, error);
            console.log("Make sure the Next.js server is running on localhost:3000");
        }
        console.log('---');
    }
    console.log('Tests completed.');
};

runTests();
