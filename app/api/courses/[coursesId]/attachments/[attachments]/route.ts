import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
    req: Request, 
    { params }: { params: { coursesId: string, attachments: string } }) {
    try {
        const { userId } = await auth();
        const { attachments } = params;
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const courseOwner = await db.course.findUnique({
            where: {
                id: params.coursesId,
                userId: userId
            }
        })

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const attachment = await db.attachment.delete({
            where: {
                courseId: params.coursesId,
                id: params.attachments
            }
        })
        return NextResponse.json(attachment)
    } catch (error) {
        console.log("ATTACHMENT_ID", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}