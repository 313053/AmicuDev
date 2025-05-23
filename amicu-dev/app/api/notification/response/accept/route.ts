import prisma from '@/lib/prisma/prismaClient';
import { NotificationPostData } from '@/lib/types/notificationTypes';
import { auth } from '@clerk/nextjs/server'; 
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
    req: NextRequest
) {
    const { userId } = await auth();
    
    if(!userId) {
        return new NextResponse("Unauthorized", { status : 401});
    }

    try {
        const body : NotificationPostData = await req.json();
        const notificationId = BigInt(body.id);
        const projectId = BigInt(body.projectId);
        const senderId = BigInt(body.senderId);
        let targetId : bigint;

        await prisma.$transaction(async (tx) => {
            
            // Checks whether the notification is a join request (1) or
            // and invite (2), and either sets the sender or reciever as
            // the target for future operations and deletes all related notifications
            switch (body.type) {
                case 1:
                    targetId = senderId
                    await tx.notification.deleteMany({ // deleteMany because that way there's no need to look up the id first
                        where: {
                            sender: targetId,
                            project: projectId
                        }
                    });
                    break;
                case 2:
                    const dbUser = await tx.user.findUniqueOrThrow({
                        where: {
                            user_id: userId
                        },
                        select: {
                            id: true
                        }
                    });
                    targetId = dbUser.id;
                    await tx.notification.delete({
                        where: {
                            id: notificationId
                        }
                    });
                    break;
            }
            
            await tx.waiting_list.deleteMany({
                where: {
                    user: targetId,
                    project: projectId
                }
            })

            const existingMembership = await tx.user_project.findFirst({
                where: {
                    user: targetId,
                    project: projectId
                },
                select: {
                    id: true
                }
            })

            if (!existingMembership) {
                await tx.user_project.create({
                    data: {
                        user: targetId,
                        project: projectId
                    }
                })
            }
        })

        

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error accepting request:", error);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}
