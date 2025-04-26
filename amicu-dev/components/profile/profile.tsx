'use client'

import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { User } from "lucide-react"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import { useEffect, useState } from "react"
import UserBio from "./bio"

interface UserData {
    username: string
    primaryEmailAddress: { emailAddress: string }
    firstName: string
    lastName: string
    imageUrl: string
    createdAt: string
    bio: string
  }


export default function ProfileCard({ userId } : {userId : string}) {
    
    const [ user, setUser ] = useState<UserData | null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ error, setError ] = useState<string | null>(null)

    const { user: currentUser, isLoaded: isAuthLoaded } = useUser()

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) {
                setError("User ID is required!");
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true)
                const response = await fetch(`/api/get-user/${userId}`)

                if (!response.ok) {
                    throw new Error(`Failed to fetch user data: ${response.status}`)
                }

                const data = await response.json()
                const userData: UserData = {
                    username: data.clerkData.username,
                    primaryEmailAddress: data.clerkData.primaryEmailAddress,
                    firstName: data.clerkData.firstName,
                    lastName: data.clerkData.lastName,
                    imageUrl: data.clerkData.imageUrl,
                    createdAt: data.clerkData.createdAt,
                    bio: data.bio ?? "",
                  }
                setUser(userData)
                setIsLoading(false)
            } catch (err) {
                console.error("Error fetching user data:", err)
                setError(err instanceof Error ? err.message : "Unknown error occured")
                setIsLoading(false)
            }
        }
        fetchUserData()
    }, [userId])
    

    if (isLoading){
        return(
            <Card className="w-full sm:w-[640px] flex flex-col items-center">
                <CardContent className="flex flex-col items-center w-3/4 pt-6">
                    <Skeleton className="w-14 h-14 rounded-full" />
                    <div className="space-y-6 my-6 w-full flex flex-col items-center">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-[250px] w-full" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error ) {
        return (
            <Card className="sm:w-[640px] flex flex-col items-center p-6">
                <div className="text-center font-bold">
                    <p>Error loading user profile</p>
                    <p className="text-sm">{error}</p>
                </div>
            </Card>
        )
    }


    const registrationDate = user?.createdAt? 
    new Date(user.createdAt).toLocaleDateString() 
    : 
    "Unknown registration date";

    const isCurrentUser = (isAuthLoaded && currentUser && currentUser.id === userId);
    
    return(
        <Card className="w-5/6 sm:w-[520px] md:w-[640px] h-full flex flex-col items-center pb-10">
            <CardHeader className="flex flex-col items-center border-b w-3/4 pb-4 mb-4">
                <Avatar className="border-2 border-subtext h-14 w-14">
                    <AvatarImage src={user?.imageUrl} alt={user?.username || "User"} />
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{user?.username}</CardTitle>
                <CardDescription>{user?.primaryEmailAddress?.emailAddress}</CardDescription>
                {isCurrentUser && (
                    <Button type="button" variant="default">Edit Profile</Button>
                )}  
            </CardHeader>
            <CardContent className="w-5/6 sm:w-3/4 h-auto flex flex-col items-center space-y-5">
                <div className="flex flex-row justify-center w-full space-x-4">
                    <div className="flex flex-col items-center w-1/2">
                        <span className="w-full h-full text-center font-semibold">{user?.firstName} {user?.lastName}</span>
                    </div>
                    <div className="flex flex-col items-center w-1/2">
                        <span className="w-full h-full text-center font-semibold">User since {registrationDate}</span>
                    </div>
                </div>
                <UserBio
                    content={user?.bio || ""}
                    editable={isCurrentUser || false}
                    onSave={() => console.log("saved")}>
                </UserBio>
                <div className="h-6"></div>
            </CardContent>
        </Card>

    )
}