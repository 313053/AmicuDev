import { UserLink } from '@/lib/types/profileTypes';
import { auth } from '@clerk/nextjs/server'; 
import { PrismaClient, Prisma } from '@prisma/client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();


function isValidLink(link: unknown): link is UserLink {
    return (
        typeof link === 'object' &&
        link !== null &&
        'name' in link &&
        typeof (link as UserLink).name === 'string' &&
        'url' in link &&
        typeof (link as UserLink).name === 'string'
    );
}

export async function POST(req: NextRequest) {
    const { userId } = await auth()

    if(!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { links } = body;

        if (!Array.isArray(links) || !links.every(isValidLink)) {
            return new Response("Invalid input", { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { user_id : userId },
            data: {links : links as unknown as Prisma.InputJsonValue[]},
            select: {links : true},
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
