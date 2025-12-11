import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage } from '@/lib/openai';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { imageUrl } = body;

        if (!imageUrl) {
            return NextResponse.json({ error: 'Missing imageUrl' }, { status: 400 });
        }

        const analysis = await analyzeImage(imageUrl);

        return NextResponse.json({ analysis });
    } catch (error) {
        console.error('Vision API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
