
import { NextRequest, NextResponse } from 'next/server';
import { searchPlaces } from '@/lib/google-places';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const keyword = searchParams.get('keyword') || undefined;

    if (!type) {
        return NextResponse.json({ error: 'Missing type parameter' }, { status: 400 });
    }

    const results = await searchPlaces(type, keyword);

    if (results) {
        return NextResponse.json({ data: results });
    } else {
        // Fallback for demo when API key is missing or quota exceeded
        // In real app, might return 503 or static JSON
        return NextResponse.json({ warning: 'Using fallback data', data: [] }, { status: 200 });
    }
}
