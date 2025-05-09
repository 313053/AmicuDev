import prisma from "../prisma/prismaClient";
import { ProjectCardData } from "../types/projectTypes";

export async function getUserProjects(userId: string) {
	if (!userId) throw new Error("No userId provided");

	const user = await prisma.user.findUnique({
		where: { 
            user_id: userId
        },
		select: { 
            id: true
        },
	});

	if (!user) return [];

	const projects = await prisma.project.findMany({
		where: {
			user_project_user_project_projectToproject: {
				some: {
					user: user.id,
				},
			},
		},
        include: {
            user_project_user_project_projectToproject: {
                where: {
                    user: user.id
                },
                select: {
                    role: true
                }
            }
        }
	});

    const projectsWithRoles : ProjectCardData[] = projects.map((project) => ({
        id : project.id,
        title : project.title,
        createdAt : project.created_at,
        description : project.description,
        thumbnail : project.thumbnail,
        role : project.user_project_user_project_projectToproject[0]?.role || 3
    }))

	return projectsWithRoles;
} 