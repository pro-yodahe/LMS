import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server"; 
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new UploadThingError("Unauthorized");
  }

  return { userId };
};

export const ourFileRouter = {
  courseImage: f({ 
    image: { maxFileSize: "4MB", maxFileCount: 1 }
  })
    .middleware(() => auth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Course Image Upload Completed", metadata, file);
    }),

  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Course Attachment Upload Completed", metadata, file);
    }),

  chapterVideo: f({ 
    video: { maxFileCount: 1, maxFileSize: "512GB" } 
  })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Chapter Video Upload Completed", metadata, file);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
