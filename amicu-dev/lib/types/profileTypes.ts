
export interface UserLink {
    name : string
    url : string
}

export interface UserData {
    id : bigint
    username : string
    emailAddress : string
    firstName : string
    lastName : string
    imageUrl : string
    createdAt : string
    bio : string 
    links : UserLink[]
}

export interface ReducedClerkData {
    id : string
    username : string | null
    emailAddress : string
    firstName : string | null
    lastName : string | null
    imageUrl : string
} 

