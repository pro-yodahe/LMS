import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
    throw new Error("MUX credentials are missing!");
}

const {Video} = new Mux({ 
    tokenId: process.env.MUX_TOKEN_ID, 
    tokenSecret: process.env.MUX_TOKEN_SECRET 
});

export async function PATCH(
    req: Request,
    { params }: { params: { coursesId: string; chapterId: string } }
) {
    try {
        const { userId } = (await auth()) || {};
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        let values;
        try {
            values = await req.json();
        } catch {
            return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
        }

        const { isPublished, ...updateData } = values;

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.coursesId,
                userId: userId,
            },
        });

        if (!ownCourse) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.coursesId,
            },
            data: updateData,
        });

        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId,
                },
            });

            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId);
                await db.muxData.delete({
                    where: { id: existingMuxData.id },
                });
            }

            const asset = await Video.Assets.create({
                input: values.videoUrl,
                playback_policy: ["public"],
                test: false,
            });

            await db.muxData.create({
                data: {
                    chapterId: params.chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids[0].id,
                },
            });
        }

        return NextResponse.json(chapter, { status: 200 });
    } catch (error) {
        console.error("[PATCH_ERROR]", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
