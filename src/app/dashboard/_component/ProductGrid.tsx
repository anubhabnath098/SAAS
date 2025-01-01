"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { AddToSiteProductModalContent } from './AddToSiteProductModalContent'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import DeleteProductAlertDialogContent from './DeleteProductAlertDialogContent'
import { useUser } from '@clerk/nextjs'
import { Product } from '../page'
import { DotsHorizontalIcon } from "@radix-ui/react-icons"

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
    setProducts: Dispatch<SetStateAction<Product[] | null>>
}) {
    const { user } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    return (
        <Card>
            <CardHeader>
                <div className='flex gap-2 justify-between items-end'>
                    <CardTitle>
                        <Link href={`/dashboard/products/${id}/edit`}>
                            {name}
                        </Link>
                    </CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="size-8 p-0">
                                <div className="sr-only">Action Menu</div>
                                <DotsHorizontalIcon className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem asChild>
                                <Link href={`/dashboard/products/${id}/edit`}>Edit</Link>
                            </DropdownMenuItem>
                            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                <DropdownMenuItem onSelect={(event) => {
                                    event.preventDefault();
                                    setIsModalOpen(true);
                                }}>
                                    Add To Site
                                </DropdownMenuItem>
                                <AddToSiteProductModalContent id={id} />
                            </Dialog>
                            <DropdownMenuSeparator />
                            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                                <DropdownMenuItem onSelect={(event) => {
                                    event.preventDefault();
                                    setIsAlertOpen(true);
                                }}>
                                    Delete
                                </DropdownMenuItem>
                                <DeleteProductAlertDialogContent id={id} userId={user?.id} setProducts={setProducts} />
                            </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <CardDescription className='overflow-auto'>{url}</CardDescription>
            </CardHeader>
            {description && <CardContent>{description}</CardContent>}
        </Card>
    );
}
export default ProductGrid
