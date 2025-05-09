import prisma from "@/lib/prisma/prismaClient";

export async function GET() {
    
    try {
        const tags = await prisma.tag.findMany();

        return new Response(JSON.stringify(tags), { status: 200 })

    } catch (error : unknown) {
        if (error instanceof Error) {
            return new Response(JSON.stringify({ message: error?.message}), { status: 500 });
        }

        return new Response(JSON.stringify({ message: "User tags not found"}), { status: 500 });
    }

    
}