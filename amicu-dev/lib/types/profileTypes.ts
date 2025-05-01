export interface UserLink {
    name: string
    url: string
}

export interface UserData {
    username: string
    emailAddress: string
    firstName: string
    lastName: string
    imageUrl: string
    createdAt: string
    bio: string 
    links: UserLink[]
}