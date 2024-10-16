import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCratorSidebar } from "@/store/use-creator-sidebar";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface NavItemProps {
  isActive: boolean;
  route: {
    id: number;
    label: string;
    href: string;
    icon: LucideIcon;
  };
}

const NavItem = ({ route, isActive }: NavItemProps) => {
  const {  label, href,icon:Icon } = route;
  const { collapsed } = useCratorSidebar();

  return (
    <Button
      asChild
      variant={"ghost"}
      className={cn(
        "w-full h-12",
        collapsed ? "justify-center" : "justify-start",
        isActive && "bg-accent"
      )}>
      <Link href={href}>
        <div className="flex items-center gap-x-4">
          <Icon
            className={cn(
              'h-4 w-4', 
              collapsed ? 'mr-0' : 'mr-2'
              
            )}
          />
           {
            !collapsed 
            && 
            <span >
              {label}
            </span>
          }
        
          </div>
      </Link>
    </Button>
  );
};

export default NavItem;


export const NavItemSkeleton = () => {
  return (  
    <li className="flex items-center gap-x-4 px-3">     
      <Skeleton
      className="min-h-[40px] min-w-[48px] rounded-md"
      />
      <div className="flex-1 hidden lg:block">
        <Skeleton
        className="h-6"
        />
      </div>
    </li>
  )
}