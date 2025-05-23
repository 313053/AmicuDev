import prisma from "@/lib/prisma/prismaClient";
import { NotificationData } from "@/lib/types/notificationTypes";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET() {
    const { userId } = await auth();
    const clerk = await clerkClient();
    const senderCache = new Map<string, { username: string; avatarUrl: string }>();

    if(!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        let notificiations : NotificationData[] = [];

        const dbUser = await prisma.user.findUniqueOrThrow({
            where: {
                user_id: userId
            },
            select : {
                id: true
            }
        })
        
        const dbNotificationList = await prisma.notification.findMany({
            where: {
                reciever: dbUser.id
            },
            include: {
                user_notification_senderTouser: {
                    select: {
                        id: true,
                        user_id: true
                    }
                },
                project_notification_projectToproject: {
                    select: {
                        id: true,
                        title: true,
                        thumbnail: true
                    }
                }
            },
            orderBy : {
                created_at: 'desc'
            }
        })
        

        // Part of the user data comes from clerk, therefore during mapping this 
        // fetches clerk user data and caches it so it takes less time if multiple
        // notifs have the same sender
        notificiations = await Promise.all(
            dbNotificationList.map(async (notif) => {
                const clerkId = notif.user_notification_senderTouser?.user_id ?? "";

                let username = "unknown";
                let avatarUrl = "";
                
                // checking for and using cached data
                if (senderCache.has(clerkId)) {
                    ({ username, avatarUrl } = senderCache.get(clerkId)!);
                } 
                else {
                  try {
                    const clerkUser = await clerk.users.getUser(clerkId);
                    username = clerkUser.username ?? "";
                    avatarUrl = clerkUser.imageUrl ?? "";
                    
                    senderCache.set(clerkId, { username, avatarUrl });
                  } catch (error) {
                    console.warn(`Failed to fetch Clerk data for ID ${clerkId}`, error);
                  }  
                }
                return {
                    id: notif.id.toString(),
                    sender: {
                        id: notif.user_notification_senderTouser?.id.toString() ?? "",
                        clerkId,
                        username,
                        avatarUrl
                    },
                    project: {
                        id: notif.project_notification_projectToproject?.id.toString() ?? "",
                        title: notif.project_notification_projectToproject?.title ?? "",
                        thumbnailUrl: notif.project_notification_projectToproject?.thumbnail ?? "",
                    },
                    creationDate: notif.created_at,
                    type: notif.type ?? 0
                };
            })
        );

        return NextResponse.json({ success: true, data: notificiations});
    } catch (error) {
        console.error("Error checking user waitlist presence: ", error);
        return new NextResponse("Internal Server Error", {status: 500})
    }   
}