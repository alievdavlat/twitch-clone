import React from "react";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const Logo = () => {
  return (
    <Link href={'/'}>
      <div className="flex  items-center gap-x-4 hover:opacity-75 transition ">
        <div className="bg-white rounded-full p-1 mr-10 shrink-0 lg:mr-0 lg:shrink">
          <Image
            src={"/spooky.png"}
            alt="spooky"
            width={32}
            height={32}
          />
        </div>
        <div className={cn("lg:block hidden", poppins.className)}>
          <p className={"text-xl font-semibold"}>
          GameHub
          </p>
          <p className={"text-sm text-muted-foreground"}>
              Let&apos;s Play
          </p>
        </div>
      </div>
    </Link>
  )
};

export default Logo;
