import prisma from "@/lib/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {

    try {
        const searchParams = request.nextUrl.searchParams;
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