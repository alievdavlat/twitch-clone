"use server";

import {
  IngressAudioEncodingPreset,
  IngressInput,
  IngressVideoEncodingPreset,
  RoomServiceClient,
  type CreateIngressOptions,
  TrackSource,
  IngressClient,
  IngressAudioOptions,
  IngressVideoOptions,
} from "livekit-server-sdk";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

// LiveKit mijozlarini ishga tushirish
const roomService = new RoomServiceClient(
  process.env.NEXT_PUBLIC_LIVEKIT_API_URL!,
  process.env.NEXT_PUBLIC_LIVEKIT_API_KEY!,
  process.env.NEXT_PUBLIC_LIVEKIT_API_SECRET!
);

const ingressClient = new IngressClient(
  process.env.NEXT_PUBLIC_LIVEKIT_API_URL!,
  process.env.NEXT_PUBLIC_LIVEKIT_API_KEY!,
  process.env.NEXT_PUBLIC_LIVEKIT_API_SECRET!
);

// Server tomonida ishlatish uchun Convex mijozini ishga tushirish
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Mavjud Ingress-ni o'chirish funksiyasi
const resetIngress = async (hostIdentity: string) => {

  const ingresses = await ingressClient.listIngress({
    roomName: hostIdentity,
  });

  // Host uchun barcha xonalarni olish
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
};

// Ingress yaratish funksiyasi
export const createIngress = async (ingressType: IngressInput, user: any) => {
  try {
    if (!user) {
      return { error: "Foydalanuvchi topilmadi" }; // Foydalanuvchi mavjud emasligini tekshirish
    }

    // Foydalanuvchi uchun mavjud ingresslarni o'chirish
    await resetIngress(user.id);

    // Yangi ingress yaratish uchun parametrlarni tayyorlash
    const options: CreateIngressOptions = {
      name: user.username,
      roomName: user.id,
      participantName: user.username,
      participantIdentity: user.id,
    };

    // Ingress turi asosida transcoding sozlamalari
    if (ingressType === IngressInput.WHIP_INPUT) {
      options.bypassTranscoding = true;
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

    // Yangi ingress yaratish
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
