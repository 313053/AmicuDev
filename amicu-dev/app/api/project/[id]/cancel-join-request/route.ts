import prisma from "@/lib/prisma/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: bigint }> }
) {
    const projectId = (await params).id
    if ( !(await auth()).userId) {
        return new NextResponse("Unauthorized", { status : 401});
    }

    try {
        const body = await req.json()
        const { userId } = body;

        await prisma.$transaction(async (tx) => {

            const dbUser = await tx.user.findUnique({
                where: {
                    user_id: userId
                },
                select: {
                    id: true
                }
            });

            if (!dbUser) {
                return new NextResponse("User doesn't exist", { status: 404 });
            }

            const existingUserWaitlist = await tx.waiting_list.findFirst({
                where: {
                    user: dbUser.id,
                    project: projectId
                },
                select: {
                    id: true
                }
            })

            if (existingUserWaitlist) {
                await tx.waiting_list.delete({
                    where: {
                        id: existingUserWaitlist.id
                    }
                })
            }

            await tx.notification.deleteMany({
                where: {
                    sender: dbUser.id,
                    project: projectId
                }
            })

        })
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error removing user from wailtist: ", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}