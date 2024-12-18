'use client'

import { useSession} from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'

export default function CreateClerkSupabaseClient() {
    const { session } =  useSession()

    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_KEY!,
        {
            global: {
                fetch: async (url, options = {}) => {
                    const clerkToken = await session?.getToken({
                        template: 'supabase_amicudev',
                    })

                    const headers = new Headers(options?.headers)
                    headers.set('Authorization', `Bearer ${clerkToken}`)

                    return  fetch(url, {
                        ...options,
                        headers,
                    })
                },
            },
        },
    )
}