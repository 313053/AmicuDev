import prisma from "@/lib/prisma/prismaClient";
import { SuggestedProject } from "@/lib/types/projectTypes";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Variables used in the suggestion algorithm
const BASE_TAG_SCORE = 5;
const MAX_SKILL_SCORE = 8;

// This API route handler suggests projects to the user using an algorithm that 
// prioritizes the ones that have the same tags and skill levels as the user.
// It also paginates the data to allow for infinite scrolling without getting hit
// with a massive payload at once.
export async function GET(
    req: NextRequest
) {
    const { userId } = await auth();
    if (!userId)
        return new NextResponse("Unauthorized", { status: 401 });

    try {
        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '5');
        const offset = (page - 1) * limit;
        const suggestedProjects: SuggestedProject[] = [];

        // Fetches the user and all their tags 
        const dbUser = await prisma.user.findUniqueOrThrow({
            where: {
                user_id: userId,
            },
            include: {
                user_tag_user_tag_userTouser: {
                    include: {
                        tag_user_tag_tagTotag: true
                    }
                }
            }
        });

        const userTags = dbUser.user_tag_user_tag_userTouser.map((userTag) => ({
            id: userTag.tag,
            name: userTag.tag_user_tag_tagTotag?.name ?? '',
            complexity: userTag.complexity
            
        }));


        // Collects ids of the projects the user's already in
        const dbUserProjects = await prisma.user_project.findMany({
            where: {
                user: dbUser.id
            },
            select: {
                project: true
            }
        })

        const unwantedIds = dbUserProjects.map(userProject => userProject.project);

        const dbProjects = await prisma.project.findMany({
            where: {
                id: {
                    notIn: unwantedIds
                }
            },
            include: {
                project_tag_project_tag_projectToproject: {
                    include: {
                        tag_project_tag_tagTotag: true
                    }
                }
            }
        });

        if (userTags.length > 0) {
            
            // Suggestion algorithm starts here.
            // For every project, it checks whether it shares tags with the user, and if it does then
            // it increases the project's score by a value depending on how close the user's skill level
            // is to the one specified in the project.
            for (const dbProject of dbProjects) {
                const projectTags = dbProject.project_tag_project_tag_projectToproject.map((projectTag) => ({
                    id: projectTag.tag,
                    name: projectTag.tag_project_tag_tagTotag?.name ?? '',
                    complexity: projectTag.complexity

                }));

                let score = 0;
                
                for (const userTag of userTags) {
                    if(!userTag.id) continue; // Unlikely but typescript appreciates this

                    const matchingTag = projectTags.find((projectTag) => (
                        projectTag.id === userTag.id
                    ));

                    // If a project has a matching tag, it calculates the appointed score based on the
                    // difference between the desired tag level and the user's level. 
                    if (matchingTag) {

                        const skillDifference = Math.abs(userTag.complexity - matchingTag.complexity);
                        // Minimum score given by just having the same tag

                        const skillBonus = userTag.complexity >= matchingTag.complexity
                            ? MAX_SKILL_SCORE - (skillDifference) 
                            : MAX_SKILL_SCORE - (skillDifference) * 2;
                        
                        score += BASE_TAG_SCORE + skillBonus;
                    }
                }

                suggestedProjects.push({
                    project: {
                        id: dbProject.id,
                        title: dbProject.title,
                        description: dbProject.description,
                        thumbnail: dbProject.thumbnail,
                        createdAt: dbProject.created_at,
                        tags: dbProject.project_tag_project_tag_projectToproject.map((tag) => ({
                            name: tag.tag_project_tag_tagTotag?.name ?? '',
                            complexity: tag.complexity,
                        })),
                    },
                    score
                })
            }

            suggestedProjects.sort((a,b) => b.score - a.score);

        } 
        // If the user doesn't have any tags it just returns and paginates all projects
        else {    
            for (const dbProject of dbProjects) {
                suggestedProjects.push({
                    project: {
                        id: dbProject.id,
                        title: dbProject.title,
                        description: dbProject.description,
                        thumbnail: dbProject.thumbnail,
                        createdAt: dbProject.created_at,
                        tags: dbProject.project_tag_project_tag_projectToproject.map((tag) => ({
                            name: tag.tag_project_tag_tagTotag?.name ?? '',
                            complexity: tag.complexity,
                        })),
                    },
                    score: 0
                })
            }   
        }


        // Pagination
        const paginatedProjects = suggestedProjects.slice(offset, offset + limit);
        const hasMore = offset + limit < suggestedProjects.length;

        // Converts BigInts to string to avoid serialization error
        const serializedProjects = paginatedProjects.map((suggestion) => ({
            ...suggestion,
            project: {
                ...suggestion.project,
                id: suggestion.project.id.toString(),
            },
        }));

        return NextResponse.json({
            data: serializedProjects,
            hasMore,
            currentPage: page,      
        })
    } catch (error) {
        console.error("Error suggesting projects: ", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}