import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { env } from '@/data/env/server'
import { createUserSubscription, getUserSubscription } from '@/server/db/subscription'
import { deleteUser } from '@/server/db/users'
import {Stripe} from "stripe"

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
    const headerPayload = await headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET)

  let event: WebhookEvent

  // Verify payload with headers
  try {
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  switch(event.type){
    case "user.created": {
      try {
        const clerkUserId = event.data.id;
        if (!clerkUserId) {
          console.error("Invalid user ID in user.created event");
          break;
        }
        console.log("New User",clerkUserId)
        await createUserSubscription({ clerkUserId, tier: "Free" });
        console.log(`Free tier assigned to user: ${clerkUserId}`);
      } catch (error) {
        console.error("Error assigning free tier:", error);
      }
      break;
    }
    case "user.deleted": {
      //console.log(event.data);
      if (event.data.id != null) {
        const UserSubscription = await getUserSubscription(event.data.id);
        if (UserSubscription?.stripeSubscriptionId != null) {
          await stripe.subscriptions.cancel(UserSubscription?.stripeSubscriptionId);
        }
    
        await deleteUser(event.data.id);
      }
      break;
    }
  }

  return new Response('Webhook received', { status: 200 })
}