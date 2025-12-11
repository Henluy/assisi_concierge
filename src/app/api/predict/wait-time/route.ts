import { NextRequest, NextResponse } from 'next/server';
import { predictCrowdLevel } from '@/lib/prediction';

export async function GET(req: NextRequest) {
    try {
        // In a real scenario, we might use searchParams.get('placeId') to customize
        // prediction based on specific place popularity data.
        // For MVP heuristic, we use a global model.

        const prediction = predictCrowdLevel();

        return NextResponse.json(prediction);
    } catch (error) {
        console.error('Prediction API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
