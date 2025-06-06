import prisma from "@/lib/prisma/prismaClient";
import { ProjectCreationData } from "@/lib/types/projectTypes";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userId } = await auth();

    if(!userId) {
        return new NextResponse("Unauthorized", { status : 401});
    }

    try {
        const body : ProjectCreationData = await req.json();
        const user = await prisma.user.findUnique({
            where : { user_id : userId },
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const createdTags : {id: string, name: string | null, complexity: number | null}[] = [];
        let project = {}

        // Making sure the db operations are all-or-nothing
        await prisma.$transaction(async (tx) => {

        // Making sure the project doesn't already exist then creating one
            let dbProject = await tx.project.findFirst({
                where : {
                    title : {
                        equals : body.title,
                        mode : 'insensitive'
                    },
                }
            });
            
            if (dbProject) {
                return new NextResponse("Project already exists", { status: 400 });
            }

            dbProject = await tx.project.create({
                data : {
                    title : body.title,
                    description : body.description,
                    thumbnail : body.thumbnail,
                    github : body.github,
                    links : body.links
                }
            })

            // Creating or finding tags, then connecting them to the project
            for (const tag of body.tags) {
                let dbTag = await tx.tag.findFirst({
                    where : {
                        name: {
                            equals : tag.name,
                            mode : 'insensitive'
                        },
                    },
                });

                if (!dbTag) {
                    dbTag = await tx.tag.create({
                        data: {
                            name: tag.name,
                        },
                    });
                }
                
                await tx.project_tag.create({
                    data: {
                        project: dbProject.id,
                        tag: dbTag.id,
                        complexity: tag.complexity,
                    },
                });

                createdTags.push({
                    ...dbTag,
                    id: dbTag.id.toString(),
                    complexity: tag.complexity 
                })
            }

            // Connecting the user to their project as the creator
            await tx.user_project.create({
                data: {
                    user: user.id,
                    project: dbProject.id,
                    role: 1
                }
            })

            project = {
                ...dbProject,
                id : dbProject.id.toString()
            }
        })
        
 

        return NextResponse.json({ success : true, data : { project, createdTags}})
    } catch (error){
        console.error("Error creating project and tags:", error);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}