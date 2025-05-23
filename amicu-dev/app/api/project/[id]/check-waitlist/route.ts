import prisma from "@/lib/prisma/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: bigint}> }
) {
    const projectId = (await params).id;
    const { userId } = await auth();

    if(!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const dbUser = await prisma.user.findUnique({
            where: {
                user_id: userId
            },
            select: {
                id : true
            }
        }); 

        if (!dbUser) {
            return new NextResponse("User doesn't exist", { status: 404 });
        }

        const isInWaitlist = await prisma.waiting_list.findFirst({
            where: {
                project: projectId,
                user: dbUser.id
            }
        })
        
        return NextResponse.json({ presence: !!isInWaitlist });
    } catch (error) {
        console.error("Error checking user waitlist presence: ", error);
        return new NextResponse("Internal Server Error", {status: 500})
    }   
}