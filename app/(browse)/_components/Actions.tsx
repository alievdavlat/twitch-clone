"use client";
import { Button } from "../../../components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { Clapperboard } from "lucide-react";
import Link from "next/link";
import React from "react";
import { UserAvatarSkeleton } from "./UserAvatar";

const Actions = () => {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-ene pag-x-2 ml-4 lg:ml-0">
      {!user && (
        <SignInButton>
          <Button size={"sm"} variant={"primary"}>
            Loggin
          </Button>
        </SignInButton>
      )}
      {!!user && (
        <div className="flex items-center gap-x-4">
          <Button
            size={"sm"}
            variant={"ghost"}
            className="text-muted-foreground hover:text-primary"
            asChild>
            <Link href={`/u/${user.username}`}>
              <Clapperboard className="h-5 w-5 lg:mr-2" />
              <span className="hidden lg:block">Dashboard</span>
            </Link>
          </Button>
          {!user.username ? (
            <UserAvatarSkeleton />
          ) : (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                baseTheme: [dark],
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Actions;
