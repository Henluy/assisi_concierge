
import { Client, PlaceInputType } from '@googlemaps/google-maps-services-js';
import { supabase } from './supabase';
import { logAPI } from './logger';

const client = new Client({});
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Simple in-memory rate limiter
let requestCount = 0;
const MAX_REQUESTS_PER_MIN = 10;
setInterval(() => { requestCount = 0; }, 60000);

export const searchPlaces = async (type: string, keyword?: string) => {
    const ASSISI_COORDS = { lat: 43.0708, lng: 12.6198 };
    const cacheKey = `places:${type}:${keyword || 'any'}`;

    // 1. Check Cache (Supabase)
    if (supabase) {
        const { data } = await supabase
            .from('place_cache')
            .select('data, created_at')
            .eq('key', cacheKey)
            .single();

        if (data) {
            const agelimit = 24 * 60 * 60 * 1000; // 24 hours
            const isFresh = (new Date().getTime() - new Date(data.created_at).getTime()) < agelimit;
            if (isFresh) {
                logAPI('CACHE', `Hit for ${cacheKey}`, 0);
                return data.data;
            }
        }
    }

    // 2. Rate Limiting
    if (requestCount >= MAX_REQUESTS_PER_MIN) {
        console.warn('Rate limit reached. Falling back to static data.');
        return null; // Should trigger fallback handling
    }

    if (!API_KEY) {
        console.warn('Google Maps API Key missing.');
        return null;
    }

    // 3. Call Google API
    try {
        requestCount++;
        const response = await client.placesNearby({
            params: {
                location: ASSISI_COORDS,
                radius: 5000,
                type: type as any,
                keyword: keyword,
                key: API_KEY,
                language: 'fr' as any // Defaulting to FR for this demo, can be dynamic
            }
        });

        const results = response.data.results.slice(0, 3).map(p => ({
            name: p.name,
            address: p.vicinity,
            rating: p.rating,
            place_id: p.place_id,
            coords: p.geometry?.location
        }));

        logAPI('GOOGLE', `Search ${type} - ${results.length} results`, 0.03); // Approx cost

        // 4. Store in Cache
        if (supabase) {
            await supabase.from('place_cache').upsert({
                key: cacheKey,
                data: results,
                created_at: new Date().toISOString()
            });
        }

        return results;

    } catch (error) {
        console.error('Google Places API Error:', error);
        return null;
    }
};
