import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
export async function POST(
    req: Request,
    { params }: { params: { coursesId: string } } 
) {
    try {
        const { userId } = await auth()
        const { title } = await req.json()
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        const courseOwner = await db.course.findUnique({
            where: {
                id: params.coursesId,
                userId: userId,
            }
            });

            if(!courseOwner) {
                return new NextResponse("Unauthorized", { status: 401 })
            }
            const lastchapter = await db.chapter.findFirst({
                where: {
                    courseId: params.coursesId
                },
                orderBy: {
                    position: "desc",
                }
            });
            
            const newposition = lastchapter ? lastchapter.position + 1 : 1;
            const chapter = await db.chapter.create({
                data: {
                    title,
                    courseId: params.coursesId,
                    position: newposition,
                }
            })
            return NextResponse.json(chapter)

    } catch (error) {
        console.log("[CHAPTERS]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}