"use server";

import {
  IngressAudioEncodingPreset,
  IngressInput,
  IngressVideoEncodingPreset,
  type CreateIngressOptions,
  TrackSource,
  IngressClient,
  IngressAudioOptions,
  IngressVideoOptions,
  RoomServiceClient,
} from "livekit-server-sdk";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
const roomService = new RoomServiceClient(
  process.env.NEXT_PUBLIC_LIVEKIT_API_URL!,
  process.env.NEXT_PUBLIC_LIVEKIT_API_KEY!,
  process.env.NEXT_PUBLIC_LIVEKIT_API_SECRET!
);

const resetIngress = async (hostIdentity: string) => {
 const ingresses =   await ingressClient.listIngress({
    roomName: hostIdentity,
  });
  const rooms = await roomService.listRooms([hostIdentity]);

  // Xonalarni o'chirish
  for (const room of rooms) {
    await roomService.deleteRoom(room.name);
  }

  // Har bir ingressni o'chirish
  for (const ingress of ingresses) {
    if (ingress.ingressId) {
      await ingressClient.deleteIngress(ingress.ingressId);
    }
  }
}
const ingressClient = new IngressClient(
  process.env.NEXT_PUBLIC_LIVEKIT_API_URL!,
  process.env.NEXT_PUBLIC_LIVEKIT_API_KEY!,
  process.env.NEXT_PUBLIC_LIVEKIT_API_SECRET!
);

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);


export const createIngress = async (ingressType: IngressInput, user: any) => {
  try {
    if (!user) {
      return { error: "Foydalanuvchi topilmadi" }; 
    }

    const options: CreateIngressOptions = {
      name: user.username,
      roomName: user.id,
      participantName: user.username,
      participantIdentity: user.id,
    };

    if (ingressType === IngressInput.WHIP_INPUT) {
      options.enableTranscoding =  true;
    } else {
      // Audio sozlamalari
      options.audio = new IngressAudioOptions({
        source: TrackSource.MICROPHONE,
        name: "microphone",
        encodingOptions: {
          value: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
          case: "preset",
        },
      });

      // Video sozlamalari
      options.video = new IngressVideoOptions({
        source: TrackSource.CAMERA,
        name: "camera",
        encodingOptions: {
          value: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
          case: "preset",
        },
      });
    }

    const ingress = await ingressClient.createIngress(ingressType, options);
    if (!ingress || !ingress.url || !ingress.streamKey) {
      return { error: "Ingress yaratishda xatolik yuz berdi" };
    }

    // Convex-ga stream ma'lumotlarini yangilash
    await convex.mutation(api.stream.createOrUpdateStream, {
      userId: user.id,
      ingressId: ingress.ingressId,
      serverUrl: ingress.url,
      streamKey: ingress.streamKey,
      isLive: true,
      isChatEnabled: true,
      isChatFollowersOnly: false,
      isChatDelayed: false,
      name: `${user.username} stream qilyapti`,
    });

    // Muvaffaqiyatli natija qaytarish
    return {
      ingressId: ingress.ingressId,
      serverUrl: ingress.url,
      streamKey: ingress.streamKey,
      ingress,
    };
  } catch (error) {
    console.error("Ingress yaratishda xatolik:", error);
    return { error: "Ingress yaratishda kutilmagan xatolik yuz berdi." }; // Xatoliklarni qayta ishlash
  }
};
