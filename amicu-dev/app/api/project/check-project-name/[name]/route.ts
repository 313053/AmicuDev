import prisma from "@/lib/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params : Promise<{name: string}> }
) {
    const projectName = (await params).name;

    try {
        const project = await prisma.project.findFirst({
            where: {
                title : projectName
            }
        });

        const check = project !== null;

        return NextResponse.json({ success : true, data : check});
    } catch (error) {
        console.error("Error fetching project:", error);
        return new NextResponse("Internal Server Error", { status : 500 });
    }
}