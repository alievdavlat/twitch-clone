import React from "react";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const Logo = () => {
  return (
    <div className="flex flex-col items-center gap-y-4">
        <div className="bg-white rounded-full p-1">
            <Image 
            src={'/spooky.png'}
            alt="spooky"
            width={80}
            height={80}
            />
        </div>
        <div className={cn("flex flex-col items-center", poppins.className)}>
          <p className={"text-xl font-semibold"}>
          GameHub
          </p>
          <p className={"text-sm text-muted-foreground"}>
              Let&apos;s Play
          </p>
        </div>
    </div>
  )
};

export default Logo;
