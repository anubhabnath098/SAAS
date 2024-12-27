"use client"
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'

import React, { Dispatch, SetStateAction, useTransition } from 'react'
import { Product } from '../page'

function DeleteProductAlertDialogContent({id, userId,setProducts}:{id:string, userId:string | undefined, setProducts:Dispatch<SetStateAction<Product[] | null>>}) {

const [isDeletePending, startDeleteTransition] = useTransition()
    const {toast} = useToast()

    const handleDelete = async () => {
        if (userId) {
          // Use transition to mark the delete process as non-urgent
          startDeleteTransition(async () => {
            try {
              const response = await fetch(`/api/product?userId=${userId}&productId=${id}`, {
                method: "DELETE",
              });
    
              const data = await response.json();
    
              toast({
                title: data.error ? "Error" : "Success",
                description: data.message,
                variant: data.error ? "destructive" : "default",
              });
    
              if (!data.error) {
                setProducts((prevProducts) =>
                    prevProducts ? prevProducts.filter((product) => product.id !== id) : null
                );
              }
            } catch (e) {
              toast({
                title: "Error",
                description: "Failed to delete the product",
                variant: "destructive",
              });
              console.log(e);
            }
          });
        }
      };

  return (
        <AlertDialogContent className="">
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this product
                </AlertDialogDescription>
            </AlertDialogHeader>
        
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeletePending}>Delete</AlertDialogAction>
        </AlertDialogFooter>
        </AlertDialogContent>
  )
}

export default DeleteProductAlertDialogContent
