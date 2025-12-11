import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramMessage, getTelegramFileUrl, bot } from '@/lib/telegram';
import { analyzeImage } from '@/lib/openai';
import { ConciergeService } from '@/services/concierge';

export async function POST(req: NextRequest) {
    try {
        const update = await req.json();

        // Check if it's a message
        if (!update.message) {
            return NextResponse.json({ ok: true });
        }

        const chatId = update.message.chat.id;
        const languageCode = update.message.from?.language_code || 'fr'; // Detect User Language

        // 1. Handle Photos (Vision API) 👁️
        // Note: Vision logic is still specific to Telegram structure, keeping it here for now
        // or moving to service later if Web App supports image upload.
        if (update.message.photo) {
            const photos = update.message.photo;
            const largestPhoto = photos[photos.length - 1];
            await sendTelegramMessage(chatId, "🧐 J'analyse votre photo... (Vision IA)");
            const imageUrl = await getTelegramFileUrl(largestPhoto.file_id);

            if (imageUrl) {
                const analysis = await analyzeImage(imageUrl);
                await sendTelegramMessage(chatId, `👁️ **Analyse IA :**\n\n${analysis}`);
            }
            return NextResponse.json({ ok: true });
        }

        // 2. Handle Text via Concierge Service
        if (update.message.text) {
            const text = update.message.text;

            // Delegate to Brain 🧠
            const response = await ConciergeService.processRequest(text, chatId.toString(), languageCode);

            // Send Audio if present
            if (response.intent === 'audio' && response.audio && bot) {
                await sendTelegramMessage(chatId, "🎙️ " + response.text); // "Recording..."
                await bot.telegram.sendVoice(chatId, { source: response.audio, filename: 'audioguide.mp3' });
            } else {
                // Send Text
                await sendTelegramMessage(chatId, response.text);
            }
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Error in webhook:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
