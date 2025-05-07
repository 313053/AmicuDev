import prisma from "../prisma/prismaClient";

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
		select: {
			id: true,
			title: true,
			created_at: true,
			description: true,
			thumbnail: true,
		},
	});

	return projects;
} 