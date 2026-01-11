import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getDorkUser, isDorkAdmin } from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const { userId: clerkId } = await auth();
        const user = await currentUser();
        const email = user?.emailAddresses[0]?.emailAddress || null;

        if (!clerkId) {
            return NextResponse.json({ tier: 'free', usage_count: 0, usage_limit: 0 });
        }

        // Check if admin
        if (email && await isDorkAdmin(email)) {
            return NextResponse.json({
                tier: 'developer',
                usage_count: 0,
                usage_limit: Infinity,
                isAdmin: true
            });
        }

        const dbUser = await getDorkUser(clerkId);

        if (!dbUser) {
            return NextResponse.json({
                tier: 'free',
                usage_count: 0,
                usage_limit: 3
            });
        }

        return NextResponse.json({
            tier: dbUser.tier,
            usage_count: dbUser.usage_count,
            usage_limit: dbUser.usage_limit,
            period_end: dbUser.period_end
        });
    } catch (error) {
        console.error('Error checking subscription:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
