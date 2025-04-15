import { clerkClient } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'



export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = (await params).id

  try {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId)
    return new Response(JSON.stringify(user), { status: 200 })
  } catch (error: unknown) {
    if (error instanceof Error) {
        return new Response(JSON.stringify({ message: error?.message}), { status: 500 })
    }
    return new Response(JSON.stringify({ message: "User not found"}), {status: 500})
  }
}
