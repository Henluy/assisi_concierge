import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type');
    const next = searchParams.get('next') ?? '/dashboard';

    if (token_hash && type) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
        });

        if (!error) {
            return NextResponse.redirect(new URL(next, req.url));
        }
    }

    // Return to login on error
    return NextResponse.redirect(new URL('/dashboard/login?error=auth', req.url));
}
