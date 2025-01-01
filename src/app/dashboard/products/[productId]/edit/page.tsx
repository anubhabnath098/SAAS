"use client"
import PageWithBackButton from "@/app/dashboard/_component/PageWithBackButton";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductDetailsForm from "@/app/dashboard/_component/forms/ProductDetailsForm";
import CountryDiscountsForm from "@/app/dashboard/_component/forms/CountryDiscountsForm";
import { ProductCustomizationForm } from "@/app/dashboard/_component/forms/ProductCustomizationForm";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

type Product = {
    id: string;
    name: string;
    description: string | null;
    url: string;
};

type CountryGroup =  {
    id: string;
    name: string;
    recommendedDiscountPercentage: number | null;
    countries: {
        code: string;
        name: string;
    }[];
    discount: {
        coupon: string;
        discountPercentage: number;
    } | undefined;
}

type Customization= {
    productId: string
    locationMessage: string
    backgroundColor: string
    textColor: string
    fontSize: string
    bannerContainer: string
    isSticky: boolean
    classPrefix: string | null
  }

type Permissions = {
    canRemoveBranding: boolean;
    canCustomizeBanner: boolean;
};

export default function EditProductPage({

}:{
 
}){
    const { productId } = useParams();
    const searchParams = useSearchParams();
    const tab = searchParams.get("tab") || "details";
    const { user } = useUser();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        if (user) {
          const fetchProduct = async () => {
            try {
              const res = await fetch(
                `/api/product?productId=${productId}&userId=${user.id}`
              );
              if (!res.ok) throw new Error("Failed to fetch product");
              const data = await res.json();
              setProduct(data[0]);
              console.log(data[0]);
            } catch (error) {
              console.error(error);
            } finally {
              setIsLoading(false);
            }
          };
          fetchProduct();
        }
      }, [user, productId]);
    if (isLoading) return (<div className="flex flex-col space-y-3 w-full h-screen">
      <Skeleton className="h-[60%] w-full rounded-xl" />
    </div>)
    if(product===null || !user || !productId){
        return notFound();
    }

    return <PageWithBackButton backButtonHref="/dashboard/products"
    pageTitle="Edit Product">
        <Tabs defaultValue={tab}>
            <TabsList className="bg-background/60">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="countries">Country</TabsTrigger>
                <TabsTrigger value="customization">Customization</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
                <DetailsTab product={product}/>
            </TabsContent>
            <TabsContent value="countries">
                <CountryTab productId = {typeof productId==="string"?productId:productId[0]} userId = {user.id}/>
            </TabsContent>
            <TabsContent value="customization">
                <CustomizationTab productId={typeof productId==="string"?productId:productId[0]} userId = {user.id}/>
            </TabsContent>
        </Tabs>
    </PageWithBackButton>
}



function DetailsTab({product}:{
    product:{
        id:string,
        name:string,
        description:string|null,
        url:string,
    }
}){
    return(
    <Card>
        <CardHeader>
            <CardTitle className="text-xl">
                Product Details
            </CardTitle>
        </CardHeader>
        <CardContent>
            <ProductDetailsForm product={product}/>
        </CardContent>
    </Card>
    )
}


function CountryTab({productId, userId}:{
    productId:string,
    userId:string
}){

    const [countryGroups, setCountryGroups] = useState<CountryGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountryGroups = async () => {
      try {
        const res = await fetch(`/api/product-country-groups?productId=${productId}&userId=${userId}`, {
          method: "GET",
        });

        if (!res.ok) {
          throw new Error(`Error fetching country groups: ${res.statusText}`);
        }

        const data: CountryGroup[] = await res.json();
        setCountryGroups(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch country groups");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountryGroups();
  }, [productId, userId]);

  if (isLoading) return (<div className="flex flex-col space-y-3 w-[70vw] h-screen">
    <Skeleton className="h-[60%] w-full rounded-xl" />
  </div>)
  if (error) return <p>{error}</p>;

    return(
    <Card>
        <CardHeader>
            <CardTitle className="text-xl">
                Country Discounts
            </CardTitle>
            <CardDescription>
                Leave the discount field blank if you do not want to display deals for any specific parity group
            </CardDescription>
        </CardHeader>
        <CardContent>
            <CountryDiscountsForm productId=  {productId} countryGroups={countryGroups}/>
        </CardContent>
    </Card>
    )
}

function CustomizationTab({
    productId,
    userId,
}:{
    productId:string,
    userId:string
}){

    const [customization, setCustomization] = useState<Customization>();
  const [permissions, setPermissions] = useState<Permissions>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomization = async () => {
      try {
        const res = await fetch(
          `/api/product-customization?productId=${productId}&userId=${userId}`,
          { method: "GET" }
        );

        if (!res.ok) {
          throw new Error(`Error fetching customization: ${res.statusText}`);
        }

        const data = await res.json();
        setCustomization(data.customization);
        setPermissions(data.permissions);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch customization");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomization();
  }, [productId, userId]);

  if (isLoading) return (<div className="flex flex-col space-y-3 w-[70vw] h-screen">
    <Skeleton className="h-[60%] w-full rounded-xl" />
  </div>)
  if(!productId || !userId || !customization){
    return notFound();
  }
  if (error) return <p>{error}</p>;
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Banner Customization</CardTitle>
            </CardHeader>
            <CardContent>
                <ProductCustomizationForm canRemoveBranding={permissions?permissions?.canRemoveBranding:false}
                canCustomizeBanner={permissions?permissions?.canCustomizeBanner:false}
                customization={customization}/>
            </CardContent>
        </Card>
    )
}