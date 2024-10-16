"use client";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import React from "react";
import ToggleCard from "./_components/ToggleCard";

const Chatpage = () => {
  const { user } = useUser();
  //@ts-ignore
  const stream = useQuery(api.stream.getStreamByUserId, { userId: user?.id });
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Chat settings</h1>
      </div>

      <div className="space-y-4">
        <ToggleCard
          field={"isChatEnabled"}
          label={"Enable chat"}
          value={stream?.isChatEnabled}
        />
        <ToggleCard
          field={"isChatDelayed"}
          label={"Delay chat"}
          value={stream?.isChatDelayed}
        />

        <ToggleCard
          field={"isChatFollowersOnly"}
          label={"Must be following to chat"}
          value={stream?.isChatFollowersOnly}
        />
      </div>
    </div>
  );
};

export default Chatpage;
