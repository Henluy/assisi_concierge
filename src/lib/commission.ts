
import crypto from 'crypto';
import { supabase } from './supabase';

const SECRET = process.env.COMMISSION_HMAC_SECRET || 'dev-secret-do-not-use-in-prod';

export const signParams = (merchantId: string, userId: string = 'anon'): string => {
    const data = `${merchantId}:${userId}`;
    return crypto.createHmac('sha256', SECRET).update(data).digest('hex');
};

export const verifySignature = (merchantId: string, userId: string, signature: string): boolean => {
    const expected = signParams(merchantId, userId);
    return signature === expected;
};

export const generateTrackingLink = (baseUrl: string, merchantId: string, userId: string = 'anon') => {
    const signature = signParams(merchantId, userId);
    return `${baseUrl}?ref=${merchantId}&uid=${userId}&sig=${signature}`;
};

export const trackReferral = async (merchantId: string, userId: string, amount: number = 0) => {
    if (!supabase) return { error: 'Supabase not initialized' };

    const { data, error } = await supabase.from('referrals').insert({
        merchant_id: merchantId,
        user_id: userId,
        amount: amount,
        status: 'pending'
    }).select().single();

    if (error) {
        console.error('Error tracking referral:', error);
        return { error };
    }
    return { data };
};
