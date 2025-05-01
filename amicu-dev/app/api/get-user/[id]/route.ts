import { clerkClient } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
  const userId = (await params).id

  try {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId)

    // Using prisma to search through the database and add remaining
    // user data to the one pulled from clerk
    const userBio = await prisma.user.findUnique({
      where : { user_id: userId },
      select : { 
        bio: true,
        links: true
      },
    })


    const combinedData = {
      clerkData: user,
      bio: userBio?.bio || null,
      links: userBio?.links || null
    }

    return new Response(JSON.stringify(combinedData), { status: 200 })

  } catch (error: unknown) {
    if (error instanceof Error) {
        return new Response(JSON.stringify({ message: error?.message}), { status: 500 })
    }

    return new Response(JSON.stringify({ message: "User not found"}), {status: 500})
  }
}
