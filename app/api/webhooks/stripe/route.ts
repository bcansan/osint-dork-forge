import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { updateDorkUserTier } from '@/lib/db';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    if (!sig || !webhookSecret) {
        return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
    }

    try {
        const parts = sig.split(',');
        const timestampPart = parts.find((p) => p.startsWith('t='));
        const signaturePart = parts.find((p) => p.startsWith('v1='));

        if (!timestampPart || !signaturePart) throw new Error('Invalid signature format');

        const timestamp = timestampPart.split('=')[1];
        const signature = signaturePart.split('=')[1];
        const signedPayload = `${timestamp}.${body}`;

        const expectedSignature = createHmac('sha256', webhookSecret)
            .update(signedPayload)
            .digest('hex');

        const signatureBuffer = Buffer.from(signature);
        const expectedBuffer = Buffer.from(expectedSignature);

        if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
            throw new Error('Signature mismatch');
        }
    } catch (err: any) {
        console.error(`Webhook Signature Error: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const clerkId = session.metadata?.clerk_id;
        const project = session.metadata?.project;

        if (project === 'dork-forge' && clerkId) {
            const { data: userData } = await supabaseAdmin
                .from('dork_users')
                .select('id')
                .eq('clerk_id', clerkId)
                .single();

            if (userData) {
                await updateDorkUserTier(userData.id, 'pro', 100);
                console.log(`✅ User ${clerkId} (Dork Forge) upgraded to PRO`);
            }
        }
    }

    // Handle subscription deletion/cancellation
    if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object;
        const clerkId = subscription.metadata?.clerk_id;
        const project = subscription.metadata?.project;

        if (project === 'dork-forge' && clerkId) {
            const { data: userData } = await supabaseAdmin
                .from('dork_users')
                .select('id')
                .eq('clerk_id', clerkId)
                .single();

            if (userData) {
                await updateDorkUserTier(userData.id, 'free', 3);
                console.log(`❌ User ${clerkId} (Dork Forge) downgraded to FREE`);
            }
        }
    }

    return NextResponse.json({ received: true });
}
