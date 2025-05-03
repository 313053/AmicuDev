import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";


const prisma = new PrismaClient();

export async function GET(
    req: NextRequest,
    { params }: {params: Promise<{ id: bigint }> }
) {
    const userId = (await params).id

    try {
        const userTagData = await prisma.tag.findMany({
            where: {
                user_tag_user_tag_tagTotag : {
                    some: {
                        user: userId
                    }
                }
            }
        });

        const userTags = userTagData.map(tag => ({
            name : tag?.name || null,
            complexity : tag?.complexity || null 
        }))

        return new Response(JSON.stringify(userTags), { status: 200 })

    } catch (error : unknown) {
        if (error instanceof Error) {
            return new Response(JSON.stringify({ message: error?.message}), { status: 500 });
        }

        return new Response(JSON.stringify({ message: "User tags not found"}), { status: 500 });
    }

    
}