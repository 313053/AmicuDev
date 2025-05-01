export interface UserLink {
    name: string
    url: string
}

export interface UserData {
    id: bigint
    username: string
    emailAddress: string
    firstName: string
    lastName: string
    imageUrl: string
    createdAt: string
    bio: string 
    links: UserLink[]
}
