export type TierNames = keyof typeof subscriptionTiers
export type paidTierNames = Exclude<TierNames, "Free">
import {env} from "@/data/env/server"

export const subscriptionTiers = {
    Free:{
        name: "Free",
        priceInCents:0,
        maxNumberOfProducts:1,
        maxNumberOfVisits:5000,
        canAccessAnalytics:false,
        canCustomizeBanner:false,
        canRemoveBranding:false,
        stripePriceId:undefined,
    },
    Basic:{
        name: "Basic",
        priceInCents:1400,
        maxNumberOfProducts:5,
        maxNumberOfVisits:10000,
        canAccessAnalytics:true,
        canCustomizeBanner:false,
        canRemoveBranding:true,
        stripePriceId:env.STRIPE_BASIC_PLAN_ID,
    },
    Standard:{
        name: "Standard",
        priceInCents:5900,
        maxNumberOfProducts:30,
        maxNumberOfVisits:100000,
        canAccessAnalytics:true,
        canCustomizeBanner:true,
        canRemoveBranding:true,
        stripePriceId:env.STRIPE_STANDARD_PLAN_ID,
    },
    Premium:{
        name: "Premium",
        priceInCents:14900,
        maxNumberOfProducts:50,
        maxNumberOfVisits:1000000,
        canAccessAnalytics:true,
        canCustomizeBanner:true,
        canRemoveBranding:true,
        stripePriceId:env.STRIPE_PREMIUM_PLAN_ID,
    } 
}as const

export const subscriptionTiersInOrder=[
    subscriptionTiers.Free,
    subscriptionTiers.Basic,
    subscriptionTiers.Standard,
    subscriptionTiers.Premium
] as const



export function getTierByPriceId(priceId:string){
    return Object.values(subscriptionTiers).find(
        tier => tier.stripePriceId == priceId
    )
}