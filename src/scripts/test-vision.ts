import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Image: Basilica of Saint Francis of Assisi (Unsplash)
const TEST_IMAGE_URL = 'https://images.unsplash.com/photo-1596825205418-723456ba88f9';

async function testVision() {
    console.log('👁️ Testing Vision API...');

    // Dynamic import to ensure env vars are loaded first
    const { analyzeImage } = await import('../lib/openai');

    console.log(`Image: ${TEST_IMAGE_URL}\n`);

    // Check key again just to be sure
    if (!process.env.OPENAI_API_KEY) {
        console.error("❌ OPENAI_API_KEY is missing in process.env!");
    } else {
        console.log("✅ OPENAI_API_KEY is present.");
    }

    const start = Date.now();
    const result = await analyzeImage(TEST_IMAGE_URL);
    const duration = (Date.now() - start) / 1000;

    console.log('\n--- Analysis Result ---\n');
    console.log(result);
    console.log(`\n-----------------------\n(Duration: ${duration}s)`);
}

testVision();
