import prisma from "@/lib/prisma/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const dbUser = await prisma.user.findUnique({
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

        const dbNotification = await prisma.notification.findFirst({
            where: {
                reciever: dbUser.id,
                new: true
            },
            select: {
                id: true
            }
        });

        return NextResponse.json({ presence: !!dbNotification });
    } catch (error) {
        console.error("Error checking notifications: ", error)
        return new NextResponse("Internal Server Error", {status: 500});
    }
}