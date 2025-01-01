"use client"
import  NoProducts  from "@/app/dashboard/_component/NoProducts"
import ProductGrid from "@/app/dashboard/_component/ProductGrid"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
type Product = {
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

  useEffect(() => {
    if (user) {
      const fetchProducts = async () => {
        try {
          const response = await fetch(
            `/api/products?userId=${user.id}`, {method:"GET"}
          );
          console.log(response);
          if (!response.ok) throw new Error("Failed to fetch products");
          const productData = await response.json();
          setProducts(productData);
        } catch (error) {
          console.error(error);
          setProducts([]);
        }
      };
      fetchProducts();
    }
  }, [user]);

  if (products === null) return (<div className="flex flex-col space-y-3 w-full h-screen">
    <Skeleton className="h-[80%] w-full rounded-xl" />
  </div>)
  if (products.length === 0) return <NoProducts />;

  return (
    <>
      <h1 className="mb-6 text-3xl font-semibold flex justify-between">
        Products
        <Button asChild>
          <Link href="/dashboard/products/new">
            <PlusIcon className="size-4 mr-2" /> New Product
          </Link>
        </Button>
      </h1>
      <ProductGrid products={products} setProducts={setProducts}/>
    </>
  )
}