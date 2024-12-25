'use server'

import { productCountryDiscountSchema, productCustomizationSchema, productDetailsSchema } from "@/schemas/product";
import { z } from "zod";
import { createProduct as createProductDb, updateProduct as updateProductDb } from "@/server/db/products";
import { redirect } from "next/navigation";
import { deleteProduct as deleteProductDb } from "@/server/db/products";
import {updateCountryDiscounts as updateCountryDiscountsDb, updateProductCustomization as updateProductCustomizationDb} from "@/server/db/products"
import { canCreateProduct, canCustomizeBanner } from "../permissions";


const errorMessage = "There was an error creating your product";

export async function createProduct(userId:string|null|undefined,unsafeData: z.infer<typeof productDetailsSchema>): Promise<{ error: boolean; message: string } | undefined> {
    const { success, data } = productDetailsSchema.safeParse(unsafeData);
    const canCreate = await canCreateProduct(userId);
    if (!success || userId == null|| !canCreate) {
        return { error: true, message: errorMessage };
    }

    const { id } = await createProductDb({ ...data, clerkUserId: userId });

    redirect(`/dashboard/products/${id}/edit?tab=countries`);
}

export async function updateProduct(id:string,userId:string|null|undefined,unsafeData: z.infer<typeof productDetailsSchema>): Promise<{ error: boolean; message: string } | undefined> {
    const { success, data } = productDetailsSchema.safeParse(unsafeData);
    if (success==false || userId == null || userId==undefined) {
        return { error: true, message: "There was an error updating your product" };
    }

    const isSuccess = await updateProductDb(data, {id, userId});
    return {error: !isSuccess, message:isSuccess?"Product details updated":"There was an error updating your product"}
}

export async function deleteProduct(userId:string|null|undefined,id: string) {
    //console.log(userId);
    if (userId === null) {
        return { error: true, message: "There was an error deleting your product or user id not found" };
    }

    const isSuccess = await deleteProductDb(id, userId!);
    if (!isSuccess) {
        return {
            error: !isSuccess,
            message: isSuccess ? "successfully deleted your product" : errorMessage
        };
    }
}

export async function updateCountryDiscounts(
    userId:string|null|undefined,
    id:string,
    unsafeData:z.infer<typeof productCountryDiscountSchema>
){
    const {success, data} = productCountryDiscountSchema.safeParse(unsafeData);

    if(!success || userId == null){
        return { 
            error: true, 
            message: "There was an error saving your country discounts"}
    }
    
    const insert:{
        countryGroupId:string,
        productId:string,
        coupon: string,
        discountPercentage: number
    }[] = []
    const deleteIds:{countryGroupId:string}[] = []

    data.groups.forEach(group => {
        if(
            group.coupon != null &&
            group.coupon.length > 0 &&
            group.discountPercentage != null &&
            group.discountPercentage>0
        ){
            insert.push({
                countryGroupId: group.countryGroupId,
                coupon: group.coupon,
                discountPercentage: group.discountPercentage /100,
                productId: id,
            })

        }else{
            deleteIds.push({ countryGroupId: group.countryGroupId})
        }
    })

    await updateCountryDiscountsDb(deleteIds, insert, {productId: id, userId})

    return { error: false, message:"Country Discounts saved"}
}


export async function updateProductCustomization(
    userId:string | null | undefined,
    id: string,
    unsafeData: z.infer<typeof productCustomizationSchema>
  ) {
    const { success, data } = productCustomizationSchema.safeParse(unsafeData)
    const canCustomize = await canCustomizeBanner(userId)
    if (!success || userId==null || !canCustomize) {
      return {
        error: true,
        message: "There was an error updating your banner",
      }
    }
  
    await updateProductCustomizationDb(data, { productId: id, userId })
  
    return { error: false, message: "Banner updated" }
  }