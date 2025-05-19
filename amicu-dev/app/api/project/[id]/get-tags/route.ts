import prisma from "@/lib/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: {params: Promise<{ id: bigint }> }
) {
    const projectId = (await params).id

    try {
        const projectTagData = await prisma.project_tag.findMany({
            where: {
                project: projectId,
            },
            include: {
                tag_project_tag_tagTotag: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        const projectTags = projectTagData.map(tag => ({
            name : tag?.tag_project_tag_tagTotag?.name ?? null,
            complexity : tag?.complexity ?? null 
        }))

        return NextResponse.json({success : true , data: projectTags})

    } catch (err) {
        console.error("Error fetching tag data:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }

    
}