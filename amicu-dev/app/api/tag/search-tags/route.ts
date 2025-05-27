import prisma from "@/lib/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";

// This api route handler returns the names of tags based on the query.
// Used for autocompletion when the user chooses (or creates) their or their
// project's tags. Suggestions begin from the 2nd input letter and return a 
// maximum of 5 names.
export async function GET(
    req: NextRequest
) {

    try {
        const searchParams = req.nextUrl.searchParams;
        const query = searchParams.get("q");

        if (!query || query.length < 2) {
            return NextResponse.json([]);
        }

        const tags = await prisma.tag.findMany({
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
            select: {
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
            take: 5,
        });

        return NextResponse.json(tags);
    } catch (error: unknown) {

    console.error("Error searching tags:", error);
    return NextResponse.json({ error: "Failed to search tags" }, { status: 500 });
    }
}