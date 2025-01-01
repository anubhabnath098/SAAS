"use client";
import NoProducts from "@/app/dashboard/_component/NoProducts";
import ProductGrid from "@/app/dashboard/_component/ProductGrid";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { HasNoPermission } from "@/components/HasPermission";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ViewsByDayChart from "./_component/charts/ViewsByDayChart";
import { Skeleton } from "@/components/ui/skeleton";

export type Product = {
  id: string;
  name: string;
  clerkUserId: string;
  description: string | null;
  url: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function Products() {
  const { user } = useUser();
  const [products, setProducts] = useState<Product[] | null>(null);

  const {toast} = useToast();
  useEffect(() => {
    if (user) {
      const fetchProducts = async () => {
        try {
          const response = await fetch(
            `/api/products?userId=${user.id}&limit=6`, {method:"GET"}
          );
          console.log(response);
          if (!response.ok) {
            toast({
              title:"Error",
              description:"Error fetching products",
              variant:"destructive"
            })
          }
          const productData = await response.json();
          setProducts(productData);
        } catch (error) {
          toast({
            title:"Error",
            description:"Error fetching products",
            variant:"destructive"
          })
          setProducts([]);
        }
      };
      fetchProducts();
    }
  }, [user]);
  const hasPermission = true;

  if (products === null || user===null || user==undefined) return (<div className="flex flex-col space-y-3 w-full h-screen">
    <Skeleton className="h-[60%] w-full rounded-xl" />
  </div>)
  if (products.length === 0) return <NoProducts />;

  return (
    <>
      <h2 className="mb-6 text-3xl font-semibold flex justify-between">
        <Link href="/dashboard/products" className="flex gap-2 items-center hover:underline group">Products<ArrowRightIcon/></Link>
        <Button asChild>
          <Link href={`/dashboard/products/new`}>
            <PlusIcon className="size-4 mr-2" /> New Product
          </Link>
        </Button>
      </h2>
      <ProductGrid products={products} setProducts={setProducts}/>
      <h2 className="mb-6 text-3xl font-semibold flex justify-between mt-6">
        <Link href="/dashboard/analytics" className="flex gap-2 items-center hover:underline group">Analytics<ArrowRightIcon/></Link>

      </h2>
      {!hasPermission?(<HasNoPermission/>):(
        <AnalyticsChart userId={user.id}/>
      )}
    </>
  );
}

function AnalyticsChart({userId}:{
  userId:string
}){
  const [chartData, setChartData] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(
          `api/analytics/dashboard/day?userId=${userId}&interval=last7Days&timezone=UTC`,
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
  }, [userId, toast]);

  if (!chartData) {
    return ((<div className="flex flex-col space-y-3 w-full h-screen">
      <Skeleton className="h-[30%] w-full rounded-xl" />
    </div>))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Views by Day
        </CardTitle>
        </CardHeader>
        <CardContent>
          <ViewsByDayChart chartData={chartData}/>
        </CardContent>
    </Card>
  )
}


