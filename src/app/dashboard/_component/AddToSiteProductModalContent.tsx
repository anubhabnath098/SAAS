'use Client'
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { env } from "@/data/env/client"

export function AddToSiteProductModalContent({id}:{id:string}){
    const code = `<script src="${env.NEXT_PUBLIC_SERVER_URL}/api/products/${id}/banner"></script>`

    return (
        <DialogContent className="max-w-max">
            <DialogHeader>
                <DialogTitle className="text-2xl">Start Earning PPP Sales</DialogTitle>
                <DialogDescription>
                    All you need to do is copy the below script into your site and your customerr will start seeing your PPP discounts!
                </DialogDescription>
            </DialogHeader>
            <pre className="mb-4 overflow-x-auto p-4 bg-secondary rounded max-w-screen-xl text-secondary-foreground">
                <code>{code}</code>
            </pre>
        </DialogContent>
    )
}