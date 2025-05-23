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
        const body = await req.json();
        const { userId, invite } = body;

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

            let existingUserWaitlist = await tx.waiting_list.findFirst({
                where: {
                    user: dbUser.id,
                    project: projectId
                }
            })

            if (!existingUserWaitlist) {
                existingUserWaitlist = await tx.waiting_list.create({
                    data: {
                        user: dbUser.id,
                        project: projectId
                    }
                })
            }

            if (!invite) {
                const existingNotification = await tx.notification.findFirst({
                    where: {
                        sender: dbUser.id,
                        project: projectId
                    },
                    select: {
                        id: true
                    }
                })
                
                if(!existingNotification) {
                    // Finds all project members with mod priviledges
                    const dbProjectMembers = await tx.user_project.findMany({
                        where : {
                            project: projectId,
                            role: {
                                in: [1,2],
                            }
                        },
                        select: {
                            user: true,
                        }
                    })

                    await tx.notification.createMany({
                        data: dbProjectMembers.map(member => ({
                            sender: dbUser.id,
                            reciever: member.user,
                            project: projectId,
                            type: 1 
                        })),
                    });
                }
            }
        })

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error putting user in wailtist: ", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}