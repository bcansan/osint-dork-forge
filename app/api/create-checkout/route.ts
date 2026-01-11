import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as any, // Use a stable version
});

export async function POST(req: NextRequest) {
    try {
        const { userId: clerkId } = await auth();
        const user = await currentUser();
        const email = user?.emailAddresses[0]?.emailAddress;

        if (!clerkId || !email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const priceId = process.env.STRIPE_DORK_PRICE_ID;
        if (!priceId) {
            return NextResponse.json({ error: 'Stripe Price ID not configured' }, { status: 500 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${req.nextUrl.origin}/?success=true`,
            cancel_url: `${req.nextUrl.origin}/pricing?canceled=true`,
            customer_email: email,
            client_reference_id: clerkId,
            metadata: {
                project: 'dork-forge',
                clerk_id: clerkId,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
