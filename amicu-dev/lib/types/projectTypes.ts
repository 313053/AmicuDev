import { TagData } from "./tagTypes"

export interface ProjectCardData{
    id : bigint
    title : string
    createdAt : Date
    description : string
    thumbnail : string
    role : number
}

export interface ProjectCreationData {
    title : string
    description : string
    thumbnail : string
    tags : TagData[]
    github : string
}