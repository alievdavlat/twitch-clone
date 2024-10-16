"use client";
import React from "react";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { followersColumns } from "./_components/followers-columns";


interface CommunityPageProps {
  params: {
    username: string;
  };
}
const CommunityPage = ({}: CommunityPageProps) => {
  const blockedUser = useQuery(api.users.getBlockedUsers);
  const followers = useQuery(api.followers.getFollowedUsers);

  const formatedBlockUser = Array.isArray(blockedUser)
    ? blockedUser.map((user) => ({
        ...user,
        updatedAt: format(new Date(user.createdAt), "dd/MM/yyyy"),
        createdAt: format(new Date(user.createdAt), "dd/MM/yyyy"),
      }))
    : [];

    const formatedFollowers = Array.isArray(followers)
    ? followers.map((user) => ({
        ...user,
        updatedAt: format(new Date(user.createdAt), "dd/MM/yyyy"),
        createdAt: format(new Date(user.createdAt), "dd/MM/yyyy"),
      }))
    : [];

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Community settings</h1>
      </div>
      <Tabs defaultValue="Followers" className="w-full">
        <TabsList className="w-auto my-2">
          <TabsTrigger value="Followers" className="w-auto">Followers</TabsTrigger>
          <TabsTrigger value="Blocked users"  className="w-auto">Blocked users</TabsTrigger>
        </TabsList>
        <TabsContent value="Followers">
        <DataTable columns={followersColumns} data={formatedFollowers!} />
        </TabsContent>
        <TabsContent value="Blocked users">
          <DataTable columns={columns} data={formatedBlockUser!} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityPage;
