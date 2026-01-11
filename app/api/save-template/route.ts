import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getDorkUser } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const dbUser = await getDorkUser(clerkId);
        if (!dbUser || (dbUser.tier !== 'pro' && dbUser.tier !== 'developer')) {
            return NextResponse.json({ error: 'Pro feature only' }, { status: 403 });
        }

        const template = await req.json();
        const { data, error } = await supabaseAdmin
            .from('dork_templates')
            .insert({
                user_id: dbUser.id,
                name: template.name,
                content: template.content,
                platform: template.platform,
                category: template.category,
                parameters: template.parameters
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error saving template:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
