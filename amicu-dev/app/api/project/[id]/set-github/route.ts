import prisma from '@/lib/prisma/prismaClient';
import { auth } from '@clerk/nextjs/server'; 
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
    req: NextRequest,
    { params }: {params: Promise<{ id: bigint }> }
) {
    const projectId = (await params).id
    const { userId } = await auth();
    
    if(!userId) {
        return new NextResponse("Unauthorized", { status : 401});
    }

    try {
        const body = await req.json();
        const { repoLink } = body;

        if (typeof repoLink !== "string") {
            return new NextResponse("Invalid input", { status: 400 });
        }

        const updatedProject = await prisma.project.update({
            where: { id : projectId },
            data: {github : repoLink},
            select: {github : true},
        });

        return NextResponse.json({ success: true, data: updatedProject.github });
    }   catch (error) {
        console.error("Error updating project repo:", error);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}
