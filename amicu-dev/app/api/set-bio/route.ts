import { auth } from '@clerk/nextjs/server'; 
import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const { userId } = await auth()

    if(!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { bio } = body;

        if (typeof bio !== "string") {
            return new Response("Invalid input", { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { user_id : userId },
            data: {bio : bio},
            select: {bio : true},
        });

        return new Response(JSON.stringify(updatedUser), { status: 200});
    }   catch (error: unknown) {
        if( error instanceof Error) {
            console.log(error)
            return new Response(JSON.stringify({ message: error?.message}), { status: 500 })
        }
        return new Response(JSON.stringify({ message: "Could not update user"}), {status: 500})
    }
}
