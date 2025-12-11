import { NextRequest, NextResponse } from 'next/server';
import { ConciergeService } from '@/services/concierge';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, language = 'fr' } = body;

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Use a dummy chatId for web users (or generate a random session ID on client)
        // For MVP, we can just use "web-user".
        const response = await ConciergeService.processRequest(message, 'web-guest', language);

        // Convert Buffer to base64 if audio exists (NextResponse JSON cannot serialize Buffer directly)
        let audioBase64 = undefined;
        if (response.audio) {
            audioBase64 = response.audio.toString('base64');
        }

        return NextResponse.json({
            text: response.text,
            intent: response.intent,
            audio: audioBase64
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
