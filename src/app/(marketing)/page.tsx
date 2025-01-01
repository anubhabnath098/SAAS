import { Button } from '@/components/ui/button'
import { SignUpButton } from '@clerk/nextjs'
import { ArrowRightIcon, CheckIcon } from 'lucide-react'
import Link from 'next/link'
import React, { ReactNode } from 'react'
import NeonIcon from './_icons/Neon'
import ClerkIcon from './_icons/Clerk'
import { subscriptionTiersInOrder } from '@/data/subscriptionTiers'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCompactNumber } from '@/lib/formatter'
import { cn } from '@/lib/utils'
import { BrandLogo } from '@/components/BrandLogo'
import SlackIcon from './_icons/SlackIcon'
import StripeIcon from './_icons/StripeIcon'
import AirtableIcon from './_icons/AirtableIcon'
import GithubIcon from './_icons/GithubIcon'
import NotionIcon from './_icons/NotionIcon'
import ZendeskIcon from './_icons/ZendeskIcon'
import ZoomIcon from './_icons/ZoomIcon'
import ShopifyIcon from './_icons/ShopifyIcon'

function Homepage() {
  return (
    <>
      <section className='min-h-screen bg-[radial-gradient(hsl(0,72%,65%,40%),hsl(24,62%,73%,40%),hsl(var(--background))_60%)] 
      flex items-center justify-center text-center text-balance flex-col gap-8 px-4'>
        <h1 className='text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight m-4'>Price Smarter, Sell bigger!</h1>
        <p className='text-lg lg:text-3xl max-w-screen-xl'>Welcome to Easy PPP, the affordable solution for displaying custom banners on websites. Our platform allows businesses to easily create and embed eye-catching banners across multiple sites, boosting visibility without breaking the bank. With Easy PPP, you can reach your audience quickly and cost-effectively, enhancing your digital presence with ease.</p>
        <SignUpButton>
          <Button className='text-lg p-6 rounded-xl flex gap-2'>
            Get Started for free <ArrowRightIcon className='size-5'/>
          </Button>

        </SignUpButton>
      </section>
      <section className='bg-primary text-primary-foreground'>
        <div className="container py-16 flex flex-col gap-15 px-8 md:py-16">
            <h2 className='text-3xl text-center text-balance mb-10'>Trusted by the top modern companies</h2>.
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-16">
            <div className="h-[50px] w-full">
              <Link href='https://neon.tech'>
                <NeonIcon/>
              </Link>
              </div>
              <div className="h-[50px] w-full">
              <Link href='https://clerk.com'>
                <ClerkIcon/>
              </Link>
              </div>
              <div className="h-[50px] w-full">
              <Link href='https://slack.com'>
                <SlackIcon />
              </Link>
              </div>
              
              <div className="h-[50px] w-full">
              <Link href='https://stripe.com'>
                <StripeIcon />
              </Link>
              </div>
              
              <div className="h-[50px] w-full">
              <Link href='https://airtable.com'>
                <AirtableIcon />
              </Link>
              </div>
              <div className="h-[50px] w-full">
              <Link href='https://github.com'>
                <GithubIcon />
              </Link>
              </div>
              <div className="h-[50px] w-full">
              <Link href='https://notion.so'>
                <NotionIcon />
              </Link>
              </div>
              <div className="h-[50px] w-full">
              <Link href='https://zendesk.com'>
                <ZendeskIcon />
              </Link>
              </div>
              <div className="h-[50px] w-full">
              <Link href='https://zoom.us'>
                <ZoomIcon />
              </Link>
              </div>
              <div className="h-[50px] w-full">
              <Link href='https://shopify.com'>
                <ShopifyIcon />
              </Link>
              </div>
            </div>
        </div>
          
      </section>
      <section id='pricing' className='px-8 py-16 bg-accent/5 mb-8'>
      <h2 className='text-4xl text-center text-balance font-semibold mb-10'>
        Pricing software which pays for itself 20x over
      </h2>
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-screen-xl mx-auto'>
        {subscriptionTiersInOrder.map(tier=>(
          <PricingCard key={tier.name} {...tier}/>
        ))}
      </div>
      </section>
      <footer className='container pt-16 pb-8 flex flex-col sm:flex-row gap-8 sm:gap-4 justify-between items-start'>
        <Link href='/'>
          <BrandLogo/>
        </Link>
        <div className='flex flex-col sm:flex-row gap-8'>
          <div className="flex flex-col gap-8">
            <FooterLinkGroup title="Help" links={[
              {
                label:"PPP Discounts", href:"#pppdiscount",
              },
              {
                label:"Discount API", href:"#discountapi",
              },
              
              ]}/>
              <FooterLinkGroup 
              title="Solutions"
              links={[
                { label: "Newsletter", href: "#newsletter" },
                { label: "SaaS Business", href: "#business" },
                { label: "Online Courses", href: "#courses" }
              ]}
            />

            

              

          </div>
          <div className="flex flex-col gap-8">
          <FooterLinkGroup 
              title="Features"
              links={[
                { label: "Real-time Analytics", href: "#real-time-analytics" },
                { label: "Custom Dashboards", href: "#custom-dashboards" },
                { label: "AI Predictions", href: "#ai-predictions" }
              ]}
            />

            <FooterLinkGroup 
              title="Tools"
              links={[
                { label: "Keyword Planner", href: "#keyword-planner" },
                { label: "SEO Checker", href: "#seo-checker" },
                { label: "Content Optimizer", href: "#content-optimizer" }
              ]}
            />

            <FooterLinkGroup 
              title="Company"
              links={[
                { label: "About Us", href: "#about-us" },
                { label: "Our Team", href: "#our-team" },
                { label: "Contact Support", href: "#contact-support" }
              ]}
            />
          </div>
          <div className="flex flex-col gap-8">

          

              <FooterLinkGroup 
                title="Integrations"
                links={[
                  { label: "Slack Integration", href: "#slack-integration" },
                  { label: "Zapier Workflow", href: "#zapier-workflow" },
                  { label: "Google Analytics", href: "#google-analytics" }
                ]}
              />
              <FooterLinkGroup 
                title="Tutorial"
                links={[
                  { label: "Getting Started Guide", href: "#getting-started-guide" },
                  { label: "Advanced Features", href: "#advanced-features" },
                  { label: "Best Practices", href: "#best-practices" }
                ]}
              />
          </div>
          
        </div>
      </footer>
    </>
  )
}


