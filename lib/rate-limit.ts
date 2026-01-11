import { redis, getDorkKey } from './redis';
import { getDorkUser, isDorkAdmin } from './db';

export async function checkDorkRateLimit(
    clerkUserId: string | null,
    email: string | null,
    ip: string
): Promise<{
    allowed: boolean;
    remaining: number;
    limit: number;
    tier: string;
    resetAt?: Date;
}> {
    // Check if admin
    if (email && await isDorkAdmin(email)) {
        return {
            allowed: true,
            remaining: Infinity,
            limit: Infinity,
            tier: 'developer'
        };
    }

    // Authenticated user
    if (clerkUserId) {
        try {
            const user = await getDorkUser(clerkUserId);

            // If user signed in but not in our DB yet, they have free tier (3 generations)
            if (!user) {
                return await checkIPLimit(ip, 3, 'free');
            }

            const limit = user.generations_limit || 3;
            const used = user.generations_used || 0;
            const remaining = Math.max(0, limit - used);

            return {
                allowed: remaining > 0,
                remaining,
                limit,
                tier: user.tier || 'free',
                resetAt: user.period_end ? new Date(user.period_end) : undefined
            };
        } catch (error) {
            console.error('Error checking user rate limit:', error);
            // Fallback to IP limit on DB error
            return await checkIPLimit(ip, 1, 'anonymous');
        }
    }

    // Default: Unauthenticated IP limit (1 per day as a safeguard/demo)
    return await checkIPLimit(ip, 1, 'anonymous');
}

async function checkIPLimit(ip: string, limit: number, tier: string) {
    if (!redis) {
        console.warn('Upstash Redis not configured. Rate limiting disabled.');
        return { allowed: true, remaining: limit, limit, tier };
    }

    const today = new Date().toISOString().split('T')[0];
    const key = getDorkKey(`ip:${ip}:${today}`);

    try {
        const count = await redis.incr(key);
        if (count === 1) {
            await redis.expire(key, 86400); // 24 hours
        }

        return {
            allowed: count <= limit,
            remaining: Math.max(0, limit - count),
            limit: limit,
            tier: tier,
            resetAt: new Date(new Date().setHours(24, 0, 0, 0))
        };
    } catch (error) {
        console.error('Redis error:', error);
        return { allowed: true, remaining: 0, limit, tier };
    }
}
