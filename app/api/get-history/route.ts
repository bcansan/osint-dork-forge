import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getDorkUser } from '@/lib/db';

export async function GET() {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const dbUser = await getDorkUser(clerkId);
        if (!dbUser || (dbUser.tier !== 'pro' && dbUser.tier !== 'developer')) {
            return NextResponse.json({ error: 'Pro feature only' }, { status: 403 });
        }

        const { data, error } = await supabaseAdmin
            .from('dork_usage_logs')
            .select('*')
            .eq('user_id', dbUser.id)
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) throw error;

        return NextResponse.json({ history: data || [] });
    } catch (error) {
        console.error('Error fetching history:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
