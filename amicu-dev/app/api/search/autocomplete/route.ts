import prisma from "@/lib/prisma/prismaClient";
import { SearchType } from "@/lib/types/extraTypes";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const USER_AMOUNT = 2
const PROJECT_AMOUNT = 3

// This api route handler returns the ids and names of projects and users based on the query.
// Used for autocompletion when the user uses the search bar. Suggestions begin from the 2nd
// input letter and return a maximum of object set by a variable each.
export async function GET(
    req: NextRequest
) {

    try {
        const suggestions : SearchType[] = [];
        const searchParams = req.nextUrl.searchParams;
        const query = searchParams.get("q");
        const clerk = await clerkClient();

        if (!query || query.length < 2) {
            return NextResponse.json([]);
        }

        const { data: users } = await clerk.users.getUserList({
            query: query,
            limit: USER_AMOUNT
        });

        const projects = await prisma.project.findMany({
            where: {
                title: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
            select: {
                id: true,
                title: true,
                thumbnail: true,
            },
            orderBy: {
                title: 'asc',
            },
            take: PROJECT_AMOUNT,
        });

        suggestions.push(
            ...projects.map((project) => ({
                id: project.id.toString(),
                name: project.title,
                imageUrl: project.thumbnail,
                project: true
            })),
            ...users.map((user) => ({
                id: user.id,
                name: user.username || "",
                imageUrl: user.imageUrl,
                project: false
            }))
        )

        return NextResponse.json({ success: true, data: suggestions})
    } catch (error) {
        console.error("Error searching user and projects: ", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}