"use client";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";

const Actions = () => {
  return (
    <div className="flex items-center justify-ene pag-x-2">
      <Button
        size={"sm"}
        variant={"ghost"}
        className="text-neutral-400 hover:text-primary ">
        <Link href={"/"} className="flex items-center">
          <LogOut className="h-5 w-5 mr-2" />
          Exit
        </Link>
      </Button>

      <UserButton
        afterSignOutUrl="/"
        appearance={{
          baseTheme: [dark],
        }}
      />
    </div>
  );
};

export default Actions;
