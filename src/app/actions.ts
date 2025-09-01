'use server';

import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createCheckoutSession() {
  const headersList = headers();
  const origin = headersList.get('origin');

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Donation',
              description: 'Support HealthCheckApp',
            },
            unit_amount: 500, // $5.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/?success=true`,
      cancel_url: `${origin}/?canceled=true`,
    });

    if (session.url) {
      redirect(session.url);
    } else {
        throw new Error('Could not create Stripe checkout session');
    }
  } catch (err) {
    console.error(err);
    // In a real app, you'd want to handle this error more gracefully
    throw new Error('Could not create Stripe checkout session');
  }
}
