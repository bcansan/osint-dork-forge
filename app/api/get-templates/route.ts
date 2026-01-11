import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getDorkUser } from '@/lib/db';

export async function GET() {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const dbUser = await getDorkUser(clerkId);
        if (!dbUser) return NextResponse.json({ templates: [] });

        const { data, error } = await supabaseAdmin
            .from('dork_templates')
            .select('*')
            .eq('user_id', dbUser.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ templates: data || [] });
    } catch (error) {
        console.error('Error fetching templates:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
