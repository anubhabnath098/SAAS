"use server"

import { paidTierNames, subscriptionTiers } from "@/data/subscriptionTiers"
import { getUserSubscription } from "@/server/db/subscription"
import { Stripe } from "stripe"
import { env as serverEnv } from "@/data/env/server"
import { env as clientEnv } from "@/data/env/client"


const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY)

export async function createCancelSession(userId:string | null | undefined) {

  if (userId == null || userId==undefined) return { error: true }

  const subscription = await getUserSubscription(userId)

  if (subscription == null) return { error: true }

  if (
    subscription.stripeCustomerId == null ||
    subscription.stripeSubscriptionId == null
  ) {
    return {error:true}
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
    flow_data: {
      type: "subscription_cancel",
      subscription_cancel: {
        subscription: subscription.stripeSubscriptionId,
      },
    },
  })

  return {url:portalSession.url}
}

export async function createCustomerPortalSession(userId:string | null | undefined) {

  if (userId == null || userId==undefined) return { error: true,  msg:"User Id appears to be not defined or null" }
  const subscription = await getUserSubscription(userId)
  if (subscription?.stripeCustomerId == null) {
    return { error: true, msg:"You need to buy a subscription to manage it" }
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
  })

  return{url:portalSession.url}
}

export async function createCheckoutSession(tier: paidTierNames, userEmail: string| undefined,userId:string|null | undefined) {
  if (userId == null || userId==undefined) return { error: true }

  const subscription = await getUserSubscription(userId)

  if (subscription == null) return { error: true }

  if (subscription.stripeCustomerId == null) {
    const url = await getCheckoutSession(tier, userEmail, userId)
    if (url == null) return { error: true }
    return {url}
  } else {
    const url = await getSubscriptionUpgradeSession(tier, subscription)
    return {url}
  }
}

async function getCheckoutSession(tier: paidTierNames, userEmail:string | undefined, userId:string) {
  const session = await stripe.checkout.sessions.create({
    customer_email: userEmail,
    subscription_data: {
      metadata: {
        clerkUserId: userId
      },
    },
    line_items: [
      {
        price: subscriptionTiers[tier].stripePriceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
    cancel_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
  })

  return session.url
}

async function getSubscriptionUpgradeSession(
  tier: paidTierNames,
  subscription: {
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    stripeSubscriptionItemId: string | null
  }
) {
  if (
    subscription.stripeCustomerId == null ||
    subscription.stripeSubscriptionId == null ||
    subscription.stripeSubscriptionItemId == null
  ) {
    throw new Error()
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
    flow_data: {
      type: "subscription_update_confirm",
      subscription_update_confirm: {
        subscription: subscription.stripeSubscriptionId,
        items: [
          {
            id: subscription.stripeSubscriptionItemId,
            price: subscriptionTiers[tier].stripePriceId,
            quantity: 1,
          },
        ],
      },
    },
  })

  return portalSession.url
}