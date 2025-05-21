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
    links : string[]
    github : string
}

export interface ProjectDashboardData {
    id : bigint
    title : string
    createdAt : Date
    description : string
    thumbnail : string
    github : string
    links : string[] | null
    role : number
    memberCount : number
    creator : { id : string; username : string }    
}

export interface ProjectMemberData {
    id: string
    username : string | null
    imageUrl : string
    clerkId : string
    role : number 
    joined : Date 
}

export interface ProjectGithubData {
    name : string
    owner : {
        login : string
        avatarUrl : string
        profileUrl : string
    }
    url : string
    createdAt : Date
    updatedAt : Date
    stars : number
    watchers : number
    forks : number
    issues : number
    commits : {
        author : {
            login : string
            profileUrl : string
        }
        message : string
        date : Date
        url : string
    }[]
}

export interface GitHubAPICommit {
  author: {
    login: string;
    html_url: string;
  } | null;
  commit: {
    message: string;
    author: {
      date: string;
    };
  };
  html_url: string;
}
