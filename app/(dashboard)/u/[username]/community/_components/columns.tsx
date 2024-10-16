"use client";

import UserAvatar from "@/app/(browse)/_components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ArrowUpDown } from "lucide-react"
import UnblockBtn from "./unblock-btn";


export type blcokUsers = {
  createdAt: string;
  _id: Id<"users">;
  _creationTime: number;
  stream?: any;
  id: string;
  username: string;
  imageUrl: string;
  externalUserId: string;
  bio: string;
  updatedAt: string;
};

export const columns: ColumnDef<blcokUsers>[] = [
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-x-4">
          <UserAvatar
            username={row.original.username}
            imageUrl={row.original.imageUrl}
            isLive={row.original.stream?.isLive}
          />
          <span>{row.original.username}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "imageUrl",
    header: "Avatar",
    cell: ({ row }) => {
      return (
        <Image
          src={row.original.imageUrl}
          alt="avatar"
          width={50}
          height={50}
          className="rounded-md"
        />
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          UpdatedAt
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          CreatedAt
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "id",
    header:'Actions',
    cell: ({ row }) => {
      return <div className="flex items-center gap-x-2">
         <UnblockBtn username={row.original.username}/>
      </div>;
    },
  },
];
