
import { signParams, verifySignature, generateTrackingLink } from '../commission';

describe('Commission Logic', () => {
    const merchantId = 'test-merchant-id';
    const userId = 'user-123';

    it('should generate a consistent signature for the same inputs', () => {
        const sig1 = signParams(merchantId, userId);
        const sig2 = signParams(merchantId, userId);
        expect(sig1).toBe(sig2);
    });

    it('should verify a valid signature', () => {
        const signature = signParams(merchantId, userId);
        const isValid = verifySignature(merchantId, userId, signature);
        expect(isValid).toBe(true);
    });

    it('should reject an invalid signature', () => {
        const isValid = verifySignature(merchantId, userId, 'invalid_signature');
        expect(isValid).toBe(false);
    });

    it('should generate a correct tracking link', () => {
        const baseUrl = 'https://example.com';
        const link = generateTrackingLink(baseUrl, merchantId, userId);
        expect(link).toContain(baseUrl);
        expect(link).toContain(`ref=${merchantId}`);
        expect(link).toContain(`uid=${userId}`);
        expect(link).toContain('sig=');
    });
});
