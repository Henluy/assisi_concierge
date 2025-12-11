
const BASE_URL = 'http://localhost:3000/api/places/search';

const runTests = async () => {
    console.log('🚀 Starting Google Places API Tests...');

    // 1. First Call (Miss)
    console.log('\n1. Testing basic search (Restaurant)...');
    const start1 = Date.now();
    const res1 = await fetch(`${BASE_URL}?type=restaurant`);
    const end1 = Date.now();
    console.log(`Status: ${res1.status}, Time: ${end1 - start1}ms`);
    if (res1.ok) {
        const json = await res1.json();
        console.log(`Received: ${json.data?.length || 0} items`);
    } else {
        console.log('Request failed (expected if API Key invalid)');
    }

    // 2. Second Call (Should be fast if Supabase connected, or just checking rate limiter)
    console.log('\n2. Testing cache/rate limit...');
    const start2 = Date.now();
    const res2 = await fetch(`${BASE_URL}?type=restaurant`);
    const end2 = Date.now();
    console.log(`Status: ${res2.status}, Time: ${end2 - start2}ms`);

    console.log('\nTests completed.');
};

runTests();
