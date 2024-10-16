"use client";
import { childProps } from "@/types";
import { SignIn, useAuth } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";

export const RedirectToAuth = ({ children }: childProps) => {
  const { userId, isSignedIn } = useAuth();

  const { isAuthenticated } = useConvexAuth();
  if (!userId || !isSignedIn || !isAuthenticated) {
    return (
          <SignIn />
    );
  } else {
    return children;
  }
};
