'use client'

import { useUser } from "@clerk/nextjs"

export function GetAccountLink() {
    const { user } = useUser();

    return user ? 
        `/account/${user?.id}`
        :
        '/'
}

// List of websites whose icons will be displayed when
// a user references them in  a link
export const allowedIcons : string[] = [
    'github.com',
    'linkedin.com',
    'pinterest.com',
    'x.com',
    'threads.com',
    'youtube.com',
    'substack.com',
    'udemy.com'
]

export const linkValidation = (link : string) => {
    try {
        new URL(link);
        return true;
    } catch {
        return false;
    }
}