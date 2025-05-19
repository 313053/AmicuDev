import prisma from "@/lib/prisma/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: bigint}> }
) {
    const projectId = (await params).id

    const { userId } = await auth();

    if (!userId)
        throw new NextResponse("Unauthorized", { status: 401 });

    try {
        const body = await req.json();
        const { removedUserId } = body;
        
        const removedUserProject = await prisma.user_project.findFirst({
            where: {
                project: projectId,
                user: removedUserId
            },
            select: {
                id: true,
                role: true
            }
        })

        if(removedUserProject?.role === 1)
            throw new Error("Project creator cannot be removed")

        await prisma.user_project.delete({
            where: {
                id: removedUserProject?.id
            }
        })

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error deleting user:", error);
        return new NextResponse("Internal Server Error: ", { status: 500 });
    }
}