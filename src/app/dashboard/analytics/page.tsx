"use client"

import { HasNoPermission } from "@/components/HasPermission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ViewsByCountryChart from "../_component/charts/ViewsByCountryChart";
import ViewsByPPPChart from "../_component/charts/ViewsByPPPChart";
import ViewsByDayChart from "../_component/charts/ViewsByDayChart";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { createURL } from "@/lib/utils";
import TimeZoneDropDownMenuItem from "../_component/TimeZoneDropDownMenuItem";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { Suspense, useEffect, useState } from "react";
import { Product } from "../page";
import { subDays } from "date-fns";
import { SQL, sql } from "drizzle-orm";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";


type ChartType = {
    timezone: string;
    productId?: string;
    userId: string;
    interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
}

export default function AnalyticsPage(){
    return(
      <Suspense fallback = {<div className="flex items-center justify-center h-[100%] w-full"><Skeleton className="w-[95%] h-[90%] rounded-full"/></div>}>
        <AnalyticsPageContent/>
      </Suspense>
    )
}

function AnalyticsPageContent(){
  const { user } = useUser();
    const searchParams = useSearchParams();
    const userId = user?.id;
    
    const searchParamsObj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      searchParamsObj[key] = value;
    });
    
    const [interval, setInterval] = useState(CHART_INTERVALS.last7Days);
    const [timezone, setTimezone] = useState('UTC');
    const [productId, setProductId] = useState('');
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const {toast} = useToast();
    useEffect(() => {
      setLoading(true)
      if (user) {
        const getPermission = async()=>{
            try{
                const response = await fetch(`/api/can-access-analytics-permission?userId=${user.id}`,{method:"GET"})
                if(!response.ok){
                    toast({
                        title:"Error",
                        description:"Error getting permission",
                        variant:"destructive"
                    })
                }else{
                    const data = await response.json();
                    setHasPermission(data.hasPermission);
                }
            }catch(err){
                toast({
                    title:"Error",
                    description:"Error getting permission",
                    variant:"destructive"
                })
            }finally{
              setLoading(false)
            }
            
        }


        getPermission();
        const intervalParam = searchParamsObj['interval'] ?? 'last7Days';
        const timezoneParam = searchParamsObj['timezone'] ?? 'UTC';
        const productIdParam = searchParamsObj['productId'] ?? '';
    
        const selectedInterval = CHART_INTERVALS[intervalParam as keyof typeof CHART_INTERVALS] ?? CHART_INTERVALS.last7Days;
    
        setInterval(selectedInterval);
        setTimezone(timezoneParam);
        setProductId(productIdParam);
      }
    }, [user, searchParams, toast]);

    if(loading==true){
      return (<div className="flex flex-col space-y-3 w-full h-screen">
        <Skeleton className="h-[80%] w-full rounded-xl" />
      </div>)
    }

    if(userId==null || userId==undefined){
        return;
    }
        return <>
            <div className="mb-6 flex justify-between items-baseline">
                <h1 className="text-3xl font-semibold">Analytics</h1>
                {hasPermission&&(
                    <div className="flex gap-2">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                {interval.label}
                                <ChevronDownIcon className="size-4 ml-2"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {Object.entries(CHART_INTERVALS).map(([key, value])=>(
                                <DropdownMenuItem asChild key={key}>
                                    <Link href={createURL("/dashboard/analytics", searchParamsObj, {interval:key})}>{value.label}</Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                        </DropdownMenu>
                        <ProductDropDown userId={userId} selectedProductId={productId} searchParams={searchParamsObj}/>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                {timezone}
                                <ChevronDownIcon className="size-4 ml-2"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            
                                <DropdownMenuItem asChild>
                                    <Link href={createURL("/dashboard/analytics", searchParamsObj, {timezone:"UTC"})}>UTC</Link>
                                </DropdownMenuItem>
                                <TimeZoneDropDownMenuItem searchParams={searchParamsObj}/>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    
                )}
            </div>
            {!hasPermission?(<HasNoPermission/>):(
                <div className="flex flex-col gap-8">
                    <ViewsByDayCard interval={interval} timezone={timezone} userId={userId} productId={productId}/>

                    <ViewsByPPPCard interval={interval} timezone={timezone} userId={userId} productId={productId}/>

                    <ViewsByCountryCard interval={interval} timezone={timezone} userId={userId} productId={productId}/>
                </div>
            )}
        
        </>
}


function ProductDropDown({
    userId,
    selectedProductId,
    searchParams
}:{
    userId:string,
    selectedProductId:string | undefined,
    searchParams:Record<string, string>
}){
    const {toast} = useToast();
    const [products, setProducts] = useState<Product[]| null >(null);
    useEffect(()=>{
            const fetchProducts = async () => {
                try {
                  const response = await fetch(
                    `/api/products?userId=${userId}`, {method:"GET"}
                  );
                  console.log(response);
                  if (!response.ok) {
                    toast({
                        title:"Error",
                        description:"Failed to fetch products",
                        variant:"destructive"
                      })
                  }
                  const productData = await response.json();
                  setProducts(productData);
                } catch (error) {
                  toast({
                    title:"Error",
                    description:"Failed to fetch products",
                    variant:"destructive"
                  })
                  setProducts([]);
                }
              };
              fetchProducts();
        },[userId, selectedProductId]
    )
    if(products===null){
        return ((<div className="">
        </div>))
    }

    return (
        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                {products.find(p=>p.id ===selectedProductId)?.name??"All Products"}
                                <ChevronDownIcon className="size-4 ml-2"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem asChild>
                                <Link href={createURL("/dashboard/analytics", searchParams, {
                                    productId:undefined
                                })}>All Products</Link>
                            </DropdownMenuItem>
                            {products.map(product=>(
                                <DropdownMenuItem asChild key={product.id}>
                                    <Link href={createURL("/dashboard/analytics", searchParams, {productId:product.id})}>{product.name}</Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
    )
}

function ViewsByDayCard(
    props: ChartType
){
  const [chartData, setChartData] = useState(null);
  const { toast } = useToast();

  const interval = getIntervalKey(props.interval);
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(
          `/api/analytics/dashboard/day?userId=${props.userId}&interval=${interval}&timezone=${props.timezone}&productId=${props.productId}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();
        setChartData(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "An unknown error occurred",
            variant: "destructive",
          });
        }
      }
    };

    fetchChartData();
  }, [props.userId, interval, props.timezone, props.productId]);

  if (!chartData) {
    return <div></div>
  }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Visitors Per Day</CardTitle>
            </CardHeader>
            <CardContent>
                <ViewsByDayChart chartData={chartData}/>
            </CardContent>
        </Card>
    )
}

function ViewsByPPPCard(
    props: ChartType
){
    const [chartData, setChartData] = useState(null);
  const { toast } = useToast();

  const interval = getIntervalKey(props.interval);
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(
          `/api/analytics/dashboard/ppp?userId=${props.userId}&interval=${interval}&timezone=${props.timezone}&productId=${props.productId}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();
        setChartData(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "An unknown error occurred",
            variant: "destructive",
          });
        }
      }
    };

    fetchChartData();
  }, [props.userId, interval, props.timezone, props.productId]);

  if (!chartData) {
    return <div></div>
  }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Visitors Per PPP Group</CardTitle>
            </CardHeader>
            <CardContent>
                <ViewsByPPPChart chartData={chartData}/>
            </CardContent>
        </Card>
    )
}

