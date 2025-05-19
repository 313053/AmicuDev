import prisma from "@/lib/prisma/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { tags, badTags } = body;

        const user = await prisma.user.findUnique({
            where: { user_id: userId },
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const createdUserTags = [];
        const deletedUserTags = [];

        // For every tag in the payload, it first checks if the tag already exists
        // and creates an entry in the table if it doesn't. Next, it checks whether 
        // an m-m relationship exists within the database between the tag and user
        // and creates an entry in the table if it doesn't.
        for (const tag of tags) {
            let dbTag = await prisma.tag.findFirst({
                where: {
                    name: {
                        equals : tag.name,
                        mode : 'insensitive'
                    },
                },
            });

            if (!dbTag) {
                dbTag = await prisma.tag.create({
                    data: {
                        name: tag.name,
                    },
                });
            }

            const existingUserTag = await prisma.user_tag.findFirst({
                where: {
                    user: user.id,
                    tag: dbTag.id,
                    complexity: tag.complexity ?? 1,
                },
            });

            let userTag;

            if (!existingUserTag) {
                userTag = await prisma.user_tag.create({
                    data: {
                        user: user.id,
                        tag: dbTag.id,
                        complexity: tag.complexity ?? 1,
                    },
                });
            }

            createdUserTags.push({
                ...userTag,
                id : userTag?.id.toString() || "",
                user: userTag?.user?.toString() || "",
                tag: userTag?.tag?.toString() || "",
                complexity: userTag?.complexity
            });
        }

        // For every tag marked for deletion in the payload, it first checks if the tag
        // already exists in the database, and if it does, then it checks whether a
        // many-many table exists with the curren user and tag, and then deletes it
        // if it exists. The tag itself DOES NOT get deleted as it can be reused.
        for (const tag of badTags) {
            const dbTag = await prisma.tag.findFirst({
                where : {
                    name : {
                        equals : tag.name,
                        mode : 'insensitive'
                    },
                },
            });

            if (!dbTag)
                continue

            const existingUserTag = await prisma.user_tag.findFirst({
                where: {
                    user: user.id,
                    tag: dbTag.id,
                    complexity: tag.complexity,
                },
            });

            if (!existingUserTag)
                continue

            const deletedUserTag = await prisma.user_tag.delete({
                where : {
                    id : existingUserTag.id
                },
            });

            deletedUserTags.push({
                ...deletedUserTag,
                id : deletedUserTag.id.toString() || "",
                user: deletedUserTag.user?.toString() || "",
                tag: deletedUserTag.tag?.toString() || "",
                complexity: deletedUserTag.complexity
            });

        }

        return NextResponse.json({ success: true, data: { createdUserTags, deletedUserTags } });
    } catch (error) {
        console.error("Error updating user tags:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
