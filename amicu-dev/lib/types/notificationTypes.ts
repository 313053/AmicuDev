export interface NotificationData{
    id: string  //string to prevent serialization error while fetching
    sender: {
        id: string //string to prevent serialization error while fetching
        clerkId: string
        username: string
        avatarUrl: string
    }
    project: {
        id: string //string to prevent serialization error while fetching
        title: string
        thumbnailUrl: string 
    }
    creationDate : Date
    type: number

}

export interface NotificationPostData{
    id: string
    senderId: string
    projectId: string
    type: number
}