"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import React, { Dispatch, SetStateAction } from 'react'
import { AddToSiteProductModalContent } from './AddToSiteProductModalContent'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import DeleteProductAlertDialogContent from './DeleteProductAlertDialogContent'
import { useUser } from '@clerk/nextjs'
import { Product } from '../page'

function ProductGrid({
    products,
    setProducts
}:{
    products:Product[],
    setProducts:Dispatch<SetStateAction<Product[] | null>>
}) {
  return (
    <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {products.map(product=>(
        <ProductCard setProducts={setProducts} key={product.id} {...product}/>
      ))}
    </div>
  )
}


export function ProductCard({
    id,
    name,
    url,
    description,
    setProducts
}: {
    name: string,
    url: string,
    description: string | null,
    id: string,
    setProducts:Dispatch<SetStateAction<Product[] | null>>
}) {
    const {user} = useUser();
    return (
        <Card>
            <CardHeader>
                <div className='flex gap-2 justify-between items-end'>
                    <CardTitle>
                        <Link href={`/dashboard/products/${id}/edit`}>
                            {name}
                        </Link>
                    </CardTitle>
                    <Dialog>
                        <AlertDialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant='outline' className='size-8 p-0'>
                                        <div className='sr-only'>Action Menu</div>
                                        <span className='size-4 bold'>⋮</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/dashboard/products/${id}/edit`}>
                                            Edit
                                        </Link>
                                    </DropdownMenuItem>
                                    <DialogTrigger asChild>
                                        <DropdownMenuItem>
                                            Add to Site
                                        </DropdownMenuItem>
                                    </DialogTrigger>
                                    <DropdownMenuSeparator />
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem>
                                            Delete
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>
                                <DeleteProductAlertDialogContent id={id} userId={user?.id} setProducts = {setProducts}/>
                                <AddToSiteProductModalContent id={id}/>
                        </AlertDialog>
                    </Dialog>
                </div>
                <CardDescription>{url}</CardDescription>
            </CardHeader>
            {description && <CardContent>{description}</CardContent>}
        </Card>
    );
}

export default ProductGrid
