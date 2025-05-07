import prisma from "@/lib/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params } : { params : Promise<{ id: string }> }
) {
    const userId = (await params).id;
    
    try {
        const user = await prisma.user.findUnique({
            where : {
                user_id : userId
            },
            select : {
                id : true
            }
        })

        const userProjectData = await prisma.project.findMany({
            where : {
                user_project_user_project_projectToproject : {
                    some : {
                        user : user?.id
                    }
                }
            },
            select : {
                id : true,
                title : true,
                created_at : true,
                description: true,
                thumbnail : true
            }
        });
        
        const userProjects = userProjectData.map(proj => ({
            ...proj,
            id : proj.id.toString(),    // making sure no stringify error comes up later
        }))

        return NextResponse.json({ success : true, data : userProjects})
    } catch (error) {
        console.error("Error fetching user projects:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}