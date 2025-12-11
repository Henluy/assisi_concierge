
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
    // In a real app, we would check session/auth here.
    // For MVP demo, we'll accept a 'merchantId' query param.
    const { searchParams } = new URL(req.url);
    const merchantId = searchParams.get('merchantId');

    if (!merchantId || !supabase) {
        return NextResponse.json({ error: 'Auth required' }, { status: 401 });
    }

    // Parallel queries
    const [referrals, totalRevenue] = await Promise.all([
        supabase.from('referrals').select('*').eq('merchant_id', merchantId).order('created_at', { ascending: false }).limit(10),
        supabase.from('referrals').select('amount').eq('merchant_id', merchantId) // Sum not directly supported in JS client easily without Rpc, doing client side for MVP or use .select w/ count
    ]);

    const revenue = (totalRevenue.data || []).reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const count = totalRevenue.data?.length || 0;

    return NextResponse.json({
        stats: {
            revenue,
            referrals: count,
            conversionRate: "12%" // Mocked for now
        },
        recentActivity: referrals.data || []
    });
}
