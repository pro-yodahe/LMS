import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { coursesId: string; chapterId: string } }
) {
    try {
        const { userId } = await auth(); // 
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { isPublished, ...values } = await req.json();

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
            data: {
                ...values,
            },
        });

        return NextResponse.json(chapter, { status: 200 });
    } catch (error) {
        console.log("[COURSE_ID]", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
