import { BrandLogo } from "@/components/BrandLogo";
import { UserButton } from "@clerk/nextjs";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuList, NavigationMenuLink } from "@/components/ui/navigation-menu";
import Link from "next/link";
import React from "react";

type NavBarProps = {};

export const NavBar: React.FC<NavBarProps> = () => {
  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
      <Sheet>
        <SheetTitle></SheetTitle>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <Link href="/dashboard" prefetch={false} className="flex items-center space-x-2">
            <BrandLogo />
          </Link>
          <div className="grid gap-2 py-6">
            <Link href="/dashboard/products" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
              Products
            </Link>
            <Link href="/dashboard/analytics" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
              Analytics
            </Link>
            <Link href="/dashboard/subscription" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
              Subscription
            </Link>
          </div>
        </SheetContent>
      </Sheet>
      <Link href="/dashboard" className="mr-auto hidden lg:flex items-center space-x-2" prefetch={false}>
        <BrandLogo />
      </Link>
      <div className="hidden lg:flex w-full justify-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuLink asChild>
              <Link href="/dashboard/products" className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium" prefetch={false}>
                Products
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link href="/dashboard/analytics" className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium" prefetch={false}>
                Analytics
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link href="/dashboard/subscription" className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium" prefetch={false}>
                Subscription
              </Link>
            </NavigationMenuLink>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="ml-auto">
        <UserButton />
      </div>
    </header>
  );
};

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
};
