import { createUploadthing, type FileRouter } from "uploadthing/next";
// import { api } from "@/convex/_generated/api";
// import { ConvexHttpClient } from "convex/browser"; // server tomondan foydalaning

// const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const f = createUploadthing();

export const ourFileRouter = {
  thumbnailUploader: f({
      image: {
        maxFileSize: "4MB",
        maxFileCount: 1
       } 
    })
    .middleware(async () => {
      // // Foydalanuvchini serverda to'g'ri so'rash
      // const self = await convex.query(api.users.getAccount); 

      // if (!self || !self.id) {
      //   throw new Error("User not authenticated or missing.");
      // }

      return { user: null }; // Middleware uchun foydalanuvchi identifikatsiyasi
    })
    .onUploadComplete(async ({ file }) => {
      // if (!metadata?.user?.id) {
      //   throw new Error("Missing user metadata during upload.");
      // }

      try {
        // Foydalanuvchi uchun stream ma'lumotlarini yangilash
        // await convex.mutation(api.stream.updateStreamByUserId, {
        //   userId: metadata.user.id, 
        //   thumbnailUrl: file.url
        // });

        return { fileUrl: file.url };
      } catch (error) {
        console.error("Error updating stream with thumbnail URL:", error);
        throw new Error("Failed to update stream with thumbnail URL.");
      }
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
