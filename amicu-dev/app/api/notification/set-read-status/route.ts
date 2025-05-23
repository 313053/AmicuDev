import prisma from '@/lib/prisma/prismaClient';
import { auth } from '@clerk/nextjs/server'; 
import { NextResponse } from 'next/server';

export async function PUT(
) {
    const { userId } = await auth();
    
    if(!userId) {
        return new NextResponse("Unauthorized", { status : 401});
    }

    try {

        const dbUser = await prisma.user.findUniqueOrThrow({
            where: {
                user_id: userId
            },
            select: {
                id: true
            }
        })

        await prisma.notification.updateMany({
            where: {
                reciever: dbUser.id
            },
            data: {
                new: false
            }
        })

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating project description:", error);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}
