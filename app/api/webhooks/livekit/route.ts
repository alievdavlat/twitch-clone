import { headers } from "next/headers";

import { WebhookReceiver } from 'livekit-server-sdk'
import { NextRequest } from "next/server";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const reciver = new WebhookReceiver(process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!)

export async function POST (req:NextRequest) {
  
  const user = await convex.query(api.users.getAccount)
  const body:any = req.text();
  const headerPayload = headers();

  const authorization =  headerPayload.get('Authorization')

  if (!authorization) {
    return new Response('Unauthorized', { status: 401 })
  }

  const event = await reciver.receive(body , authorization)

  if (event?.event === "egress_started") {
    await convex.mutation(api.stream.updateStreamByUserId, {
      ingressId:event?.ingressInfo?.ingressId,
      isLive:true,
      userId:user?.id || '',
    });
  }
  if (event?.event === "egress_ended") {
    await convex.mutation(api.stream.updateStreamByUserId, {
      ingressId:event?.ingressInfo?.ingressId,
      isLive:false,
      userId:user?.id || '',
    });
}


}