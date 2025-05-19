import prisma from "@/lib/prisma/prismaClient";
import { ProjectMemberData } from "@/lib/types/projectTypes";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{id: bigint}> }
) {
    const projectId = (await params).id;
    const clerk = await clerkClient();
    

    try {
        const users : ProjectMemberData[] = []

        const projectUserData = await prisma.user_project.findMany({
            where: {
                project: projectId,
            },
            include: {
                user_user_project_userTouser: {
                    select: {
                        user_id: true
                    }
                }
            },
            orderBy: {
                role: 'asc'
            }
        })

        for (const user of projectUserData) {
            const userClerkData = await clerk.users.getUser(user.user_user_project_userTouser?.user_id ?? "");
            const projectMember : ProjectMemberData = {
                id: user.user.toString(),
                username: userClerkData.username,
                imageUrl: userClerkData.imageUrl,
                clerkId: userClerkData.id,
                role: user.role,
                joined: user.created_at,
            }
            users.push(projectMember);
        }

        return NextResponse.json({ success: true, data: users });
    } catch (error) {
        console.error("Error fetching project members: ", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}