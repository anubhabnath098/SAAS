'use client'

import { Button } from "@/components/ui/button";
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { env } from "@/data/env/client";
import { useState } from "react";

export function AddToSiteProductModalContent({ id }: { id: string }) {
    const code = `<script src="${env.NEXT_PUBLIC_SERVER_URL}/api/products/${id}/banner"></script>`;
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <DialogContent
            className="max-w-max"
            aria-describedby="dialog-description"
            aria-labelledby="dialog-title"
        >
            <DialogTitle></DialogTitle>
            <DialogHeader>
                <DialogTitle id="dialog-title" className="text-2xl">
                    Start Earning PPP Sales
                </DialogTitle>
                <DialogDescription id="dialog-description">
                    Copy the script below and paste it into your site. Your customers will start seeing PPP discounts!
                </DialogDescription>
            </DialogHeader>
            <pre className="mb-4 overflow-x-auto p-4 bg-secondary rounded max-w-screen-xl text-secondary-foreground">
                <code>{code}</code>
            </pre>
            <Button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            >
                {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
            
        </DialogContent>
    );
}