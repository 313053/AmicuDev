import prisma from "@/lib/prisma/prismaClient";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: {params: Promise<{ id: bigint }> }
) {
    const userId = (await params).id

    try {
        const userTagData = await prisma.user_tag.findMany({
            where: {
                user: userId,
            },
            include: {
                tag_user_tag_tagTotag: {
                    select: {
                        name: true
                    }
                }
            }
        })

        const userTags = userTagData.map(tag => ({
            name : tag?.tag_user_tag_tagTotag?.name ?? null,
            complexity : tag?.complexity ?? null 
        }))

        return new Response(JSON.stringify(userTags), { status: 200 })

    } catch (error : unknown) {
        if (error instanceof Error) {
            return new Response(JSON.stringify({ message: error?.message}), { status: 500 });
        }

        return new Response(JSON.stringify({ message: "User tags not found"}), { status: 500 });
    }

    
}