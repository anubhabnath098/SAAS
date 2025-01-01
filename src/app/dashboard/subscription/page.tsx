"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  paidTierNames,
  TierNames,
} from "@/data/subscriptionTiers"
import { formatCompactNumber } from "@/lib/formatter"
import { cn } from "@/lib/utils"

import { CheckIcon } from "lucide-react"
import { ReactNode, useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

type Subscription = {
  name: string,
  priceInCents:0,
  maxNumberOfProducts:number,
  maxNumberOfVisits:number,
  canAccessAnalytics:boolean,
  canCustomizeBanner:boolean,
  canRemoveBranding:boolean,
  stripePriceId:string|undefined,
}

export default function SubscriptionPage() {
    const { user } = useUser();
    const [userStats, setUserStats] = useState<{
      tier:any
      productCount: number;
      pricingViewCount: number;
    }>({
      tier: null,
      productCount: 0,
      pricingViewCount: 0,
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [subscriptionTiers, setSubscriptionTier] = useState<{
      Free:Subscription,
      Basic:Subscription,
      Standard:Subscription,
      Premium:Subscription
    
}>()
    const [subscriptionTiersInOrder, setSubscriptionTiersInOrder] = useState<Array<Subscription>>()
    const router = useRouter();
    const {toast} = useToast();
  
    useEffect(() => {
      if (user?.id) {
        const fetchUserStats = async () => {
          try {
            const response = await fetch(`/api/subscription?userId=${user.id}`, {method:"GET"});
            if (!response.ok) {toast({
              title: "Error",
              description: "Problem in fetching subscription stats",
              variant: "destructive",
            });
          }
  
            const data = await response.json();
            setUserStats({
              tier: data.tier,
              productCount: data.productCount,
              pricingViewCount: data.pricingViewCount,
            });
              const response1 = await fetch(`/api/subscription/subscription-data`, {method:"GET"})
              if (!response1.ok) {toast({
                title: "Error",
                description: "Problem in fetching subscription stats",
                variant: "destructive",
              });
            }else{

              const data1 = await response1.json();
              setSubscriptionTier(data1.subscriptionTiers)
              setSubscriptionTiersInOrder(data1.subscriptionTiersInOrder)
            }

          } catch (err) {
            toast({
              title: "Error",
              description: "Problem in fetching subscription stats",
              variant: "destructive",
            });
          } finally {
            setLoading(false);
          }
        };
  
        fetchUserStats();
      }
    }, [user]);
  
    if (loading || user==null || user==undefined) return ((<div className="flex flex-col space-y-3 w-full h-screen">
      <Skeleton className="h-[70%] w-full rounded-xl" />
    </div>))
    if (error) return <div>{error}</div>;

  const handleManageSubscription = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {

      const response = await fetch("/api/subscription/create-customer-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId:user.id }),
      });

      
      //console.log(response);
      const data = await response.json();
      if(!data){
        toast({
          title: "Error",
          description: "problem in creating customer portal session",
          variant: "destructive",
        });
      }
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
      }else if(data.url){
        router.push(data.url)
      }

    } catch (error) {
      toast({
        title: "Error",
        description: "problem in creating customer portal session! Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <>
      <h1 className="mb-6 text-3xl font-semibold">Your Subscription</h1>
      <div className="flex flex-col gap-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Usage</CardTitle>
              <CardDescription>
                {formatCompactNumber(userStats.pricingViewCount)} /{" "}
                {formatCompactNumber(userStats.tier.maxNumberOfVisits)} pricing page
                visits this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress
                value={(userStats.pricingViewCount / userStats.tier.maxNumberOfVisits) * 100}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Number of Products</CardTitle>
              <CardDescription>
                {userStats.productCount} / {userStats.tier.maxNumberOfProducts} products created
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress
                value={(userStats.productCount / userStats.tier.maxNumberOfProducts) * 100}
              />
            </CardContent>
          </Card>
        </div>
        {userStats.tier != subscriptionTiers?.Free && (
          <Card>
            <CardHeader>
              <CardTitle>You are currently on the {userStats.tier.name} plan</CardTitle>
              <CardDescription>
                If you would like to upgrade, cancel, or change your payment
                method use the button below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManageSubscription}>
                <Button
                  variant="accent"
                  className="text-lg rounded-lg"
                  size="lg"
                >
                  Manage Subscription
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="grid-cols-2 lg:grid-cols-4 grid gap-4 max-w-screen-xl mx-auto">
        {subscriptionTiersInOrder?.map(t => (
          <PricingCard key={t.name} currentTierName={userStats.tier.name} {...t} userId={user.id} email={user.emailAddresses[0].emailAddress}/>
        ))}
      </div>
    </>
  )
}

function PricingCard({
  name,
  priceInCents,
  maxNumberOfVisits,
  maxNumberOfProducts,
  canRemoveBranding,
  canAccessAnalytics,
  canCustomizeBanner,
  currentTierName,
  userId,
  email
}: (Subscription) & { currentTierName: TierNames } &{userId:string} &{email:string}) {
  const {toast} = useToast();
  const router = useRouter()

  const handleCancelSession = async (event:React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/subscription/create-cancel-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
  
      const data = await response.json();
  
      if (data.error) {
        toast({
          title:"error",
          description:"Error while cancelling session. Please try again later",
          variant:"destructive"

        })
      } else if(data.url){
        router.push(data.url)
      }
    } catch (error) {
      toast({
        title:"error",
        description:"Error while cancelling session. Please try again later",
        variant:"destructive"

      })
    }
  };

  const handleCreateCheckoutSession = async (event:React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/subscription/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tier:name, userEmail:email, userId:userId }),
      });
  
      const data = await response.json();
  
      if (data.error) {
        toast({
          title:"error",
          description:data.error,
          variant:"destructive"

        })
      }else if(data.url){
        router.push(data.url)
      }
      
    } catch (error) {
      toast({
        title:"error",
        description:"Error while cancelling subscription. Please try again later",
        variant:"destructive"

      })
    }
  };
  
  
  const isCurrent = currentTierName === name

  return (
    <Card className="shadow-none rounded-3xl overflow-hidden">
      <CardHeader>
        <div className="text-accent font-semibold mb-8">{name}</div>
        <CardTitle className="text-xl font-bold">
          ${priceInCents / 100} /mo
        </CardTitle>
        <CardDescription>
          {formatCompactNumber(maxNumberOfVisits)} pricing page visits/mo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={
            name === "Free"
              ? handleCancelSession
              : handleCreateCheckoutSession
          }
        >
          <Button
            disabled={isCurrent}
            className="text-lg w-full rounded-lg"
            size="lg"
          >
            {isCurrent ? "Current" : "Swap"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 items-start">
        <Feature className="font-bold">
          {maxNumberOfProducts}{" "}
          {maxNumberOfProducts === 1 ? "product" : "products"}
        </Feature>
        <Feature>PPP discounts</Feature>
        {canCustomizeBanner && <Feature>Banner customization</Feature>}
        {canAccessAnalytics && <Feature>Advanced analytics</Feature>}
        {canRemoveBranding && <Feature>Remove Easy PPP branding</Feature>}
      </CardFooter>
    </Card>
  )
}

function Feature({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <CheckIcon className="size-4 stroke-accent bg-accent/25 rounded-full p-0.5" />
      <span>{children}</span>
    </div>
  )
}