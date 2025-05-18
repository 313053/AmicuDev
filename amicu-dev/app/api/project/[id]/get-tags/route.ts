import prisma from "@/lib/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: {params: Promise<{ id: bigint }> }
) {
    const projectId = (await params).id

    try {
        const projectTagData = await prisma.tag.findMany({
            where: {
                project_tag_project_tag_tagTotag : {
                    some: {
                        project: projectId
                    }
                }
            }
        });

        const projectTags = projectTagData.map(tag => ({
            name : tag?.name || null,
            complexity : tag?.complexity || null 
        }))

        return NextResponse.json({success : true , data: projectTags})

    } catch (err) {
        console.error("Error fetching tag data:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }

    
}