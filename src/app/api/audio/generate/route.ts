import { NextRequest, NextResponse } from 'next/server';
import { generateSpeech } from '@/lib/openai';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { text } = body;

        if (!text) {
            return NextResponse.json({ error: 'Missing text' }, { status: 400 });
        }

        const audioBuffer = await generateSpeech(text);

        if (!audioBuffer) {
            return NextResponse.json({ error: 'Failed to generate audio' }, { status: 500 });
        }

        // Return audio as a stream/buffer
        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.length.toString(),
            },
        });
    } catch (error) {
        console.error('Audio API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