function PricingCard({
  name,
  priceInCents,
  maxNumberOfProducts,
  maxNumberOfVisits,
  canAccessAnalytics,
  canCustomizeBanner,
  canRemoveBranding,
}:(typeof subscriptionTiersInOrder)[number]){

  const isMostPopular = name ==="Standard"
  return(
    <Card className={cn("relative shadow-none rounded-3xl overflow-hidden", isMostPopular? "border-accent border-2":"border-none")}>
      {isMostPopular &&(
        <div className="bg-accent text-accent-foreground absolute py-1 px-10 -right-8 top-24 rotate-45 origin-top-right">Most Popular</div>
      )}
      <CardHeader>
        <div className="text-accent font-semibold mb-8">{name}</div>
        <CardTitle className='text-xl font-bold'>${priceInCents/100} /mo</CardTitle>
        <CardDescription>{formatCompactNumber(
          maxNumberOfVisits)
          } pricing page visits</CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpButton>
          <Button className='text-lg w-full rounded-lg' variant={isMostPopular?"accent":"default"}>Get Started</Button>
        </SignUpButton>
      </CardContent>
      <CardFooter className='flex flex-col gap-4 items-start'>
        <Feature className='font-bold'>{maxNumberOfProducts}{" "}{maxNumberOfProducts===1?"products":"products"}</Feature>

        <Feature>PPP Discounts</Feature>
        
        {canAccessAnalytics&&<Feature>Advanced Analytics</Feature>}
        {canRemoveBranding&&<Feature>Remove Easy PPP Branding</Feature>}
        {canCustomizeBanner&&<Feature>Banner Customization</Feature>}
        

      </CardFooter>
    </Card>
  )
}

function Feature({children, className}:{children:ReactNode, className?:string}){
  return <div className={cn("flex items-center gap-2", className)}>
    <CheckIcon className='size-4 stroke-accent bg-accent/25 rounded-full p-0-0.5'/>
    <span>{children}</span>
  </div>
}

function FooterLinkGroup({title, links}:{
  title:string,
  links:{label:string, href:string}[]
}){
  return(

  <div className='flex flex-col gap-4'>
    <h3 className='font-semibold'>{title}</h3>
    <ul className='flex flex-col gap-2 text-sm'>
      {links.map(link=>(
        <li key={link.href}>
          <Link href={link.href}>{link.label}</Link>
        </li>
      ))}
    </ul>
  </div>)

}

export default Homepage
