import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "../prisma/prismaClient";
import { ProjectDashboardData } from "../types/projectTypes";

export async function getProjectData(projectId: string) {
    const clerk = await clerkClient();
    if (!projectId) 
        throw new Error("No projectId provided!");

    const { userId } = await auth();
    if (!userId) 
        throw new Error("Unauthorized user!");

    const dbUser = await prisma.user.findUnique({
        where: {
            user_id: userId
        },
        select: {
            id: true
        }
    })

    if(!dbUser)
        throw new Error("Server Error: Couldn't find user")

    const dbProject = await prisma.project.findUnique({
        where: {
            id: BigInt(projectId)
        }
    });

    if(!dbProject)
        throw new Error("Server Error: Couldn't find project")

    const userProject = await prisma.user_project.findFirst({
        where: {
            project: dbProject.id,
            user: dbUser.id
        },
        select: {
            role: true
        }
    });

    const memberCount = await prisma.user_project.count({
        where: {
            project: BigInt(projectId)
        }
    });

    const creatorId = await prisma.user.findFirst({
        where: {
            user_project_user_project_userTouser: {
                some: {
                    project: BigInt(projectId),
                    role: 1
                }
            }
        },
        select: {
            user_id: true
        }
    })

    const creatorData = await clerk.users.getUser(creatorId?.user_id || "");

    const userRole = userProject?.role || 0;

    const project : ProjectDashboardData = {
        id: dbProject.id,
        title: dbProject.title,
        createdAt: dbProject.created_at,
        description: dbProject.description,
        thumbnail: dbProject.thumbnail,
        github: dbProject.github,
        links: dbProject.links,
        role : userRole,
        memberCount: memberCount,
        creator: { id: creatorId?.user_id || "" , username: creatorData.username || "" }
    }

    return project;
}