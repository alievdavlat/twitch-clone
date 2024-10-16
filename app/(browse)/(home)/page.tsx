"use client"
import { quotes } from "@/constants";
import { api } from "@/convex/_generated/api";
import { useLoading } from "@/store/useLoading";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { Suspense, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Results, { ResultSkeleton } from "./_components/Results";

export default function Home() {
  const { user } = useUser();
  const {setIsLoading} = useLoading((state) => state)

  const saveUser = useMutation(api.functions.saveUser);
  const createStream = useMutation(api.stream.createOrUpdateStream);

  const checkUserIfExist = useQuery(api.users.checkUserExists);
  

  useEffect(() => {
    setIsLoading(false)
    if (user?.id && !checkUserIfExist) {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      const externalId = uuidv4();
      saveUser({
        id: user.id,
        username: user.username || "",
        imageUrl: user.imageUrl || "",
        externalUserId:externalId,
        bio: randomQuote,
        stream:{
          userId:user.id,
          name:`${user.username}'s stream`,
          isLive:false,
          isChatEnabled:true,   
          isChatFollowersOnly:false,
          isChatDelayed:false
        },
      });

      createStream({
        userId:user.id,
        name:`${user.username}'s stream`,
        isLive:false,
        isChatEnabled:true,   
        isChatFollowersOnly:false,
        isChatDelayed:false
      })
    }


  }, [user, saveUser]);

  return (
    <div className="h-full p-8 max-w-screen-2xl mx-auto">
     <Suspense fallback={<ResultSkeleton/>}>
          <Results/>
        </Suspense>
    </div>
  );
}
