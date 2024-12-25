"use client"

import React, { useEffect, useState } from 'react'
import PageWithBackButton from '../../_component/PageWithBackButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProductDetailsForm from '../../_component/forms/ProductDetailsForm'
import { useUser } from '@clerk/nextjs'
import { HasNoPermission } from '@/components/HasPermission'

function Page() {
  const { user } = useUser();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (user) {
      const fetchPermission = async () => {
        try {
          const response = await fetch(`/api/create-product-permission?userId=${user.id}`, {method:"GET"});
          if (!response.ok) {
            throw new Error("Failed to fetch permission");
          }

          const data = await response.json();
          setHasPermission(data.hasPermission);
        } catch (error) {
          console.error("Error fetching permission:", error);
          setHasPermission(false); 
        }
      };

      fetchPermission();
    }
  }, [user]);

  if (hasPermission === null) {
    return <p>Loading...</p>;
  }


  return (
    <>
      {hasPermission === true ? (
        <PageWithBackButton backButtonHref="/dashboard/products" pageTitle="New Product">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductDetailsForm />
            </CardContent>
          </Card>
        </PageWithBackButton>
      ) : (
        <HasNoPermission />
      )}
    </>
  );
  
}

export default Page
