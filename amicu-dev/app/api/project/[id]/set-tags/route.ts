import prisma from "@/lib/prisma/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: bigint }>}
) {
    const projectId = (await params).id;
    const { userId } = await auth();

    if(!userId) {
        return new NextResponse("Unauthorized", { status: 401});
    }

    try {
        const body = await req.json();
        const { tags, badTags } = body;

        const createdProjectTags = [];
        const deletedProjectTags = [];

        // For every tag in the payload, it first checks if the tag already exists
        // and creates an entry in the table if it doesn't. Next, it checks whether 
        // an m-m relationship exists within the database between the tag and project
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

            const existingProjectTag = await prisma.project_tag.findFirst({
                where: {
                    project: projectId,
                    tag: dbTag.id,
                    complexity: tag.complexity,
                },
            });

            let projectTag;

            if (!existingProjectTag) {
                projectTag = await prisma.project_tag.create({
                    data: {
                        project: projectId,
                        tag: dbTag.id,
                        complexity: tag.complexity ?? 1,
                    },
                });
            } 

            createdProjectTags.push({
                ...projectTag,
                id : projectTag?.id.toString() || "",
                project: projectTag?.project?.toString() || "",
                tag: projectTag?.tag?.toString() || "",
                complexity: projectTag?.complexity 
            });
        }

        // For every tag marked for deletion in the payload, it first checks if the tag
        // already exists in the database, and if it does, then it checks whether a
        // many-many table exists with the curren project and tag, and then deletes it
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

            const existingProjectTag = await prisma.project_tag.findFirst({
                where: {
                    project: projectId,
                    tag: dbTag.id,
                    complexity: tag.complexity
                },
            });

            if (!existingProjectTag)
                continue

            const deletedProjectTag = await prisma.project_tag.delete({
                where : {
                    id : existingProjectTag.id
                },
            });

            deletedProjectTags.push({
                ...deletedProjectTag,
                id : deletedProjectTag.id.toString() || "",
                project: deletedProjectTag.project?.toString() || "",
                tag: deletedProjectTag.tag?.toString() || "",
                complexity: deletedProjectTag.complexity,
            });

        }

        return NextResponse.json({ success: true, data: { createdProjectTags, deletedProjectTags } });
    } catch (error) {
        console.error("Error updating project tags:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}