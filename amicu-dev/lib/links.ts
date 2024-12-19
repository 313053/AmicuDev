'use client'

import { useUser } from "@clerk/nextjs"

export function GetAccountLink() {
    const { user } = useUser();

    return user ? 
        `/account/${user?.id}`
        :
        '/'
}