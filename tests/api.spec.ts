
import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {

    test('GET /api/places/search should return results structure', async ({ request }) => {
        const response = await request.get('/api/places/search?type=restaurant');
        expect(response.ok()).toBeTruthy();
        const json = await response.json();
        // Assuming fallback logic returns data array, empty or not
        expect(json).toHaveProperty('data');
        expect(Array.isArray(json.data)).toBeTruthy();
    });

    test('POST /api/referrals/track should require signature', async ({ request }) => {
        const response = await request.post('/api/referrals/track', {
            data: {
                merchantId: 'test',
                userId: 'test',
                // Missing signature
            }
        });
        // Should fail with 400 or 403
        expect(response.status()).toBeGreaterThanOrEqual(400);
    });

});
