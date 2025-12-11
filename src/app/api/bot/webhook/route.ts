
import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramMessage } from '@/lib/telegram';
import { getChatMessage } from '@/lib/openai';
import { searchPlaces } from '@/lib/google-places';
import { searchKnowledge } from '@/lib/embeddings';
import { generateTrackingLink } from '@/lib/commission';
import places from '@/data/places.json';

// Simple types for our static data
type Place = {
    id: string;
    type: string;
    name: string;
    rating?: number;
    avg_price?: number;
    hours?: string;
    mass_schedule?: string[];
    description: string;
};

import { getTelegramFileUrl } from '@/lib/telegram';
import { analyzeImage } from '@/lib/openai';

// ... (existing imports)

export async function POST(req: NextRequest) {
    try {
        const update = await req.json();

        // Handle Photos (Vision API) 👁️
        if (update.message?.photo) {
            const chatId = update.message.chat.id;
            const photos = update.message.photo;
            // Get largest photo
            const largestPhoto = photos[photos.length - 1];

            // 1. Notify user
            await sendTelegramMessage(chatId, "🧐 J'analyse votre photo... (Vision IA)");

            // 2. Get File URL
            const imageUrl = await getTelegramFileUrl(largestPhoto.file_id);
            if (!imageUrl) {
                await sendTelegramMessage(chatId, "❌ Impossible de récupérer l'image.");
                return NextResponse.json({ ok: true });
            }

            // 3. Analyze with OpenAI Vision
            const analysis = await analyzeImage(imageUrl);

            // 4. Reply
            await sendTelegramMessage(chatId, `👁️ **Analyse IA :**\n\n${analysis}`);

            return NextResponse.json({ ok: true });
        }

        // Check if it's a message and has text
        if (!update.message || !update.message.text) {
            return NextResponse.json({ ok: true }); // Ignore non-text updates
        }

        const chatId = update.message.chat.id;
        const text = update.message.text.toLowerCase();

        let responseText = "";

        if (text.includes('mangiare')) {
            // Try live search first
            const liveData = await searchPlaces('restaurant');
            const dataToUse = (liveData && liveData.length > 0) ? liveData : places.filter(p => p.type === 'restaurant').slice(0, 3);

            responseText = "🍽 *Voici 3 restaurants recommandés à Assise :*\n\n";
            dataToUse.forEach((r: any) => {
                responseText += `• *${r.name}* (⭐${r.rating || 'N/A'})\n  _${r.address || r.description || ''}_\n\n`;
            });
        } else if (text.includes('pregare')) {
            const churches = places.filter(p => p.type === 'church').slice(0, 3);
            responseText = "🙏 *Lieux de prière et horaires des messes :*\n\n";
            churches.forEach(c => {
                responseText += `• *${c.name}*\n  _${c.description}_\n  🕒 Messes: ${(c.mass_schedule || []).join(', ')}\n\n`;
            });
        } else if (text.includes('dormire')) {
            const hotels = places.filter(p => p.type === 'hotel').slice(0, 3);
            responseText = "🛏 *Où dormir à Assise :*\n\n";
            hotels.forEach(h => {
                responseText += `• *${h.name}*\n  _${h.description}_\n  💶 Prix moyen: ${h.avg_price}€\n\n`;
            });
        } else {
            // Fallback: Vector Search + OpenAI
            // 1. Search Knowledge Base
            const knowledge = await searchKnowledge(update.message.text);
            let context = "";
            if (knowledge && knowledge.length > 0) {
                context = "Information pertinente trouvée dans la base de connaissances:\n" +
                    knowledge.map((k: any) => `- ${k.content}`).join("\n");
            }

            // 2. Call GPT with Context
            responseText = await getChatMessage(update.message.text, context);

            // Add general tracking footer for demo
            // In real world, we'd only add this if a specific merchant was recommended
            const trackLink = generateTrackingLink('https://assisi.ai/book', 'generic-merchant', chatId.toString());
            responseText += `\n\n🔗 [Réserver via AssisiConcierge](${trackLink})`;
        }

        // Send response back to Telegram
        await sendTelegramMessage(chatId, responseText);

        // For local testing logging
        console.log(`[BOT REPLIED] to ${chatId}: ${responseText.substring(0, 50)}...`);

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Error in webhook:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