function ViewsByCountryCard(
    props: ChartType
){
  const [chartData, setChartData] = useState(null);
  const { toast } = useToast();

  const interval = getIntervalKey(props.interval);
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(
          `/api/analytics/dashboard/country?userId=${props.userId}&interval=${interval}&timezone=${props.timezone}&productId=${props.productId}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();
        setChartData(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "An unknown error occurred",
            variant: "destructive",
          });
        }
      }
    };

    fetchChartData();
  }, [props.userId, interval, props.timezone, props.productId]);

  if (!chartData) {
    return <div></div>
  }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Visitors Per Country</CardTitle>
            </CardHeader>
            <CardContent>
                <ViewsByCountryChart chartData={chartData}/>
            </CardContent>
        </Card>
    )
}

function getIntervalKey(interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS]) {
    return Object.keys(CHART_INTERVALS).find(
      (key) => CHART_INTERVALS[key as keyof typeof CHART_INTERVALS] === interval
    );
  }

const CHART_INTERVALS = {
    last7Days: {
      dateFormatter: (date: Date) => dateFormatter.format(date),
      startDate: subDays(new Date(), 7),
      label: "Last 7 Days",
      sql: sql`GENERATE_SERIES(current_date - 7, current_date, '1 day'::interval) as series`,
      dateGrouper: (col: SQL | SQL.Aliased) =>
        sql<string>`DATE(${col})`.inlineParams(),
    },
    last30Days: {
      dateFormatter: (date: Date) => dateFormatter.format(date),
      startDate: subDays(new Date(), 30),
      label: "Last 30 Days",
      sql: sql`GENERATE_SERIES(current_date - 30, current_date, '1 day'::interval) as series`,
      dateGrouper: (col: SQL | SQL.Aliased) =>
        sql<string>`DATE(${col})`.inlineParams(),
    },
    last365Days: {
      dateFormatter: (date: Date) => monthFormatter.format(date),
      startDate: subDays(new Date(), 365),
      label: "Last 365 Days",
      sql: sql`GENERATE_SERIES(DATE_TRUNC('month', current_date - 365), DATE_TRUNC('month', current_date), '1 month'::interval) as series`,
      dateGrouper: (col: SQL | SQL.Aliased) =>
        sql<string>`DATE_TRUNC('month', ${col})`.inlineParams(),
    },
  }
  
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeZone: "UTC",
  })
  
  const monthFormatter = new Intl.DateTimeFormat(undefined, {
    year: "2-digit",
    month: "short",
    timeZone: "UTC",
  })

