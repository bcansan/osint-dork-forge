import { supabaseAdmin } from './supabase';

export async function getDorkUser(clerkId: string) {
    const { data, error } = await supabaseAdmin
        .from('dork_users')
        .select('*')
        .eq('clerk_id', clerkId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
}

export async function createDorkUser(clerkId: string, email: string) {
    const { data, error } = await supabaseAdmin
        .from('dork_users')
        .insert({
            clerk_id: clerkId,
            email: email,
            tier: 'free',
            usage_count: 0,
            usage_limit: 3
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function incrementDorkUsage(userId: string) {
    // Current period check logic could go here, but for now simple increment
    const { data, error } = await supabaseAdmin
        .rpc('increment_dork_usage', { user_id_param: userId });

    if (error) {
        // Fallback to update if RPC doesn't exist
        const { data: userData, error: fetchError } = await supabaseAdmin
            .from('dork_users')
            .select('usage_count')
            .eq('id', userId)
            .single();

        if (fetchError) throw fetchError;

        const { data: updatedData, error: updateError } = await supabaseAdmin
            .from('dork_users')
            .update({
                usage_count: (userData.usage_count || 0) + 1
            })
            .eq('id', userId)
            .select()
            .single();

        if (updateError) throw updateError;
        return updatedData;
    }

    return data;
}

export async function logDorkUsage(
    userId: string,
    action: string,
    success: boolean,
    details?: any
) {
    const { error } = await supabaseAdmin
        .from('dork_usage_logs')
        .insert({
            user_id: userId,
            action,
            success,
            details
        });

    if (error) throw error;
}

export async function isDorkAdmin(email: string): Promise<boolean> {
    const { data, error } = await supabaseAdmin
        .from('dork_admin_emails')
        .select('email')
        .eq('email', email)
        .single();

    return !error && !!data;
}

export async function updateDorkUserTier(
    userId: string,
    tier: 'free' | 'pro' | 'developer',
    limit: number
) {
    const { error } = await supabaseAdmin
        .from('dork_users')
        .update({
            tier,
            usage_limit: limit,
            usage_count: 0,
            period_start: new Date().toISOString(),
            period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', userId);

    if (error) throw error;
}
