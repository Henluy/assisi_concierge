
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import places from '../data/places.json';
// Dynamic import to ensure process.env is populated before the lib is loaded
const main = async () => {
    // Import helper dynamically
    const { storeKnowledge } = await import('../lib/embeddings');

    console.log('🌱 Starting Knowledge Seeding...');

    // Warning: ensure SUPABASE_URL/KEY are loaded
    if (!process.env.SUPABASE_URL) {
        console.error('❌ Missing SUPABASE_URL');
        return;
    }

    let count = 0;
    for (const place of places) {
        // Create a rich text chunk description
        const content = `${place.type.toUpperCase()}: ${place.name}. ${place.description} 
        ${place.address ? `Adresse: ${place.address}.` : ''} 
        ${(place as any).rating ? `Note: ${(place as any).rating}/5.` : ''} 
        ${(place as any).secret_local ? `Conseil local: ${(place as any).secret_local}` : ''}`;

        console.log(`Processing: ${place.name}...`);

        await storeKnowledge(content, {
            id: place.id,
            name: place.name,
            type: place.type,
            coords: place.coords
        });
        count++;
    }

    console.log(`✅ Seeding complete! Processed ${count} items.`);
};

main();
