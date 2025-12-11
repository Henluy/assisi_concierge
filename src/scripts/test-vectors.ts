
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Dynamic import for environment variables
const runTests = async () => {
    const { searchKnowledge } = await import('../lib/embeddings');

    console.log('🚀 Starting Vector Search Tests...');

    // 1. Semantic Query (Eating Italian)
    console.log('\n1. Query: "Je veux manger italien"');
    const res1 = await searchKnowledge("Je veux manger italien");
    console.log(`Found ${res1.length} results.`);
    res1.forEach((r: any) => console.log(` - [${r.similarity.toFixed(4)}] ${r.metadata.name}`));

    // 2. Semantic Query (Peace/Quiet)
    console.log('\n2. Query: "Un endroit calme pour méditer"');
    const res2 = await searchKnowledge("Un endroit calme pour méditer");
    console.log(`Found ${res2.length} results.`);
    res2.forEach((r: any) => console.log(` - [${r.similarity.toFixed(4)}] ${r.metadata.name}`));

    // 3. Specific Detail (Giotto)
    console.log('\n3. Query: "Où voir des fresques ?"');
    const res3 = await searchKnowledge("Où voir des fresques ?");
    console.log(`Found ${res3.length} results.`);
    res3.forEach((r: any) => console.log(` - [${r.similarity.toFixed(4)}] ${r.metadata.name}`));

    console.log('\nTests completed.');
};

runTests();
